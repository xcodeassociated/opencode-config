---
name: ci-cd-pipeline
description: "Design provider-neutral CI/CD for on-prem code, containers, tests, deploy readiness, and rollback. Use for production pipeline work."
license: MIT
---

# CI/CD Pipeline

Use for pipeline design or changes.

## Provider-Neutral Defaults

Works with GitLab CE, Forgejo/Gitea Actions, Woodpecker, Drone, Jenkins, Argo CD, or Flux. Do not assume GitHub Actions.

## Pipeline Stages

1. Checkout and cache.
2. Backend test/check/build.
3. Frontend install/typecheck/lint/test/build with Bun.
4. Contract tests when APIs changed.
5. Build container image.
6. Scan image/dependencies/secrets where tooling exists.
7. Generate SBOM when required.
8. Push image with immutable tag.
9. Render/diff manifests or Helm chart.
10. Deploy only after approval unless environment is explicitly non-production.

## Rules

- Fail fast on tests and type checks.
- Keep deploy separate from build.
- Use immutable image tags; avoid `latest` for deployment.
- Externalize secrets.
- Every deployment has rollback instructions.
- Prefer GitOps for k8s production when available.

## Output

```md
Pipeline provider:
Stages:
Artifacts:
Secrets required:
Deploy gate:
Rollback:
Risks:
```
