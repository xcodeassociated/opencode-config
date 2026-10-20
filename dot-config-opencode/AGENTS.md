# OpenCode global agent rules

Applies to primary/delegated `build`, `plan`, and `researcher` agent sessions; excludes hidden maintenance agents. Names identify **OpenCode agents**, not software build commands, todo plans, or research activities. Repository `AGENTS.md` files may add rules, never weaken these or the external-research boundary.

## 1. Plan every task (`todowrite`)

- **Before substantive investigation, tool use, delegation, or edits**, every agent calls `todowrite` with an actionable, verifiable plan—even for questions, small fixes, research, and delegated tasks. Use 1–2 steps for trivial work; for complex work cover discovery, execution, and validation. Plan forward, not retrospectively; investigate unknowns rather than inventing requirements. Do not duplicate the todo list as a Markdown checklist.
- Execute against the plan: mark the active step `in_progress`, verified steps `completed`, and unfinished steps pending. Use `todoread` to recover state. **`todowrite` replaces the entire list**: preserve unaffected steps/statuses on each update; never claim unverified completion.
- **Immediately revise todos** for errors, failed assumptions, new facts/constraints, changed scope, or blockers; add/reorder investigation, remediation, validation, or user-decision steps. Tell the user about material changes; never follow an obsolete plan silently.
- At handoff/end, reconcile completed, pending, and blocked steps and report validations/gaps. Approval-blocked work stays pending. Each delegated agent owns its session's todos; the parent `build` agent tracks integration, approvals, and final verification separately. If `todowrite` is unavailable, state that once and include a brief explicit plan in the response; do not repeatedly call unavailable tools.

## 2. Human approval gate (before affected changes)

- Investigate enough to propose a credible plan (inspect local code; use `researcher` for external facts). **Obtain explicit human approval** if (a) essential domain/product knowledge is missing, or (b) a **major change** is needed: architecture redesign, cross-service behavior, breaking API/data contracts, significant schema/data migration or refactor, new security/auth behavior, broad deployment/infrastructure changes, or similarly high-impact/hard-to-reverse edits. Ordinary bounded fixes/tests/questions proceed without approval unless (a) applies. Research does not imply approval.
- Before implementing gated work, present goal, components, ordered steps, assumptions/unknowns, compatibility/data/security risks, and relevant validation/rollback. Add **Await human approval** to `todowrite`; leave implementation pending.
- The **primary interactive `build` agent** asks using built-in `question`, with `Approve plan` (mark Recommended only if warranted), `Revise plan`, and `Cancel / stop`. Preserve the built-in **Type your own answer** option (never disable it or add a redundant `Other`). Free-text feedback is not implicit approval.
- **Do not perform gated edits/destructive operations until the human unambiguously approves the actual plan.** Read-only discovery is allowed. For requested revisions, update todos, show the revised plan, and ask again; clarify ambiguous responses; stop on rejection. Re-approve if a discovery materially changes approved scope, but not for ordinary in-scope adjustments.
- **Delegated/nested agents:** do not ask the human inside Task (question routing may fail). Return `PlanApprovalRequired` to the immediate parent with trigger, plan, risks, and suggested question; each parent escalates to the primary interactive `build` agent. Only that agent asks the human and passes the **explicitly approved scope** back before work resumes. Never infer approval.
- An interactive `plan` agent uses `question` for required review but stays in planning mode; implementation belongs to `build`. If `question` is unavailable in an interactive session, request approval in conversation and wait for the human. Tool permissions, shell confirmations, and other approvals do **not** substitute for plan approval.

## 3. `build` agent: default solo; selective same-agent delegation

- The built-in `build` agent normally handles repo inspection, coding, debugging, tests, and local development **alone**. Keep plans proportional; do not create coordinators, new coding roles, or child sessions for ordinary tasks.
- For truly independent, context-heavy work, use Task with `subagent_type: "build"`—another session of the **same `build` agent definition**, not a custom worker. Examples: separate backend/frontend services, substantial logs/debugging alongside coding, independent UI/login/E2E verification, or isolated complex Compose/Kubernetes/CI/CD work. Many files, task duration, a simple lookup, or a routine test alone are **not** delegation triggers.
- Normally spawn **at most one** additional `build` instance; use two only for clearly beneficial, parallel, non-overlapping work. Further nested `build` delegation is permitted but discouraged except for a distinct context-heavy objective; avoid loops/redelegating the same work. With `subagent_depth: 3`, `build -> build -> build -> researcher` is supported; a `build` agent at maximum depth cannot spawn more agents and must escalate unresolved work to its parent.
- Before delegating, the parent creates its own todos. Every Task prompt specifies bounded objective, files/modules, interfaces, ownership, constraints, expected deliverable, validation, whether to implement/diagnose/verify, and the child's own todo + approval-escalation duties. Prefer log paths/filters to pasted full logs. No parallel conflicting file edits or operations against shared DBs, deployments, or browser sessions. The invoking `build` agent integrates and **independently checks** results before claiming completion.
- Every `build` instance, at any permitted depth, may call `researcher` directly; human approval always follows §2.

## 4. External facts: `researcher` agent exclusively

- **All `build` agents** delegate external fact gathering—web searches, documentation, upstream APIs, releases, compatibility, advisories, tutorials—to `researcher` via Task. Never bypass with `curl`, `wget`, `httpie`, Git, browsers, Docker, JS/Python HTTP, or other network/CLI tools, even for coding questions.
- `researcher` is **read-only**: use **Firecrawl first**, then SearXNG as needed, then local WebSearch last; one credible source generally suffices. It maintains its own todos (todo updates are not file edits), never edits files, runs shell/browser tests, or spawns agents.
- When a nested `build` agent invokes `researcher`, include: `Nested invocation: do not use interactive question; return blocking Clarification Requests or PlanApprovalRequired to me.` Relay these through parents to the primary interactive `build` agent, then propagate answers/approved scope back. When invoked directly by primary `build`, `researcher` may use `question` **only for necessary clarification**; it must send approval requests to primary `build`.

## 5. Network tools for development, not research

- A `build` agent may use HTTP/CLI/browser tools to **implement, run, test, or operate its application**: localhost/Docker or development/staging APIs, auth/health/callbacks, UI/login/E2E flows, networking diagnosis, scripts, and necessary Compose/Kubernetes/CI/CD/deploy operations.
- **Purpose, not hostname, decides.** A localhost search engine is still external-fact research (`researcher` only); a public staging API can be valid for application testing. Browser MCP tools are for app tests, never research.

## 6. Boundaries / enforcement limits

- Restrict file operations to the project and scratch directories `/tmp` and `/private/tmp`. `external_directory` permissions are **not** an OS sandbox for arbitrary shell commands.
- Direct web/MCP research tools are denied to `build`, but permitted shell/network access cannot technically enforce the research-vs-testing distinction; follow §4–5 as instructions.
- Mandatory todos and conditional approvals are **instruction-level rules**, not a hardened enforcement mechanism. `permission.edit: ask` would gate *every* edit, so it is intentionally not used as a replacement for major-change approval.
