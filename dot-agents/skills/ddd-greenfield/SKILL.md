---
name: ddd-greenfield
description: "Apply DDD only when domain complexity justifies it: bounded contexts, aggregates, invariants, and ubiquitous language. Use for greenfield or complex domains."
license: MIT
---

# DDD Greenfield

Use for complex domains, not simple CRUD/admin tools.

## Rules

- Start with ubiquitous language.
- Identify bounded contexts before entities.
- Aggregates protect invariants; do not model every relation as an aggregate.
- Keep aggregates small.
- Domain events only when they decouple real business processes.
- Avoid speculative CQRS/event sourcing.

## Discovery Checklist

- Actors and workflows.
- Commands and decisions.
- Entities/value objects.
- Invariants and consistency boundaries.
- Lifecycle/state transitions.
- External systems.
- Reporting/read-model needs.

## Output

```md
Ubiquitous language:
Bounded contexts:
Aggregates:
Value objects:
Invariants:
Domain events:
Repositories/services:
Out of scope:
Risks:
```
