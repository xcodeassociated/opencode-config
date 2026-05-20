---
name: agents-md-init
description: "Create or update project-root AGENTS.md with business, architecture, development, testing, data, ops, and delegation guidance. Use for repo init or stale project instructions."
license: MIT
---

# AGENTS.md Init

Create or update project-root `AGENTS.md` for future coding-agent sessions. Use for repo init, stale project instructions, or replacing weak `/init` output.

## Hard Rules

- Never invent product, business, command, version, deployment, or responsibility facts.
- Derive facts from repo evidence, tool output, cited research, approved scope, or human answers.
- Ask/route clarification before finalizing material business/system claims.
- Unresolved blocking facts must be answered or explicitly marked as draft limitations.
- `# VERIFY` is for residual or non-blocking uncertainty, not for hiding questions that should be asked.
- Preserve useful existing `AGENTS.md` content; update in place and remove stale rules.
- Never include secrets or private credentials.

## Coordinator and Question Flow

The invoking `@team-lead`, `@developer`, or `@architect` coordinates discovery.

- Specialists return findings plus `Blocking` / `Non-blocking` clarification requests to the coordinator by default.
- The coordinator answers only from evidence. If unresolved and human-facing, ask the human once with `question`; if delegated, route upstream.
- Resume affected discovery/editing only after `Clarification Answers` arrive.
- Direct specialist `question` use is allowed only when explicitly routed or no invoker exists.

## Required AGENTS.md Content

The guide must tell future agents:

- what the app does, key responsibilities, non-responsibilities, users, workflows, integrations, owned data, and sensitive data;
- whether it is standalone or part of a larger system;
- architecture, module boundaries, coding style, commands, testing, deployment/runtime, observability, and gotchas;
- how agents coordinate, delegate, checkpoint, verify, and keep `AGENTS.md` current.

## Mandatory Maintenance Rules

Every generated/updated guide must include `## Agent Workflow for This Repo` or equivalent with these rules in substance:

- At task start, check for project-root `AGENTS.md`; if missing, strongly recommend `/project-init` before substantive work.
- Read relevant sections before planning, editing, testing, or reporting.
- After successful work, verify the result still matches `AGENTS.md`.
- Update `AGENTS.md` in the same task when changes affect purpose, responsibilities, architecture, boundaries, commands, dependencies, runtime/deployment, data/migrations, auth/security, testing, conventions, or operational gotchas.
- Agents without edit permission return `AGENTS.md update required` with exact proposed text.
- Final reports include `AGENTS.md status`: checked/read, updated, not needed, missing, or update required.

## Discovery Order

Use sequential specialist discovery where useful; do not run agents in parallel unless the user requested it.

1. Coordinator repo scan.
2. `@analyst`: business/domain/data model, invariants, schema, migrations, data risks.
3. `@architect`: architecture, boundaries, modules, APIs, persistence, auth, design rules.
4. `@developer`: build/run/test commands, code style, backend/frontend conventions, local setup.
5. `@tester`: verification strategy, test commands, artifacts, gaps, risk scenarios.
6. `@devops`: Docker/Compose/K8s/Proxmox/CI/CD/runtime/observability/deployment gotchas.
7. `@researcher`: external docs, versions, CVEs, or package/library facts only when current external facts are needed.

When invoked by `@architect`, developer/tester/devops work is discovery and AGENTS.md contribution only, not implementation.

## Inspect When Present

`README*`, `docs/**`, existing `AGENTS.md`, `CLAUDE.md`, `.cursor/**`, CI files, build files, `Makefile`, `package.json`, `bun.lock*`, Vite/TS configs, `src/**`, `test/**`, `requests/**`, OpenAPI files, migrations/schema/seed files, Dockerfiles, Compose, Helm/K8s manifests, scripts, and env examples.

## Suggested Structure

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

## Writing Rules

- Prefer exact paths, commands, modules, services, package names, ports, env files, and test targets.
- Classify important business statements as `Evidence-backed`, `Inferred`, or `# VERIFY with human`.
- Keep text comprehensive but operational; remove long explanations that do not guide future agents.
- Do not edit until business purpose, scope, and blocking human-owned decisions are clear, unless the user requested a draft.

## Final Report

```md
Summary:
Sections created/updated:
Agents consulted:
Commands/files inspected:
Human clarifications asked/answered:
Remaining # VERIFY items:
AGENTS.md maintenance rules added/verified:
Risks/gaps:
```
