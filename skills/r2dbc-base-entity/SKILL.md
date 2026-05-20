---
name: r2dbc-base-entity
description: "Create Spring Data R2DBC/Kotlin entities. Use for reactive persistence models, IDs, versions, audit fields, and table mapping."
license: MIT
---

# R2DBC Base Entity

Use before writing R2DBC entities.

## Rules

- R2DBC entities are not JPA entities. Do not use JPA annotations.
- Use Spring Data annotations: `@Table`, `@Id`, `@Version`.
- Prefer immutable IDs where possible.
- Include audit fields only when configured and needed.
- Keep mapping explicit when column names differ.
- Do not use lazy-loading assumptions.

## Example Shape

```kotlin
@Table("items")
data class ItemEntity(
    @Id val id: UUID? = null,
    @Version val version: Long? = null,
    val name: String,
    val createdAt: Instant? = null,
    val updatedAt: Instant? = null,
)
```

## Notes

- Data classes are acceptable for R2DBC because there are no JPA proxy constraints.
- Verify generated IDs and version behavior with integration tests.

## Output

State table, ID strategy, versioning, audit fields, and tests.
