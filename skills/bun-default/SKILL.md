---
name: bun-default
description: "Use Bun/Bunx for JS and TS tasks. Block npm, npx, pnpm, and yarn drift in project workflows."
license: MIT
---

# Bun Default

## Rule

Use Bun for all JavaScript/TypeScript package, script, and CLI work.

- Install: `bun install`
- Run scripts: `bun run <script>`
- Execute packages: `bunx <package>`
- Add deps: `bun add <pkg>` / `bun add -d <pkg>`
- Tests: `bun test` or project script via `bun run test`

Do not use `npm`, `npx`, `pnpm`, or `yarn` for project work.

## Common Commands

```bash
bun install
bun run dev
bun run build
bun run test
bun run lint
bunx playwright test
bunx shadcn@latest init
bunx shadcn@latest add button
bunx shadcn@latest docs button
```

## package.json

Prefer Bun-compatible scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint ."
  }
}
```

## Translate Non-Bun Docs

- `npm install x` -> `bun add x`
- `npm install -D x` -> `bun add -d x`
- `npx x` -> `bunx x`
- `pnpm dlx x` -> `bunx x`

If no Bun-compatible path exists, stop and report the blocker instead of using another package manager.
