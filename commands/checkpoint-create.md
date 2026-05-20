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
- Use the exact `Checkpoint Format` from `work-state-checkpoint`; preserve heading names and order. Empty sections must say `none yet`, `not applicable`, or `not run`.

## Rules

- Save state only. Do not continue implementation, tests, deploys, or research while checkpointing.
- Do not ask clarification questions just to save state; record unknowns and `# VERIFY` items.
- Non-research agents must not use web/docs retrieval. Use current context, repo evidence, tool output, delegated reports, cited research already present, and human answers.
- Include enough recovery detail: goal, approved scope, constraints, plan, current step, completed work, files read/changed, commands/results, delegated reports, decisions, errors/loops, risks, unknowns, exact next actions, and stop conditions.
- Include safe repo state when available: branch, commit, git status summary, and diff summary. If not checked, write `not run`.
- Never include secrets, credentials, tokens, private keys, full `.env` values, or long logs.
- The checkpoint is a narrow state-saving artifact, not permission to edit application code.

After saving, stop and respond only with the saved path, the `/checkpoint-resume` command, and one-line caveat if needed.
