---
name: jpa-base-entity
description: "Create Kotlin JPA entities with stable identity, audit fields, and optimistic versioning. Use before new or refactored @Entity classes."
license: MIT
---

# JPA Base Entity

## Reference Files

Not auto-loaded; read explicitly only when needed, as `<root>/<skill-name>/references/<file>` from the same root that served this `SKILL.md`: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Do not mix copies.
- `references/base-entity-example.md` — Kotlin JPA base entity pattern.

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
