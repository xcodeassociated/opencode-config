---
name: read-model-outbox-propagation
description: "Design safe read-model synchronization across transactions, databases, brokers, and services. Use for outbox, Kafka/event propagation, synchronous gRPC/REST read-model writes, idempotent projectors, retries, dead letters, eventual consistency, and repair paths."
license: MIT
---

# Read Model Outbox Propagation

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/outbox-examples.md` — outbox table, event relay/projector, Kafka-style handler, and tests.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

Use when a source-of-truth transactional model must update a read model outside the same local database transaction: another database, document/search store, broker, or separate service.

Do not use this for a same-database regular/materialized view. Use the JPA view/materialized-view skills instead.

## Load Related Skills

- Architecture escalation and KISS ladder: `spring-data-jpa-read-write-models`.
- Transaction/proxy/rollback behavior: `spring-transaction-propagation`.
- Event/broker design: `event-driven-architecture`.
- gRPC/REST trade-off: `grpc-vs-rest`.
- Schema/index/backfill: `liquibase-migrations`, `jpa-foreign-key-indexes`.
- Runtime checks: `observability`, `ci-cd-pipeline`, `backup-restore-strategy`.

If a related skill is unavailable in your role, return a handoff recommendation.

## Clarification Gate

Block design/implementation until these are explicit:

- Source of truth and command invariants.
- Target read model: same DB table, external store, or separate service.
- Consistency model: same transaction, synchronous confirmation, or eventual consistency.
- Maximum accepted staleness and user-visible stale-read behavior.
- Failure policy for read-model insert/update/publish failure.
- Retry, dead-letter, replay, rebuild, and manual repair plan.
- Idempotency key/event ID and ordering requirements.
- Observability owner: lag, failure count, DLT/dead-letter, projector health.

## Consistency Options

### Same local transaction

Use only when the read model is in the same database/transaction manager. The command can require fresh read-after-write behavior. Test rollback so no partial derived row remains.

### Transactional outbox + projector

Preferred for cross-store or service propagation when eventual consistency is acceptable. The source transaction writes domain state and an outbox record atomically. A relay/projector publishes or applies the event later with retries and idempotency.

Rules:

- Outbox record is committed with source-of-truth state.
- Projector is idempotent and can safely replay.
- Ordering is explicit per aggregate/key when required.
- Failed projection goes to retry and then dead-letter/repair, not silent loss.
- Commands must not depend on the eventually consistent read model.

### Synchronous gRPC/REST propagation

Use only when the command must wait for read-model service confirmation and the availability cost is acceptable.

Rules:

- This is not one ACID transaction unless a real distributed transaction is implemented and approved.
- Define timeout, retry, rollback/compensation, and command response when the remote write fails.
- Do not hold long DB transactions around slow remote calls unless explicitly justified.
- If failures cannot safely block the command, use outbox instead.

### Direct dual write

Avoid by default. It can leave the source and read model divergent. Use only with explicit approval and a documented repair policy.

## Outbox Design Rules

- Use stable event IDs and aggregate IDs.
- Store type, payload, schema version, creation time, attempt count, next-at time, status, error, and optional trace/correlation IDs.
- Keep payloads sufficient for projection or use a documented lookup strategy.
- Make consumers/projectors idempotent with event IDs, version checks, or upsert semantics.
- Avoid unbounded retries; define retry schedule and terminal dead-letter state.
- Provide replay/rebuild from source tables or from retained events.
- Monitor lag and failures; alert on sustained lag, dead letters, or projector downtime.

## Failure Policy Matrix

```md
Failure: source transaction fails
Expected: no outbox event and no read-model update

Failure: outbox relay cannot publish/apply
Expected: source state remains committed; event remains pending/retryable; alert/lag increases

Failure: projector write fails
Expected: retry with idempotency; eventually dead-letter with repair path

Failure: duplicate event
Expected: no duplicate read-model effect

Failure: out-of-order event
Expected: version/order guard or documented tolerance
```

## Tester Checklist

- Source transaction and outbox insert are atomic.
- No event is emitted for rolled-back commands.
- Projector is idempotent under duplicate delivery.
- Retry/DLT/dead-letter behavior is tested.
- Projection lag and failure metrics exist.
- Rebuild/replay path is documented and tested at least at integration level.
- User-facing stale-read behavior is explicit.

## Handoff Output

```md
Propagation mode:
Source of truth:
Target read model:
Consistency/staleness:
Failure policy:
Outbox/event schema:
Idempotency/order strategy:
Retry/dead-letter/replay plan:
Observability/runbook:
Tests:
Residual risks / # VERIFY:
```
