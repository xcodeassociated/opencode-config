# JPA Many-to-Many Mapping Examples

Use after loading `jpa-many-to-many` when concrete Kotlin mapping code is needed.

## Direct Mapping Pattern: One Association Table

```kotlin
@Entity
@Table(name = "app_user")
class User(
    @Column(nullable = false, unique = true)
    var email: String,
) : BaseEntity() {

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "app_user_role",
        joinColumns = [JoinColumn(name = "user_id", nullable = false)],
        inverseJoinColumns = [JoinColumn(name = "role_id", nullable = false)],
        uniqueConstraints = [UniqueConstraint(columnNames = ["user_id", "role_id"])],
        indexes = [
            Index(name = "idx_app_user_role_role_id_user_id", columnList = "role_id, user_id"),
        ],
    )
    private val _roles: MutableSet<Role> = linkedSetOf()

    val roles: Set<Role>
        get() = _roles

    fun addRole(role: Role) {
        if (_roles.add(role)) {
            role.addUserInternal(this)
        }
    }

    fun removeRole(role: Role) {
        if (_roles.remove(role)) {
            role.removeUserInternal(this)
        }
    }
}
```

```kotlin
@Entity
@Table(name = "role")
class Role(
    @Column(nullable = false, unique = true)
    var name: String,
) : BaseEntity() {

    @ManyToMany(mappedBy = "_roles", fetch = FetchType.LAZY)
    private val _users: MutableSet<User> = linkedSetOf()

    val users: Set<User>
        get() = _users

    internal fun addUserInternal(user: User) {
        _users.add(user)
    }

    internal fun removeUserInternal(user: User) {
        _users.remove(user)
    }
}
```

If project style avoids backing-field property names in `mappedBy`, expose the owning collection as a JPA-mapped mutable property and protect it through helper methods. The invariant stays the same: `mappedBy` points to the owning-side association property, not to the join-table name.

## Bad Pattern: Two Association Tables

```kotlin
@Entity
class User : BaseEntity() {
    @ManyToMany
    @JoinTable(name = "app_user_role")
    val roles: MutableSet<Role> = linkedSetOf()
}

@Entity
class Role : BaseEntity() {
    // Bad: this is a second owning association, not the inverse side.
    @ManyToMany
    @JoinTable(name = "role_user")
    val users: MutableSet<User> = linkedSetOf()
}
```

Fix by choosing one owner and replacing the other side with `mappedBy`.

## Join Entity Pattern

Use this when the association table has meaning beyond linking two rows.

```kotlin
@Entity
@Table(
    name = "app_user_role",
    uniqueConstraints = [UniqueConstraint(columnNames = ["user_id", "role_id"])],
    indexes = [
        Index(name = "idx_app_user_role_role_id_user_id", columnList = "role_id, user_id"),
    ],
)
class UserRole(
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    var user: User,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    var role: Role,

    @Column(nullable = false)
    var grantedAt: Instant = Instant.now(),
) : BaseEntity()
```

With a join entity, map `User -> UserRole` and `Role -> UserRole` as one-to-many/many-to-one relationships. Do not also add a direct `User.roles @ManyToMany` for the same table unless it is explicitly read-only and justified.
