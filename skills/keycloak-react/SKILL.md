---
name: keycloak-react
description: "Integrate React/Vite apps with Keycloak. Use for auth flows, route guards, token handling, roles, refresh, and frontend security."
license: MIT
---

# Keycloak React

Use for React/Vite Keycloak integration.

## Rules

- Use Authorization Code + PKCE through Keycloak JS or a maintained wrapper.
- Avoid localStorage for tokens when possible; understand XSS risk if used.
- Handle refresh failure and logout cleanly.
- Guard routes by auth state and role/claim.
- Do not trust frontend roles for backend authorization.
- Keep realm/client config environment-specific.
- Verify current Keycloak JS/API behavior through `@researcher` when versions matter.

## Checks

- Login/logout redirect URIs.
- Silent refresh or refresh strategy.
- 401/403 UI behavior.
- Token expiry handling.
- Role/claim mapping.
- CORS and allowed origins.

## Output

```md
Client config:
Auth flow:
Token storage:
Route guards:
Role mapping:
Backend expectations:
Risks:
```
