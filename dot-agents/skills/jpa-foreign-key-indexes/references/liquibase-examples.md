
## JPA annotation alignment

Use annotations to document expected schema and to help generated/test DDL. Liquibase remains the production source of truth.

```kotlin
@Entity
@Table(
    name = "orders",
    indexes = [Index(name = "idx_orders_customer_id", columnList = "customer_id")],
)
class Order(
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    var customer: Customer,
) : BaseEntity()
```

# FK Index Liquibase Examples

## Many-to-one FK index

```yaml
databaseChangeLog:
  - changeSet:
      id: 020-orders-customer-fk-index
      author: agent
      changes:
        - createIndex:
            tableName: orders
            indexName: idx_orders_customer_id
            columns:
              - column:
                  name: customer_id
        - addForeignKeyConstraint:
            baseTableName: orders
            baseColumnNames: customer_id
            referencedTableName: customer
            referencedColumnNames: id
            constraintName: fk_orders_customer
      rollback:
        - dropForeignKeyConstraint:
            baseTableName: orders
            constraintName: fk_orders_customer
        - dropIndex:
            tableName: orders
            indexName: idx_orders_customer_id
```

## Many-to-many join table

```kotlin
@ManyToMany(fetch = FetchType.LAZY)
@JoinTable(
    name = "app_user_role",
    joinColumns = [JoinColumn(name = "user_id", nullable = false)],
    inverseJoinColumns = [JoinColumn(name = "role_id", nullable = false)],
    uniqueConstraints = [UniqueConstraint(columnNames = ["user_id", "role_id"])],
    indexes = [
        Index(name = "idx_app_user_role_role_user", columnList = "role_id, user_id"),
    ],
)
private val _roles: MutableSet<Role> = linkedSetOf()
```

```yaml
databaseChangeLog:
  - changeSet:
      id: 021-create-app-user-role
      author: agent
      changes:
        - createTable:
            tableName: app_user_role
            columns:
              - column: { name: user_id, type: bigint, constraints: { nullable: false } }
              - column: { name: role_id, type: bigint, constraints: { nullable: false } }
        - addUniqueConstraint:
            tableName: app_user_role
            columnNames: user_id, role_id
            constraintName: uk_app_user_role_user_role
        - createIndex:
            tableName: app_user_role
            indexName: idx_app_user_role_role_user
            columns:
              - column: { name: role_id }
              - column: { name: user_id }
        - addForeignKeyConstraint:
            baseTableName: app_user_role
            baseColumnNames: user_id
            referencedTableName: app_user
            referencedColumnNames: id
            constraintName: fk_app_user_role_user
        - addForeignKeyConstraint:
            baseTableName: app_user_role
            baseColumnNames: role_id
            referencedTableName: role
            referencedColumnNames: id
            constraintName: fk_app_user_role_role
      rollback:
        - dropTable:
            tableName: app_user_role
```

The unique pair constraint or index usually covers lookups by `user_id` first. Add the reverse `(role_id, user_id)` index only when reverse lookups/deletes are expected.

## Composite FK

```kotlin
@Entity
@Table(
    name = "invoice_line",
    indexes = [Index(name = "idx_invoice_line_invoice", columnList = "tenant_id, invoice_number")],
)
class InvoiceLine(
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumns(
        JoinColumn(name = "tenant_id", referencedColumnName = "tenant_id", nullable = false),
        JoinColumn(name = "invoice_number", referencedColumnName = "invoice_number", nullable = false),
    )
    var invoice: Invoice,
)
```

```yaml
- createIndex:
    tableName: invoice_line
    indexName: idx_invoice_line_invoice
    columns:
      - column: { name: tenant_id }
      - column: { name: invoice_number }
```
