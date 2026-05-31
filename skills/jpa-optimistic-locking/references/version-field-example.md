# JPA Optimistic Locking Example

```kotlin
@Version
@Column(nullable = false)
var version: Long? = null
```

API behavior:

- client reads entity with version or ETag;
- client submits update with expected version;
- server rejects stale version with `409 Conflict`.
