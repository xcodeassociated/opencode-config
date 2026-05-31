---
name: context-reset
description: "Reset working context after long or complex work. Use before handoff, after compaction, or when assumptions may have drifted."
license: MIT
---

# Context Reset

Do not convert uncertainty into facts during reset. Preserve unknowns and route blocking questions.

Use to re-align before continuing complex work.


## Durable Reset

If the reset must survive a new session, lost context, repeated errors, or stopping work, load `work-state-checkpoint` and apply `/checkpoint-create` save semantics directly to create/overwrite `AGENT_WORK_STATE.md`; do not literally invoke another slash command. A normal context reset is in-memory only.

## Reset Format

```md
Goal:
Approved scope:
Facts verified:
Decisions made:
Files touched:
Commands run:
Open risks:
Unknowns:
Next action:
Stop conditions:
```

## Rules

- Separate facts from assumptions; mark missing facts that need human or researcher clarification.
- Do not repeat full history.
- Keep only information needed for the next step.
- Include exact file paths and command results when relevant.
- Mention who owns the next action.

## When to Use

- Before handing off to another agent.
- After a long investigation.
- After failing tests or unexpected behavior.
- Before final report.
- After context compaction.
