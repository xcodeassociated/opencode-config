---
name: websocket-auth-session-lifecycle
description: "Secure long-running WebSocket sessions authenticated by OAuth2/OIDC (Keycloak) JWT in Spring WebFlux, no STOMP. Use for handshake authentication, token-expiry-during-session policy, forced reconnect vs in-band re-auth, logout/revocation propagation via Keycloak back-channel logout or optional Kafka events, the scheduled stale-session sweeper, heartbeat liveness policy, multi-instance session registries, and Origin/CSWSH checks. Architecture-agnostic: no chat domain."
license: MIT
---

# WebSocket Auth & Long-Running Session Lifecycle

Security and lifecycle skill for WebSocket sessions whose connection can outlive the bearer token that authorized them. Covers handshake authentication, what to do when the token expires mid-session, propagating logout/revocation, the scheduled sweeper backstop, heartbeat liveness policy, and multi-instance concerns. **Architecture-agnostic**: no rooms, presence, or message domain.

For the **transport/concurrency mechanics** (handler wiring, send/receive/heartbeat jobs, channels), load `spring-webflux-coroutine-websockets`.

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples are needed.

Relative to this skill directory:
- `references/auth-and-revocation.md` — handshake principal/expiry capture, the user→sessions index, the `@Scheduled` sweeper, close-with-control-message, in-band re-auth sketch, the Keycloak back-channel logout endpoint, and the optional Kafka logout consumer.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

## The Core Problem

With JWT/OAuth2 bearer auth, **authentication is enforced once, at the HTTP upgrade (handshake)**. After the socket is open it is a long-lived TCP connection that Spring Security does not re-check. Two failure modes follow:

1. **Token expiry mid-session** — the access token's `exp` passes while the socket stays open, so an unauthenticated connection lingers.
2. **Logout / revocation** — the user logs out (or the SSO session is killed) in Keycloak, but the still-unexpired access token and the open socket are unaffected. The socket stays live until the token would have expired anyway.

A correct design bounds both windows. Do not assume handshake auth alone is sufficient for long-lived sockets.

## Capture Identity at Handshake

Inside the handler, read the authenticated principal from the reactive security context and store, per session:

- `sub` (user id) — required.
- token `exp` (instant) — required; this is the hard upper bound of session validity absent refresh.
- `sid` (OIDC session id claim, if present) and/or `jti` — enables precise per-SSO-session revocation.

Maintain a **reverse index** `userId -> set<session>` (and `sid -> set<session>` if available). The transport registry keys by `WebSocketSession`; revocation needs to find sessions *by user*, so add this index. Without it you cannot act on a logout event efficiently.

## Handshake Authentication & Authorization

- Spring Security's `SecurityWebFilterChain` authorizes the upgrade request like any HTTP path (e.g. the `/ws/**` matcher requires the appropriate authority). The resource-server JWT config validates signature, issuer, and `exp` at connect.
- The browser `WebSocket` API does **not** send custom `Authorization` headers and is **not** subject to CORS. So:
  - Decide the token-delivery mechanism explicitly (subprotocol token, short-lived ticket exchanged over HTTPS first, or cookie) and document it. Avoid putting tokens in the URL query string (they leak into logs/proxies).
  - **Validate the `Origin` header on the handshake** to prevent Cross-Site WebSocket Hijacking (CSWSH). CORS rules do not protect WebSocket upgrades, so an allow-all CORS config gives no protection here.

## Token Expiry Policy (decision)

When the stored `exp` is reached on an open socket, choose one:

### Option A — Close and require reconnect (default, recommended)
Close the socket and tell the client to obtain a fresh token and reconnect.

- Send a control message (e.g. `{"type":"REAUTH_REQUIRED"}`) and close with an **application-defined close code in the 4000–4999 range** (RFC 6455 reserves that range for application use), e.g. `4001`. The distinct code lets the client tell "your token expired, reconnect with a new bearer" apart from a generic transport error.
- Optionally send a `TOKEN_EXPIRING` nudge ~30–60s before `exp` so a well-behaved client refreshes and reconnects seamlessly.

Why this is the default: it preserves the invariant that *every live socket is backed by a currently-valid token*, it is simple, and it cannot drift identity. Clients must already handle reconnects (networks drop), so this reuses existing client logic.

### Option B — In-band re-authentication (enhancement)
Let the client push a refreshed bearer over the socket before `exp`; the server re-validates and updates the stored `exp`/principal without dropping the connection.

- Validate the new token exactly like the handshake: signature, issuer, audience, `exp`, and **`sub` MUST equal the original `sub`** — never allow switching identity on a live socket.
- If no valid refresh arrives by `exp`, fall back to Option A (close).
- Use this only when reconnect churn is a real problem (high-frequency streaming, costly resubscribe, flaky mobile). It is more code and more attack surface.

**Recommendation:** default to Option A; add Option B only where reconnect cost is proven. Either way, `exp` is a hard ceiling — never let an expired token keep a socket open silently.

> The user's instinct is correct: on expiry, close with a signal that a new session must be established and the client reconnects with a new bearer (Option A). Keeping the user connected indefinitely without re-validation is not acceptable; keeping them connected *with* in-band re-auth (Option B) is acceptable only with strict same-subject validation.

## Logout / Revocation Propagation

Expiry policy alone cannot catch a logout that happens *before* `exp`. Layer these (strongest available wins; the sweeper is always present):

### 1. Scheduled sweeper — always-on backstop
A periodic `@Scheduled` job scans live sessions and closes (with the Option-A control message) any that are: past stored `exp`, flagged as logged-out, or heartbeat-stale. This works with **no** webhook and **no** Kafka, and bounds the bad window to roughly `exp + sweepInterval`. Keep this even when a webhook/Kafka is configured — it covers missed/failed events.

### 2. Keycloak OIDC Back-Channel Logout — webhook, no Kafka required
Register a back-channel logout URI in Keycloak; on logout Keycloak POSTs a `logout_token` to the app. The endpoint validates the logout token (issuer, audience, signature, `events` claim) and extracts `sid`/`sub`, then closes matching sockets. This is the vendor-neutral, standards-based path and the right default when Kafka is not in the stack.
- `# VERIFY` the exact Keycloak realm/client configuration and `logout_token` validation rules for your Keycloak version via `@researcher` before implementing; do not guess claim names or endpoints.

### 3. Keycloak → Kafka events — optional
If Kafka is already in the stack, a Keycloak event-listener fork (e.g. SnuK87/keycloak-kafka) publishes LOGIN/LOGOUT/REGISTER events to a topic. Consume LOGOUT events, map `userId`/`sessionId` to live sockets via the reverse index, and close them. **Treat Kafka as optional** — the same outcome is achievable with the back-channel webhook plus the sweeper. Do not add Kafka solely for this.

Choose one near-real-time signal (webhook *or* Kafka) **plus** the sweeper, or the sweeper alone if neither is available.

## Multi-Instance / Scale-Out

An in-memory registry is per-instance, which matters once more than one app instance runs:

- A logout event must reach the instance that actually holds the socket.
  - **Kafka:** a single shared consumer group load-balances each event to *one* instance, which may not own the session. For revocation fan-out, make **every instance receive every logout event** (per-instance consumer group / unique group id suffix, or a broadcast topic). Each instance then closes only its local matches.
  - **Back-channel webhook:** the load balancer delivers the POST to one instance. For scale-out, either re-broadcast the revocation internally (e.g. publish to a topic all instances consume) or use a **shared session→user index** (e.g. Redis) so any instance can locate and signal the session.
- Single instance: in-memory is fine; document the assumption so scale-out is a conscious change.
- Coordinate sticky-session / connection-draining behavior on rolling deploys with `@devops`.

## Heartbeat Liveness (policy)

The ping/pong *mechanics* live in `spring-webflux-coroutine-websockets`. The *policy* here: track `lastPong` per session and close sessions that miss pongs beyond a threshold. This catches half-open/dead TCP that infra will not surface promptly, and it is independent from auth expiry — a socket can be live-but-unauthenticated (expired token) or authenticated-but-dead (no pong). Handle both.

## Hard Rules

- Identity is fixed at handshake; never trust client-claimed identity sent over the socket. Only in-band re-auth (Option B) may update the principal, and only to the **same `sub`**.
- `exp` is a hard ceiling: no expired token keeps a socket open without successful in-band re-auth.
- Always have the scheduled sweeper as a backstop, even with a webhook/Kafka signal.
- Validate the handshake `Origin` (CSWSH); CORS does not protect WebSockets.
- Never log tokens, `logout_token`, or full claim sets. Do not put tokens in URLs.
- Route external/current Keycloak configuration facts (back-channel logout setup, claim names, event formats, fork versions) to `@researcher`; mark unverified specifics `# VERIFY`.
- Keep this skill domain-agnostic; no rooms/presence/history.

## Verification Checklist (for @tester)

- Open a socket with a valid token, then let the token expire (or set a short-lived token): the session is closed within `sweepInterval` with the agreed close code/control message; the client can reconnect with a fresh token.
- Log the user out in Keycloak before `exp`: the socket closes (near-real-time if webhook/Kafka configured, otherwise by the sweeper).
- Attempt in-band re-auth (if Option B) with a different `sub`: rejected; the socket is not re-bound to another identity.
- Stop sending pongs: the session is closed after the missed-pong threshold.
- Cross-site connect attempt with a foreign `Origin`: rejected at handshake.
- Confirm no tokens/claims appear in logs or reports.

## Output / Report

```md
Auth at handshake (token delivery, Origin check):
Identity captured per session (sub/exp/sid):
Reverse index (userId -> sessions):
Expiry policy (A close+reconnect / B in-band re-auth) and reason:
Close code + control message contract:
Revocation signal(s): sweeper (always) + webhook/Kafka (which, why):
Multi-instance handling:
Heartbeat threshold/policy:
External facts routed to @researcher / # VERIFY:
Handoff for @developer / @devops / @tester:
```
