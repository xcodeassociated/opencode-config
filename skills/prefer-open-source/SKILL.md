---
name: prefer-open-source
description: "Prefer open-source and on-prem-capable tools. Use when choosing services, dependencies, CI/CD, observability, and infrastructure."
license: MIT
---

# Prefer Open Source

Use for tool and platform choices.

## Rules

- Prefer self-hostable open-source tools.
- Avoid SaaS lock-in unless it has clear value and human approval.
- Check license compatibility for production use.
- Prefer tools that work with Docker/Compose and k8s.
- Evaluate operational cost, not only feature list.

## Decision Template

```md
Need:
Open-source option:
Alternative:
License:
Operational cost:
Security/maintenance:
Recommendation:
```

## Examples

- GitLab CE, Forgejo/Gitea, Woodpecker, Drone, Jenkins.
- Prometheus, Grafana, Loki, Tempo, OpenTelemetry.
- Keycloak, Strimzi, CloudNativePG, Longhorn.
