---
description: Create or update project AGENTS.md using team analysis
agent: team-lead
---

Load `agents-md-init` and create/update the project-root `AGENTS.md` for this repository.

## Operator Prompt Context

Human request / extra context typed after this command:
$ARGUMENTS

Treat the block above as optional human-provided context. Preserve any constraints in it. If it is empty, run the standard project-init workflow.

Example invocation: `/project-init focus on Docker and deployment readiness`

## Hard Rules

- Do not invent business/product facts, commands, versions, deployment targets, or responsibilities.
- Analyze only the main repository/worktree. Do not analyze Git submodule contents when creating or updating `AGENTS.md`.
- Treat Git submodule paths as external and out of scope. You may inspect `.gitmodules` only to identify submodule paths that must be skipped.
- Exclude submodule paths from file listing, search/grep, code reads, build/test command inference, architecture summaries, and specialist discovery tasks.
- Do not run commands or tool options that recurse into submodules, including `git submodule update`, `git submodule foreach`, `git grep --recurse-submodules`, or `git ls-files --recurse-submodules`.
- If a command or tool accidentally includes submodule results, discard those findings and redo discovery with those paths excluded.
- If a submodule is necessary to describe a project boundary, mention only its path/name and mark its purpose as `# VERIFY` unless the main repository documents it.
- Use sequential specialist discovery when useful; specialists return `Clarification Requests` to `@team-lead` by default.
- `@team-lead` answers only from evidence or asks the human with `question`; specialists may always ask the human directly when a blocking question cannot be resolved through `@team-lead`, when routed straight to the human, or when no invoker exists.
- Ask blocking human-owned questions before editing/finalizing. Do not bury blocking questions only under `# VERIFY`.
- The final `AGENTS.md` must include durable maintenance rules: future agents check/read it, recommend `/project-init` when missing, verify work against it, and update it after significant repo-context changes.

## Discovery Focus

- business purpose, responsibilities, non-responsibilities, and whether the app is standalone or part of a larger system;
- architecture, modules, APIs, integrations, data ownership, auth/security, and conventions;
- exact build/run/test/verification commands;
- local runtime, Docker/Compose, K8s/Proxmox, CI/CD, deployment, rollback, observability, and gotchas.

## Embedded AGENTS.md Suggested Structure

The command carries the AGENTS.md structure explicitly so the agent does not rely on a sibling reference file being loaded. Use the embedded `AGENTS.md Suggested Structure` below as the starting point for a new guide or a major restructure of a weak guide. Do not fill sections with invented facts; mark unresolved non-blocking details as `# VERIFY`, and ask blocking human-owned questions before finalizing.

# AGENTS.md Suggested Structure

Use this as a starting point after loading `agents-md-init`. Do not fill sections with invented facts; mark unresolved non-blocking details as `# VERIFY`.

```md
# <Project Name> Agent Guide

## Application Overview
- What the app does
- Key responsibilities / non-responsibilities
- Standalone vs larger system
- Main users/workflows
- Integrations/upstream/downstream systems
- Owned data and sensitive data
- Business assumptions / # VERIFY items

## Repository Structure
## Tech Stack
## Build, Run, Test, and Verification Commands
## Architecture and Design Rules
## Backend Conventions
## Frontend Conventions
## Data, Persistence, and Migrations
## Authentication, Authorization, and Security
## Testing Strategy
## Docker, Compose, Kubernetes, and On-Prem Runtime
## CI/CD and Deployment Readiness
## Observability and Operations

## Agent Workflow for This Repo
- Coordination/delegation rules
- Plan/approval/checkpoint conventions

### AGENTS.md Maintenance
- Check for this file at task start; recommend `/project-init` if missing before substantive work.
- Read relevant sections before planning/editing/testing/reporting.
- Verify successful changes still match this guide.
- Update this file when repo purpose, responsibilities, architecture, commands, dependencies, runtime/deploy, data, auth/security, testing, conventions, or gotchas change.
- If unable to edit, report `AGENTS.md update required` with exact proposed text.
- Include `AGENTS.md status` in final reports.

## Known Gotchas
## Human-Owned Decisions / Open Questions
```
