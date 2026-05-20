---
name: spring-flexible-search
description: "Build Spring search/filter/list endpoints with pagination. Use for optional filters, sorting, pageable APIs, JPA specs, or R2DBC criteria."
license: MIT
---

# Spring Flexible Search

Use for list endpoints with optional filters, pagination, and sorting.

## Rules

- Always page potentially large results.
- Validate sort fields against an allowlist.
- Do not expose entity internals directly.
- Avoid broad unindexed `LIKE` searches on large tables without index strategy.
- The `(:param IS NULL OR column = :param)` pattern is simple but can hurt index usage; use only when acceptable.
- Use Criteria/Specification/custom query for many filters or complex logic.

## JPA Choices

- Simple filters: explicit `@Query` or derived methods.
- Dynamic filters: Specification/Criteria/QueryDSL.
- Read DTOs: projections or DTO queries.

## R2DBC Choices

- Use `R2dbcEntityTemplate` criteria or custom SQL.
- Keep count query explicit for pagination.

## References

For implementation examples, read only the matching file when needed:

- `references/jpa.md`
- `references/r2dbc.md`

## Output

```md
Endpoint:
Filters:
Sort allowlist:
Query style:
Indexes:
Tests:
```
