---
name: jpa-repository-patterns
description: "Design Spring Data JPA repositories and queries. Use for derived queries, @Query, specifications, pagination, joins, and performance-sensitive reads."
license: MIT
---

# JPA Repository Patterns

Use before adding or changing JPA repositories.

## Rules

- Derived queries are fine for simple predicates.
- Use explicit `@Query`, Specification, QueryDSL, or custom repository for complex filtering, joins, pagination, or performance-sensitive paths.
- Always page large list endpoints.
- Avoid N+1: use fetch joins, entity graphs, projections, or batch settings deliberately.
- Do not expose entities directly from controllers.
- Keep write operations in services with transaction boundaries.

## Query Choice

- Simple equality/existence: derived query.
- Dynamic filters: Specification/Criteria or explicit nullable-parameter query.
- Read model/projection: interface/class projection or DTO query.
- Complex reporting: custom repository or SQL view/read model.

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
Transaction boundary:
Tests:
```
