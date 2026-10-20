---
name: agents-md-init
description: Create or update a concise, evidence-based project-root AGENTS.md for a repository.
license: MIT
---

# Initialize or refresh AGENTS.md

Use the **built-in `build` agent**, which owns local discovery and the final edit. No specialist team is required. Delegate to the `researcher` agent only for genuine external/current documentation questions.

## Discover

- Read the existing `AGENTS.md` if present, plus README and relevant local docs.
- Inspect project structure, module manifests, build scripts, tests, CI and deployment config, but stay in the main Git worktree. Identify (do not traverse) Git submodules via `.gitmodules`.
- Record observed commands and conventions, and distinguish repo evidence from inference.
- Verify key commands with safe execution when feasible; otherwise label them untested.
- Ask the user only if a missing material decision prevents a correct guide. Omit unneeded speculative details.

## Produce

Write a practical guide future coding sessions can follow. Include only relevant sections, typically:

- Project purpose and scope, when documented
- Important paths/modules and architectural boundaries
- Languages, frameworks and conventions
- Commands: setup, build, run, test, lint, format
- Data/storage/migrations and auth/security, if applicable
- Runtime, deployment, CI, operations and known gotchas, if applicable
- Testing expectations and how to keep `AGENTS.md` current

Preserve accurate existing guidance. Use real file paths, command examples and precise caveats; never invent dependencies, versions or infrastructure. Avoid multi-agent workflow instructions or mandatory approval rituals. Do not include credentials or secrets. Keep the content concise enough for everyday use.

At the end, report the file updated, key sections and any unverified information. If the file cannot be written, supply the proposed content and reason.
