---
name: local-dev-compose
description: "Create local Docker Compose environments for development. Use for app dependencies, DBs, Keycloak, Kafka, and reproducible testing."
license: MIT
---

# Local Dev Compose

Use for reproducible local dependencies.

## Rules

- Compose should make local startup predictable.
- Keep app outside Compose for fast dev unless full-stack Compose is explicitly useful.
- Use profiles for optional services.
- Overrides are allowed when they reduce duplication or support local differences.
- Add healthchecks and dependency readiness.
- Use named volumes for stateful dev data.
- Do not store secrets in Compose files; use ignored `.env` files and committed `.env.template` with blank values only.

## Services to Consider

- PostgreSQL/MongoDB/Redis.
- Keycloak.
- Kafka/Redpanda if event-driven.
- Mailhog/test SMTP.
- App service for demo/CI profile.

## Output

```md
Services:
Profiles:
Env vars:
Healthchecks:
Startup command:
Reset command:
Limitations:
```
