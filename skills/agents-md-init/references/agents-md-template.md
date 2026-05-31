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
