---
name: tdd-cycle
description: "Use test-first development for behavior changes. Red, green, refactor, then broader checks and handoff evidence."
license: MIT
---

# TDD Cycle

Never encode guessed behavior in tests. Ask or route clarification before writing tests that define expected behavior.

Do not start the red phase until expected behavior and acceptance criteria are clear enough that the test will not encode a guess. If delegated and unclear, return `Clarification Requests` to the immediate invoker.

Use for behavior-changing code.

## Rules

- Write or update a failing test first when practical.
- Implement the smallest code to pass.
- Refactor only after green.
- Run focused tests often.
- Run broader checks before handoff.
- Spikes are allowed, but production code needs tests before handoff.

## Cycle

```text
RED: failing test proves desired behavior or bug.
GREEN: minimal implementation passes.
REFACTOR: clean design without changing behavior.
VERIFY: run relevant suite and report commands.
```

## Test Choice

- Unit for pure logic.
- Integration for DB/security/serialization/transactions.
- Contract for API boundary.
- E2E only when user flow needs browser/runtime proof.

## Output

```md
Failing test:
Implementation:
Commands:
Result:
Remaining gaps:
```
