---
name: jpa-foreign-key-indexes
description: "Ensure JPA/Hibernate relationship foreign keys have matching database indexes. Use for @ManyToOne, @OneToOne, @OneToMany join columns, @ManyToMany join tables, Liquibase migrations, and slow joins."
license: MIT
---

# JPA Foreign Key Indexes

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/liquibase-examples.md` — Kotlin relationship-index annotations and Liquibase index/FK examples.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

Use whenever a JPA relationship, join table, or migration creates or changes a foreign key.

## Goal

Do not assume every database creates indexes for foreign keys. Make FK index review explicit in both entity annotations and the migration. Liquibase is the production source of truth.

## Rules

- For every relationship FK, add or verify an index on the referencing/child table columns.
- Keep JPA annotations (`@Table(indexes = ...)`, `@JoinTable(indexes = ...)`) aligned with Liquibase `createIndex` changes.
- Check whether an existing composite index already covers the needed leading columns before adding another index.
- Index order matters. Put the columns used by joins/filtering in the useful order for the query shape.
- For join tables, add a unique constraint/index on the pair and a reverse-direction index when both directions are queried or FK checks need it.
- For composite FKs, index the full referencing column set in the same order used by the FK/query.
- For large existing tables, review deployment locking and use the migration strategy in `liquibase-migrations`.
- Do not rely on Hibernate generated DDL for production. Entity indexes are documentation/test-schema hints; migrations must create the production indexes.

## Review Checklist

- Relationship type and owning table identified.
- FK columns named explicitly.
- Liquibase has the FK and matching index.
- JPA annotation reflects the index when practical.
- Existing indexes checked to avoid duplication.
- Query direction and composite index order checked.
- Migration locking/backfill risk checked for large tables.
- Tests or schema inspection verify the index exists.

## Output

```md
Relationship:
Referencing table/columns:
Referenced table/columns:
Existing index coverage:
New/verified index:
JPA annotation updated:
Liquibase migration updated:
Large-table migration risk:
Tests/schema verification:
```
