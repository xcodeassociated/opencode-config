---
name: jpa-set-collections
description: "Use safe collection types for JPA relationships. Prefer Set for unordered associations and use ordered lists only with explicit reason."
license: MIT
---

# JPA Set Collections

Use before mapping JPA collections.

## Default

Use `MutableSet` for unordered relationships.

## Why

- Avoid duplicate association rows.
- Better semantic fit for most relationships.
- Reduces accidental ordering assumptions.

## Use List Only When

- Order is a business requirement.
- You define `@OrderColumn` or `@OrderBy` intentionally.
- Tests cover ordering behavior.

## Rules

- Initialize collections in entity.
- Provide helper methods for bidirectional relationships.
- Avoid replacing managed collections wholesale.
- Do not expose mutable collections through API DTOs.

## Output

State collection type, ordering requirement, and helper methods.
