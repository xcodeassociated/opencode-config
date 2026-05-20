---
name: vitest-vite
description: "Use Vitest for Vite/React tests. Apply for unit/component tests, mocks, jsdom/happy-dom choice, and CI commands."
license: MIT
---

# Vitest with Vite

Use for frontend tests.

## Rules

- Use Bun commands.
- Test behavior, not implementation details.
- Prefer React Testing Library for components.
- Use MSW only when HTTP mocking is needed.
- Choose `jsdom` for browser-like APIs; `happy-dom` for faster simpler tests when sufficient.
- Keep tests deterministic.

## Commands

```bash
bunx --bun vitest run
bunx --bun vitest
bunx --bun vitest --coverage
```

## Component Test Checklist

- Render state.
- User interactions.
- Validation/errors.
- Loading/empty states.
- Accessibility-relevant labels/roles.

## Output

```md
Tests added:
Environment:
Mocks:
Command:
Result:
```
