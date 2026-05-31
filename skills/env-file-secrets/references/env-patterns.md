# Env File Secret Patterns

## `.gitignore` contract

```gitignore
.env
.env.*
!.env.template
!.env.*.template
!.env.example
```

Also check `.dockerignore` so secrets are not copied into image build context.

## Template contract

Use `.env.template` or `.env.example` as the committed key contract.

```env
DATABASE_URL=
KEYCLOAK_ISSUER=
KEYCLOAK_CLIENT_ID=
```

Rules:

- blank values by default;
- comments only when they do not reveal private infrastructure;
- stable names aligned with application config;
- docs/`AGENTS.md` may mention key names and purpose, not values.
