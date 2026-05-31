---
name: jpa-hibernate-views
description: "Map database views and Hibernate @Subselect read models safely. Use for advanced read queries, reusable SQL views, @Immutable entities, read-only repositories, base-table indexing, Liquibase view migrations, and avoiding unsafe materialized-view assumptions."
license: MIT
---

# JPA / Hibernate Views

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/regular-view-examples.md` — regular database view, @Subselect, @Immutable mapping, repository, and tests.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

Use when an advanced relational read query should be represented as a reusable read-only model without introducing writable denormalized data.

Prefer regular database views or Hibernate `@Subselect` for reusable read models before materialized views, writable read tables, external read stores, or separate services.

## Load Related Skills

- N+1/fetch-plan alternatives: `jpa-n-plus-one-fetching`.
- Relationship FK/base-table indexes: `jpa-foreign-key-indexes`.
- View migrations and rollback: `liquibase-migrations`.
- Materialized-view semi-read models: `jpa-materialized-view-read-models`.
- Writable/external read-model escalation: `spring-data-jpa-read-write-models`.

If a related skill is unavailable in your role, return a handoff recommendation.

## When to Use

Use a regular view or `@Subselect` when:

- The read query is complex but should remain derived from normalized source tables.
- A stable read shape is reused by API/reporting code.
- The read model should be read-only.
- Query recomputation at read time is acceptable with proper base-table indexes.

Do not use as a hidden write model. If derived rows must be stored, refreshed, repaired, or externally propagated, escalate to the materialized/read-write model skills.

## Regular View vs `@Subselect`

### Regular database view

Prefer when the schema/migration layer should own the SQL and DBAs/ops may inspect it. Manage with Liquibase and map it through `@Table(name = "...")` plus `@Immutable`.

### Hibernate `@Subselect`

Use when the read model is Hibernate-specific, local to the application, and does not need a database schema object. Add `@Synchronize` for source tables so Hibernate understands query synchronization boundaries.

## Rules

- Mark mapped entities `@Immutable`.
- Use a stable, unique `@Id` from source data; do not invent random or row-number IDs for persistent mapping.
- Expose read-only repository APIs; avoid inherited `save/delete` methods at the application boundary.
- Index the underlying source tables for view joins, filters, and sorts. A regular view itself usually does not have independent storage/indexes.
- Keep DTO projections as an option when a full entity mapping is unnecessary.
- Do not use views for command invariants that require current locked state unless transaction/isolation behavior is explicitly reviewed.
- Include tests that prove the mapping is read-only and query shape is correct.

## Review Checklist

```md
View type: regular DB view / @Subselect
Source tables:
Read query shape:
Stable ID:
Base-table indexes:
Read-only repository API:
Migration/rollback:
Tests:
Escalation needed: materialized view / writable read model / external store
Risks / # VERIFY:
```
