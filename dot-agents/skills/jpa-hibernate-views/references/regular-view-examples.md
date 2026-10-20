# Regular View and @Subselect Examples

## Liquibase regular view

```yaml
databaseChangeLog:
  - changeSet:
      id: 040-create-order_summary_view
      author: agent
      changes:
        - createIndex:
            tableName: orders
            indexName: idx_orders_customer_created
            columns:
              - column: { name: customer_id }
              - column: { name: created_at }
        - createView:
            viewName: order_summary_view
            replaceIfExists: true
            selectQuery: |
              SELECT
                  o.id AS order_id,
                  o.customer_id,
                  c.name AS customer_name,
                  o.status,
                  o.created_at,
                  COUNT(ol.id) AS line_count
              FROM orders o
              JOIN customer c ON c.id = o.customer_id
              LEFT JOIN order_line ol ON ol.order_id = o.id
              GROUP BY o.id, o.customer_id, c.name, o.status, o.created_at
      rollback:
        - dropView:
            viewName: order_summary_view
```

## JPA read-only mapping

```kotlin
@Entity
@Immutable
@Table(name = "order_summary_view")
class OrderSummaryView(
    @Id
    @Column(name = "order_id")
    val orderId: Long = 0,

    @Column(name = "customer_id", nullable = false)
    val customerId: Long = 0,

    @Column(name = "customer_name", nullable = false)
    val customerName: String = "",

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val status: OrderStatus = OrderStatus.NEW,

    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.EPOCH,

    @Column(name = "line_count", nullable = false)
    val lineCount: Long = 0,
)

interface OrderSummaryViewRepository : Repository<OrderSummaryView, Long> {
    fun findByCustomerId(customerId: Long, pageable: Pageable): Page<OrderSummaryView>
    fun findByStatus(status: OrderStatus, pageable: Pageable): Page<OrderSummaryView>
}
```

## Hibernate @Subselect alternative

```kotlin
@Entity
@Immutable
@Subselect(
    """
    SELECT
        o.id AS order_id,
        o.customer_id,
        c.name AS customer_name,
        o.status,
        o.created_at
    FROM orders o
    JOIN customer c ON c.id = o.customer_id
    """
)
@Synchronize("orders", "customer")
class OrderSummarySubselect(
    @Id
    @Column(name = "order_id")
    val orderId: Long = 0,

    @Column(name = "customer_id", nullable = false)
    val customerId: Long = 0,

    @Column(name = "customer_name", nullable = false)
    val customerName: String = "",

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val status: OrderStatus = OrderStatus.NEW,

    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.EPOCH,
)
```

## Mapping test

```kotlin
@DataJpaTest
class OrderSummaryViewRepositoryTest(
    @Autowired private val repository: OrderSummaryViewRepository,
    @Autowired private val entityManager: TestEntityManager,
) {
    @Test
    fun `view returns order summary`() {
        val order = persistOrderWithCustomerAndLines()
        entityManager.flush()
        entityManager.clear()

        val result = repository.findById(requireNotNull(order.id))

        assertThat(result).isPresent
        assertThat(result.get().customerName).isEqualTo(order.customer.name)
    }
}
```
