---
name: jpa-repository-patterns
description: "Design Spring Data JPA repositories and queries. Use for derived queries, @Query, specifications, pagination, joins, and performance-sensitive reads."
license: MIT
---

# JPA Repository Patterns

Use before adding or changing JPA repositories.

## Rules

- For separate normalized write models and denormalized read models, load `spring-data-jpa-read-write-models`; keep the write model as source of truth and do not introduce a split by default. Before a writable read table/external store, consider `jpa-materialized-view-read-models` as the same-DB semi-read-model step when bounded staleness is acceptable.
- Derived queries are fine for simple predicates.
- Use explicit `@Query`, Specification, QueryDSL, or custom repository for complex filtering, joins, pagination, or performance-sensitive paths.
- Always page large list endpoints.
- Avoid N+1: load `jpa-n-plus-one-fetching`; use fetch joins, entity graphs, projections, or batch settings deliberately.
- For relationship columns, join tables, and schema/migration changes, load `jpa-foreign-key-indexes`; FK indexes must be represented in both JPA metadata and Liquibase unless an existing index covers them.
- For advanced read models, reporting queries, or reusable complex joins, load `jpa-hibernate-views`; prefer read-only regular views with base-table indexes, then `jpa-materialized-view-read-models` when the query must be cached and eventual consistency is acceptable.
- For multi-entity writes, load `spring-data-saveall-batch-writes`; prefer `saveAll(...)` or chunked `saveAll(...)` over `save(...)` loops.
- Do not expose entities directly from controllers.
- Keep write operations in services with transaction boundaries. For `@Transactional`, propagation, rollback rules, or proxy/self-invocation concerns, load `spring-transaction-propagation`.
- Do not hide persistence performance choices inside vague repository names; make fetch/write strategy explicit.

## Query Choice

- Simple equality/existence: derived query.
- Dynamic filters: Specification/Criteria or explicit nullable-parameter query.
- Read model/projection: interface/class projection or DTO query.
- Complex reporting: custom repository, DTO projection, or SQL view/read model; load `jpa-hibernate-views` when the query becomes a schema-owned view.

## Transactions

- Reads can be `@Transactional(readOnly = true)`.
- Writes belong in application/service layer.
- Avoid repository methods that hide business behavior.

## Output

```md
Repository method:
Query style:
Pagination:
Fetch strategy:
Relationship indexes:
View/read model:
Transaction boundary:
Tests:
```
