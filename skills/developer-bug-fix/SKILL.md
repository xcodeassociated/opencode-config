---
name: developer-bug-fix
description: "Fix bugs with reproduction-first workflow. Use for reported defects, regressions, flaky behavior, or failing tests."
license: MIT
---

# Developer Bug Fix

Never invent expected behavior or root cause. Reproduce, inspect evidence, or ask/route clarification before fixing.

Use for bug work.

Do not edit the fix until expected behavior, reproduction, and affected scope are clear. If direct, ask `Blocking` questions; if delegated, return them to the immediate invoker.

## Rules

- Reproduce first. If reproduction is missing, ask `@tester` unless the failure is already exact.
- Add or update a regression test before the fix when practical.
- Fix root cause, not only the symptom.
- Keep change minimal.
- Re-run the failing test, then relevant surrounding tests.
- Send fix to `@tester` for non-trivial verification.

## Workflow

1. Read bug report and evidence.
2. Locate likely code path.
3. Write failing test or reproduce manually.
4. Implement smallest fix.
5. Run focused tests.
6. Run broader checks.
7. Handoff with evidence.

## Handoff

```md
Bug:
Root cause:
Fix:
Regression test:
Commands run:
Result:
Risk:
Tester notes:
```
