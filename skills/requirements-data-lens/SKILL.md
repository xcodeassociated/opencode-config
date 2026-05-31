---
name: requirements-data-lens
description: "Analyze requirements through a data lens. Use before planning features to surface entities, lifecycle, volumes, read/write patterns, consistency, reporting, and compliance."
license: MIT
---

# Requirements Data Lens

Do not invent business requirements. Surface missing facts as clarification requests.

Use before feature/greenfield planning.

## Questions to Surface

- What entities are implied?
- What relationships exist?
- What is the lifecycle of each entity?
- What data is created, updated, deleted, archived, or retained?
- What uniqueness and invariants are implied?
- What volumes and read/write patterns are expected?
- What query/search/reporting shapes need denormalized or cross-aggregate data?
- What read-after-write consistency or acceptable staleness is required?
- What reporting/export/admin views are implied?
- Is there PII, financial, health, or regulated data?

## Rules

- Do not design architecture.
- If a split write/read model is being considered, load `spring-data-jpa-read-write-models` and return requirements/risks/clarification requests only. Capture whether a regular view or materialized-view semi-read model would satisfy the use case before writable read tables or external stores.
- Produce questions and data constraints.
- Mark assumptions and `# VERIFY` items; ask/route clarification for assumptions that could materially affect work.
- Use `@researcher` for regulatory facts.

## Output

```md
Entities:
Relationships:
Lifecycle gaps:
Volume assumptions:
Invariants:
Reporting needs:
Read freshness/staleness needs:
Read/write split risks:
Compliance flags:
Clarification requests for immediate invoker or human-facing orchestrator:
```
