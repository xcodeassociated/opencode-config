---
name: docker-always
description: "Use Docker/Compose for reproducible local and deployable services. Apply for Spring, React, DBs, Keycloak, and supporting services."
license: MIT
---

# Docker Always

Use Docker for reproducible runtime environments.

## Rules

- Add `.dockerignore`.
- Build minimal images.
- Run as non-root when practical.
- Use healthchecks for services.
- Externalize config and secrets.
- Use Compose profiles for optional services.
- Avoid baking secrets into images.
- Prefer multi-stage builds.

## Spring Image Notes

- Build jar with Gradle/Maven.
- Runtime image should only contain runtime artifacts.
- Expose actuator health if available.
- Pass profile/config through env.

## Frontend Image Notes

- Build with Bun.
- Serve static assets through Nginx/Caddy or app platform.
- Keep API base URL configurable.

## Output

```md
Images changed:
Compose services:
Healthchecks:
Config/secrets:
Build command:
Run command:
```
