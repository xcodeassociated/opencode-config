---
name: liquibase-migrations
description: "Create safe Liquibase migrations for Spring services. Use for schema changes, backfills, indexes, constraints, views, and deployment planning."
license: MIT
---

# Liquibase Migrations

Use before DB schema changes.

## Rules

- Every schema change is a changelog.
- Prefer expand/migrate/contract for zero-downtime changes.
- Review lock time, table size, indexes, and backfills.
- Use preconditions for risky assumptions.
- Rollback sections are useful but not a substitute for backups.
- Coordinate entity changes with migration order.
- For JPA relationship foreign keys, load `jpa-foreign-key-indexes`; add explicit `createIndex` changes unless an existing index covers the relationship direction.
- For regular database views, load `jpa-hibernate-views`. For materialized-view semi-read models, load `jpa-materialized-view-read-models`; use database-specific SQL, explicit rollback, base-table indexes, materialized-view indexes, and a refresh/backfill plan. For writable denormalized read tables, outbox tables, or read-model backfills, load `spring-data-jpa-read-write-models` and `read-model-outbox-propagation`.
- Ask `@analyst` to profile existing data before risky changes.

## Safe Pattern

1. Expand: add nullable column/table/index concurrently when supported.
2. Migrate: backfill in bounded batches if large.
3. Deploy code using new shape.
4. Contract: drop old column/constraint after verification.

## Checklist

- Existing data compatible.
- Constraint validation considered.
- Index creation strategy reviewed, including relationship FK indexes.
- View dependencies, materialized-view refresh/backfill, and underlying table indexes reviewed when views are changed.
- Backfill bounded.
- Rollback/backup documented.
- Tests updated.

## Output

```md
Change:
Changelog path:
Data impact:
Lock/backfill risk:
Preconditions:
Rollback/backup:
Indexes/views/materialized refresh:
Tests:
```
