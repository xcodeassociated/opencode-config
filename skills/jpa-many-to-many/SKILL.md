---
name: jpa-many-to-many
description: "Model many-to-many relationships in JPA. Use to decide direct @ManyToMany versus explicit join entity with lifecycle and metadata."
license: MIT
---

# JPA Many-to-Many

Use before adding many-to-many mappings.

## Rule

Prefer an explicit join entity unless the relationship is simple, stable, and has no metadata.

## Direct `@ManyToMany` Is Acceptable When

- Pure association table.
- No audit fields, status, ordering, permissions, or extra columns.
- No independent lifecycle.
- No business behavior on the association.

## Use Join Entity When

- Association has metadata.
- You need audit/history.
- You need permissions/status/order.
- Deletes must be controlled.
- You need queries over the association.

## Safety

- Do not cascade remove across many-to-many.
- Use `Set` by default.
- Test add/remove behavior.
- Ensure unique constraint on pair columns.

## Output

```md
Choice:
Reason:
Join table/entity:
Cascade:
Constraints:
Tests:
```
