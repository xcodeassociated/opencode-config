# R2DBC Flexible Search Reference

Use when implementing optional filters with Spring Data R2DBC.

## DTOs

```kotlin
data class ItemSearchRequest(
    val text: String? = null,
    val status: ItemStatus? = null,
    val createdFrom: Instant? = null,
    val createdTo: Instant? = null,
    val page: Int = 0,
    val size: Int = 20,
    val sort: String = "created_at",
    val direction: Sort.Direction = Sort.Direction.DESC,
)
```

## Sort Allowlist

```kotlin
private val sortColumns = mapOf(
    "createdAt" to "created_at",
    "name" to "name",
    "status" to "status",
)

private fun sort(req: ItemSearchRequest): Sort {
    val column = sortColumns[req.sort] ?: error("Unsupported sort: ${req.sort}")
    return Sort.by(req.direction, column)
}
```

## Criteria Query

```kotlin
fun criteria(req: ItemSearchRequest): Criteria {
    var c = Criteria.empty()

    req.text?.takeIf { it.isNotBlank() }?.let {
        c = c.and("name").like("%${it.lowercase()}%")
    }
    req.status?.let {
        c = c.and("status").`is`(it.name)
    }
    req.createdFrom?.let {
        c = c.and("created_at").greaterThanOrEquals(it)
    }
    req.createdTo?.let {
        c = c.and("created_at").lessThan(it)
    }

    return c
}
```

Template usage:

```kotlin
suspend fun search(req: ItemSearchRequest): PageResponse<ItemDto> {
    val size = req.size.coerceIn(1, 100)
    val offset = req.page.toLong() * size
    val query = Query.query(criteria(req))
        .sort(sort(req))
        .limit(size)
        .offset(offset)

    val rows = template.select(query, ItemEntity::class.java)
        .map(ItemDto::from)
        .asFlow()
        .toList()

    val total = template.count(Query.query(criteria(req)), ItemEntity::class.java).awaitSingle()

    return PageResponse(rows, req.page, size, total, ceil(total.toDouble() / size).toInt())
}
```

## Custom SQL Alternative

Use custom SQL when Criteria cannot express the query clearly or when SQL/index tuning matters.
Always bind parameters; never concatenate user input into SQL.

## Tests

- Empty filter returns paged data.
- Each filter works alone.
- Combined filters use AND semantics.
- Unsupported sort is rejected.
- Count query matches data query.
- Size is capped.
