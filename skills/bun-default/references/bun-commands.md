# Bun Command Examples

## Common commands

```bash
bun install
bun run dev
bun run build
bun run test
bun run lint
bunx playwright test
bunx --bun shadcn@latest init
bunx --bun shadcn@latest add button
bunx --bun shadcn@latest docs button
```

## Bun-compatible package scripts

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
