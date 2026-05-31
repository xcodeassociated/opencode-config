# R2DBC Optimistic Locking Examples

## Entity pattern

```kotlin
@Table("items")
data class ItemEntity(
    @Id val id: UUID,
    @Version val version: Long? = null,
    val name: String,
)
```

## Custom SQL pattern

```sql
UPDATE items
SET name = :name, version = version + 1
WHERE id = :id AND version = :expectedVersion
```

After executing custom SQL, check affected row count. If it is zero, return a conflict.
