---
name: spring-data-jpa-read-write-models
description: "Design normalized Spring Data JPA write models and denormalized read models only when justified. Use for CQRS-like read/write splits, materialized-view semi-read models, same-DB read tables/views, document/search read stores, KISS gate, consistency, migrations, and tests."
license: MIT
---

# Spring Data JPA Read/Write Models

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/same-db-writable-table.md` — same-DB writable read-table model, Liquibase, services, and tests.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

Use when a Spring Data JPA system may need a normalized source-of-truth write model plus a separate denormalized read model.

This is an architecture escalation, not a default. Keep KISS first: one normalized JPA model, focused queries, DTO projections, fetch joins/entity graphs, indexes, and regular SQL views should be tried or rejected with evidence before introducing writable denormalized data.

The normalized write model remains the source of truth unless the human explicitly approves another system-of-record decision.

## Load Related Skills

- Query/read optimization first: `jpa-n-plus-one-fetching`, `jpa-repository-patterns`, `jpa-hibernate-views`.
- Relationship/index/migration design: `jpa-foreign-key-indexes`, `liquibase-migrations`.
- Materialized-view semi-read model: `jpa-materialized-view-read-models`.
- Transaction semantics and rollback tests: `spring-transaction-propagation`.
- External store/service propagation: `read-model-outbox-propagation`.
- Existing data/schema evidence: ask `@analyst` for schema/data profiling.
- Integration protocol/event choice: ask `@architect` to compare event broker, gRPC, and REST.

If a related skill is unavailable in your role, return a handoff recommendation instead of duplicating its guidance.

## Clarification Gate

Before designing or implementing a split, clarify:

- Which reads are too slow, complex, or unstable with the current model?
- Why projections, fetch plans, indexes, or a regular view are insufficient?
- Target shape: regular view, materialized view, same-DB writable table, external store, or separate service?
- Consistency requirement: same local transaction, synchronous confirmation, or eventual consistency?
- Maximum accepted staleness, including materialized-view refresh lag.
- Failure policy when refresh/read-model update/propagation fails.
- Rebuild/backfill/repair path and owner.
- Index/latency targets and ownership of mismatch incidents.

Return a blocking clarification request when source of truth, consistency, target store, or failure policy is unclear.

## Decision Ladder

Choose the lowest-complexity option that satisfies the requirement.

### 0. No split

Use for most new applications and ordinary CRUD/domain services.

Use Spring Data JPA queries, DTO projections, `JOIN FETCH`, `@EntityGraph`, targeted indexes, and regular SQL views. Reject a split when there is no measured or clearly described read bottleneck, the app is early-stage, or synchronization semantics are not understood.

### 1. Regular SQL view / read-only entity

Use when the query is reusable or conceptually important but recomputing it on every read is acceptable. Map the view as read-only and keep base-table indexes aligned with the view query.

### 2. Materialized-view semi-read model

Use after query/projection/regular-view optimization when the read is expensive, denormalized, reused, and bounded stale data is acceptable.

Rules: source tables remain truth, the materialized view is read-only derived data, refresh lag is eventual consistency, refresh schedule/failure policy/monitoring must be defined, and both base-table and materialized-view indexes must be reviewed.

### 3. Same app, same DB, writable read table

Use when a materialized view is not enough: strong consistency is needed, incremental update logic is required, or scheduled refresh is too expensive/stale.

Rules: update write and read tables in one service transaction when strong consistency is required; migrations must include table, indexes, constraints, and backfill; expose read-table write APIs only to internal projector/writer code; test rollback and rebuild behavior.

### 4. Same app, different read store

Use only for a concrete feature: full-text search, faceting, document-shaped reads, store-specific analytics, read isolation, or scale. Treat this as cross-store synchronization. Prefer outbox propagation over direct dual writes.

### 5. Separate read-model service

Use only for real service/team/deployment/scaling boundaries. Prefer durable asynchronous propagation when eventual consistency is acceptable. For synchronous gRPC/REST propagation, the command must not report success until the read-model response and source transaction outcome are handled by an explicit failure policy. Never make command invariants depend on an eventually consistent read model.

## Same-DB Writable Read Table Rules

- Keep write aggregate logic in the normalized model.
- Treat the read table as derived data; design rebuild/backfill from source tables.
- Co-locate write-model and read-model updates in one `@Transactional` service method when fresh read-after-write behavior is required.
- Use explicit indexes for read filters/sorts and foreign-key columns.
- Keep read repositories read-only for application callers; create an internal writer/projector API separately.
- Test rollback: if the write transaction fails, the read model must not persist partial derived data.

## External Read Store / Service Rules

- Do not directly dual-write the source DB and external store unless the failure/rollback policy is explicitly approved.
- Prefer transactional outbox + idempotent projector for eventual consistency.
- Define retry, DLT/dead-letter, replay, lag metrics, repair tooling, and mismatch alerts.
- Tell the user explicitly that asynchronous synchronization introduces eventual consistency and data mismatch risk.
- For synchronous propagation, define timeout, retry, compensation, and what command result is returned when the read-model update fails.

## Review Checklist

```md
Decision: no split / regular view / materialized view / writable table / external store / separate service
Reason simple options are insufficient:
Source of truth:
Consistency model:
Failure policy:
Refresh/propagation mechanism:
Indexes and migration/backfill plan:
Rebuild/repair plan:
Tests required:
Operational owner and alerts:
Residual risks / # VERIFY:
```
