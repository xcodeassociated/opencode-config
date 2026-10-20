# Kubernetes Secret Reference Patterns

Example reference only. Do not commit real values.

```yaml
env:
  - name: DATABASE_PASSWORD
    valueFrom:
      secretKeyRef:
        name: app-database
        key: password
```

Useful template artifacts:

- `values.template.yaml` with key names/placeholders only;
- README/`AGENTS.md` setup instructions with no values;
- ExternalSecret/SealedSecret/SOPS manifests only when encrypted or value-free according to the chosen workflow.
