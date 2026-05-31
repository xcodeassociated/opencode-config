---
name: event-driven-architecture
description: "Design event-driven flows only when async decoupling is justified. Use for Kafka, outbox, integration events, retries, and DLTs."
license: MIT
---

# Event-Driven Architecture

Use only for real async, integration, or decoupling needs.

## Use When

- Producers and consumers should be decoupled.
- Work is eventually consistent.
- Events feed multiple consumers.
- External systems need reliable integration.
- Throughput or buffering matters.

## Avoid When

- A simple synchronous call is enough.
- Consistency must be immediate.
- There is only one local consumer and no scaling need.

## Required Decisions

- Event name and schema.
- Producer transaction boundary.
- Outbox/inbox strategy. For materialized-view read models, prefer `jpa-materialized-view-read-models` and a refresh schedule before events. For read-model propagation from a JPA write model to another store/service, load `read-model-outbox-propagation` and define consistency, idempotency, retry, and DLT behavior.
- Partition key.
- Idempotency key/storage.
- Retry and dead-letter policy.
- Ordering guarantees.
- Observability: correlation ID, metrics, tracing.

## Output

```md
Events:
Producer/consumer:
Consistency model:
Idempotency:
Retry/DLT:
Schema compatibility:
Tests:
Risks:
```
