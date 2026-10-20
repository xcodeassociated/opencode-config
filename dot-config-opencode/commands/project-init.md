---
description: Create or refresh a practical project AGENTS.md using the built-in `build` agent
agent: build
---

Initialize or update the project-root `AGENTS.md` for the current repository.

Optional guidance from the user:
$ARGUMENTS

1. Load the `agents-md-init` skill.
2. **Normally do the work directly as the `build` agent.** Do not spin up a specialist team or invent handoff/checkpoint artifacts. A focused child `build` agent is justified only if independent module inspection or verification would materially reduce context pressure; follow global `AGENTS.md`. Use the `researcher` agent **only** if current external documentation, dependency compatibility or other online facts are genuinely needed. Local codebase discovery is the `build` agent's job. Give the `researcher` agent the relevant repo context and required version/source constraints. If the `researcher` agent asks the human a blocking question directly, use its answered result. If it returns `Clarification Requests` instead, answer from repo evidence or ask the user via the primary `build` agent's `question` tool, then send `Clarification Answers` in a new `researcher` agent invocation before relying on the blocked research.
3. Inspect repository-owned evidence: existing `AGENTS.md`, README, relevant docs, source/package/build files, tests, scripts, CI, Docker/Compose/Kubernetes/deployment manifests, and configuration templates. Prefer targeted searches over dumping every file. Exclude Git submodule contents: `.gitmodules` may be read to identify their paths, but do not recurse into those trees.
4. Derive actual build, run, test and lint commands from inspected files. If appropriate and safe, check them; never claim unexecuted commands were tested. Avoid inventing project purpose, business rules, environment values, or production infrastructure.
5. Preserve correct and useful content in any existing `AGENTS.md`; remove inaccurate, redundant or obsolete guidance. Write a concise actionable guide appropriate for this repository, not a generic checklist. Include purpose/context (if evidenced), key paths/modules, architecture/conventions, exact commands, tests, operational notes, gotchas, and how to maintain the guide. Omit irrelevant sections.
6. If a missing *material* decision prevents an accurate instruction, ask one focused question. Do not force questions for optional/marginal details. For uncertain but nonessential details, omit the claim or label it unverified.
7. Verify the final file against repository evidence, keep it reasonably short, and summarize what changed and what remains unverified.

This command deliberately complements OpenCode's built-in `/init` rather than overriding it.
