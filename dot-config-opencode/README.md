# OpenCode v2 configuration

Personal, global [OpenCode v2](https://opencode.ai/v2/docs/) configuration for a self-hosted vLLM model, a coding/research agent workflow, MCP integrations, and custom plugins.

This directory is intended to be installed at **`~/.config/opencode/`**. It is one half of the repository: the separate [`../dot-agents/`](../dot-agents/) directory installs to **`~/.agents/`** and holds reusable, tool-agnostic skills. See the [root README](../README.md) for the full repository layout and shared-skill installation.

## Files and responsibilities

```text
dot-config-opencode/               -> ~/.config/opencode/
├── opencode.json                  # V2 server config: model, agents, permissions, MCP, plugins
├── cli.json                       # Terminal-client appearance and session settings
├── AGENTS.md                      # Global instructions for all relevant agent sessions
├── .env.example                   # Environment-variable template (no credentials)
├── agents/
│   └── researcher.md              # Read-only researcher subagent definition
├── commands/
│   └── project-init.md            # Custom project initialization command
├── plugins/
│   ├── firecrawl-first-guard.js   # Checks direct research-tool call ordering
│   └── researcher-temperature.js  # Sets researcher temperature through a V2 hook
├── skills/                        # Five OpenCode-specific skills
│   ├── agents-md-init/
│   ├── agents-md-maintenance/
│   ├── developer-bug-fix/
│   ├── firecrawl-first/
│   └── iterative-development/
└── tests/
    └── firecrawl-first-guard.test.mjs
```

OpenCode also discovers compatible skills installed separately in `~/.agents/skills/`; there is no need to duplicate those files here.

## Installation

**Prerequisites:** OpenCode **v2**, a reachable vLLM OpenAI-compatible endpoint, and Bun/`bunx` for the enabled local MCP launch commands. The Firecrawl and SearXNG servers additionally require reachable services and suitable environment variables. Some integrations may need other runtime-specific dependencies.

From the **repository root**, with a backup of any existing installation:

```sh
mkdir -p "$HOME/.config/opencode" "$HOME/.agents"
rsync -av dot-config-opencode/ "$HOME/.config/opencode/"
rsync -av dot-agents/ "$HOME/.agents/"

# Create local environment settings only once.
[ -f "$HOME/.config/opencode/.env" ] || \
  cp "$HOME/.config/opencode/.env.example" "$HOME/.config/opencode/.env"
```

`rsync -av` merges directories but **overwrites same-named destination files**. It does not remove files no longer present in the repository; check for obsolete files from older installations (for example `agents/build_worker_prompt.txt`). Do not use `--delete` without reviewing the destination.

The `.env` file is only a template-derived local file. **OpenCode does not automatically source it as a shell script.** To start a shell-launched client with those variables:

```sh
set -a
. "$HOME/.config/opencode/.env"
set +a
opencode
```

OpenCode v2 has a shared background service: when it is already running, changing the client's shell environment may **not** change the service's environment. Check `opencode service status`, and ensure the **server process** receives the configured values before retrying. The [service commands](https://opencode.ai/v2/docs/cli/commands/) include `opencode service set env` and `opencode service restart`.

## vLLM model and settings

`opencode.json` selects the **`build`** agent by default and the following model:

| Setting | Configured value |
| --- | --- |
| Provider | `vllm` using `aisdk:@ai-sdk/openai-compatible` |
| Model | `vllm/qwen/qwen3.8-flash-next` |
| Provider base URL | `{env:OPENCODE_VLLM_BASE_URL}` |
| Model context limit (declared) | `524288` tokens |
| Model output limit (declared) | `32768` tokens |
| Reasoning effort (default) | `xhigh` |
| Available variants | `no-thinking`, `low`, `medium`, `xhigh` |
| Input / output capability | Text and images in; text out; tools and reasoning declared |

The limits and capabilities above are **client configuration declarations**, not measurements of your running vLLM server. The actual model, KV-cache capacity, context window, supported request fields and authentication requirements must match the endpoint. In particular, `opencode.json` does **not** currently specify an API key for this provider; if your endpoint requires bearer-token authentication, configure credentials separately before expecting requests to succeed.

## Agent workflow

### `build` (default)

`agents.build` in `opencode.json` uses `mode: "all"`: the same `build` agent definition can run interactively or in a delegated subagent session. No separate `build-worker` agent is defined.

- Implement ordinary changes in the primary `build` session.
- Delegate bounded, independent work to another `build` session when it provides a clear benefit.
- Delegate **external factual research** (documentation, releases, compatibility, web searches) to `researcher`; `build` may use networking/browser tools for **application development and testing**, not external research.
- Use `todowrite` on every task, with a plan proportional to the request.
- Request explicit human approval before major, high-impact changes or work blocked by essential domain/product knowledge. Delegated agents escalate approval requests to the primary interactive agent.

The corresponding requirements live in [`AGENTS.md`](./AGENTS.md). **Todo discipline and major-change approvals are agent instructions, not fail-closed authorization controls.** The configuration does not automatically identify all major changes or stop every unauthorized edit.

`experimental.todo: true` enables the V2 todo tool. `experimental.subagent_depth: 3` allows nested delegation beyond the default depth. **Depth is not a parallel-agent/concurrency limit**. Agent instructions discourage unnecessary nesting and overlapping writes.

### `researcher` (subagent)

[`agents/researcher.md`](./agents/researcher.md) defines the read-only research agent. It cannot edit files, run shell commands, or spawn other agents under its configured permissions. Its preferred retrieval sequence is:

1. **Firecrawl first** (`firecrawl_search`, `firecrawl_scrape`, or an appropriate developer-search tool).
2. **SearXNG** if Firecrawl fails or is insufficient.
3. **Local `websearch`** only as a last search fallback. For a known URL that Firecrawl cannot scrape, `webfetch` is an allowed fetching fallback.

A credible source is normally enough for a straightforward lookup; complex, contested or high-stakes questions may require further verification. The `researcher-temperature.js` plugin sets the researcher's request temperature to `0.1`.

When nested research needs a clarification or major-change approval, the researcher returns it to the caller rather than asking interactively from a deeply nested session.

## MCP servers

These values reflect **`opencode.json` as committed**, not a live connection check.

| Server | State | Mode | Role |
| --- | --- | --- | --- |
| `firecrawl` | Enabled | **Direct tools** (`codemode: false`) | Primary external research source |
| `searxng` | Enabled | **Direct tools** (`codemode: false`) | Research fallback |
| `playwright` | Enabled | Code Mode (`codemode: true`) | Application/browser testing |
| `shadcn` | Enabled | Code Mode (`codemode: true`) | UI component tooling |
| `chrome-devtools` | Disabled | Code Mode | Optional browser diagnostics |
| `duckduckgo` | Disabled | Direct tools | Optional search server, not in normal fallback sequence |

Firecrawl and SearXNG deliberately use **direct MCP tools**, not Code Mode. This keeps their calls visible to the Firecrawl-first hook and follows the researcher tool policy. Merely setting `codemode: false` does not grant those tools to `build`: agent permissions still apply.

The enabled local launch commands use `bunx`. Firecrawl, SearXNG, and other server dependencies must be accessible from the host running OpenCode. Check live connections with `opencode mcp list`.

## Plugins, command and skills

**Local plugins** in `~/.config/opencode/plugins/` are discovered by OpenCode v2. This repository has two:

- [`firecrawl-first-guard.js`](./plugins/firecrawl-first-guard.js): uses a V2 `execute.before` hook to reject direct SearXNG, DuckDuckGo, `webfetch` or `websearch` calls **until a recognized Firecrawl retrieval has been attempted in that session**. The guard checks ordering, **not success or quality**. It is not a general network firewall and cannot enforce policy inside opaque Code Mode tool calls.
- [`researcher-temperature.js`](./plugins/researcher-temperature.js): uses the V2 session-context hook to apply `temperature: 0.1` for the `researcher` agent.

The `plugins` array also declares the external **`opencode-cmux`** plugin. Availability and behavior depend on the installed OpenCode version and plugin package.

The custom [`commands/project-init.md`](./commands/project-init.md) command guides the `build` agent in creating or maintaining project-level `AGENTS.md`. The five [OpenCode-specific skills](./skills/) cover agent instructions, bug fixes, research discipline and incremental implementation; generic cross-tool skills live under `~/.agents/skills/`.

## Environment variables and credentials

Start from [`.env.example`](./.env.example). The active settings referenced by this repository's JSON are:

| Variable | Used for |
| --- | --- |
| `OPENCODE_VLLM_BASE_URL` | vLLM OpenAI-compatible base URL (normally including `/v1`) |
| `OPENCODE_FIRECRAWL_AI_API_URL` | Firecrawl MCP API endpoint |
| `OPENCODE_FIRECRAWL_AI_API_KEY` | Firecrawl MCP API key |
| `OPENCODE_FIRECRAWL_RETRY_MAX_ATTEMPTS` | Firecrawl retry setting |
| `OPENCODE_SEARXNG_AI_URL` | SearXNG MCP URL |

The template also contains `OPENCODE_FIRECRAWL_API_URL`, `OPENCODE_FIRECRAWL_API_KEY`, and `OPENCODE_SEARXNG_URL`, but **those three are not referenced by the current `opencode.json`**. Only the `*_AI_*` versions above are wired to the MCP configurations. Missing `{env:...}` values expand to empty strings; ensure required variables are present in the OpenCode **server's** environment.

**Never commit** actual `.env` files, API tokens, private keys or `service.json`. The v2 `service.json` password is for the OpenCode background service, **not** for vLLM. Keep a root `.gitignore` covering secret paths at any depth. If a password has been committed or disclosed, rotate it; removing the tracked file does not remove its history.

## Validation and troubleshooting

From the repository root:

```sh
# Syntax and isolated local plugin behavior
python3 -m json.tool dot-config-opencode/opencode.json >/dev/null
python3 -m json.tool dot-config-opencode/cli.json >/dev/null
node --test dot-config-opencode/tests/*.test.mjs

# Inspect the actual v2 installation (requires OpenCode installed)
opencode service status
opencode debug config
opencode debug agents
opencode models
opencode mcp list
opencode plugin list
```

The Node tests exercise plugin behavior in isolation; they **do not** prove that the model endpoint, real MCP servers, OpenCode plugin APIs, nested delegation, or approval prompts work end to end. Test those in a fresh OpenCode session after installing and reloading the configuration. If environment variables or plugins were changed, restart the relevant background service.

For an end-to-end smoke check, try a small local coding task, a Firecrawl-first documentation question delegated to `researcher`, and a major-change request that should trigger a plan approval **before** implementation. Verify behavior rather than assuming instructions are enforced automatically.

## Official references

- [OpenCode v2 configuration](https://opencode.ai/v2/docs/config)
- [V1 → V2 migration](https://opencode.ai/v2/docs/migrate-v1)
- [Agents](https://opencode.ai/v2/docs/agents)
- [Permissions](https://opencode.ai/v2/docs/permissions)
- [Skills](https://opencode.ai/v2/docs/skills)
- [MCP servers](https://opencode.ai/v2/docs/mcp-servers)
- [Plugins](https://opencode.ai/v2/docs/plugins)
- [CLI commands](https://opencode.ai/v2/docs/cli/commands)
- [Terminal client settings](https://opencode.ai/v2/docs/cli/config)
