---
name: r2dbc-base-entity
description: "Create Spring Data R2DBC/Kotlin entities. Use for reactive persistence models, IDs, versions, audit fields, and table mapping."
license: MIT
---

# R2DBC Base Entity

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/r2dbc-entity-example.md` — Kotlin Spring Data R2DBC entity shape.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

Use before writing R2DBC entities.

## Rules

- R2DBC entities are not JPA entities. Do not use JPA annotations.
- Use Spring Data annotations: `@Table`, `@Id`, `@Version`.
- Prefer immutable IDs where possible.
- Include audit fields only when configured and needed.
- Keep mapping explicit when column names differ.
- Do not use lazy-loading assumptions.
- Data classes are acceptable for R2DBC because there are no JPA proxy constraints.
- Verify generated IDs and version behavior with integration tests.

## Output

State table, ID strategy, versioning, audit fields, and tests.
