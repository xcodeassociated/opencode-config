---
name: jpa-base-entity
description: "Create Kotlin JPA entities with stable identity, audit fields, and optimistic versioning. Use before new or refactored @Entity classes."
license: MIT
---

# JPA Base Entity

## Reference Files

Read supporting files only when needed, resolving paths relative to this SKILL.md directory.
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
