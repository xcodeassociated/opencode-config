---
name: playwright-ui-testing
description: "Use Playwright for meaningful UI/E2E verification. Prefer role/label selectors and reserve E2E for critical user flows."
license: MIT
---

# Playwright UI Testing

Use for browser-visible behavior and critical flows.

## Rules

- Prefer role, label, placeholder, and text selectors. Use `data-testid` when semantics are insufficient.
- Keep tests independent.
- Test user behavior, not implementation details.
- Use traces/screenshots for failures.
- Do not create E2E tests for every small UI change.
- Use Bun/Bunx commands.

## Commands

```bash
bunx --bun playwright test
bunx --bun playwright test --ui
bunx --bun playwright codegen <url>
```

## Good E2E Targets

- Auth/login flows.
- Critical CRUD workflow.
- Permissions/role behavior.
- Payment/order-like irreversible flows.
- Regression-prone flows.

## Output

```md
Flow:
Selectors:
Assertions:
Command:
Artifacts:
Result:
```
