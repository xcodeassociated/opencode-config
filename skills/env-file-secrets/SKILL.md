---
name: env-file-secrets
description: "Manage .env files, .env.template, .gitignore, .dockerignore, Dockerfile, and Docker Compose secrets. Use before adding env vars, local config, env_file, or secret-bearing runtime config."
license: MIT
---

# Env File Secrets

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/env-patterns.md` — .gitignore, env template, Docker/Compose, and final-report examples.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

Use when adding/changing/reviewing env vars, local config, Dockerfile/Compose config, test env files, or any value that might be secret.

## Goal

Keep real secrets out of git while preserving a complete committed key contract.

- Real values live only in ignored local files such as `.env`.
- Committed templates contain keys only with blank values.
- Docker, Compose, tests, docs, and agents reference templates/ignored env files without leaking values.

## Non-Negotiable Rules

- Never commit real env files or secret values.
- Commit `.env.template` or `.env.example` for the key contract; blank or explicitly non-secret dummy values only.
- Do not commit `.env`, `.env.local`, `.env.development`, `.env.test`, `.env.production`, or value-bearing `.env.*` files.
- Do not place real secrets in source, Dockerfiles, Compose, scripts, test fixtures, docs, logs, screenshots, reports, or `AGENTS.md`.
- Final reports mention key names only, never values.
- If a value-bearing env file is already tracked, stop and report leak risk before editing. Remove from tracking only with explicit approval and preserve local data carefully.
- If a required value is unknown, add only the key to the template; do not invent fake secret-looking values.

## Docker / Compose Rules

- Do not bake secrets with `ARG`, `ENV`, `COPY .env`, or generated config files.
- Prefer runtime env injection.
- For local Compose, `env_file: .env` is acceptable only when `.env` is ignored and the template documents keys.
- For Docker Swarm/Compose secrets, mount secrets as files and pass file paths when the app supports them.
- Do not use committed `environment:` values for real secrets.

## Tests and Local Dev

- Prefer isolated test config with non-secret dummy values.
- Do not commit real `.env.test` values.
- If tests need env vars, document keys in the template and setup docs.

## Incident Rules

If a secret appears in git, logs, issue text, screenshots, or artifacts: stop, report leak location/scope without repeating the value, recommend immediate rotation, and remove future exposure only with explicit approval.

## Final Report

```md
Env keys added/changed:
Files updated:
Ignored local files verified:
Templates updated:
Secrets exposed: yes/no
Follow-up / rotation needed:
AGENTS.md status:
```
