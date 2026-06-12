---
name: bun-default
description: "Use Bun/Bunx for all JS and TS tasks. Use to block npm, npx, pnpm, and yarn drift in project workflows."
license: MIT
---

# Bun Default

## Reference Files

Not auto-loaded; read explicitly only when needed, as `<root>/<skill-name>/references/<file>` from the same root that served this `SKILL.md`: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Do not mix copies.
- `references/bun-commands.md` — Bun command/package-script examples.

Use Bun for JavaScript/TypeScript package, script, and CLI work.

## Rules

- Install with `bun install`.
- Run scripts with `bun run <script>`.
- Execute packages with `bunx <package>`.
- Add dependencies with `bun add <pkg>` / `bun add -d <pkg>`.
- Run tests with `bun test` or the project script via `bun run test`.
- Do not use `npm`, `npx`, `pnpm`, or `yarn` for project work unless no Bun-compatible path exists; then stop and report the blocker.
- Translate docs mentally: `npm install x` -> `bun add x`, `npm install -D x` -> `bun add -d x`, `npx x` / `pnpm dlx x` -> `bunx x`.

