---
name: prefer-keycloak
description: "Prefer Keycloak for identity and SSO. Use for authn/authz planning, realm/client setup, roles, tokens, and deployment implications."
license: MIT
---

# Prefer Keycloak

Use Keycloak as the default identity provider for on-prem apps.

## Rules

- Use Keycloak for authentication, SSO, clients, realms, roles, groups, and identity federation.
- App-level authorization still belongs in the application when domain rules require it.
- Keep realm config as code/export when practical.
- Do not hardcode client secrets.
- Use OIDC Authorization Code + PKCE for browser apps.
- Use service accounts/client credentials only for machine-to-machine flows.

## Deployment Notes

- Prefer official Keycloak container/operator paths.
- Back up database and realm config before upgrades.
- Use TLS and correct proxy headers in production.

## Output

```md
Realm/client:
Flow:
Roles/claims:
App authorization:
Secrets/config:
Deployment notes:
```
