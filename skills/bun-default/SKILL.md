---
name: bun-default
description: "Use Bun/Bunx for JS and TS tasks. Block npm, npx, pnpm, and yarn drift in project workflows."
license: MIT
---

# Bun Default

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/bun-commands.md` — Bun command/package-script examples.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

Use Bun for JavaScript/TypeScript package, script, and CLI work.

## Rules

- Install with `bun install`.
- Run scripts with `bun run <script>`.
- Execute packages with `bunx <package>`.
- Add dependencies with `bun add <pkg>` / `bun add -d <pkg>`.
- Run tests with `bun test` or the project script via `bun run test`.
- Do not use `npm`, `npx`, `pnpm`, or `yarn` for project work unless no Bun-compatible path exists; then stop and report the blocker.
- Translate docs mentally: `npm install x` -> `bun add x`, `npm install -D x` -> `bun add -d x`, `npx x` / `pnpm dlx x` -> `bunx x`.

