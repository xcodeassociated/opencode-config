---
name: k8s-operators-first
description: "Prefer Kubernetes operators for complex/stateful workloads. Use for Keycloak, Kafka/Strimzi, databases, Longhorn, and production k8s services."
license: MIT
---

# Kubernetes Operators First

Use for complex or stateful k8s platforms.

## Rules

- Prefer mature operators for stateful systems.
- Verify CRD versions and operator compatibility.
- Use Helm/plain manifests for simple stateless apps when operators add no value.
- Back up before operator upgrades that touch state.
- Use manual approval for risky operator upgrades.
- Validate with diff/dry-run before apply.

## Good Operator Fits

- Keycloak Operator for Keycloak.
- Strimzi for Kafka.
- CloudNativePG for PostgreSQL.
- Longhorn for storage.
- cert-manager for certificates.
- External Secrets / Sealed Secrets / Vault operators for secrets.

## Keycloak Note

Prefer the official Keycloak Operator. For OLM installs, use manual approval for upgrades. For vanilla k8s without OLM, verify official CRDs and operator manifests for the target version.

## Output

```md
Workload:
Operator choice:
CRDs/version:
Install/upgrade plan:
Backup/rollback:
Validation:
Risks:
```
