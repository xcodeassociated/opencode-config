---
name: spring-persistence-selection
description: "Choose JPA, R2DBC, or JDBC for Spring services. Use before creating persistence code or changing database access style."
license: MIT
---

# Spring Persistence Selection

Use before choosing persistence style.

## Default

Use Spring MVC + JPA for normal CRUD/domain services.

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
- Choosing R2DBC for fashion.
- Rewriting persistence style without measurable benefit.

## Output

```md
Choice:
Why:
Rejected alternatives:
Transaction model:
Repository style:
Test strategy:
```
