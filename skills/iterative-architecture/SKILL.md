---
name: iterative-architecture
description: "Design architecture in small validated slices. Use when architecture is uncertain, greenfield, or high-risk."
license: MIT
---

# Iterative Architecture

Use to avoid over-design.

## Rules

- Define the smallest architecture decision that unblocks the next implementation slice.
- Validate with code/tests when possible.
- Defer irreversible choices until enough facts exist.
- Document trade-offs, not theory.
- Revisit decisions after evidence changes.

## Slice Plan

```md
Decision needed:
Current facts:
Smallest viable design:
Validation step:
Deferred decisions:
Risk if wrong:
```

## When to Escalate

- Cross-team contracts.
- Persistence style changes.
- Security model changes.
- Deployment topology changes.
- Event-driven or distributed consistency decisions.
