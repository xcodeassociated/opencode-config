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
- Preserve the checkpoint format from `work-state-checkpoint`; do not invent a new structure.

Return a compact continuation plan, current uncertainty, live-checkpoint status, and the first safe next action.
