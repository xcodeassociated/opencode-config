---
name: url-state-encoding
description: "Encode UI state in URLs safely. Use for filters, pagination, sort, tabs, shareable links, and browser navigation."
license: MIT
---

# URL State Encoding

Use for frontend state that should survive reload/share/back navigation.

## Put in URL

- Search filters.
- Pagination and sorting.
- Tabs/views.
- Lightweight selections.
- Shareable report/list state.

## Do Not Put in URL

- Secrets or tokens.
- Sensitive PII.
- Large payloads.
- Ephemeral form drafts unless explicitly required.

## Rules

- Define a schema for query params.
- Provide defaults.
- Validate and sanitize on read.
- Keep URLs human-readable when practical.
- Version encoded state if complex.
- Debounce updates for text search.

## Output

```md
State fields:
Query params:
Defaults:
Validation:
Privacy risks:
Tests:
```
