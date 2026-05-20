---
name: api-contract-testing
description: "Define and verify API contracts between frontend, backend, and clients. Use for changed endpoints, DTOs, auth behavior, or generated clients."
license: MIT
---

# API Contract Testing

Use before changing or testing cross-boundary API behavior.

## Rules

- Treat the contract as a product boundary, not an implementation detail.
- Prefer OpenAPI for REST. Use Pact only when consumer/provider drift is a real risk.
- Include auth requirements, error responses, pagination, sorting, and validation failures.
- Update generated clients only after contract changes are intentional.
- Contract tests should run before broad E2E tests.

## Backend Checklist

- Request/response DTOs match contract.
- HTTP status codes are explicit.
- Validation errors have stable shape.
- Authn/authz cases are specified: 401, 403, wrong owner, wrong role.
- Pagination and sorting parameters are documented.
- Breaking changes are called out.

## Frontend Checklist

- Client types match contract.
- UI handles loading, empty, success, validation error, authorization error, and server error states.
- No ad-hoc response parsing when a typed client exists.

## Output

```md
Contract source:
Changed endpoints:
Breaking changes:
Tests to run:
Client update needed:
Risks:
```
