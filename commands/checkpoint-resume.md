---
description: Resume work from AGENT_WORK_STATE.md or another safe Markdown checkpoint file
---

Load `work-state-checkpoint` and resume from a checkpoint in the current workspace. This command has no `agent:` frontmatter by design; it runs as the currently selected agent.

Arguments:
$ARGUMENTS

## Source Path

- Read the provided safe workspace-local Markdown path, or `AGENT_WORK_STATE.md` by default.
- Reject absolute paths, `..`, and non-Markdown targets.
- If the checkpoint is missing, report that and suggest `/checkpoint-create` in the old session if available.

## Resume Rules

- Read the whole checkpoint before planning.
- Inspect project-root `AGENTS.md` if present and relevant.
- Run safe repo-state checks when permitted: branch, commit, git status summary, and diff summary.
- Compare current repo state with the checkpoint; prefer repo evidence over stale checkpoint content and report mismatches before editing.
- Reconstruct goal, approved scope, constraints, plan, current step, completed work, files changed, verification state, blockers, risks, and exact next actions.
- Do not redo completed work unless repo comparison shows it is stale or missing.
- Do not mutate until the Modification Clarity Gate is satisfied.
- If another specialist owns the next step, switch/delegate only when normal agent rules allow it.
- Non-research agents must not use web/docs retrieval; delegate current external facts to `@researcher`.
- If `Auto-update mode: active`, re-enable live checkpointing after verification and keep updating the same path unless the human disables it.
- Preserve the embedded checkpoint format below; do not invent a new structure.

Return a compact continuation plan, current uncertainty, live-checkpoint status, and the first safe next action.

## Embedded Checkpoint Format

The command carries the checkpoint structure explicitly so the agent does not rely on a sibling reference file being loaded. Use this exact structure for new checkpoints, live checkpoint rewrites, and resume-continued updates. Preserve heading names and order; keep empty sections with `none yet`, `not applicable`, or `not run`.

# Work State Checkpoint Template

Use this exact structure for `/checkpoint-create`, `/checkpoint-auto`, live updates, and resume-continued updates after loading `work-state-checkpoint`.

```md
# Agent Work State

## Resume Instructions
- Read this entire file before planning or editing.
- Compare the saved git/repo state with the current repo state before continuing.
- Continue from `Current Step` and `Next Actions`; do not redo completed work unless validation shows it is stale.
- Do not start mutating work until the Modification Clarity Gate is satisfied.
- If this checkpoint conflicts with repo evidence, prefer repo evidence and report the mismatch.

## Snapshot
- Saved by agent:
- Human-facing orchestrator:
- Immediate invoker, if delegated:
- Checkpoint reason:
- Working directory:
- Branch:
- Commit:
- Git status summary:
- Git diff summary:
- Date/time if known:

## Auto Checkpoint Tracking
- Auto-update mode: inactive unless `/checkpoint-auto` activated it
- Live checkpoint target:
- Last update reason:
- Last material progress event:
- Earlier progress summary:

## Material Progress Log
-

## Original User Goal

## Approved Scope and Constraints

## Detailed To Do / Done / Left To Do
### To Do
-
### Done
-
### Left To Do
-

## Current Plan
- [x] Completed step
- [>] Current step
- [ ] Remaining step

## Current Step

## Completed Work

## Files Read

## Files Changed

## Commands and Observed Results

## Delegated Agents / Reports

## Decisions Made

## Research / External Facts Already Used

## Tests and Verification State

## Errors, Loops, or Context-Degeneration Signals

## Risks, Unknowns, and # VERIFY Items

## Exact Next Actions
1.
2.
3.

## Stop Conditions / Human Approval Needed

## Suggested Resume Command
`/checkpoint-resume AGENT_WORK_STATE.md`

## Suggested Resume Prompt
Read `AGENT_WORK_STATE.md`, verify repo state, summarize the current step, and continue from the next action without redoing completed work.
```
