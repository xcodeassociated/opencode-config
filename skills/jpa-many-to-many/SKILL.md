---
name: jpa-many-to-many
description: "Model JPA/Hibernate many-to-many relationships safely. Use to enforce one association table, owning/inverse sides, mappedBy, JoinTable, Set collections, and direct @ManyToMany versus explicit join entity choice."
license: MIT
---

# JPA Many-to-Many

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/mapping-examples.md` — direct mapping, duplicate-table anti-pattern, and join-entity examples.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

Use before adding or changing JPA/Hibernate many-to-many mappings.

## Default Rule

Prefer an explicit join entity unless the relationship is simple, stable, and has no metadata.

For a direct bidirectional `@ManyToMany`, there must be exactly one association table:

- One owning side declares `@ManyToMany` plus `@JoinTable`.
- The other side declares `@ManyToMany(mappedBy = "<owningSideProperty>")`.
- Do not put `@JoinTable` on both sides.
- Do not leave both sides without `mappedBy`; that models two independent associations and Hibernate can generate two join tables.
- Keep both sides synchronized through helper methods.

## Direct `@ManyToMany` Is Acceptable When

- Pure association table with only the two foreign keys.
- No audit fields, status, ordering, permissions, validity dates, or extra columns.
- No independent lifecycle.
- No business behavior on the association.
- Relationship cardinality is bounded enough that collection loading remains safe.

## Prefer Join Entity When

- Association has metadata or needs future metadata.
- You need audit/history.
- You need permissions/status/order/validity dates.
- Deletes must be controlled.
- You need queries over the association.
- The join row has business meaning.

## Schema and Migration Checks

- Create only one association table for a direct relationship.
- Name it explicitly in Liquibase/Flyway and in `@JoinTable`.
- Add foreign keys to both parent tables.
- Add a unique constraint on `(owner_id, inverse_id)`.
- Load `jpa-foreign-key-indexes`; add/verify join-table indexes in both JPA annotations and the Liquibase migration.
- Usually the unique `(owner_id, inverse_id)` constraint covers owner-to-inverse traversal; add a reverse `(inverse_id, owner_id)` index when inverse-to-owner traversal or FK checks need it.
- Do not let Hibernate auto-generate production schema for this relationship without reviewing the produced DDL.

## Safety

- Load `jpa-set-collections` and use `MutableSet` by default.
- Load `jpa-foreign-key-indexes` before adding or changing join-table migrations.
- Load `jpa-cascade-orphan-removal` before adding cascade or delete behavior.
- Do not use `CascadeType.REMOVE` across direct many-to-many relationships.
- Avoid eager fetching; load `jpa-n-plus-one-fetching` for read paths over the relationship.
- Test add/remove behavior from the owning-side service method.
- Test that only the intended join table is present when schema generation or migrations are changed.

## Integration Test Hints

For direct mappings, add a repository/service integration test that persists both sides through the owning side, clears the persistence context, and verifies:

- the association is readable from both directions;
- removing the association deletes only the join row;
- neither parent row is deleted;
- the database has exactly the intended association table for this relationship.

Prefer inspecting the migration/DDL for table count. If using generated test schema, query database metadata or `information_schema` with the project dialect.

## Output

```md
Choice: direct @ManyToMany | join entity
Reason:
Owning side:
Inverse side:
Association table/entity:
MappedBy:
Cascade:
Constraints:
FK/index plan:
Fetch/read plan:
Tests:
```
