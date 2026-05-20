# OpenCode Multi-Agent Team Config

A structured OpenCode setup for a specialist coding team:

- `@team-lead` — human-facing orchestrator, routing, scope control, integration, final report.
- `@architect` — architecture decisions, boundaries, contracts, persistence/security design.
- `@developer` — implementation, refactoring, TDD loop, frontend/backend code.
- `@tester` — bug reproduction, API/UI/security verification, regression evidence.
- `@devops` — local runtime, Docker/Compose, Kubernetes, CI/CD, deployment readiness, diagnostics.
- `@analyst` — read-only requirements, schema, data, and migration-risk analysis.
- `@researcher` — only agent allowed to perform external research, web/docs lookup, package/version/CVE discovery.

The setup is intentionally conservative: most external lookup is denied except for `@researcher`, destructive operations require approval or are denied, and delegated agents must route clarification questions back through the invoking agent unless direct human questioning is explicitly allowed.

## Repository layout

```text
opencode.json          # OpenCode config: providers, agents, permissions, MCP servers
agents/*.txt           # Agent system prompts referenced by opencode.json
commands/*.md          # Custom slash commands
skills/*/SKILL.md      # Portable skill definitions
skills/README.md       # Skill authoring/install policy
PUBLISHING.md          # Pre-publication checklist
```

OpenCode supports agent prompt files referenced from `opencode.json`, custom commands in `commands/`, and skills in `skills/<name>/SKILL.md` when installed in an OpenCode config location.

## Install

Global install:

```bash
mkdir -p ~/.config/opencode
cp -R opencode.json agents commands skills ~/.config/opencode/
```

Project-local install:

```bash
mkdir -p .opencode
cp -R opencode.json agents commands skills .opencode/
```

Then start OpenCode from the target project. The default agent is `team-lead`.

## Required local configuration

Before use, review `opencode.json` and adjust:

- model/provider names and `provider.vllm.options.baseURL`;
- MCP endpoints for SearXNG and Firecrawl;
- enabled/disabled MCP servers;
- shell permissions for your OS and trust level;
- package-manager policy (`bun` is preferred here; npm/pnpm/yarn are denied for implementation agents);
- deployment permissions for Kubernetes, Docker, SSH, SCP, and package managers.

The checked-in config may contain environment-specific service URLs. Treat them as examples unless they are yours.

## Operating model

Use `team-lead` for normal work. It should delegate non-trivial work to the right specialist and integrate reports. Specialists can also be invoked directly when you intentionally want that role as the human-facing agent.

Key rules:

- no hallucinated facts; ask or mark non-blocking `# VERIFY`;
- no external research except through `@researcher`;
- no production deploy, push, destructive DB/infra operation, or credential change without explicit approval;
- real `.env` files are readable by the agents by design so they can code, test, debug local runtime config, deploy, and use the env/K8s secret skills; they must not commit or print real secret values;
- long or fragile work should use `/checkpoint-auto`, `/checkpoint-create`, and `/checkpoint-resume`;
- project context should be captured in `AGENTS.md` via `/project-init`.

## Custom commands

- `/project-init` — create or update project `AGENTS.md` through team discovery.
- `/checkpoint-create` — save a durable session checkpoint.
- `/checkpoint-auto` — enable live checkpoint updates after material progress.
- `/checkpoint-resume` — resume from a saved checkpoint.

## Publication notes

Before publishing a fork, read `PUBLISHING.md`. At minimum, remove or replace private endpoints, choose a license, and confirm no secrets or real internal hostnames are committed.
