---
name: jpa-optimistic-locking
description: "Use JPA optimistic locking with @Version. Use for concurrent updates, REST conflicts, admin edits, and aggregate mutations."
license: MIT
---

# JPA Optimistic Locking

## Reference Files

Not auto-loaded; read explicitly only when needed, as `<root>/<skill-name>/references/<file>` from the same root that served this `SKILL.md`: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Do not mix copies.
- `references/version-field-example.md` — version field and API/conflict examples.

Use when concurrent updates can conflict.

## Rules

- Add `@Version` to aggregate roots that are edited concurrently.
- Let JPA include the version in updates; do not manually overwrite newer data.
- Map `OptimisticLockException` / `ObjectOptimisticLockingFailureException` to `409 Conflict` for API updates.
- Consider REST `ETag` / `If-Match` for external clients.
- Add tests for stale update conflicts.
- If optimistic retries/conflicts are not acceptable for a short high-contention critical section, consider pessimistic locking guidance instead.

## Review Checklist

```md
Entity:
Version field:
Conflict handling:
API contract:
Tests:
Risks / # VERIFY:
```
