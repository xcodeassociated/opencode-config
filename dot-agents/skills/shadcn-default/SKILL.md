---
name: shadcn-default
description: "Use shadcn/ui correctly with React/Vite and Bun. Use for components, registry/MCP lookup, accessibility, theming, and forms."
license: MIT
---

# shadcn Default

Use for shadcn/ui work.

## Rules

- Use current CLI: `bunx --bun shadcn@latest ...`.
- Do not use deprecated `shadcn-ui` commands.
- Components are copied into the project; treat them as owned source.
- Prefer accessible components and ARIA-correct composition.
- Check docs/MCP for component APIs when uncertain.
- Avoid styling forks unless the design requires it.

## Commands

```bash
bunx --bun shadcn@latest init
bunx --bun shadcn@latest add button dialog form
bunx --bun shadcn@latest docs button
bunx --bun shadcn@latest info
```

## Checks

- `components.json` exists and paths match project aliases.
- Tailwind/CSS variables configured.
- Components import from project aliases.
- Forms use suitable validation and accessible errors.

## Output

State components added/changed, command used, and accessibility notes.
