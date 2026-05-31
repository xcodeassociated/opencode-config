---
name: sql-read-only
description: "Run safe SQL read-only analysis. Use for PostgreSQL/relational profiling, schema inspection, migration impact, and data validation."
license: MIT
---

# SQL Read-Only

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/safe-sql-patterns.md` — safe SQL connection and query examples.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

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
