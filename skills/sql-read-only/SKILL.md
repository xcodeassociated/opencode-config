---
name: sql-read-only
description: "Run safe SQL read-only analysis. Use for PostgreSQL/relational profiling, schema inspection, migration impact, and data validation."
license: MIT
---

# SQL Read-Only

Use before SQL analysis.

## Hard Rules

- No writes: INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, CREATE.
- Use read-only credentials when available.
- Prefer read-only transaction.
- Set statement timeout.
- Always LIMIT exploratory queries.
- Do not dump sensitive data.
- `EXPLAIN ANALYZE` only on non-production or with approval.

## Safe Start

```sql
BEGIN READ ONLY;
SET LOCAL statement_timeout = '5s';
SELECT current_database(), current_user;
```

## Useful Sources

- `information_schema`
- `pg_catalog`
- `pg_stat_user_tables`
- `pg_stat_user_indexes`

## Output

```md
Query purpose:
Query:
Limit/timeout:
Finding:
Risk:
```
