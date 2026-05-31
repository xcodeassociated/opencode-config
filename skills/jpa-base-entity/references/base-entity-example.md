# JPA Kotlin Base Entity Example

Use after loading `jpa-base-entity` when concrete entity code is needed.

```kotlin
@MappedSuperclass
@EntityListeners(AuditingEntityListener::class)
abstract class BaseEntity(
    @Column(nullable = false, updatable = false, unique = true)
    val uuid: UUID = UUID.randomUUID()
) {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
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

Adapt sequence strategy, UUID policy, and auditing to the project database and migration setup.
