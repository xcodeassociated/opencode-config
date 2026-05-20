---
description: Create or update project AGENTS.md using team analysis
agent: team-lead
---

Load `agents-md-init` and create/update the project-root `AGENTS.md` for this repository.

Request / extra context:
$ARGUMENTS

## Hard Rules

- Do not invent business/product facts, commands, versions, deployment targets, or responsibilities.
- Use sequential specialist discovery when useful; specialists return `Clarification Requests` to `@team-lead` by default.
- `@team-lead` answers only from evidence or asks the human with `question`; specialists ask directly only when the brief explicitly allows it or no invoker exists.
- Ask blocking human-owned questions before editing/finalizing. Do not bury blocking questions only under `# VERIFY`.
- The final `AGENTS.md` must include durable maintenance rules: future agents check/read it, recommend `/project-init` when missing, verify work against it, and update it after significant repo-context changes.

## Discovery Focus

- business purpose, responsibilities, non-responsibilities, and whether the app is standalone or part of a larger system;
- architecture, modules, APIs, integrations, data ownership, auth/security, and conventions;
- exact build/run/test/verification commands;
- local runtime, Docker/Compose, K8s/Proxmox, CI/CD, deployment, rollback, observability, and gotchas.
