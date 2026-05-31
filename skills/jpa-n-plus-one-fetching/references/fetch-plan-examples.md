# JPA Fetch Plan Examples

Use these examples after loading `jpa-n-plus-one-fetching` when concrete Kotlin/Spring Data code is needed.

## Preferred: JPQL FETCH JOIN

```kotlin
interface OrderRepository : JpaRepository<Order, Long> {
    @Query(
        """
        select o
        from Order o
        join fetch o.customer
        left join fetch o.lines line
        left join fetch line.product
        where o.status = :status
        order by o.createdAt desc
        """
    )
    fun findByStatusWithDetails(
        @Param("status") status: OrderStatus
    ): List<Order>
}
```

Use when the query is specific and the required associations are known. Keep the fetch plan as narrow as the endpoint/use case needs.

## Alternative: EntityGraph

```kotlin
interface OrderRepository : JpaRepository<Order, Long> {
    @EntityGraph(attributePaths = ["customer", "lines", "lines.product"])
    fun findByStatus(status: OrderStatus): List<Order>
}
```

Use when the predicate is simple and a derived query remains readable. Prefer JPQL `JOIN FETCH` for complex predicates, joins, ordering, or hand-tuned queries.

## Pageable Collection Fetch Pattern

Do not combine pageable list queries with collection fetch joins. Fetch page IDs first, then fetch the graph for those IDs.

```kotlin
interface OrderRepository : JpaRepository<Order, Long> {
    @Query(
        """
        select o.id
        from Order o
        where o.status = :status
        order by o.createdAt desc
        """
    )
    fun findPageIdsByStatus(
        @Param("status") status: OrderStatus,
        pageable: Pageable
    ): Page<Long>

    @Query(
        """
        select o
        from Order o
        join fetch o.customer
        left join fetch o.lines line
        left join fetch line.product
        where o.id in :ids
        """
    )
    fun findWithDetailsByIdIn(@Param("ids") ids: Collection<Long>): List<Order>
}
```

```kotlin
@Service
class OrderQueryService(
    private val repository: OrderRepository,
) {
    @Transactional(readOnly = true)
    fun findReadyOrders(pageable: Pageable): Page<OrderDto> {
        val page = repository.findPageIdsByStatus(OrderStatus.READY, pageable)
        if (page.isEmpty) return Page.empty(pageable)

        val ordersById = repository.findWithDetailsByIdIn(page.content)
            .associateBy { requireNotNull(it.id) }

        val orderedDtos = page.content.mapNotNull { id -> ordersById[id]?.toDto() }
        return PageImpl(orderedDtos, pageable, page.totalElements)
    }
}
```

## DTO Projection Option

Use projections when the caller does not need managed entities.

```kotlin
data class OrderSummaryDto(
    val id: Long,
    val customerName: String,
    val createdAt: Instant,
)

interface OrderRepository : JpaRepository<Order, Long> {
    @Query(
        """
        select new com.acme.orders.OrderSummaryDto(o.id, c.name, o.createdAt)
        from Order o
        join o.customer c
        where o.status = :status
        order by o.createdAt desc
        """
    )
    fun findSummariesByStatus(
        @Param("status") status: OrderStatus,
        pageable: Pageable,
    ): Page<OrderSummaryDto>
}
```

## Batch Fetching Mitigation

Use when associations are accessed lazily across multiple already-loaded roots and a use-case fetch query is not appropriate.

```kotlin
@OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
@BatchSize(size = 50)
val lines: MutableSet<OrderLine> = mutableSetOf()
```

```properties
spring.jpa.properties.hibernate.default_batch_fetch_size=50
```

Batch fetching reduces N+1 into fewer `IN (...)` queries, but it usually should not replace a clear fetch join, entity graph, or projection for a known read use case.

## Query Count Regression Test

```kotlin
@DataJpaTest(
    properties = ["spring.jpa.properties.hibernate.generate_statistics=true"]
)
class OrderRepositoryFetchTest(
    @Autowired private val repository: OrderRepository,
    @Autowired private val entityManager: EntityManager,
) {
    @Test
    fun `loads order details without N plus one selects`() {
        val statistics = entityManager.entityManagerFactory
            .unwrap(SessionFactory::class.java)
            .statistics

        statistics.clear()

        val orders = repository.findByStatusWithDetails(OrderStatus.READY)

        orders.forEach { order ->
            order.customer.name
            order.lines.forEach { line -> line.product.sku }
        }

        assertThat(statistics.prepareStatementCount).isLessThanOrEqualTo(2)
    }
}
```

Adjust the threshold to the actual expected query shape.
