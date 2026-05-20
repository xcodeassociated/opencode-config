---
name: schema-analysis
description: "Analyze database schema and migration impact. Use for existing DBs, schema changes, indexes, constraints, and persistence design validation."
license: MIT
---

# Schema Analysis

Use before schema or persistence changes.

## Inspect

- Tables/collections and relationships.
- Primary/foreign/unique/check constraints.
- Indexes and usage.
- Nullability and defaults.
- Migration history.
- Views, triggers, functions, materialized views.
- Row counts and table sizes.

## Migration Risk

- Lock time.
- Backfill size.
- Constraint validation.
- Index creation strategy.
- Rollback feasibility.
- Dependent code and queries.

## Rules

- Read-only only.
- Use limits/timeouts.
- Ask `@analyst` for existing data profile when needed.

## Output

```md
Schema facts:
Constraints/indexes:
Dependencies:
Migration risk:
Recommended approach:
Queries used:
```
