---
name: requirements-data-lens
description: "Analyze requirements through a data lens. Use before planning features to surface entities, lifecycle, volumes, invariants, reporting, and compliance."
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
- What reporting/export/admin views are implied?
- Is there PII, financial, health, or regulated data?

## Rules

- Do not design architecture.
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
Compliance flags:
Clarification requests for immediate invoker or human-facing orchestrator:
```
