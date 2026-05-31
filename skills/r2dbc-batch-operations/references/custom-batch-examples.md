# R2DBC Custom Batch Examples

Use these examples after loading `r2dbc-batch-operations`. Adapt SQL, bind markers, generated-ID handling, and transaction policy to the selected R2DBC driver/database.

## Custom saveAll-like Fragment

Name the method so callers understand that it has different semantics from repository `saveAll(...)`.

```kotlin
interface UserBatchRepository {
    fun insertAllBatch(users: Flux<UserEntity>, chunkSize: Int = 500): Flux<UserEntity>
}
```

```kotlin
@Repository
class UserBatchRepositoryImpl(
    private val databaseClient: DatabaseClient,
    private val tx: TransactionalOperator,
) : UserBatchRepository {

    override fun insertAllBatch(users: Flux<UserEntity>, chunkSize: Int): Flux<UserEntity> {
        require(chunkSize > 0) { "chunkSize must be positive" }

        return users
            .buffer(chunkSize)
            .filter { it.isNotEmpty() }
            .concatMap { chunk ->
                tx.transactional(
                    insertChunk(chunk).thenMany(Flux.fromIterable(chunk)),
                )
            }
    }

    private fun insertChunk(chunk: List<UserEntity>): Mono<Long> {
        val valuesSql = chunk.indices.joinToString(", ") { i ->
            "(:id$i, :email$i, :displayName$i)"
        }

        var spec = databaseClient.sql(
            """
            insert into users (id, email, display_name)
            values $valuesSql
            """.trimIndent(),
        )

        chunk.forEachIndexed { i, user ->
            spec = spec
                .bind("id$i", user.id)
                .bind("email$i", user.email)
                .bind("displayName$i", user.displayName)
        }

        return spec.fetch().rowsUpdated()
    }
}
```

This example assumes client-generated IDs and non-null fields. If IDs are database-generated, either map returned rows with a database-specific `RETURNING`/generated-key strategy or return only a count/result object instead of pretending the original entities contain generated state.

## Implementation Notes

- Named parameters are expanded by Spring's `DatabaseClient`; native placeholders differ by driver.
- Reduce `chunkSize` when generated SQL creates too many bind parameters.
- Use `bindNull` for nullable columns.
- Keep generated SQL deterministic and covered by integration tests.
- For updates, prefer set-based SQL when possible; otherwise use prepared statement batching or chunked multi-row patterns verified against the selected driver.

## Integration Test Guidance

Verify against the actual R2DBC driver/database:

- emitted statement count or observable batch behavior;
- row count and duplicate/upsert behavior;
- transaction boundary per chunk versus whole stream;
- backpressure and no unbounded collection;
- failure reporting for failed chunk/item;
- generated ID/version/audit behavior.
