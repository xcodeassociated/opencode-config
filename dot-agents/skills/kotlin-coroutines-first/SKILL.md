---
name: kotlin-coroutines-first
description: "Use Kotlin coroutines for asynchronous Kotlin code when appropriate. Avoid mixing reactive types unless the stack requires it."
license: MIT
---

# Kotlin Coroutines First

Use for Kotlin async code.

## Rules

- Prefer `suspend` functions over exposing Reactor types in application/domain layers.
- Use `Flow` for streams.
- Do not force WebFlux/R2DBC when MVC/JPA is simpler.
- Keep blocking calls off event-loop/reactive threads.
- Use structured concurrency.
- Avoid `GlobalScope`.
- Use explicit dispatchers for blocking IO when needed.

## Spring Guidance

- MVC + JPA: normal blocking code is acceptable.
- WebFlux + R2DBC: coroutines can wrap reactive persistence cleanly.
- Do not mix JPA blocking repositories into reactive request paths.

## Output

State chosen execution model, blocking boundaries, and tests.
