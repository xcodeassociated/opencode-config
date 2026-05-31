---
name: work-state-checkpoint
description: "Save, resume, or live-update a durable task checkpoint on disk. Use when /checkpoint-create, /checkpoint-auto, or /checkpoint-resume is invoked, context is degrading, errors loop, work is paused, or a fresh session must continue from summarized state."
license: MIT
---

# Work State Checkpoint

## Reference Files and Embedded Template

The full checkpoint template is embedded in this `SKILL.md` below to avoid workflow drift when sibling reference files are not loaded. `references/checkpoint-template.md` is kept as a colocated copy for humans or agents that explicitly need a separate template file.

If the read tool needs a concrete reference path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

Create a durable repo-local recovery brief so a fresh agent can continue without relying on the old session.

## Safe Paths

- Default target/source: `AGENT_WORK_STATE.md` in the current workspace.
- Guaranteed cross-agent writable targets: `AGENT_WORK_STATE.md` and Markdown files directly under `.agent-state/`.
- Agents with normal edit permission may use another explicit workspace-local Markdown path only when the human clearly provided it.
- Reject absolute paths, `..`, and non-Markdown targets.
- Prefer one stable latest-state file. Overwrite it; create dated/archive files only when the human asks.
- For `.agent-state/<name>.md`, create `.agent-state` with `mkdir -p .agent-state` if allowed; otherwise fall back to `AGENT_WORK_STATE.md`.
- Checkpoint writes are a narrow exception for restricted/read-only agents; they do not permit application-code edits.

## Commands

- `/checkpoint-create [path-or-note]`: create/overwrite a durable latest-state checkpoint.
- `/checkpoint-auto [path-or-note]`: create/overwrite immediately, then keep updating after meaningful progress until disabled or the session ends.
- `/checkpoint-resume [path]`: read checkpoint, verify repo state, and continue safely.

## Shared Rules

- Run as the current agent. Switch/delegate only when the checkpoint and normal agent rules require a different specialist.
- Do not ask clarification questions solely to checkpoint; save best-effort state and mark unknowns.
- Non-research agents must not use web/docs retrieval. Use current context, repo evidence, tool output, delegated reports, already-cited research, and human answers. Delegate fresh external facts to `@researcher`.
- Never include secrets, credentials, tokens, private keys, full `.env` values, or long logs.
- Include safe repo state when available: branch, commit, git status summary, and diff summary. If not checked, write `not run`.
- Preserve all required headings and their order. Empty sections must say `none yet`, `not applicable`, or `not run`.

## `/checkpoint-create`

- Create or overwrite one self-contained checkpoint.
- Read an existing checkpoint only as optional context; never append or leave stale contradictory sections.
- If Live Checkpoint Mode is active and no different safe path was provided, reuse the active target and keep `Auto-update mode: active`.
- After saving, stop and respond with only the saved path, resume command, and one-line caveat if needed.

## `/checkpoint-auto`

After initial save, treat Live Checkpoint Mode as active for the rest of the session. Replace the whole checkpoint after meaningful progress:

- goal/scope clarified; plan/current step changed;
- file edited; command/test/build/research result obtained;
- delegated report received; decision made;
- blocker/error loop/context-degeneration signal found or resolved;
- verification changed; user changes scope;
- agent is about to return control after material work.

Do not rewrite after trivial reads, cosmetic narration, or repeated no-op checks. Batch small observations. Preserve useful prior progress in `Material Progress Log`; compact old entries into `Earlier Progress Summary` when needed.

If the human tells you to stop live checkpointing, stop automatic updates. Optionally write one final update: `Auto-update mode: stopped by human`.

## `/checkpoint-resume`

1. Read the checkpoint first.
2. Inspect project-root `AGENTS.md` if present and relevant.
3. Run safe repo-state checks when permitted.
4. Compare current repo state with the checkpoint.
5. Reconstruct goal, approved scope, plan, current step, blockers, verification state, and next actions.
6. Prefer repo evidence over stale checkpoint content and report mismatches.
7. Re-apply the Modification Clarity Gate before edits.
8. If `Auto-update mode: active`, continue updating the same target after meaningful progress unless disabled.
9. If another specialist owns the next step, switch/delegate when allowed or report the recommended owner.

## Completion Responses

After `/checkpoint-create`:

```md
Checkpoint saved: <path>
Resume with: /checkpoint-resume <path>
Notes: <one-line caveat if any>
```

After `/checkpoint-auto`:

```md
Live checkpoint active: <path>
Resume with: /checkpoint-resume <path>
Stop with: tell me to stop live checkpointing
Notes: <one-line caveat if any>
```

After `/checkpoint-resume`, return a compact continuation plan and the first safe next action.

## Embedded Checkpoint Format

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
