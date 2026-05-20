---
name: agents-md-section
description: "Produce a compact specialist audit section for AGENTS.md. Use during project init or repo-rule creation to document evidence-backed guidance."
license: MIT
---

# Goal

Never invent business, architecture, command, version, or deployment facts. Ask or route clarification instead.

Return concise, evidence-backed findings for a project `AGENTS.md` file.

Do not write the full file unless asked. Contribute your specialist section.

# Common Rules

- Inspect the repo before answering.
- Prefer exact paths, commands, service names, modules, env files, and test targets.
- Separate facts from inference.
- Mark uncertain items with `# VERIFY`.
- Do not include secrets.
- Do not do unrelated implementation work.
- Do not edit files; return findings and blocking questions to the orchestrator.
- If existing `AGENTS.md` guidance is stale or incomplete, return exact proposed updates instead of ignoring it.
- When contributing to project init, verify that the generated `AGENTS.md` will include the AGENTS.md maintenance rules for future agents.
- If delegated, return `Blocking` and `Non-blocking` clarification requests to the immediate invoking orchestrator as task output by default. Use `question` directly only when explicitly routed or no invoker exists.
- Use `Blocking` only when missing context would make `AGENTS.md` misleading or unsafe. If answers are supplied later, continue only from those `Clarification Answers`.

# Role Focus

## Analyst

Report business/domain/data facts:

- What the app appears to do and key responsibilities.
- Standalone vs part of larger system.
- Entities, relationships, invariants, lifecycle, retention.
- Schema/data risks, migrations, volume hints, PII/security flags.
- Business questions that require orchestrator clarification.

## Architect

Report architecture facts:

- Modules, layers, package boundaries, backend/frontend split.
- API style, persistence style, auth/security model, eventing.
- Architectural rules future agents must preserve.
- Existing ADRs/diagrams/docs and gaps.

## Developer

Report implementation facts:

- Build/run/test/lint/typecheck commands.
- Kotlin/Spring, React/Vite/shadcn, Bun, Gradle conventions.
- Code style, naming, module layout, local dev setup.
- Common implementation gotchas.

## Tester

Report verification facts:

- Test framework layout and commands.
- API/UI/manual artifacts, `.http` files, Playwright/Vitest/Gradle tests.
- Critical scenarios, auth checks, regression areas, gaps.

## DevOps

Report runtime/ops facts:

- Dockerfiles, compose files, service names, ports, env files.
- K8s/Helm/operators, Proxmox/on-prem assumptions, CI/CD.
- Observability, backup/restore, deployment readiness, rollback gotchas.

## Researcher

Report external facts only when requested:

- Official docs, library/package discovery, dependency/version lookup.
- Docker image, Helm chart, K8s operator, CLI, CVE/security facts.
- Include sources and date checked.

# Report Format

```md
Section owner:
Scope inspected:
Evidence-backed AGENTS.md entries:
Inferred entries:
Clarification requests:
  Blocking:
  - ...
  Non-blocking:
  - ...
Risks/gotchas:
AGENTS.md update required:
Files/commands inspected:
```
