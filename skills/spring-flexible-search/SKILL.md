---
name: spring-flexible-search
description: "Build Spring search/filter/list endpoints with pagination. Use for optional filters, sorting, pageable APIs, JPA specs, or R2DBC criteria."
license: MIT
---

# Spring Flexible Search

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/jpa.md` — JPA search/filter examples.
- `references/r2dbc.md` — R2DBC search/filter examples.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

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

## Output

```md
Endpoint:
Filters:
Sort allowlist:
Query style:
Indexes:
Tests:
```
