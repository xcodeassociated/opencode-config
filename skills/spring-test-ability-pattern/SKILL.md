---
name: spring-test-ability-pattern
description: "Design Spring/Kotlin code for testability. Use for services, controllers, repositories, fixtures, integration tests, and refactors."
license: MIT
---

# Spring Testability Pattern

Use while designing or refactoring Spring code.

## Rules

- Keep business logic out of controllers.
- Inject dependencies through constructors.
- Avoid static/global state.
- Keep time, UUID, current user, and external calls behind injectable providers.
- Use small focused services/use cases.
- Make transactions explicit at service/application layer.
- Tests should be readable and stable.

## Test Levels

- Unit: pure domain/application logic.
- Slice: MVC/WebFlux/repository where useful.
- Integration: DB, transactions, migrations, security, serialization.
- Contract: API boundary.
- E2E: only critical flows.

## Fixtures

- Use builders/factories when setup repeats.
- Do not force heavy builders for trivial tests.
- Keep test data valid by default.

## Spring Tips

- Prefer `@SpringBootTest` only when full context is needed.
- Use Testcontainers for DB integration when realistic behavior matters.
- Use `@MockBean`/test doubles sparingly and deliberately.

## Output

```md
Test level:
Seams/providers:
Fixtures:
Integration needs:
Commands:
```
