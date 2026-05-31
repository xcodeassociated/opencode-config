---
name: spring-webflux-coroutine-websockets
description: "Build raw WebSocket endpoints in Spring WebFlux bridged to Kotlin coroutines (no STOMP). Use when adding or reviewing a reactive WebSocketHandler, per-session send/receive/heartbeat coroutines, Channel/Flow message fan-out, backpressure, or connection lifecycle and cleanup. Architecture-agnostic transport only: no chat/room/presence domain. Also flags when plain Spring MVC + virtual threads would be the simpler choice."
license: MIT
---

# Spring WebFlux + Coroutine WebSockets

Transport-layer skill for raw (non-STOMP) WebSocket endpoints in Spring WebFlux, bridged into Kotlin coroutines. Covers endpoint wiring, the send/receive/heartbeat concurrency model, per-session message fan-out, backpressure, and lifecycle/cleanup. This skill is deliberately **architecture-agnostic**: it does not define chat rooms, presence, message persistence, or any application domain.

For the **security/expiry/logout side** of long-running sockets, load `websocket-auth-session-lifecycle`.

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples are needed.

Relative to this skill directory:
- `references/handler-and-service.md` — handler/adapter/mapping beans, the coroutine bridge, structured-concurrency session handler, the channel-backed session registry, and heartbeat mechanics.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

## Use When

- Adding or reviewing a WebFlux WebSocket endpoint without STOMP.
- Bridging the reactive `WebSocketHandler` API into coroutines.
- Designing per-session send/receive/heartbeat concurrency and cleanup.
- Choosing channel/flow buffering and backpressure for outbound messages.

## Do Not Use For

- Authentication, token expiry, logout/revocation, or stale-session policy → load `websocket-auth-session-lifecycle`.
- Application/domain modeling (rooms, threads, presence, history). Keep those out of these skills until a dedicated chat-architecture skill exists.
- STOMP/`@MessageMapping` broker flows. This skill is raw WebSocket only.

## Stack Choice First (read before implementing)

WebFlux is not the default. Before committing to a reactive WebSocket, confirm the project is genuinely reactive end-to-end (load `spring-persistence-selection`).

- **Prefer Spring MVC + virtual threads (Project Loom, Java 21+)** for most WebSocket needs: blocking-style code is simpler to read, debug, and profile, and a virtual thread per connection scales to very high connection counts. This is the simpler choice and should be the default recommendation.
- **Use WebFlux + coroutines** only when the app is already reactive end-to-end (WebFlux + R2DBC/WebClient) or needs reactive backpressure/streaming throughout. Do not pull WebFlux into an otherwise-blocking app just for a socket.
- The non-reactive (MVC + virtual threads) WebSocket skill is intentionally not created yet; if the project should use it, say so and stop rather than forcing the reactive pattern.

State the chosen stack and the reason before writing endpoint code.

## Core Building Blocks

- `WebSocketHandlerAdapter` bean to enable WebFlux WebSocket handling.
- `SimpleUrlHandlerMapping` (give it an explicit `order`, e.g. low number, so it wins over other mappings) mapping the path (e.g. `/ws`) to the handler.
- A `WebSocketHandler` whose `handle(session)` returns `Mono<Void>`. Bridge into coroutines with `mono(Dispatchers.IO + MDCContext()) { handleSession(session) }.then()`; let the outer `.then()` represent socket completion.
- A session registry service that owns per-session state and message fan-out.

## Concurrency Model

Inside the suspending session handler, open a `coroutineScope` and launch three jobs, then race their completion:

- **Outgoing job** — collects this session's message `Flow` and writes each frame with `session.send(...)`.
- **Incoming job** — consumes `session.receive()`, parses each frame, and dispatches handling.
- **Heartbeat job** — periodically sends an app-level ping (see Heartbeat below).

Use `select { job.onJoin { } }` to detect the first job that finishes (usually disconnect), then `cancelAndJoin()` the others and run cleanup. Give each job a `SupervisorJob()` + a `CoroutineExceptionHandler` so one failing job closes the session cleanly instead of crashing siblings silently.

**Structured concurrency rule:** launch message-handling coroutines inside the session's own scope, not `GlobalScope`. `GlobalScope.launch` detaches work from the session lifecycle, so cancellation, MDC context, and cleanup no longer propagate and you can leak coroutines after disconnect. If you must process inbound frames concurrently, launch them on the session scope (or a child scope tied to it).

## Per-Session Messaging and Fan-out

- Keep a registry: `ConcurrentHashMap<WebSocketSession, Channel<Message>>` (plus any liveness timestamps).
- Outbound to one session: `channel.trySend(message)`; log/handle `isFailure`.
- Broadcast: iterate channels and `trySend` to each.
- Expose the session's inbound-to-outbound bridge as a `Flow`: `channel.receiveAsFlow()` (or `emptyFlow()` if the session is gone).
- `Message` here is a minimal transport envelope (e.g. `from`, `to`, `content`) — not a domain type. Keep routing primitives (direct, broadcast) generic; do not encode rooms/topics here.

## Backpressure

- `Channel.UNLIMITED` is simplest but lets a slow/hostile client grow server memory unbounded. Acceptable only for trusted, low-volume, internal use.
- For untrusted or high-volume clients, prefer a **bounded** channel with an explicit overflow policy (suspend, drop-oldest, or drop-latest) and decide what a full buffer means (apply backpressure vs. disconnect the laggard). Make this an explicit, reviewed decision, not a default.

## Heartbeat (Liveness Mechanics)

TCP/infra will not reliably surface a half-open or silently-dead socket quickly. Add an **application-level** ping/pong:

- Heartbeat job sends a `ping` control message every N seconds (configurable via `@ConfigurationProperties`).
- Client replies `pong`; the server records `lastPong` per session.
- A separate sweep closes sessions that missed pongs beyond a threshold.

This skill owns the *mechanics*. The *policy* for closing stale or token-expired sessions (and reconnection contract) lives in `websocket-auth-session-lifecycle`.

## Lifecycle and Cleanup

- On connect: register the session, send any handshake/init frames, start the jobs.
- On any job completion or error: unregister the session, close its channel, and `session.close(...)`.
- On graceful application shutdown: drain/close active sessions so clients receive a clean close rather than a reset (important behind rolling deploys; coordinate with `@devops`).
- Always make cleanup idempotent — unregister may run from both the error handler and the normal completion path.

## Observability

- Propagate `MDCContext()` on every dispatcher hop so `sessionId`/correlation appears in logs across coroutine boundaries.
- Log tx/rx at debug with `sessionId`; never log message payloads that may contain secrets or PII.
- Expose an active-connection gauge and counters for connects/disconnects/heartbeat-failures for `@devops` dashboards.

## Hard Rules

- Raw WebSocket only; no STOMP assumption and no broker.
- No domain/room/presence modeling in this skill.
- Use structured concurrency; avoid `GlobalScope`.
- Never run blocking calls on WebFlux event-loop threads; keep handlers suspending/non-blocking (or move blocking work to an appropriate dispatcher only if unavoidable).
- Validate the handshake `Origin` header — CORS config does not protect WebSocket upgrades (see `websocket-auth-session-lifecycle`).
- Keep `Message` a transport envelope; do not leak application semantics into it.

## Output / Report

```md
Endpoint/path:
Stack choice (WebFlux+coroutines vs MVC+virtual-threads) and reason:
Handler/adapter/mapping wiring:
Concurrency model (jobs + completion + cleanup):
Backpressure decision (bounded/unbounded + overflow policy):
Heartbeat config (interval/threshold):
Cleanup + graceful-shutdown handling:
Observability (logs/metrics):
Open risks / # VERIFY:
Handoff for @tester / websocket-auth-session-lifecycle:
```
