---
name: handoff-brief
description: "Create compact handoffs between agents. Use when delegating, returning specialist findings, or transferring work after partial progress."
license: MIT
---

# Handoff Brief

Use to transfer work without losing scope, evidence, or question routing.

## Delegation Brief

Every agent-to-agent task must include:

```md
Goal:
Context:
Scope:
Inputs / paths / commands:
Expected output:
Constraints:
Question route:
Stop/ask conditions:
```

Rules:

- State the immediate invoker and whether the specialist may ask the human directly.
- Include only needed context; avoid dumping unrelated history.
- Separate facts, assumptions, and `# VERIFY` items.
- Do not delegate external research except to `@researcher`.
- Do not delegate implementation to read-only/research roles.

## Return Brief

When returning from delegated work:

```md
Status:
What was done:
Evidence / commands run:
Files read:
Files changed:
Findings:
Clarification Requests:
Risks / # VERIFY:
Recommended next owner:
```

Rules:

- Report to the immediate invoker unless explicitly routed otherwise.
- State what was not run.
- Do not hide blockers in prose; use `Clarification Requests`.
- If work changed scope or reveals stale repo guidance, include `AGENTS.md update required` with exact proposed text.

## Resume / Pause Brief

If work cannot continue safely, create or update a checkpoint using `work-state-checkpoint`, then return:

```md
Paused because:
Current step:
Completed:
Remaining:
Blocking questions:
Resume command:
```
