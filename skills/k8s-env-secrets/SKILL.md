---
name: k8s-env-secrets
description: "Manage Kubernetes env vars and secrets safely. Use for Secrets, ConfigMaps, manifests, Helm values, External Secrets, Sealed Secrets, SOPS, or secret-bearing deployment config."
license: MIT
---

# Kubernetes Env and Secrets

Use for Kubernetes `Secret`, `ConfigMap`, env vars, Helm values, External Secrets, Sealed Secrets, SOPS, or secret-bearing deployment config. Non-DevOps agents should delegate this work to `@devops`.

## Hard Rules

- Never commit real secret values, generated Secret YAML with real data, kubeconfigs, tokens, private keys, certificates with private keys, or decrypted secret files.
- Never paste real secret values into reports, docs, `AGENTS.md`, logs, or chat.
- `ConfigMap` is for non-secret config only.
- `Secret` objects are base64-encoded, not encrypted by default; treat them as sensitive.
- Prefer a GitOps-safe secret workflow before production use.
- If a value is unknown, document the key and required source; do not invent values.
- If a real secret is already committed, stop, report leak risk, and recommend rotation.

## Preferred Production Options

Choose one explicitly and document ownership/rotation/apply flow in `AGENTS.md` without values:

1. External Secrets Operator pulling from a real secret manager.
2. SOPS-encrypted manifests with age/KMS and restricted decryption keys.
3. Sealed Secrets when cluster-bound encrypted manifests are acceptable.
4. Manual `kubectl create secret ...` only for local/dev or explicitly accepted operational workflows.

## Safe Manifest Pattern

- Commit non-secret config in `ConfigMap`.
- Commit templates/placeholders for required secret keys, not values.
- Reference secrets via `envFrom`, `secretKeyRef`, mounted files, or Helm values that are supplied outside git.
- Keep secret names stable and environment-specific.
- Validate manifests with dry-run/diff where possible before apply.

Example reference only:

```yaml
env:
  - name: DATABASE_PASSWORD
    valueFrom:
      secretKeyRef:
        name: app-database
        key: password
```

## Local / Dev

- Local dummy values may live in ignored files.
- Provide `.env.template`, `values.template.yaml`, or README instructions with key names only.
- Do not put local real values into committed Helm values or manifests.

## Validation

Before handoff, check as applicable:

- secret-bearing files are ignored or encrypted;
- committed manifests contain key names, not values;
- pods reference expected Secret/ConfigMap names and keys;
- rollout can fail fast when required keys are missing;
- apply/dry-run command is documented;
- rotation owner and process are documented.

## AGENTS.md Update Trigger

If you introduce/change Kubernetes secret handling, update `AGENTS.md` with:

- chosen secret mechanism;
- where real values live;
- key names and purpose only;
- local/dev setup;
- production apply/rotation owner;
- commands for safe validation/dry-run.

Agents without edit permission must return `AGENTS.md update required` with exact text.

## Final Report

```md
Secret/config keys changed:
Mechanism chosen:
Files updated:
Validation run:
Real values exposed: yes/no
Rotation/follow-up needed:
AGENTS.md status:
```
