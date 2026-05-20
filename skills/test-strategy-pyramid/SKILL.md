---
name: test-strategy-pyramid
description: "Choose the right test levels. Use for planning feature tests, CI gates, bug fixes, and production-readiness review."
license: MIT
---

# Test Strategy Pyramid

Use to avoid overusing slow tests.

## Default Order

1. Unit tests for logic.
2. Integration/slice tests for Spring, DB, security, serialization.
3. Contract/API tests for service or frontend/backend boundaries.
4. E2E tests for critical user flows.
5. Manual exploratory/security tests for risk areas.

## Rules

- Test behavior at the lowest reliable level.
- Add integration tests when framework/DB behavior matters.
- Add contract tests when clients depend on stable API shape.
- Add E2E tests only for high-value flows.
- Keep CI gates fast enough to run consistently.

## Output

```md
Feature/risk:
Unit tests:
Integration tests:
Contract tests:
E2E/manual:
CI gate:
Gaps:
```
