---
name: plan-first
description: "Plan before broad work. In delegated mode, execute within scope and route questions to the invoking agent."
license: MIT
---

# Plan First

Never invent missing requirements or facts. Ask directly if human-facing; if delegated, route `Clarification Requests` to the immediate invoker.

## Use When

- Work is broad, multi-file, risky, architectural, data-affecting, deploy-related, or ambiguous.
- A delegated slice needs explicit scope before edits.

## Human-Facing Mode

Produce a short plan and ask for approval before broad mutating work. Do not edit until no unresolved question could materially change the modification.

```md
Goal:
Scope:
Assumptions / known facts:
Clarification requests:
Plan:
Validation:
Risk / rollback:
Waiting for approval:
```

## Delegated Mode

If another agent delegated an approved slice:

- Treat the delegation brief as approved scope.
- Do not ask the human directly unless explicitly routed or no invoker exists.
- Return questions to the immediate invoker by default.
- The invoker answers only from the brief, repo evidence, tool output, cited research, approved scope, or human answers; otherwise it routes unresolved questions upstream.
- Pause affected work until `Clarification Answers` arrive.
- Stay inside scope; report out-of-scope findings separately.

## Checkpoint

For long-running, delegated, or context-risk work, load `work-state-checkpoint` and apply `/checkpoint-create` save semantics directly before pausing or handing off; do not literally invoke another slash command.
