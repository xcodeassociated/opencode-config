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
