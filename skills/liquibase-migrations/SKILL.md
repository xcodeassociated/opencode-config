---
name: liquibase-migrations
description: "Create safe Liquibase migrations for Spring services. Use for schema changes, backfills, indexes, constraints, and deployment planning."
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
- Ask `@analyst` to profile existing data before risky changes.

## Safe Pattern

1. Expand: add nullable column/table/index concurrently when supported.
2. Migrate: backfill in bounded batches if large.
3. Deploy code using new shape.
4. Contract: drop old column/constraint after verification.

## Checklist

- Existing data compatible.
- Constraint validation considered.
- Index creation strategy reviewed.
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
Tests:
```
