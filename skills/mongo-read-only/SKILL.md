---
name: mongo-read-only
description: "Run safe MongoDB read-only analysis. Use for profiling collections, indexes, data quality, query behavior, and schema assumptions."
license: MIT
---

# Mongo Read-Only

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/mongo-safe-patterns.md` — safe Mongo read-only startup and query examples.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

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
