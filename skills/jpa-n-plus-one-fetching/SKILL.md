---
name: jpa-n-plus-one-fetching
description: "Prevent Spring Data JPA/Hibernate N+1 queries. Use for repository read methods, JPQL FETCH JOIN, @EntityGraph, projections, fetch plans, and relationship-heavy list/detail endpoints."
license: MIT
---

# JPA N+1 Fetching

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/fetch-plan-examples.md` — JPQL FETCH JOIN, EntityGraph, projection, pagination-safe fetch, and query-count tests.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

Use before adding or changing Spring Data JPA read paths that return entities with relationships or access associations after a repository call.

## Goal

Avoid loading root rows and then triggering one additional SQL query per row or per association. Choose an explicit fetch plan for the use case.

## Rules

- Prefer `LAZY` associations by default. Do not fix N+1 by changing relationships to global `EAGER` fetching.
- Prefer explicit JPQL `JOIN FETCH` for bounded, use-case-specific entity reads.
- Use `@EntityGraph` as the main alternative for simple derived or declared repository queries.
- Use DTO/projection queries when the caller only needs read data and not managed entities.
- For reusable advanced read models or schema-owned reporting queries, load `jpa-hibernate-views`; still index the base tables because a regular view is not a cache. If the regular view remains too expensive and stale data is acceptable, load `jpa-materialized-view-read-models` before introducing writable denormalized tables.
- Use Hibernate batch fetching (`@BatchSize` or `hibernate.default_batch_fetch_size`) only as a deliberate mitigation when fetch join/entity graph/projection is not the right shape.
- A plain `JOIN` does not fetch the association. Use `JOIN FETCH` when the association must be initialized.
- Avoid fetching multiple to-many collections in parallel in one query; it can create a Cartesian product.
- Do not use collection fetch joins directly with pageable list queries. Page IDs first, then fetch details by IDs, or use DTO/projection queries.
- Verify SQL/query count in tests or logs for performance-sensitive paths.
- On Hibernate 6+/7, do not add JPQL `distinct` only to remove duplicate root entities from collection fetch joins; older providers/projects may still need project-specific handling.

## Strategy Selection

- Specific detail read with known associations: JPQL `JOIN FETCH`.
- Simple finder that needs associations: `@EntityGraph`.
- API list/search/reporting data only: DTO/projection query or read model.
- Pageable collection read: page IDs, then fetch graph by IDs; preserve page order in service code.
- Repeated lazy access over already-loaded roots: batch fetching as mitigation.

## Verification

For important paths, add an integration test or log-based assertion that checks the expected query shape. Avoid magic query-count thresholds unless they match the intended fetch plan.

## Output

```md
Read use case:
Associations needed:
Fetch strategy: JPQL FETCH JOIN / EntityGraph / projection / batch fetch
Pagination strategy:
Expected SQL/query count:
Verification:
Risks:
```
