---
name: jpa-base-entity
description: "Create Kotlin JPA entities with stable identity, audit fields, and optimistic versioning. Use before new or refactored @Entity classes."
license: MIT
---

# JPA Base Entity

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/base-entity-example.md` — Kotlin JPA base entity pattern.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

Use before writing Kotlin JPA entities.

## Rules

- Do not use Kotlin `data class` for JPA entities.
- Use `open` classes/properties where required by the JPA/Hibernate/Kotlin plugin setup.
- Avoid equality based on nullable database ID.
- Prefer immutable application UUID for equality when a shared base entity is used.
- Include `@Version` for optimistic locking when concurrent updates matter.
- Prefer `Instant` for audit timestamps.
- Keep entity constructors compatible with JPA.
- For identifier strategy, sequence allocation, assigned IDs, UUIDs, and insert batching, load the relevant identifier/batching guidance if available in the project skill set.

## Output

State identity strategy, audit fields, versioning, and any deviation.
