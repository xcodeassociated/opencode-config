---
name: mongo-read-only
description: "Run safe MongoDB read-only analysis. Use for profiling collections, indexes, data quality, query behavior, and schema assumptions."
license: MIT
---

# Mongo Read-Only

## Reference Files

Not auto-loaded; read explicitly only when needed, as `<root>/<skill-name>/references/<file>` from the same root that served this `SKILL.md`: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Do not mix copies.
- `references/mongo-safe-patterns.md` — safe Mongo read-only startup and query examples.

Use before MongoDB analysis.

## Hard Rules

- No writes: no insert, update, delete, drop, createIndex, rename, aggregate `$out`, or `$merge`.
- Use read-only credentials.
- Use projection, `limit`, and `maxTimeMS`.
- Prefer samples for large collections.
- Use `explain` for query plans.
- Do not dump sensitive data.

## Output

```md
Collection:
Query:
Limit/sample:
Findings:
Risks:
```
