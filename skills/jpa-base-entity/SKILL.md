---
name: jpa-base-entity
description: "Create Kotlin JPA entities with stable identity, audit fields, and optimistic versioning. Use before new or refactored @Entity classes."
license: MIT
---

# JPA Base Entity

Use before writing Kotlin JPA entities.

## Rules

- Do not use Kotlin `data class` for JPA entities.
- Use `open` classes/properties where required by JPA/Hibernate setup.
- Avoid equality based on nullable database ID.
- Prefer immutable application UUID for equality when a shared base entity is used.
- Include `@Version` for optimistic locking when concurrent updates matter.
- Prefer `Instant` for audit timestamps.
- Keep entity constructors compatible with JPA.

## Base Pattern

```kotlin
@MappedSuperclass
@EntityListeners(AuditingEntityListener::class)
abstract class BaseEntity(
    @Column(nullable = false, updatable = false, unique = true)
    val uuid: UUID = UUID.randomUUID()
) {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE)
    var id: Long? = null

    @Version
    var version: Long? = null

    @CreatedDate
    var createdAt: Instant? = null

    @LastModifiedDate
    var updatedAt: Instant? = null

    override fun equals(other: Any?) =
        this === other || (other is BaseEntity && uuid == other.uuid)

    override fun hashCode() = uuid.hashCode()
}
```

## Output

State identity strategy, audit fields, versioning, and any deviation.
