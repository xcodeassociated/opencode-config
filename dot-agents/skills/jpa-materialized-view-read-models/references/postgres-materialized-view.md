# PostgreSQL Materialized View Example

Use only when the target DB is PostgreSQL or compatible. Adjust names, locking, and refresh semantics for the actual database.

## Liquibase migration

```yaml
databaseChangeLog:
  - changeSet:
      id: 050-create-order-report-materialized-view
      author: agent
      changes:
        - createIndex:
            tableName: orders
            indexName: idx_orders_customer_created
            columns:
              - column: { name: customer_id }
              - column: { name: created_at }
        - createIndex:
            tableName: order_line
            indexName: idx_order_line_order_id
            columns:
              - column: { name: order_id }
        - sql:
            splitStatements: false
            sql: |
              CREATE MATERIALIZED VIEW order_report_mv AS
              SELECT
                  o.id AS order_id,
                  o.customer_id,
                  c.name AS customer_name,
                  o.status,
                  o.created_at,
                  COUNT(ol.id) AS line_count,
                  COALESCE(SUM(ol.quantity * ol.unit_price), 0) AS total_amount
              FROM orders o
              JOIN customer c ON c.id = o.customer_id
              LEFT JOIN order_line ol ON ol.order_id = o.id
              GROUP BY o.id, o.customer_id, c.name, o.status, o.created_at
              WITH NO DATA;
        - sql:
            sql: |
              CREATE UNIQUE INDEX ux_order_report_mv_order_id
              ON order_report_mv(order_id);
        - sql:
            sql: |
              CREATE INDEX idx_order_report_mv_customer_created
              ON order_report_mv(customer_id, created_at);
        - sql:
            sql: |
              CREATE INDEX idx_order_report_mv_status_created
              ON order_report_mv(status, created_at);
      rollback:
        - sql:
            sql: DROP MATERIALIZED VIEW IF EXISTS order_report_mv;
```

`REFRESH MATERIALIZED VIEW CONCURRENTLY` requires a suitable unique index and an already populated view. Use non-concurrent refresh for first population or explicit maintenance windows.

## JPA mapping

```kotlin
@Entity
@Immutable
@Table(name = "order_report_mv")
class OrderReportView(
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

    @Column(name = "total_amount", nullable = false, precision = 19, scale = 2)
    val totalAmount: BigDecimal = BigDecimal.ZERO,
)

interface OrderReportRepository : Repository<OrderReportView, Long> {
    fun findByCustomerId(customerId: Long, pageable: Pageable): Page<OrderReportView>
    fun findByStatus(status: OrderStatus, pageable: Pageable): Page<OrderReportView>
}
```

Do not extend `JpaRepository` unless you intentionally hide/avoid inherited write methods at the application boundary.

## Refresh service

```kotlin
@Service
class OrderReportRefreshService(
    private val jdbcTemplate: JdbcTemplate,
) {
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    fun refresh(concurrently: Boolean = true) {
        val sql = if (concurrently) {
            "REFRESH MATERIALIZED VIEW CONCURRENTLY order_report_mv"
        } else {
            "REFRESH MATERIALIZED VIEW order_report_mv"
        }
        jdbcTemplate.execute(sql)
    }
}
```

## Scheduled refresh

```kotlin
@Component
class OrderReportRefreshJob(
    private val refreshService: OrderReportRefreshService,
) {
    @Scheduled(cron = "\${app.order-report.refresh-cron}", zone = "UTC")
    fun refresh() {
        refreshService.refresh(concurrently = true)
    }
}
```

For multiple application instances, add a distributed lock or run the refresh from one scheduler/worker only.

## JUnit 5 stale-until-refresh check

```kotlin
@SpringBootTest
@ActiveProfiles("test")
class OrderReportMaterializedViewTest(
    @Autowired private val orderService: OrderService,
    @Autowired private val reportRepository: OrderReportRepository,
    @Autowired private val refreshService: OrderReportRefreshService,
) {
    @Test
    fun `materialized view stays stale until refresh`() {
        val orderId = orderService.createOrder(validCommand())

        assertThat(reportRepository.findById(orderId)).isEmpty()

        refreshService.refresh(concurrently = false)

        val report = reportRepository.findById(orderId).orElseThrow()
        assertThat(report.orderId).isEqualTo(orderId)
    }
}
```
