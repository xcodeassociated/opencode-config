# JPA Flexible Search Reference

Use when implementing optional filters with Spring Data JPA.

## DTOs

```kotlin
data class ItemSearchRequest(
    val text: String? = null,
    val status: ItemStatus? = null,
    val createdFrom: Instant? = null,
    val createdTo: Instant? = null,
    val page: Int = 0,
    val size: Int = 20,
    val sort: String = "createdAt",
    val direction: Sort.Direction = Sort.Direction.DESC,
)

data class PageResponse<T>(
    val content: List<T>,
    val page: Int,
    val size: Int,
    val totalElements: Long,
    val totalPages: Int,
)
```

## Sort Allowlist

```kotlin
private val sortFields = mapOf(
    "createdAt" to "createdAt",
    "name" to "name",
    "status" to "status",
)

fun pageable(req: ItemSearchRequest): Pageable {
    val property = sortFields[req.sort] ?: error("Unsupported sort: ${req.sort}")
    return PageRequest.of(req.page, req.size.coerceIn(1, 100), Sort.by(req.direction, property))
}
```

## Specification Pattern

```kotlin
fun searchSpec(req: ItemSearchRequest): Specification<ItemEntity> = Specification { root, _, cb ->
    val predicates = mutableListOf<Predicate>()

    req.text?.takeIf { it.isNotBlank() }?.let {
        predicates += cb.like(cb.lower(root.get("name")), "%${it.lowercase()}%")
    }
    req.status?.let {
        predicates += cb.equal(root.get<ItemStatus>("status"), it)
    }
    req.createdFrom?.let {
        predicates += cb.greaterThanOrEqualTo(root.get("createdAt"), it)
    }
    req.createdTo?.let {
        predicates += cb.lessThan(root.get("createdAt"), it)
    }

    cb.and(*predicates.toTypedArray())
}
```

Repository:

```kotlin
interface ItemRepository : JpaRepository<ItemEntity, UUID>, JpaSpecificationExecutor<ItemEntity>
```

Service:

```kotlin
@Transactional(readOnly = true)
fun search(req: ItemSearchRequest): PageResponse<ItemDto> {
    val page = itemRepository.findAll(searchSpec(req), pageable(req))
    return PageResponse(
        content = page.content.map(ItemDto::from),
        page = page.number,
        size = page.size,
        totalElements = page.totalElements,
        totalPages = page.totalPages,
    )
}
```

## Tests

- Empty filter returns paged data.
- Each filter works alone.
- Combined filters use AND semantics.
- Unsupported sort is rejected.
- Size is capped.
- Large text filter has index/performance review.
