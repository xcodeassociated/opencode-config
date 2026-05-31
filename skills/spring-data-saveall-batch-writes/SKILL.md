---
name: spring-data-saveall-batch-writes
description: "Prefer Spring Data saveAll for multi-entity writes across SQL and non-SQL repositories. Use for save(...) loops, imports, upserts, batch writes, and bulk persistence."
license: MIT
---

# Spring Data saveAll Batch Writes

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/saveall-examples.md` — Kotlin saveAll, chunking, JPA batching, and R2DBC caveat examples.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

Use when persisting, updating, importing, or syncing more than one entity/document/aggregate through a Spring Data repository.

## Default

Prefer collection-level repository writes such as `saveAll(...)` over calling `save(...)` repeatedly in a loop.

## Rules

- If code calls `repository.save(entity)` inside a loop, map, `forEach`, or stream for multiple items, prefer collecting/chunking and calling `repository.saveAll(items)`.
- Apply this default to Spring Data SQL and non-SQL repositories when the repository exposes `saveAll(...)` and the module has a real collection-level implementation or documented benefit.
- For Spring Data R2DBC, treat repository `saveAll(...)` as a special case. It exists, but the default repository implementation is not a true SQL batch/multi-row write. Load `r2dbc-batch-operations` for high-volume R2DBC write implementation guidance.
- Keep multi-entity writes in an application/service method with a clear transaction boundary when the store supports transactions. For Spring `@Transactional` propagation or proxy/self-invocation concerns, load `spring-transaction-propagation`.
- Use the returned saved instances from `saveAll(...)`; generated IDs, versions, auditing fields, or store-specific state may be updated.
- Validate empty input and avoid unnecessary repository calls.
- Chunk large inputs. Do not build an unbounded list for imports, backfills, or sync jobs.
- For JPA, enable and verify JDBC batching when high write throughput matters.
- For managed JPA entities already loaded inside a transaction, mutate them and rely on dirty checking; do not call `save(...)` or `saveAll(...)` just to flush changes.
- For set-based SQL updates/deletes, prefer `@Modifying @Query`, JDBC, or a bulk API when entity lifecycle callbacks and per-entity validation are not required.
- For non-SQL stores, prefer `saveAll(...)` first, but use module-native bulk APIs only when volume/performance is measured and repository semantics are insufficient.
- Preserve domain invariants. Do not bypass aggregate methods, validation, optimistic locking, audit rules, or events just to batch faster.

## R2DBC Special Case

Spring Data R2DBC repositories expose `ReactiveCrudRepository.saveAll(...)`, but the default repository implementation processes each item through `save(...)` with `concatMap`. Do not assume it performs a database-level batch insert/update or a single multi-row SQL statement.

Use this rule:

- Small bounded R2DBC writes: repository `saveAll(Publisher<T>)` is acceptable for repository semantics and reactive API clarity.
- Measured high-volume R2DBC writes: load `r2dbc-batch-operations` and implement a custom batch method there.
- Do not duplicate R2DBC SQL/Statement batching details in this general Spring Data skill.
- Do not claim R2DBC repository `saveAll(...)` is faster than a `save(...)` loop unless benchmarked in the target project.

## When Not To Use saveAll

- The caller updates managed JPA entities inside a transaction and dirty checking is sufficient.
- A set-based bulk SQL update/delete is semantically correct and avoids loading rows.
- A native bulk API is required for measured throughput and its different semantics are acceptable.
- Spring Data R2DBC needs a real database-level batch/multi-row write; use `r2dbc-batch-operations` instead of relying on repository `saveAll(...)`.
- Each item must be persisted independently with separate transaction/retry/failure behavior.
- Input size is unbounded and must be streamed/chunked first.

## Tests

- Add or update service/repository tests for empty input, one item, multiple items, validation failures, optimistic locking, and rollback behavior.
- For JPA batch work, verify SQL/batching behavior with logs, Hibernate statistics, or integration tests.
- For R2DBC batch work, verify the number of SQL statements, row counts, transaction behavior, backpressure, and failure handling with integration tests.
- For non-SQL stores, verify partial failure and duplicate/upsert behavior according to the store/module semantics.

## Output

```md
Write use case:
Repository/store:
Input size:
Method: saveAll / chunked saveAll / bulk API / dirty checking / R2DBC custom batch
Chunk size:
Transaction boundary:
Batch/store settings:
R2DBC batch skill loaded: yes/no/not applicable
Returned-instance handling:
Tests:
Risks:
```
