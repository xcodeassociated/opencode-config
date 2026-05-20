---
name: r2dbc-batch-operations
description: "Implement R2DBC batch operations only for measured batch needs. Use for bulk inserts/updates, imports, backfills, and high-volume writes."
license: MIT
---

# R2DBC Batch Operations

Use when normal repository writes are not enough for measured batch workload.

## Rules

- Do not assume `saveAll()` is wrong. Use custom batching only when volume/performance requires it.
- Batch size must be explicit.
- Keep transactions bounded.
- Handle backpressure.
- Avoid unbounded `collectList()` on large streams.
- Prefer idempotent imports/backfills.
- Record timing and failure behavior.

## Options

- Repository `saveAll`: simple and acceptable for small batches.
- `DatabaseClient` with batched SQL: use for high-volume inserts/updates.
- Driver-native copy/bulk APIs: use only with clear need and tests.

## Checklist

- Input size known or bounded.
- Chunk size configured.
- Transaction boundary chosen.
- Retry/idempotency strategy exists.
- Error reporting includes failed row/item.
- Integration test covers batch behavior.

## Output

```md
Use case:
Batch method:
Chunk size:
Transaction:
Backpressure:
Failure handling:
Bench/test result:
```
