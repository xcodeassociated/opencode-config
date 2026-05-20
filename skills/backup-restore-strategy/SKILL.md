---
name: backup-restore-strategy
description: "Design backup and restore for on-prem Docker/k8s systems. Use before stateful changes, upgrades, migrations, or production readiness review."
license: MIT
---

# Backup and Restore Strategy

Use before risky changes to databases, volumes, clusters, or identity systems.

## Required Decisions

- RPO: acceptable data loss.
- RTO: acceptable restore time.
- Backup scope: DB, object storage, PVCs, config, secrets, realm exports, manifests.
- Storage: local, offsite, immutable, encrypted.
- Retention: daily/weekly/monthly and legal constraints.
- Restore target: same cluster, new cluster, local drill.

## Rules

- A backup is not valid until restored in a drill.
- Prefer logical DB backups plus PVC snapshots when both are useful.
- Store secrets and encryption keys outside the backup set, but recoverably.
- Document exact restore commands.
- For k8s, include namespace, CRDs, operator-managed resources, and PVC dependencies.
- For Proxmox, consider VM/LXC snapshots separately from application-level backups.

## Output

```md
Data protected:
RPO/RTO:
Backup method:
Restore method:
Drill cadence:
Encryption/offsite:
Risks:
Approval needed:
```
