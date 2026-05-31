---
name: jpa-optimistic-locking
description: "Use JPA optimistic locking with @Version. Apply to concurrent updates, REST conflicts, admin edits, and aggregate mutations."
license: MIT
---

# JPA Optimistic Locking

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/version-field-example.md` — version field and API/conflict examples.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

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
