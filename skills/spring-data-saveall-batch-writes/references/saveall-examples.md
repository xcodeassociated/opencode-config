# Spring Data saveAll Examples

Use these examples after loading `spring-data-saveall-batch-writes` when concrete Kotlin code is needed.

## Bad Pattern

```kotlin
fun importUsers(rows: List<UserImportRow>) {
    rows.forEach { row ->
        userRepository.save(row.toEntity())
    }
}
```

## Preferred Pattern

```kotlin
@Service
class UserImportService(
    private val userRepository: UserRepository,
) {
    @Transactional
    fun importUsers(rows: List<UserImportRow>): List<User> {
        if (rows.isEmpty()) return emptyList()

        val users = rows.map { row -> row.toEntity() }

        return userRepository.saveAll(users).toList()
    }
}
```

This keeps the write path explicit, avoids repeated repository calls, and lets Spring Data/store implementations apply collection-level behavior where available.

## Chunked JPA Import

Use chunking when input can be large. Flush/clear only when memory pressure or batch behavior requires it.

```kotlin
@Service
class LargeUserImportService(
    private val userRepository: UserRepository,
    @PersistenceContext private val entityManager: EntityManager,
) {
    @Transactional
    fun importUsers(rows: Sequence<UserImportRow>): Int {
        var saved = 0

        rows.chunked(500).forEach { chunk ->
            val users = chunk.map { row -> row.toEntity() }
            saved += userRepository.saveAll(users).count()

            entityManager.flush()
            entityManager.clear()
        }

        return saved
    }
}
```

Only clear the persistence context when later code does not depend on still-managed instances.

## JPA Batch Settings

For high-volume JPA inserts/updates, repository `saveAll(...)` is only part of the solution. Verify Hibernate/JDBC batching and ID generation strategy.

```properties
spring.jpa.properties.hibernate.jdbc.batch_size=50
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
```

Prefer sequence/pooled identifiers for insert batching when possible. Identity-generated IDs may limit batching because the database must return each generated key immediately.

## Non-SQL Repository Pattern

```kotlin
@Service
class ProductSyncService(
    private val productRepository: ProductDocumentRepository,
) {
    fun syncProducts(documents: List<ProductDocument>): List<ProductDocument> {
        if (documents.isEmpty()) return emptyList()

        return productRepository.saveAll(documents).toList()
    }
}
```

For stores with native bulk APIs, use them only after confirming repository `saveAll(...)` is not enough and after documenting changed failure, ordering, event, and transaction semantics.

## Reactive Repository Pattern

For reactive repositories, do not `collectList()` unbounded streams just to call a blocking-style batch method.

```kotlin
@Service
class ReactiveProductSyncService(
    private val productRepository: ReactiveProductRepository,
) {
    fun syncProducts(documents: Flux<ProductDocument>): Flux<ProductDocument> =
        productRepository.saveAll(documents)
}
```

For Spring Data R2DBC specifically, use this pattern only for small bounded/simple repository writes. For throughput-sensitive inserts, updates, imports, or backfills, load `r2dbc-batch-operations` and implement a custom batch method instead.
