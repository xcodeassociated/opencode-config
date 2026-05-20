---
name: jpa-cascade-orphan-removal
description: "Choose JPA cascade and orphanRemoval safely. Use for one-to-many/one-to-one relationships, deletes, and aggregate ownership."
license: MIT
---

# JPA Cascade and Orphan Removal

Use before changing entity relationships or deletes.

## Rules

- Cascade only across true aggregate ownership.
- Do not use `CascadeType.REMOVE` across shared references.
- Use `orphanRemoval = true` only when removing from collection should delete the child row.
- Keep both sides of bidirectional relationships synchronized.
- Confirm DB foreign keys match JPA behavior.
- Add integration tests for delete/orphan behavior.

## Defaults

- Parent owns child lifecycle: `cascade = [PERSIST, MERGE]`; add `orphanRemoval = true` only if child cannot exist independently.
- Shared child/reference: no remove cascade.
- Many-to-many: avoid remove cascade.

## Output

```md
Relationship:
Ownership:
Cascade choice:
Orphan removal:
DB FK behavior:
Tests:
Risks:
```
