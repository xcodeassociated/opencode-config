---
name: r2dbc-optimistic-locking
description: "Use Spring Data R2DBC optimistic locking: @Version covers entity save/update/delete paths; custom SQL must check versions manually."
license: MIT
---

# R2DBC Optimistic Locking

## Reference Files

Read supporting files only when needed, resolving paths relative to this SKILL.md directory.
- `references/r2dbc-version-examples.md` — entity and custom SQL optimistic-locking examples.

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
