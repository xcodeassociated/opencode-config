---
name: iterative-development
description: "Deliver code in small testable slices. Use for features, refactors, bug fixes, and multi-agent implementation work."
license: MIT
---

# Iterative Development

Never invent missing requirements to start a slice. Ask or route clarification before mutating work.

Use for implementation planning and execution.

## Rules

- Work in small slices with clear acceptance criteria.
- Do not edit a slice until no unresolved question could materially change that slice.
- Test each slice before expanding scope.
- Avoid unrelated refactors.
- Do not run parallel agents unless the user explicitly asks; keep slices sequential by default.
- Hand off after each meaningful slice. If a subagent returns questions, answer only from repo evidence, tool output, cited research, approved scope, or human answers; otherwise route unresolved `Blocking` questions upstream before editing the affected slice.

## Slice Template

```md
Slice:
Goal:
Files likely touched:
Test first:
Implementation step:
Verification:
Risk:
Clarity / open questions:
Owner:
```

## Stop Conditions

- Scope drift.
- Architecture ambiguity.
- Data migration risk.
- Failing unrelated tests.
- Required credential/approval missing.
