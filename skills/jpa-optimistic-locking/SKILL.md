---
name: jpa-optimistic-locking
description: "Use JPA optimistic locking with @Version. Apply to concurrent updates, REST conflicts, admin edits, and aggregate mutations."
license: MIT
---

# JPA Optimistic Locking

Use when concurrent updates can conflict.

## Rules

- Add `@Version` to aggregate roots that are edited concurrently.
- Let JPA include version in updates.
- Map `OptimisticLockException` / `ObjectOptimisticLockingFailureException` to `409 Conflict`.
- Consider REST `ETag` / `If-Match` for external clients.
- Do not silently overwrite newer data.
- Add tests for stale update conflict.

## Kotlin Field

```kotlin
@Version
@Column(nullable = false)
var version: Long? = null
```

## API Behavior

- Client reads entity with version or ETag.
- Client submits update with expected version.
- Server rejects stale version with 409.

## Output

```md
Entity:
Version field:
Conflict handling:
API contract:
Tests:
```
