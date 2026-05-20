---
name: secrets-security
description: "Handle secrets safely in code, Compose, k8s, and CI. Use before adding config, auth, credentials, tokens, env files, or deployment manifests."
license: MIT
---

# Secrets Security

Use whenever secrets or sensitive config are involved.

## Rules

- Never commit real secrets.
- Use env vars, secret stores, or sealed/external secrets.
- For `.env`, Docker, or Compose env handling, load `env-file-secrets` when available.
- For Kubernetes Secret/ConfigMap workflows, load `k8s-env-secrets` when available and route the work to DevOps.
- `.env.template` may contain names, not values. Prefer `KEY=` with blank values.
- Do not use `.env.example` unless the repo already standardizes on it; if used, it must also contain names only, not values.
- K8s Secret values may be base64-encoded, but base64 is not encryption by itself.
- Do not put secret values in Kubernetes ConfigMaps.
- Enable encryption at rest or external secret management for sensitive clusters.
- Scan before handoff when risk exists: gitleaks/trufflehog/trivy where available.
- Do not print secrets in logs or reports.

## Options

- Local: ignored `.env` files plus committed `.env.template` with blank values only.
- Compose: `env_file`, Docker Compose secrets, or Docker secrets where appropriate.
- Docker build: BuildKit secret mounts, never `ARG`, `ENV`, or `COPY .env` for secrets.
- K8s: External Secrets, Sealed Secrets, Vault, SOPS, Secrets Store CSI, or secure manual Secret creation from ignored `.env` files.
- CI: masked/protected variables.

## Output

```md
Secret names:
Storage method:
Template/ignored files:
Rotation/owner:
Files checked:
Scan command/result:
Risks:
```
