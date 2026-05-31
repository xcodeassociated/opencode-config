---
name: r2dbc-batch-operations
description: "Implement R2DBC batch operations only for measured batch needs. Use for bulk inserts/updates, imports, backfills, high-volume writes, and saveAll-style R2DBC batching."
license: MIT
---

# R2DBC Batch Operations

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/custom-batch-examples.md` — custom repository-fragment examples for high-volume R2DBC writes.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

Use when normal repository writes are not enough for a measured R2DBC batch workload.

## Rules

- Do not assume repository `saveAll(...)` is wrong. Use it for small bounded writes where repository semantics are more important than raw throughput.
- Do not assume repository `saveAll(...)` is a real SQL batch. In Spring Data R2DBC, the default repository implementation delegates item-by-item to `save(...)`.
- Use custom batching only when volume/performance requires it or when the batch shape is part of the requirement.
- Batch size must be explicit.
- Keep transactions bounded. Prefer one transaction per chunk unless the use case explicitly needs all-or-nothing across the whole stream.
- Handle backpressure.
- Avoid unbounded `collectList()` on large streams.
- Prefer idempotent imports/backfills.
- Record timing and failure behavior.
- Preserve SQL-injection safety. Use bind parameters; do not concatenate user-provided values into SQL.

## Repository saveAll Caveat

Spring Data R2DBC exposes `ReactiveCrudRepository.saveAll(...)`, but the default `SimpleR2dbcRepository` implementation processes both `Iterable` and `Publisher` inputs with `concatMap(this::save)`.

That means repository `saveAll(...)` is a semantic convenience and reactive API fit, not a guaranteed database-level batch insert/update. When `spring-data-saveall-batch-writes` routes an R2DBC workload here, implement a separate custom repository fragment such as `insertAllBatch(...)` or `saveAllBatch(...)` instead of duplicating R2DBC-specific details in the general skill.

## Options

- Repository `saveAll`: simple and acceptable for small bounded batches.
- Multi-row SQL through `DatabaseClient`: useful for inserts when the driver/database supports the generated SQL shape.
- R2DBC SPI `Statement.add()`: useful for prepared statement batching when supported by the driver and verified with integration tests.
- Driver-native copy/bulk APIs: use only with clear need, explicit fallback, and tests.
- Set-based SQL update/delete: prefer when one statement can express the change and entity callbacks are not required.

## Implementation Notes

- Prefer a custom repository fragment over overriding inherited `saveAll(...)`.
- Name methods so callers understand different semantics, for example `insertAllBatch(...)` or `saveAllBatch(...)`.
- Keep bind markers database/driver compatible. Named parameters are expanded by Spring's `DatabaseClient`; native placeholders differ by driver.
- Respect database parameter limits. Reduce `chunkSize` when generated SQL creates too many bind parameters.
- Use nullable-safe binding (`bindNull`) for nullable columns.
- Keep generated SQL deterministic and covered by integration tests.
- For upserts, make conflict/merge semantics explicit and store-specific.
- For updates, prefer set-based SQL when possible; otherwise use prepared statement batching or chunked multi-row patterns verified against the selected driver.
- Do not silently drop repository semantics such as auditing, callbacks, optimistic locking, domain events, or generated IDs. Document what the custom batch path preserves or bypasses.

## Checklist

- Input size known or bounded.
- Chunk size configured.
- Transaction boundary chosen.
- Retry/idempotency strategy exists.
- Error reporting includes failed row/item or failed chunk.
- Generated IDs, versions, callbacks, and auditing behavior are documented.
- SQL statement count and row count are verified.
- Integration test covers batch behavior against the actual R2DBC driver.

## Output

```md
Use case:
Batch method: repository saveAll / multi-row SQL / Statement.add / driver bulk API / set-based SQL
Chunk size:
Transaction:
Backpressure:
Generated state handling:
Repository semantics preserved/bypassed:
Failure handling:
Bench/test result:
```
