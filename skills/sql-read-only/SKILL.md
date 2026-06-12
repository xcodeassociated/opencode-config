---
name: sql-read-only
description: "Run safe SQL read-only analysis. Use for PostgreSQL/relational profiling, schema inspection, migration impact, and data validation."
license: MIT
---

# SQL Read-Only

## Reference Files

Not auto-loaded; read explicitly only when needed, as `<root>/<skill-name>/references/<file>` from the same root that served this `SKILL.md`: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Do not mix copies.
- `references/safe-sql-patterns.md` — safe SQL connection and query examples.

Use before SQL analysis.

## Hard Rules

- No writes: `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, `CREATE`.
- Use read-only credentials when available.
- Prefer a read-only transaction.
- Set statement timeout.
- Always limit exploratory queries.
- Do not dump sensitive data.
- Use `EXPLAIN ANALYZE` only on non-production or with approval.

Useful sources include `information_schema`, `pg_catalog`, `pg_stat_user_tables`, and `pg_stat_user_indexes`.

## Output

```md
Query purpose:
Query:
Limit/timeout:
Finding:
Risk:
```
