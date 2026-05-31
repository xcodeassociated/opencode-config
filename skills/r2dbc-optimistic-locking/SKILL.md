---
name: r2dbc-optimistic-locking
description: "Use Spring Data R2DBC optimistic locking. @Version works for entity save/update/delete paths; custom SQL must check versions manually."
license: MIT
---

# R2DBC Optimistic Locking

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/r2dbc-version-examples.md` — entity and custom SQL optimistic-locking examples.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

Use when concurrent updates can conflict in R2DBC services.

## Correct Rule

Spring Data R2DBC supports optimistic locking with `@Version` on aggregate roots for normal entity save/update/delete paths. Custom SQL, bulk updates, and raw `DatabaseClient` updates must include manual version checks.

## API Behavior

- Reject stale updates with `409 Conflict`.
- Include version in DTO or use ETag/If-Match.
- For custom SQL, check affected row count. If zero, return conflict.
- Add integration tests for conflicting updates.

## Output

```md
Path type: repository/template/custom SQL
Version field:
Conflict handling:
Tests:
```
