---
name: design-patterns
description: "Apply design patterns only when they reduce real complexity. Use during refactors or design choices, not as decoration."
license: MIT
---

# Design Patterns

Use patterns as tools, not goals.

## Rules

- Name the problem before naming the pattern.
- Prefer simple functions/classes first.
- Do not add factories, strategies, abstractions, or events without current need.
- Remove pattern use when it no longer pays for itself.
- Keep tests around behavior, not pattern structure.

## Useful Defaults

- Strategy: multiple interchangeable algorithms.
- Adapter: boundary to external system or framework.
- Factory: complex construction or invariant enforcement.
- Template method: stable workflow with limited variation.
- Observer/domain event: decoupled side effects.

## Output

```md
Problem:
Pattern chosen:
Why simpler code is insufficient:
Alternatives rejected:
Test impact:
```
