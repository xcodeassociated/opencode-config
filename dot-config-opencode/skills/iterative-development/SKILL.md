---
name: iterative-development
description: Implement larger features or refactors in verifiable increments; optional narrowly scoped delegation to another `build` agent instance for independent workstreams.
license: MIT
---

# Iterative development

For **every task**, including trivial edits, first create a right-sized plan with built-in `todowrite`; one or two tasks is enough for small work. Maintain step statuses throughout execution. For multi-file or risky tasks, break the work into verifiable increments. After each meaningful slice, run focused checks; update the todo plan immediately when tests, requirements or assumptions reveal new work. Avoid unrelated refactors. **Before implementation of any major code/architecture change, or when material product/domain knowledge is lacking, request human approval of the plan using `question`** (with its default custom-answer option). Do not require routine approval for ordinary steps inside an already approved scope. Nested agents must route approval requests to the primary `build` agent rather than prompting interactively.

**Direct implementation is the default.** Delegate one sharply bounded component, log investigation, independent test, or DevOps workstream to a child `build` agent instance only if the benefit from separate context or independent verification outweighs the coordination overhead. Assign non-overlapping files/environment ownership. The primary `build` agent integrates results and verifies the final behavior. A delegated `build` agent may directly call the `researcher` agent for external questions and can selectively delegate to another `build` agent if allowed by the configured nesting limit; do not create unnecessary recursive chains.

Use the `researcher` agent for current external facts, not for ordinary code inspection. Use HTTP/browser tooling directly for application development and testing, not for web research. Summarize code changes, validation, and remaining risks at completion.
