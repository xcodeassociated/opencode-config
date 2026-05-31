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
