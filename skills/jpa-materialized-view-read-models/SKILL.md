---
name: jpa-materialized-view-read-models
description: "Use database materialized views as a denormalized semi-read model before writable read tables or external read stores. Covers JPA/Hibernate read-only mapping, refresh consistency, indexes, Liquibase SQL, cron/scheduler refresh, tests, and operations."
license: MIT
---

# JPA Materialized-View Read Models

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/postgres-materialized-view.md` — PostgreSQL materialized-view migration, indexes, refresh, entity mapping, scheduler, and tests.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

Use when query/projection/fetch optimization and regular SQL views are not enough, but a writable read table, external store, or separate read-model service would be excessive.

A materialized view is a same-database, denormalized, read-only derived model. It can improve expensive read paths by storing query results, but refresh creates staleness. Treat it as eventual consistency.

Do not start a greenfield app with materialized views unless the user explicitly asks or the requirement clearly justifies them.

## Load Related Skills

- Query/fetch/read optimization before escalation: `jpa-n-plus-one-fetching`, `jpa-repository-patterns`, `jpa-hibernate-views`.
- Base-table FK/index review: `jpa-foreign-key-indexes`.
- Liquibase/database-specific SQL: `liquibase-migrations`.
- Transaction/consistency implications: `spring-transaction-propagation`.
- If materialized view is not enough and a writable/external read model is proposed: `spring-data-jpa-read-write-models`.

If a related skill is unavailable in your role, return a handoff recommendation.

## Clarification Gate

Clarify before design/implementation:

- Target database/dialect and native materialized/indexed-view support.
- Read query, filters, sorts, aggregations, and required freshness.
- Accepted staleness window and whether read-after-write freshness is required.
- Refresh mechanism: DB refresh command, DB job, app scheduler, external scheduler, or manual/backfill process.
- Refresh frequency, overlap/concurrency rules, and multi-instance scheduler ownership.
- Failure policy: keep stale data, block reads, alert, retry, manual repair, or rebuild.
- Required base-table indexes and materialized-view indexes.
- Whether the view has a stable unique identifier for JPA mapping.

If freshness/failure policy is unclear, block implementation and return clarification requests.

## When to Use

Use a materialized view when:

- The read shape is denormalized, aggregated, expensive, or frequently reused.
- A regular view is correct but too slow because the query is recomputed on each read.
- Bounded stale data is acceptable.
- Refresh cost is predictable and schedulable.
- The same database should remain the operational boundary.

Do not use when:

- Commands require fresh read-after-write data.
- Refresh failures cannot be tolerated or repaired.
- The target DB lacks suitable support and an emulated read table would be clearer.
- Query/index optimization or a regular view has not been considered.

## Portability

Materialized views are database-specific. JPA does not define them. Hibernate only maps the resulting relation/query as a read-only entity.

General patterns:

- Native materialized view: use database-specific Liquibase SQL and refresh commands.
- Indexed/materialized-view variant: follow the database's special constraints.
- No native support: keep a regular view, or intentionally model an application-managed read table and treat it as a read/write split.

## Design Rules

- Source tables remain the source of truth.
- Materialized-view rows are derived and read-only.
- Refresh lag is eventual consistency; expose/document it where users may observe stale data.
- Add base-table indexes for the refresh query joins/filters.
- Add materialized-view indexes for actual read filters/sorts.
- Use a stable unique key for JPA `@Id`; do not use row number/random IDs.
- Map the entity with `@Immutable` and expose a read-only repository API.
- Refresh should have timeout, no-overlap guard, metrics, last-success timestamp, lag alert, and manual repair path.
- Large refreshes need deployment/runtime review: locks, IO, CPU, connection use, and impact on writers/readers.

## Implementation Shape

1. Define the read query and prove ordinary optimization is insufficient.
2. Add/verify base-table indexes.
3. Add materialized view creation SQL through Liquibase or the project's migration tool.
4. Add materialized-view indexes.
5. Map a read-only JPA entity and read-only repository.
6. Implement refresh trigger/schedule with explicit failure policy.
7. Test stale-until-refresh behavior and read-only semantics.
8. Add operational visibility: refresh duration, last success, lag, failure count, and runbook.

## Tester Checklist

- Query/projection/regular-view alternatives were considered.
- Materialized view is read-only and has a stable ID.
- Base-table indexes support refresh; materialized-view indexes support reads.
- Refresh schedule and failure policy are documented.
- Tests prove data is stale until refresh and updated after refresh.
- Concurrent/overlapping refresh risk is handled.
- Staleness is not used for command invariants.

## Handoff Output

```md
Materialized view decision:
Source tables:
Read query shape:
Accepted staleness:
Refresh mechanism/schedule:
Failure policy:
Indexes: base tables / materialized view
JPA mapping:
Migration/backfill/rollback:
Tests:
Operations/alerts:
Risks / # VERIFY:
```
