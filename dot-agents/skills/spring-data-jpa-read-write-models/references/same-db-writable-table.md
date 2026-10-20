# Same-DB Writable Read Table Example

Use this only after the main skill's decision ladder justifies a writable derived table.

## Normalized write model

```kotlin
@Entity
@Table(name = "orders")
class Order(
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    var customer: Customer,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: OrderStatus,

    @Column(name = "created_at", nullable = false)
    var createdAt: Instant = Instant.now(),
) : BaseEntity() {
    @OneToMany(mappedBy = "order", cascade = [CascadeType.ALL], orphanRemoval = true)
    private val _lines: MutableSet<OrderLine> = linkedSetOf()

    val lines: Set<OrderLine>
        get() = _lines

    fun addLine(line: OrderLine) {
        _lines += line
        line.order = this
    }

    fun totalAmount(): BigDecimal =
        _lines.fold(BigDecimal.ZERO) { acc, line -> acc + line.totalAmount() }
}
```

## Denormalized read table

```kotlin
@Entity
@Table(
    name = "order_summary_read_model",
    indexes = [
        Index(name = "idx_order_summary_customer_created", columnList = "customer_id, created_at"),
        Index(name = "idx_order_summary_status_created", columnList = "status, created_at"),
    ],
)
class OrderSummaryReadModel(
    @Id
    @Column(name = "order_id")
    val orderId: Long = 0,

    @Column(name = "customer_id", nullable = false)
    var customerId: Long = 0,

    @Column(name = "customer_name", nullable = false)
    var customerName: String = "",

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: OrderStatus = OrderStatus.NEW,

    @Column(name = "total_amount", nullable = false, precision = 19, scale = 2)
    var totalAmount: BigDecimal = BigDecimal.ZERO,

    @Column(name = "created_at", nullable = false)
    var createdAt: Instant = Instant.EPOCH,
)
```

## Read-only application API plus internal writer

```kotlin
interface OrderSummaryReadRepository : Repository<OrderSummaryReadModel, Long> {
    fun findByStatus(status: OrderStatus, pageable: Pageable): Page<OrderSummaryReadModel>
    fun findByCustomerId(customerId: Long, pageable: Pageable): Page<OrderSummaryReadModel>
}

interface OrderSummaryReadModelWriter : JpaRepository<OrderSummaryReadModel, Long>
```

## Same-transaction update

```kotlin
@Service
class OrderService(
    private val orderRepository: OrderRepository,
    private val summaryWriter: OrderSummaryReadModelWriter,
) {
    @Transactional
    fun createOrder(command: CreateOrderCommand): Long {
        val order = orderRepository.save(command.toOrder())

        summaryWriter.save(
            OrderSummaryReadModel(
                orderId = requireNotNull(order.id),
                customerId = requireNotNull(order.customer.id),
                customerName = order.customer.name,
                status = order.status,
                totalAmount = order.totalAmount(),
                createdAt = order.createdAt,
            )
        )

        return requireNotNull(order.id)
    }
}
```

## Liquibase shape

```yaml
databaseChangeLog:
  - changeSet:
      id: 030-create-order-summary-read-model
      author: agent
      changes:
        - createTable:
            tableName: order_summary_read_model
            columns:
              - column:
                  name: order_id
                  type: bigint
                  constraints:
                    primaryKey: true
                    nullable: false
              - column: { name: customer_id, type: bigint, constraints: { nullable: false } }
              - column: { name: customer_name, type: varchar(255), constraints: { nullable: false } }
              - column: { name: status, type: varchar(40), constraints: { nullable: false } }
              - column: { name: total_amount, type: numeric(19,2), constraints: { nullable: false } }
              - column: { name: created_at, type: timestamptz, constraints: { nullable: false } }
        - createIndex:
            tableName: order_summary_read_model
            indexName: idx_order_summary_customer_created
            columns:
              - column: { name: customer_id }
              - column: { name: created_at }
        - createIndex:
            tableName: order_summary_read_model
            indexName: idx_order_summary_status_created
            columns:
              - column: { name: status }
              - column: { name: created_at }
      rollback:
        - dropTable:
            tableName: order_summary_read_model
```

## JUnit 5 rollback check

```kotlin
@SpringBootTest
@ActiveProfiles("test")
class OrderReadModelTransactionTest(
    @Autowired private val service: OrderService,
    @Autowired private val orderRepository: OrderRepository,
    @Autowired private val summaryWriter: OrderSummaryReadModelWriter,
) {
    @Test
    fun `read model is rolled back with failed order transaction`() {
        assertThrows<IllegalStateException> {
            service.createOrderAndFail(validCommand())
        }

        assertThat(orderRepository.findAll()).isEmpty()
        assertThat(summaryWriter.findAll()).isEmpty()
    }
}
```
