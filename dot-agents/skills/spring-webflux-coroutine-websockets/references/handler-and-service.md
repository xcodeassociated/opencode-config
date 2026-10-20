# WebFlux + Coroutine WebSocket — Handler and Service Examples

Architecture-agnostic transport examples. `Message` is a minimal envelope; replace it with your own transport DTO but keep domain semantics (rooms, topics, presence) out of these classes.

Read this file only when you need concrete code. The authoritative guidance is in `SKILL.md`.

## Transport Envelope (domain-agnostic)

```kotlin
data class Message(
    val from: String,   // sender identity or "SYSTEM"
    val to: String,     // recipient session id, a known sentinel, or "ALL"
    val content: String // opaque payload; no domain meaning at the transport layer
) {
    fun toJson(mapper: ObjectMapper): String = mapper.writeValueAsString(this)
}
```

## Bean Wiring

```kotlin
@Configuration
class CoroutineWebSocketConfig(
    private val messageService: CoroutineMessageService,
    private val config: WebSocketProperties,
) {
    private val log = LogFactory.getLog(javaClass)

    @Bean
    fun webSocketHandlerAdapter() = WebSocketHandlerAdapter()

    @Bean
    fun handlerMapping(objectMapper: ObjectMapper): HandlerMapping =
        SimpleUrlHandlerMapping().apply {
            order = 10 // ensure this mapping is consulted before broader mappings
            urlMap = mapOf("/ws" to webSocketHandler(objectMapper))
        }

    @Bean
    fun webSocketHandler(objectMapper: ObjectMapper): WebSocketHandler =
        WebSocketHandler { session ->
            log.info("ws: new session ${session.id}")
            // Bridge reactive -> coroutine; .then() ties Mono<Void> completion to the socket.
            mono(Dispatchers.IO + MDCContext()) {
                try {
                    handleSession(session, objectMapper)
                } catch (e: Exception) {
                    log.error("ws: session ${session.id} failed", e)
                }
            }.then()
        }

    // ... handleSession + jobs below
}
```

## Session Handler with Structured Concurrency

Prefer launching inbound handling on the session scope over `GlobalScope`, so cancellation, MDC, and cleanup propagate with the connection.

```kotlin
private suspend fun handleSession(
    session: WebSocketSession,
    objectMapper: ObjectMapper,
) = withContext(Dispatchers.IO + MDCContext()) {
    messageService.registerSession(session)
    messageService.send(Message("SYSTEM", session.id, "HANDSHAKE"), session)

    try {
        coroutineScope {
            val ctx = Dispatchers.IO + MDCContext() + SupervisorJob()

            fun onJobFailure(t: Throwable) = launch(ctx) {
                log.error("ws: ${session.id} job failed", t)
                closeSession(session)
            }

            val outgoing = launch(ctx + CoroutineExceptionHandler { _, t -> onJobFailure(t) }) {
                handleOutgoing(session, objectMapper)
            }
            val incoming = launch(ctx + CoroutineExceptionHandler { _, t -> onJobFailure(t) }) {
                handleIncoming(session, objectMapper, this) // pass scope, not GlobalScope
            }
            val heartbeat = launch(ctx + CoroutineExceptionHandler { _, t -> onJobFailure(t) }) {
                handleHeartbeat(session)
            }

            select {
                outgoing.onJoin {}
                incoming.onJoin {}
                heartbeat.onJoin {}
            }
            outgoing.cancelAndJoin()
            incoming.cancelAndJoin()
            heartbeat.cancelAndJoin()
        }
    } finally {
        log.info("ws: disconnect ${session.id}")
        messageService.unregisterSession(session) // idempotent
    }
}

private suspend fun closeSession(session: WebSocketSession) =
    withContext(Dispatchers.IO + MDCContext()) {
        messageService.unregisterSession(session)
        session.close().awaitSingleOrNull()
    }

private suspend fun handleOutgoing(session: WebSocketSession, mapper: ObjectMapper) {
    messageService.getMessageFlow(session).collect { msg ->
        session.send(Mono.just(session.textMessage(msg.toJson(mapper)))).awaitSingleOrNull()
    }
}

private suspend fun handleIncoming(
    session: WebSocketSession,
    mapper: ObjectMapper,
    scope: CoroutineScope, // session scope; do NOT use GlobalScope
) {
    session.receive()
        .asFlow() // kotlinx-coroutines-reactive
        .collect { frame ->
            val msg = runCatching { mapper.readValue(frame.payloadAsText, Message::class.java) }
                .getOrElse { log.error("ws: ${session.id} bad frame", it); return@collect }
            scope.launch(Dispatchers.IO + MDCContext()) {
                runCatching {
                    if (msg.content == "pong" && msg.to == "SYSTEM")
                        messageService.updateLastPong(session)
                    else
                        messageService.routeMessage(msg)
                }.onFailure { log.error("ws: ${session.id} route failed", it) }
            }
        }
}

private suspend fun handleHeartbeat(session: WebSocketSession) {
    while (currentCoroutineContext().isActive) {
        delay(config.heartbeatIntervalSeconds.seconds)
        messageService.send(Message("SYSTEM", session.id, "ping"), session)
    }
}
```

## Channel-Backed Session Registry

```kotlin
@Service
class CoroutineMessageService(private val config: WebSocketProperties) {
    private val log = LogFactory.getLog(javaClass)
    private val channels = ConcurrentHashMap<WebSocketSession, Channel<Message>>()
    private val lastPong = ConcurrentHashMap<WebSocketSession, Instant>()

    suspend fun registerSession(session: WebSocketSession) {
        // Choose capacity deliberately: UNLIMITED is simple but unbounded; prefer a bounded
        // buffer with an overflow policy for untrusted/high-volume clients.
        channels[session] = Channel(capacity = Channel.BUFFERED) // or Channel.UNLIMITED
        lastPong[session] = Instant.now()
        log.info("ws: registered ${session.id}")
    }

    fun unregisterSession(session: WebSocketSession) {
        channels.remove(session)?.close()
        lastPong.remove(session)
    }

    fun send(message: Message, session: WebSocketSession): Message {
        channels[session]?.trySend(message)?.let { if (it.isFailure) log.warn("ws: send failed ${session.id}") }
        return message
    }

    fun broadcast(message: Message) { channels.values.forEach { it.trySend(message) } }

    fun routeMessage(message: Message) {
        when (message.to) {
            "ALL" -> broadcast(message)
            else -> channels.keys.firstOrNull { it.id == message.to }
                ?.let { send(message, it) }
                ?: log.warn("ws: unknown target ${message.to}")
        }
    }

    fun getMessageFlow(session: WebSocketSession): Flow<Message> =
        channels[session]?.receiveAsFlow() ?: emptyFlow()

    fun updateLastPong(session: WebSocketSession) { lastPong[session] = Instant.now() }

    fun sessionsMissingPong(thresholdSeconds: Long): List<WebSocketSession> {
        val cutoff = Instant.now().minusSeconds(thresholdSeconds)
        return lastPong.filterValues { it.isBefore(cutoff) }.keys.toList()
    }
}
```

## Properties

```kotlin
@ConfigurationProperties(prefix = "com.example.ws")
data class WebSocketProperties(
    val heartbeatIntervalSeconds: Long = 10,
    val staleCheckThresholdSeconds: Long = 30,
    val staleCheck: Boolean = true,
)
```

## Notes

- `awaitSingleOrNull()` / `awaitSingle()` come from `kotlinx-coroutines-reactor`; `.asFlow()` on `session.receive()` comes from `kotlinx-coroutines-reactive`.
- Closing the channel on unregister makes the outgoing `collect` complete, which lets the outgoing job finish and the `select` fire — keep cleanup idempotent because it can run from both the error path and the normal completion path.
- For the stale-session sweep that calls `sessionsMissingPong(...)` and the token-expiry/logout policy, see `websocket-auth-session-lifecycle`.
