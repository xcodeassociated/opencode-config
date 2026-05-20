---
name: markdown-mermaid-artifacts
description: "Create concise Markdown and Mermaid architecture artifacts. Use for design docs, handoffs, flows, sequence diagrams, and decisions."
license: MIT
---

# Markdown Mermaid Artifacts

Use for lightweight architecture documentation.

## Rules

- Diagrams must answer a specific question.
- Keep Mermaid small enough to render reliably.
- Prefer one diagram per concept.
- Use text for decisions; diagrams for relationships/flow.
- Include assumptions and unresolved questions.
- Check Mermaid syntax when possible.

## Useful Diagrams

- C4-style context/container sketch.
- Sequence diagram for API/workflow.
- State diagram for lifecycle.
- Flowchart for deployment or pipeline.
- ER-style sketch only for high-level data relationships.

## Template

```md
# Title

## Context
## Decision / Flow
```mermaid
flowchart TD
  A --> B
```
## Consequences
## Open Questions
```

## Output

Provide file path and purpose.
