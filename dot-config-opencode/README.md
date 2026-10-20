# OpenCode — mandatory todos and plan approval; one `build` agent definition with optional self-delegation

This package extends your existing OpenCode setup with required todo planning for all configured agents and human review of significant plans, without creating a `build-worker` or any other coding-agent identity. Your vLLM, `researcher` agent / Firecrawl-first guard, and existing delegation/tool configurations are otherwise preserved.

**Terminology:** `build` is the OpenCode agent ID; references to the coding assistant explicitly use **`build` agent**. A *software build* or *build command* means compiling/packaging the application. The config IDs (`build`, `plan`, `researcher`) and executable commands remain unchanged.

## New: mandatory todo plans and human review

- Global `~/.config/opencode/AGENTS.md` now tells **every interactive/delegated agent** (primary `build` agent, delegated `build` agent, built-in `plan` agent, `researcher` agent) to create a right-sized todo plan at the beginning of every task, follow the steps and update them immediately when unexpected facts/problems arise. Even a one-off question gets a tiny plan.
- Both global and per-agent `permission.todowrite: "allow"` explicitly expose OpenCode's built-in `todowrite`/`todoread` tools. This is important for delegated `build` agent and `researcher` agent sessions, as subagent todo tools can otherwise be hidden. If using an older OpenCode build that still hides todo tools in subagents, the fallback is a short written plan; upgrade OpenCode for tool-based subagent plans.
- For **major code changes** or **material missing domain/product knowledge**, agents must prepare a concrete plan and get **explicit human approval before implementation**. The primary interactive agent asks via the built-in `question` tool with `Approve plan`, `Revise plan`, and `Cancel / stop` choices. OpenCode automatically includes **Type your own answer**, which must remain enabled. Feedback is not implicit approval.
- Nested agents **escalate** plan approval needs to the primary `build` agent instead of issuing interactive questions from nested Task sessions. A material change after approval requires a revised plan and new approval. Routine minor fixes do not require approval, but still need a todo plan.
- `todowrite` and approval-gate behavior are **prompt instructions**, not fail-closed runtime guards. This setup does not automatically detect whether a diff is major. It also does not modify the global `edit` permission to ask for every change.

## Key changes

- `agent.build.mode: "all"` — the same built-in `build` agent definition is usable as the primary agent and as a Task target.
- `agent.build.permission.task` allows `build` and `researcher` only (all other Task targets denied). All `build` agent sessions, even nested ones, receive the same agent-level permissions.
- `subagent_depth: 3` — permits `build -> build -> build -> researcher`. There is a real depth limit to reduce runaway recursion; it is not a concurrency limit. Once the limit is reached, a session cannot spawn further tasks.
- Removed `agent.build-worker` and the `agents/build_worker_prompt.txt` file. No new coding agent configuration.
- Updated global `AGENTS.md`, `researcher` agent prompt and iterative development skill to allow the same `build` agent to delegate carefully and consult the `researcher` agent at permitted depths.

**Important technical distinction:** OpenCode's Task tool always creates a child/subagent *session*. `mode: "all"` makes it the identical `build` *agent*, not a separate `build-worker`. It has an independent conversation/context window; it is not an independently switched primary session.

## Intended behavior

| Request | Expected approach |
| --- | --- |
| Ordinary bug fix or feature | Single `build` agent handles it |
| Backend + frontend or multiple independent services | The `build` agent optionally delegates an independent scoped component to another `build` agent instance |
| Big logs/debugging investigation | The `build` agent optionally delegates diagnosis to a child `build` agent instance |
| Login, UI or E2E verification | A delegated `build` agent can run Playwright against the application |
| Nontrivial Docker/Kubernetes/CI work | The `build` agent can delegate a bounded DevOps component |
| Online docs, external facts, current releases | The `researcher` agent only, invoked by any `build` agent at an allowed depth |
| Local/staging API calls or auth testing | The `build` agent can use curl/wget/HTTP/browser tools directly |
| Fetching online docs with curl or using browser for web research | Not allowed for the `build` agent; use the `researcher` agent |

By default the `build` agent instructions favor direct implementation, usually at most one other `build` agent instance if needed, and nested `build` agent delegation only for genuinely distinct work. These are **agent behavior instructions, not concurrency enforcement**.

## `researcher` agent behavior

Firecrawl-first remains protected by the original `plugins/firecrawl-first-guard.js`: Firecrawl retrieval is required before SearXNG/websearch fallbacks. One useful source is normally sufficient; there is no mandatory second-source requirement. The `researcher` agent remains read-only, cannot use bash/edit or Task, and can ask questions when invoked directly by the primary `build` agent.

For nested research (`build -> build -> researcher`), the caller tells the `researcher` agent to return clarification requests rather than call `question`, because nested question routing has been reported problematic in some versions. The `build` agent relays unanswered requirements to the primary session.

## Installation

1. Back up `~/.config/opencode/`.
2. Copy `opencode.json`, `AGENTS.md`, `agents/researcher_prompt.txt`, and other included folders into that configuration directory, merging existing unrelated files rather than deleting them.
3. If you installed the previous package, **delete the obsolete `~/.config/opencode/agents/build_worker_prompt.txt`**. The new JSON no longer references it (keeping the orphan file would not itself configure an agent).
4. Restart OpenCode and start a fresh session.
5. `AGENTS.md` at `~/.config/opencode/AGENTS.md` is automatically loaded as global rules; it does not need an explicit `instructions` entry.

## Static/runtime checks

```sh
python3 -m json.tool ~/.config/opencode/opencode.json >/dev/null
opencode debug agent build
opencode debug agent researcher
```

Check that the `build` agent has mode `all`, the Task allowlist contains `build` and `researcher`, and `todowrite` is allowed for the `build` and `researcher` agents and globally. Then try:

1. "Fix a localized bug without delegating." → Should stay in one `build` agent session.
2. "Implement these independent backend and frontend changes; delegate the backend portion to another build agent." → Task target should be `build`, not `build-worker`.
3. "In the delegated `build` agent session, look up the official docs for the current API through researcher." → Expected `build -> build -> researcher`, Firecrawl first.
4. "Call the running local API with curl to check its response." → Direct command by the `build` agent is permitted.
5. "Find current Kubernetes documentation using curl." → The `build` agent should delegate to the `researcher` agent instead.

The artifact was statically verified, but a live OpenCode session and MCP services were **not** executed here. Depth and Task behaviors depend on installed OpenCode version. The documented `subagent_depth` key applies to the current V1 configuration; OpenCode V2 uses `experimental.subagent_depth` instead.

## Documentation

- https://opencode.ai/docs/agents/ — agent modes, Task and todo permissions
- https://docs.opencode.ai/docs/tools/ — built-in `question` with custom answers
- https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/tool/task.ts — delegated tool-permission logic
- https://opencode.ai/docs/config/ — depth configuration
- https://opencode.ai/docs/rules/ — global AGENTS.md
- https://opencode.ai/v2/docs/migrate-v1/ — V2 setting changes
