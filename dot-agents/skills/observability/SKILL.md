---
name: observability
description: "Add or review logs, metrics, traces, health checks, dashboards, and alerts. Use for production readiness and changed behavior."
license: MIT
---

# Observability

Use before production handoff or when behavior changes.

## Rules

- Add observability where it helps operate the feature.
- Do not log secrets, tokens, passwords, or sensitive PII.
- Use correlation/request IDs across boundaries.
- Prefer structured logs.
- Metrics should have bounded label cardinality.
- Traces should include external calls and async boundaries.
- Alerts must be actionable.

## Spring Checks

- Actuator health/readiness/liveness.
- HTTP metrics.
- DB/client metrics where useful.
- Error logging with context.
- OpenTelemetry only after verifying current exporter/config needs.

## Frontend Checks

- Error boundary/reporting.
- User-visible failure states.
- Performance only where relevant.

## Output

```md
Logs:
Metrics:
Traces:
Health checks:
Dashboards/alerts:
Gaps:
```
