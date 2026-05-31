# R2DBC Entity Example

Data classes are acceptable for R2DBC because there are no JPA proxy constraints.

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
