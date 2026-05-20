---
name: kiss-yagni
description: "Prefer the simplest sufficient solution. Use for all planning, architecture, implementation, and refactoring decisions."
license: MIT
---

# KISS / YAGNI

Use on every design and implementation decision.

## Rules

- Solve current requirements, not imagined future ones.
- Prefer readable direct code over abstractions.
- Add indirection only when it removes current duplication or risk.
- Avoid frameworks, patterns, events, queues, and microservices without measurable need.
- Keep APIs small.
- Keep tests focused on behavior.

## Complexity Gate

Before adding complexity, state:

```md
Requirement forcing this:
Simpler alternative:
Why simpler alternative fails:
Cost of complexity:
How it will be tested:
```

## Default Bias

- CRUD/domain service: MVC + JPA.
- Frontend state: local/component state before global stores.
- Sync call before async messaging.
- REST before gRPC.
- Compose before k8s for local dev.
