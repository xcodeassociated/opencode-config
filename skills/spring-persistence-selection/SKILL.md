---
name: spring-persistence-selection
description: "Choose JPA, R2DBC, or JDBC for Spring services. Use before creating persistence code, read/write models, or changing database access style."
license: MIT
---

# Spring Persistence Selection

Use before choosing persistence style.

## Default

Use Spring MVC + JPA for normal CRUD/domain services. Keep one normalized JPA model by default; use query/projection/regular view first, then consider `jpa-materialized-view-read-models` as a same-DB semi-read-model step before proposing separate denormalized read tables, external read stores, or read-model services. Load `spring-data-jpa-read-write-models` before proposing those larger splits.

## Choose JPA When

- Blocking MVC stack.
- Rich domain model and transactions.
- Relationships and aggregate persistence matter.
- Team wants simpler operations and mature tooling.

## Choose R2DBC When

- Reactive/WebFlux service end-to-end.
- Non-blocking IO is a real requirement.
- Database driver supports required features.
- You accept fewer ORM conveniences.

## Choose JDBC When

- SQL-first service.
- Simple mapping.
- No ORM relationship management needed.
- Blocking stack is fine.

## Avoid

- Mixing MVC + R2DBC or WebFlux + JPA without a strong reason.
- Choosing a persistence style without an explicit transaction model; load `spring-transaction-propagation` for imperative Spring/JPA transaction boundaries.
- Choosing R2DBC for fashion.
- Splitting write and read models at application start without an explicit user request or justified read/scale/ownership requirement.
- Rewriting persistence style without measurable benefit.

## Related JPA Skills

- For relationship FK indexes and migration parity, load `jpa-foreign-key-indexes`.
- For view-backed read models and advanced reusable queries, load `jpa-hibernate-views`; prefer regular read-only views with base-table indexes, then load `jpa-materialized-view-read-models` when a same-DB cached semi-read model is justified and stale data is acceptable.
- For normalized write models plus writable denormalized read tables/stores/services, load `spring-data-jpa-read-write-models`; for cross-store or cross-service propagation, load `read-model-outbox-propagation`.

## Output

```md
Choice:
Why:
Rejected alternatives:
Transaction model:
Repository style:
Test strategy:
```
