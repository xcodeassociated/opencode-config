---
name: nvm-node
description: "Use Node/NVM only when project tooling requires Node compatibility. Bun remains default for JS package management and scripts."
license: MIT
---

# NVM Node

Use only when Node version compatibility matters.

## Rules

- Bun remains default for package management and project scripts.
- Use Node/NVM when a tool explicitly requires Node or CI/runtime compatibility must be checked.
- Respect existing `.nvmrc`.
- Do not introduce `.nvmrc` unless the project needs a stable Node runtime.
- Keep Node version aligned with Vite/React/tooling support.

## Commands

```bash
node --version
nvm install
nvm use
```

## Output

State Node version, reason it is needed, and whether Bun remains the runner.
