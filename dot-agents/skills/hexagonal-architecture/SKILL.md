---
name: hexagonal-architecture
description: "Apply ports/adapters boundaries for Spring/Kotlin services. Use for architecture setup, refactors, integrations, and testable domain code."
license: MIT
---

# Hexagonal Architecture

Use when boundaries matter.

## Rules

- Domain model has no dependency on web, persistence, messaging, or framework adapters.
- Application services orchestrate use cases.
- Ports define inbound/outbound contracts.
- Adapters implement ports for REST, DB, messaging, external APIs.
- Keep package boundaries enforceable with tests where valuable.
- Do not retrofit hexagonal structure into trivial CRUD without benefit.

## Package Sketch

```text
domain/
application/
application/port/in
application/port/out
adapter/in/web
adapter/out/persistence
adapter/out/messaging
```

## Output

```md
Boundaries:
Ports:
Adapters:
Dependency direction:
Tests/ArchUnit:
Risks:
```
