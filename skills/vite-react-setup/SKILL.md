---
name: vite-react-setup
description: "Set up React + Vite + TypeScript with Bun. Use for greenfield frontend, build config, routing, shadcn, testing, and env handling."
license: MIT
---

# Vite React Setup

Use for React/Vite project setup.

## Rules

- Use Bun commands.
- Use TypeScript by default.
- Use shadcn/ui for components when suitable.
- Keep env vars prefixed correctly for Vite.
- Do not hardcode backend URLs.
- Add test/build/lint/typecheck scripts.
- Verify current Vite/React/Tailwind/shadcn versions through `@researcher` for greenfield work.

## Commands

```bash
bun create vite <app> --template react-ts
cd <app>
bun install
bunx --bun shadcn@latest init
bun run dev
bun run build
```

## Project Checks

- `tsconfig` strict enough for project.
- Path aliases configured in Vite and TS.
- Routing chosen deliberately.
- API client centralizes base URL and errors.
- Vitest configured if tests needed.

## Output

```md
Project setup:
Commands:
Scripts:
Env vars:
Testing:
Risks:
```
