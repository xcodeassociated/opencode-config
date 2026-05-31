# WebSocket Auth & Revocation — Examples

Architecture-agnostic examples for authenticating and policing long-running WebSocket sessions. Read this only when you need concrete code; the authoritative guidance is in `SKILL.md`. Mark anything Keycloak-version-specific `# VERIFY` and confirm via `@researcher`.

## Capture Identity at Handshake

```kotlin
// Inside the suspending session handler, before starting jobs:
val authentication = ReactiveSecurityContextHolder.getContext().awaitSingle().authentication
val jwt = (authentication as JwtAuthenticationToken).token
val identity = SessionIdentity(
    sub = jwt.subject,                                  // user id
    exp = jwt.expiresAt ?: Instant.MIN,                 // hard ceiling
    sid = jwt.claims["sid"] as String?,                 // OIDC session id, if present
)
sessionRegistry.bind(session, identity)
```

## Session Identity + Reverse Index

```kotlin
data class SessionIdentity(val sub: String, val exp: Instant, val sid: String?)

@Service
class WebSocketSessionRegistry {
    private val identities = ConcurrentHashMap<WebSocketSession, SessionIdentity>()
    private val byUser = ConcurrentHashMap<String, MutableSet<WebSocketSession>>()

    fun bind(session: WebSocketSession, id: SessionIdentity) {
        identities[session] = id
        byUser.computeIfAbsent(id.sub) { ConcurrentHashMap.newKeySet() }.add(session)
    }

    fun unbind(session: WebSocketSession) {
        identities.remove(session)?.let { id ->
            byUser[id.sub]?.apply { remove(session); if (isEmpty()) byUser.remove(id.sub) }
        }
    }

    fun sessionsForUser(sub: String): Set<WebSocketSession> = byUser[sub].orEmpty()
    fun expiredSessions(now: Instant = Instant.now()): List<WebSocketSession> =
        identities.filterValues { it.exp.isBefore(now) }.keys.toList()
    fun updateExp(session: WebSocketSession, newExp: Instant) {
        identities.computeIfPresent(session) { _, old -> old.copy(exp = newExp) }
    }
    fun subOf(session: WebSocketSession): String? = identities[session]?.sub
}
```

## Close With a Control Message (Option A)

Application close codes use the 4000–4999 range (RFC 6455, reserved for application use).

```kotlin
enum class WsControl { REAUTH_REQUIRED, TOKEN_EXPIRING, LOGGED_OUT }

suspend fun closeForReauth(
    session: WebSocketSession,
    mapper: ObjectMapper,
    control: WsControl = WsControl.REAUTH_REQUIRED,
) {
    runCatching {
        val frame = session.textMessage(mapper.writeValueAsString(mapOf("type" to control.name)))
        session.send(Mono.just(frame)).awaitSingleOrNull()
    }
    // 4001 = app-defined "reauthenticate and reconnect"
    session.close(CloseStatus(4001, control.name)).awaitSingleOrNull()
}
```

## Scheduled Sweeper (always-on backstop)

`@Scheduled` works in a WebFlux app. Keep the body non-blocking; bridge to coroutines with a small scope. Each instance sweeps only its own in-memory sessions.

```kotlin
@Component
class WebSocketSweeper(
    private val registry: WebSocketSessionRegistry,
    private val messageService: CoroutineMessageService, // from the transport skill
    private val mapper: ObjectMapper,
    private val props: WebSocketProperties,
) {
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    @Scheduled(fixedDelayString = "\${com.example.ws.sweep-interval-ms:10000}")
    fun sweep() {
        scope.launch {
            // 1) token expiry
            registry.expiredSessions().forEach { closeForReauth(it, mapper) }
            // 2) heartbeat-stale (sessionsMissingPong defined in the transport service)
            messageService.sessionsMissingPong(props.staleCheckThresholdSeconds)
                .forEach { closeForReauth(it, mapper, WsControl.REAUTH_REQUIRED) }
            // 3) logout-flagged sessions are closed by the logout handler directly (below)
        }
    }
}
```

## In-Band Re-Auth (Option B, optional)

Handle a client frame carrying a refreshed bearer. Validate exactly like the handshake and require the **same subject**.

```kotlin
suspend fun handleReauth(
    session: WebSocketSession,
    rawToken: String,
    decoder: ReactiveJwtDecoder,
    registry: WebSocketSessionRegistry,
): Boolean {
    val jwt = runCatching { decoder.decode(rawToken).awaitSingle() }.getOrNull() ?: return false
    val currentSub = registry.subOf(session) ?: return false
    if (jwt.subject != currentSub) return false          // never switch identity on a live socket
    val exp = jwt.expiresAt ?: return false
    if (exp.isBefore(Instant.now())) return false
    registry.updateExp(session, exp)
    return true
}
```

## Keycloak Back-Channel Logout Endpoint (no Kafka)

Vendor-neutral path. Keycloak POSTs a `logout_token` to a registered URI on logout.

```kotlin
@RestController
class BackChannelLogoutController(
    private val registry: WebSocketSessionRegistry,
    private val mapper: ObjectMapper,
    // a decoder/validator for the logout token; configure issuer/audience/events claim
    private val logoutTokenValidator: LogoutTokenValidator, // # VERIFY shape via @researcher
) {
    @PostMapping("/oidc/backchannel-logout", consumes = ["application/x-www-form-urlencoded"])
    suspend fun logout(@RequestParam("logout_token") logoutToken: String): ResponseEntity<Void> {
        // Validate signature, issuer, audience, and the back-channel-logout `events` claim.
        val claims = logoutTokenValidator.validate(logoutToken) // # VERIFY claim names/version
        val sid = claims.sid
        val sub = claims.sub
        val targets = buildSet {
            if (sub != null) addAll(registry.sessionsForUser(sub))
            // if you indexed by sid, prefer the precise sid match
        }
        targets.forEach { closeLoggedOut(it) }
        return ResponseEntity.ok().build()
    }

    private suspend fun closeLoggedOut(session: WebSocketSession) {
        runCatching {
            val frame = session.textMessage(mapper.writeValueAsString(mapOf("type" to "LOGGED_OUT")))
            session.send(Mono.just(frame)).awaitSingleOrNull()
        }
        session.close(CloseStatus(4002, "LOGGED_OUT")).awaitSingleOrNull()
    }
}
```

> `# VERIFY` with `@researcher`: the exact Keycloak back-channel-logout client setting, the `logout_token` validation requirements (the `events` claim URI, `sid`/`sub` presence rules), and whether your realm issues `sid` in access tokens. Do not hardcode assumptions.

## Optional Kafka Logout Consumer

Only when Kafka is already in the stack. For multi-instance fan-out, ensure **every instance** receives every event (per-instance group id), not a shared load-balanced group.

```kotlin
@Controller
class KeycloakLogoutConsumer(
    private val registry: WebSocketSessionRegistry,
    private val mapper: ObjectMapper,
) {
    // NOTE: a shared group load-balances events to ONE instance. For WS revocation fan-out,
    // give each instance a unique group (e.g. "...-keycloak-${INSTANCE_ID}") or a broadcast topic.
    @KafkaListener(
        id = "\${spring.kafka.consumer.group-id}-keycloak-ws",
        topics = ["\${com.softeno.kafka.keycloak}"],
    )
    suspend fun onEvent(record: ConsumerRecord<String, JsonNode>) {
        val event = mapper.readValue(record.value().toString(), KeycloakUserEvent::class.java)
        if (event.type == KeycloakEventType.LOGOUT) {
            registry.sessionsForUser(event.userId).forEach { closeLoggedOut(it) }
            // if event.sessionId maps to a captured sid, prefer the precise match
        }
    }
    // closeLoggedOut(...) as above
}

// Event DTO mirrors the SnuK87/keycloak-kafka payload (LOGIN/LOGOUT/REGISTER).
@JsonIgnoreProperties(ignoreUnknown = true)
data class KeycloakUserEvent(
    val id: String, val time: Long, val type: KeycloakEventType,
    val realmId: String, val clientId: String?, val userId: String,
    val sessionId: String?, val ipAddress: String, val error: String?,
    val details: Map<String, String>,
)
```

## Properties (auth/lifecycle additions)

```kotlin
// extend the transport WebSocketProperties or add a sibling block
@ConfigurationProperties(prefix = "com.example.ws")
data class WebSocketAuthProperties(
    val sweepIntervalMs: Long = 10_000,
    val expiryWarningSeconds: Long = 45,   // pre-expiry TOKEN_EXPIRING nudge (Option A)
    val allowInBandReauth: Boolean = false // enable Option B explicitly
)
```

## Notes

- The window for an expired-but-open socket is bounded by `sweepInterval`; tighten it if your threat model needs a smaller window, or send the pre-expiry warning and rely on client refresh.
- For scale-out, externalize the `byUser` index (e.g. Redis) or broadcast revocation events so any instance can act; see `SKILL.md` → Multi-Instance.
- Keep close codes/control message names stable as a documented client contract.
