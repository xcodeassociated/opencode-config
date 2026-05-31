# Outbox Propagation Examples

Adapt names and serialization to the project. Keep source-state update and outbox insert in one local transaction.

## Outbox entity

```kotlin
@Entity
@Table(
    name = "outbox_event",
    indexes = [
        Index(name = "idx_outbox_status_next_at", columnList = "status, next_attempt_at"),
        Index(name = "idx_outbox_aggregate", columnList = "aggregate_type, aggregate_id"),
    ],
)
class OutboxEvent(
    @Id
    @Column(name = "event_id", nullable = false)
    val eventId: UUID = UUID.randomUUID(),

    @Column(name = "aggregate_type", nullable = false)
    val aggregateType: String,

    @Column(name = "aggregate_id", nullable = false)
    val aggregateId: String,

    @Column(name = "event_type", nullable = false)
    val eventType: String,

    @Column(name = "schema_version", nullable = false)
    val schemaVersion: Int = 1,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payload", nullable = false, columnDefinition = "jsonb")
    val payload: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: OutboxStatus = OutboxStatus.PENDING,

    @Column(name = "attempt_count", nullable = false)
    var attemptCount: Int = 0,

    @Column(name = "next_attempt_at", nullable = false)
    var nextAttemptAt: Instant = Instant.now(),

    @Column(name = "last_error")
    var lastError: String? = null,
)
```

## Atomic source update + outbox insert

```kotlin
@Service
class OrderCommandService(
    private val orderRepository: OrderRepository,
    private val outboxRepository: OutboxRepository,
    private val objectMapper: ObjectMapper,
) {
    @Transactional
    fun placeOrder(command: PlaceOrderCommand): Long {
        val order = orderRepository.save(command.toOrder())
        val orderId = requireNotNull(order.id)

        outboxRepository.save(
            OutboxEvent(
                aggregateType = "Order",
                aggregateId = orderId.toString(),
                eventType = "OrderPlaced",
                payload = objectMapper.writeValueAsString(
                    OrderPlacedEvent(orderId = orderId, customerId = requireNotNull(order.customer.id))
                ),
            )
        )

        return orderId
    }
}
```

## Polling relay shape

```kotlin
@Component
class OutboxRelay(
    private val outboxRepository: OutboxRepository,
    private val publisher: DomainEventPublisher,
) {
    @Scheduled(fixedDelayString = "\${app.outbox.poll-delay-ms}")
    fun publishPending() {
        outboxRepository.findPendingBatch(Instant.now(), PageRequest.of(0, 100))
            .forEach { event -> publishOne(event.eventId) }
    }

    @Transactional
    fun publishOne(eventId: UUID) {
        val event = outboxRepository.findForUpdate(eventId).orElseThrow()
        try {
            publisher.publish(event)
            event.status = OutboxStatus.PUBLISHED
        } catch (ex: Exception) {
            event.attemptCount += 1
            event.lastError = ex.message?.take(1000)
            event.nextAttemptAt = Instant.now().plusSeconds(backoffSeconds(event.attemptCount))
            if (event.attemptCount >= 10) event.status = OutboxStatus.DEAD_LETTER
        }
    }
}
```

## Idempotent projector

```kotlin
@Service
class OrderSummaryProjector(
    private val inboxRepository: InboxEventRepository,
    private val summaryRepository: OrderSummaryRepository,
) {
    @Transactional
    fun apply(event: OrderPlacedEvent, eventId: UUID) {
        if (inboxRepository.existsById(eventId)) return

        summaryRepository.save(
            OrderSummaryReadModel(
                orderId = event.orderId,
                customerId = event.customerId,
                status = OrderStatus.PLACED,
            )
        )

        inboxRepository.save(InboxEvent(eventId = eventId, processedAt = Instant.now()))
    }
}
```

## Liquibase shape

```yaml
databaseChangeLog:
  - changeSet:
      id: 060-create-outbox-event
      author: agent
      changes:
        - createTable:
            tableName: outbox_event
            columns:
              - column: { name: event_id, type: uuid, constraints: { primaryKey: true, nullable: false } }
              - column: { name: aggregate_type, type: varchar(100), constraints: { nullable: false } }
              - column: { name: aggregate_id, type: varchar(100), constraints: { nullable: false } }
              - column: { name: event_type, type: varchar(100), constraints: { nullable: false } }
              - column: { name: schema_version, type: int, constraints: { nullable: false } }
              - column: { name: payload, type: jsonb, constraints: { nullable: false } }
              - column: { name: status, type: varchar(40), constraints: { nullable: false } }
              - column: { name: attempt_count, type: int, constraints: { nullable: false } }
              - column: { name: next_attempt_at, type: timestamptz, constraints: { nullable: false } }
              - column: { name: last_error, type: varchar(1000) }
        - createIndex:
            tableName: outbox_event
            indexName: idx_outbox_status_next_at
            columns:
              - column: { name: status }
              - column: { name: next_attempt_at }
```

## Integration tests to add

```kotlin
@SpringBootTest
@ActiveProfiles("test")
class OutboxPropagationTest(
    @Autowired private val commandService: OrderCommandService,
    @Autowired private val orderRepository: OrderRepository,
    @Autowired private val outboxRepository: OutboxRepository,
) {
    @Test
    fun `rolled back command does not create outbox event`() {
        assertThrows<IllegalStateException> { commandService.placeOrderAndFail(validCommand()) }
        assertThat(orderRepository.findAll()).isEmpty()
        assertThat(outboxRepository.findAll()).isEmpty()
    }
}
```
