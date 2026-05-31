---
description: Enable live checkpoint tracking and update AGENT_WORK_STATE.md after meaningful progress
---

Load `work-state-checkpoint` and enable Live Checkpoint Mode for the current session. This command has no `agent:` frontmatter by design; it runs as the currently selected agent.

Arguments:
$ARGUMENTS

## Target Path

- Default: `AGENT_WORK_STATE.md`.
- Accept a safe workspace-local Markdown path only when it is `AGENT_WORK_STATE.md`, directly under `.agent-state/`, or explicitly provided by the human to an agent with normal edit permission.
- Restricted agents must use `AGENT_WORK_STATE.md` or `.agent-state/<name>.md`.
- Treat non-path arguments as a note about why live tracking is enabled.
- Reject absolute paths, `..`, and non-Markdown targets.
- For `.agent-state/<name>.md`, create `.agent-state` with `mkdir -p .agent-state` if allowed; otherwise fall back to `AGENT_WORK_STATE.md`.

## Immediate Action

- New/empty session: create or overwrite the target with an initialized checkpoint that says live tracking is active, no task has started, and the next action is to wait for the human task.
- Work in progress: perform `/checkpoint-create` save semantics directly. Do not literally invoke another slash command.

## Ongoing Updates

Live Checkpoint Mode stays active until the human disables it or the session ends. Replace the whole checkpoint after meaningful progress, including:

- goal/scope clarified; plan/current step changed;
- file edited; command/test/build/research result obtained;
- delegated report received; decision made;
- blocker/error loop/context-degeneration signal found or resolved;
- verification state changed; user changes scope;
- agent is about to return control after material work.

Do not rewrite after trivial reads, cosmetic narration, or no-op checks. Batch low-level observations into the next meaningful update.

## Format and Rules

- Use the embedded `Checkpoint Format` below; preserve heading names and order.
- Preserve useful prior progress via `Material Progress Log`; rewrite cleanly instead of raw-appending.
- Compact old log entries into `Earlier Progress Summary` when needed.
- Keep empty sections with `none yet`, `not applicable`, or `not run`.
- Before returning control after material work, update the checkpoint if stale.
- Checkpoint writes are narrow state-saving writes, not permission to edit application code.
- Non-research agents must not use web/docs retrieval while checkpointing.
- Do not ask clarification questions just to checkpoint; mark unknowns or `# VERIFY`.
- Include safe repo state when available and never include secrets or long logs.
- If delegated, record immediate invoker, human-facing orchestrator, and question route.

After the first checkpoint is written, respond only with the saved path, live-checkpoint status, resume command, and stop instruction.

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
