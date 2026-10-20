---
name: frontend-linting
description: "Configure and run TypeScript/React/Vite linting and formatting. Use for frontend setup, refactors, CI checks, or UI code review."
license: MIT
---

# Frontend Linting

Use for Vite/React/TypeScript quality gates.

## Rules

- Prefer project's existing lint config.
- Use Bun commands.
- Do not introduce formatting churn unrelated to the task.
- Typecheck separately from lint when possible.
- For flat ESLint config with TypeScript, ensure compatible `typescript-eslint` packages.

## Common Commands

```bash
bun run lint
bun run typecheck
bun run build
bunx --bun eslint .
bunx --bun tsc --noEmit
```

## Checks

- React hooks rules.
- Type-aware TS rules where configured.
- No unused exports/imports unless project allows.
- Accessibility lint where available.
- CI command matches local command.

## Output

```md
Commands run:
Failures:
Fixes applied:
Remaining warnings:
```
