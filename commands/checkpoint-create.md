---
description: Create or overwrite a durable checkpoint in AGENT_WORK_STATE.md or another safe Markdown checkpoint path
---

Load `work-state-checkpoint` and save the current session state. This command has no `agent:` frontmatter by design; it runs as the currently selected agent.

Arguments:
$ARGUMENTS

## Target Path

- Default: `AGENT_WORK_STATE.md`.
- Accept a workspace-local Markdown path only when it is `AGENT_WORK_STATE.md`, directly under `.agent-state/`, or explicitly provided by the human to an agent with normal edit permission.
- Restricted agents must use `AGENT_WORK_STATE.md` or `.agent-state/<name>.md`.
- Treat non-path arguments as a human note to include in the checkpoint.
- Reject absolute paths, `..`, and non-Markdown targets.
- For `.agent-state/<name>.md`, create `.agent-state` with `mkdir -p .agent-state` if allowed; otherwise fall back to `AGENT_WORK_STATE.md`.

## Save Semantics

- Create or overwrite the selected target with one fresh, self-contained checkpoint.
- If Live Checkpoint Mode is active and no different safe path was provided, reuse the live target and keep `Auto-update mode: active`.
- Read an existing checkpoint only as optional context; never append, duplicate, or leave stale contradictory sections.
- Use the embedded `Checkpoint Format` below; preserve heading names and order. Empty sections must say `none yet`, `not applicable`, or `not run`.

## Rules

- Save state only. Do not continue implementation, tests, deploys, or research while checkpointing.
- Do not ask clarification questions just to save state; record unknowns and `# VERIFY` items.
- Non-research agents must not use web/docs retrieval. Use current context, repo evidence, tool output, delegated reports, cited research already present, and human answers.
- Include enough recovery detail: goal, approved scope, constraints, plan, current step, completed work, files read/changed, commands/results, delegated reports, decisions, errors/loops, risks, unknowns, exact next actions, and stop conditions.
- Include safe repo state when available: branch, commit, git status summary, and diff summary. If not checked, write `not run`.
- Never include secrets, credentials, tokens, private keys, full `.env` values, or long logs.
- The checkpoint is a narrow state-saving artifact, not permission to edit application code.

After saving, stop and respond only with the saved path, the `/checkpoint-resume` command, and one-line caveat if needed.

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
