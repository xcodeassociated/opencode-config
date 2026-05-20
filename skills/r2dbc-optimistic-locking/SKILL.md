---
name: r2dbc-optimistic-locking
description: "Use Spring Data R2DBC optimistic locking. @Version works for entity save/update/delete paths; custom SQL must check versions manually."
license: MIT
---

# R2DBC Optimistic Locking

Use when concurrent updates can conflict in R2DBC services.

## Correct Rule

Spring Data R2DBC supports optimistic locking with `@Version` on aggregate roots for normal entity save/update/delete paths. Custom SQL, bulk updates, and raw `DatabaseClient` updates must include manual version checks.

## Entity Pattern

```kotlin
@Table("items")
data class ItemEntity(
    @Id val id: UUID,
    @Version val version: Long? = null,
    val name: String
)
```

## Custom SQL Pattern

```sql
UPDATE items
SET name = :name, version = version + 1
WHERE id = :id AND version = :expectedVersion
```

Then check affected row count. If zero, return conflict.

## API Behavior

- Reject stale updates with `409 Conflict`.
- Include version in DTO or use ETag/If-Match.
- Add integration tests for conflicting updates.

## Output

```md
Path type: repository/template/custom SQL
Version field:
Conflict handling:
Tests:
```
