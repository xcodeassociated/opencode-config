---
name: k8s-env-secrets
description: "Manage Kubernetes env vars and secrets safely. Use for Secrets, ConfigMaps, manifests, Helm values, External Secrets, Sealed Secrets, SOPS, or secret-bearing deployment config."
license: MIT
---

# Kubernetes Env and Secrets

## Reference Files

Read supporting files only when needed, resolving paths relative to this SKILL.md directory.
- `references/k8s-secret-patterns.md` — safe Kubernetes Secret/ConfigMap/Helm manifest examples.

Use for Kubernetes `Secret`, `ConfigMap`, env vars, Helm values, External Secrets, Sealed Secrets, SOPS, or secret-bearing deployment config.

## Hard Rules

- Never commit real secret values, generated Secret YAML with real data, kubeconfigs, tokens, private keys, certificates with private keys, or decrypted secret files.
- Never paste real secret values into reports, docs, `AGENTS.md`, logs, or chat.
- `ConfigMap` is for non-secret config only.
- Kubernetes `Secret` objects are base64-encoded, not encrypted by default; treat them as sensitive.
- Prefer a GitOps-safe secret workflow before production use.
- If a value is unknown, document the key and required source; do not invent values.
- If a real secret is already committed, stop, report leak risk, and recommend rotation.

## Preferred Production Options

Choose one explicitly and document ownership/rotation/apply flow in `AGENTS.md` without values:

1. External Secrets Operator pulling from a real secret manager.
2. SOPS-encrypted manifests with age/KMS and restricted decryption keys.
3. Sealed Secrets when cluster-bound encrypted manifests are acceptable.
4. Manual `kubectl create secret ...` only for local/dev or explicitly accepted operational workflows.

## Safe Manifest Rules

- Commit non-secret config in `ConfigMap`.
- Commit templates/placeholders for required secret keys, not values.
- Reference secrets via `envFrom`, `secretKeyRef`, mounted files, or Helm values supplied outside git.
- Keep secret names stable and environment-specific.
- Validate manifests with dry-run/diff where possible before apply.

## Local / Dev

Use ignored local files or committed templates with key names only. Do not put local real values into committed Helm values or manifests.

## Validation

Check that secret-bearing files are ignored or encrypted, committed manifests contain key names not values, pods reference expected Secret/ConfigMap names/keys, rollout fails fast when keys are missing, dry-run/diff is documented, and rotation ownership is documented.

## AGENTS.md Update Trigger

If Kubernetes secret handling changes, update `AGENTS.md` with mechanism, where real values live, key names/purpose only, local/dev setup, production apply/rotation owner, and validation/dry-run commands. Agents without edit permission return `AGENTS.md update required` with exact text.

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
