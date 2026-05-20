---
name: env-file-secrets
description: "Manage .env files, .env.template, .gitignore, .dockerignore, Dockerfile, and Docker Compose secrets. Use before adding env vars, local config, env_file, or secret-bearing runtime config."
license: MIT
---

# Env File Secrets

Use when adding/changing/reviewing env vars, local config, Dockerfile/Compose config, test env files, or any value that might be secret.

## Goal

Keep real secrets out of git while preserving a complete committed key contract.

- Real values live only in ignored local files such as `.env`.
- Committed templates contain keys only with blank values: `KEY=`.
- Docker, Compose, tests, docs, and agents reference templates/ignored env files without leaking values.

## Non-Negotiable Rules

- Never commit real env files or secret values.
- Commit `.env.template` for the main env contract; blank values only.
- Do not commit `.env`, `.env.local`, `.env.development`, `.env.test`, `.env.production`, or value-bearing `.env.*` files.
- Do not place real secrets in source, Dockerfiles, Compose, scripts, test fixtures, docs, logs, screenshots, reports, or `AGENTS.md`.
- Final reports mention key names only, never values.
- If a value-bearing env file is already tracked, stop and report leak risk before editing. Remove from tracking only with explicit approval and preserve local data carefully.
- If a required value is unknown, add only the key to the template; do not invent fake secret-looking values.

## Git Ignore Contract

Ensure `.gitignore` ignores value-bearing env files while allowing templates:

```gitignore
.env
.env.*
!.env.template
!.env.*.template
```

Also check `.dockerignore` so secrets are not copied into image build context.

## Template Contract

Use `.env.template` as the committed contract:

```env
DATABASE_URL=
KEYCLOAK_ISSUER=
KEYCLOAK_CLIENT_ID=
```

Rules:

- Blank values only.
- Add comments only when they do not reveal private infrastructure.
- Use stable names aligned with application config.
- Update docs/AGENTS.md with key names and purpose, not values.

## Dockerfile / Compose

- Do not bake secrets with `ARG`, `ENV`, `COPY .env`, or generated config files.
- Prefer runtime env injection.
- For local Compose, `env_file: .env` is acceptable only when `.env` is ignored and `.env.template` documents the keys.
- For Docker Swarm/Compose secrets, mount secrets as files and pass file paths when the app supports them.
- Do not use `environment:` for real secret values in committed Compose files.

## Tests and Local Dev

- Prefer isolated test config using non-secret dummy values.
- Do not commit real `.env.test` values.
- If tests need env vars, document keys in `.env.template` and test setup docs.

## Rotation / Incident Rules

If a secret appears in git, logs, issue text, screenshots, or artifacts:

1. Stop and report leak location and scope.
2. Do not repeat the value.
3. Recommend immediate rotation.
4. Remove the value from future files/output only with explicit approval.
5. Record follow-up without exposing the secret.

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
