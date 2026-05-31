---
name: schema-analysis
description: "Analyze database schema and migration impact. Use for existing DBs, schema changes, indexes, constraints, and persistence design validation."
license: MIT
---

# Schema Analysis

Use before schema or persistence changes.

## Inspect

- Tables/collections and relationships, including source-of-truth tables, materialized views, read-model tables, outbox/inbox tables, and existing views when relevant.
- Primary/foreign/unique/check constraints.
- Indexes and usage, especially relationship FK indexes, regular-view input indexes, materialized-view indexes, read-model query indexes, and outbox polling indexes.
- Nullability and defaults.
- Migration history.
- Views, triggers, functions, materialized views, and whether view queries have supporting base-table indexes.
- Row counts and table sizes.

## Migration Risk

- Lock time.
- Backfill size for source tables, read-model tables, and outbox/inbox replay where relevant.
- Constraint validation.
- Index creation strategy.
- Rollback feasibility.
- Dependent code and queries.

## Rules

- Read-only only.
- Use limits/timeouts.
- Ask `@analyst` for existing data profile when needed.
- For regular views, load `jpa-hibernate-views`; for materialized-view semi-read models, load `jpa-materialized-view-read-models`; for normalized-write/denormalized-read designs, load `spring-data-jpa-read-write-models`; for cross-store/service propagation, load `read-model-outbox-propagation`.

## Output

```md
Schema facts:
Constraints/indexes:
Dependencies:
Migration risk:
Recommended approach:
Read-model/backfill risk:
Queries used:
```
