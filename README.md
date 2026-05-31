# OpenCode Multi-Agent Team Config

Structured OpenCode setup for a specialist coding team:

- `@team-lead` — human-facing orchestrator, routing, scope control, specialist integration, final report.
- `@architect` — architecture decisions, boundaries, contracts, persistence/security design.
- `@developer` — implementation, refactoring, TDD loop, frontend/backend code.
- `@tester` — bug reproduction, API/UI/security verification, regression evidence.
- `@devops` — local runtime, Docker/Compose, Kubernetes, CI/CD, deployment readiness, diagnostics.
- `@analyst` — read-only requirements, schema, data, and migration-risk analysis.
- `@researcher` — only agent allowed to perform external research, web/docs lookup, package/version/CVE discovery.

The setup is intentionally conservative. Most external lookup is denied except for `@researcher`; destructive operations require approval or are denied; delegated agents route clarification questions through the invoking agent unless direct human questioning is explicitly allowed.

## Repository layout

```text
opencode.json          # OpenCode config: vLLM provider, agents, permissions, MCP servers
.env.example           # Runtime env template for provider/MCP endpoint variables
.env                   # Optional personal runtime env; may contain private endpoints/secrets; do not publish
agents/*.txt           # Agent system prompts referenced by opencode.json
commands/*.md          # Custom slash commands; checkpoint and AGENTS.md templates are embedded here
skills/*/SKILL.md      # Portable skill definitions; core checkpoint/AGENTS templates are embedded
skills/*/references/   # Optional colocated template/example copies for explicit reads
skills/README.md       # Skill authoring/install policy
```

## Model/provider behavior

This config registers a custom OpenAI-compatible `vllm` provider using:

```text
OPENCODE_VLLM_BASE_URL
```

The provider includes the configured vLLM model catalogue in `opencode.json`. The config does **not** define a model-selection environment variable, does **not** set a top-level `model`, and does **not** set `small_model`. Model selection therefore remains controlled by OpenCode's normal model selection flow or by any other OpenCode config layer you intentionally merge with this one.

OpenAI/Codex is not configured by this package. This config also does not set `enabled_providers` or `disabled_providers`, so it does not intentionally block providers you configure elsewhere.

## Environment variables referenced by the config

`opencode.json` uses `{env:...}` placeholders for provider and MCP endpoint values. These placeholders are resolved from the **exported process environment** inherited by `opencode` and by local MCP subprocesses.

This detail matters: a plain `source ~/.config/opencode/.env` can make `echo "$VAR"` work while still leaving the variable unexported. Use `set -a` before sourcing the file so every `KEY=value` line is exported.

Referenced variables:

```text
OPENCODE_VLLM_BASE_URL
OPENCODE_SEARXNG_URL
OPENCODE_SEARXNG_AI_URL
OPENCODE_FIRECRAWL_API_URL
OPENCODE_FIRECRAWL_API_KEY
OPENCODE_FIRECRAWL_RETRY_MAX_ATTEMPTS
OPENCODE_FIRECRAWL_AI_API_URL
OPENCODE_FIRECRAWL_AI_API_KEY
```

Use only the values your setup needs. For self-hosted Firecrawl, `OPENCODE_FIRECRAWL_API_URL` is normally the important value. API-key variables can remain empty when the corresponding self-hosted service does not require a key.

## Global install

```bash
mkdir -p ~/.config/opencode
cp -R opencode.json agents commands skills ~/.config/opencode/
cp .env.example ~/.config/opencode/.env.example
cp .env.example ~/.config/opencode/.env
```

Edit `~/.config/opencode/.env` with your local/self-hosted endpoints.

### Required shell setup

Add this block to `~/.zshrc` for zsh users and to `~/.bashrc` for bash users:

```bash
# OpenCode multi-agent config env
if [ -f "$HOME/.config/opencode/.env" ]; then
  set -a
  . "$HOME/.config/opencode/.env"
  set +a
fi
```

For macOS bash login shells, also make sure `~/.bash_profile` loads `~/.bashrc`:

```bash
# ~/.bash_profile
if [ -f "$HOME/.bashrc" ]; then
  . "$HOME/.bashrc"
fi
```

Reload the shell file or open a new terminal:

```bash
source ~/.zshrc
# or
source ~/.bashrc
```

Verify with `printenv`, not only `echo`:

```bash
printenv OPENCODE_VLLM_BASE_URL
printenv OPENCODE_SEARXNG_URL
printenv OPENCODE_FIRECRAWL_API_URL
```

Expected: each configured variable prints its value. If `echo "$OPENCODE_FIRECRAWL_API_URL"` prints a value but `printenv OPENCODE_FIRECRAWL_API_URL` prints nothing, the variable is shell-local and OpenCode/MCP subprocesses will not receive it.

Then run:

```bash
opencode
```

The default custom agent is `team-lead`.

## Project-local install

Use this when you want a repository-local OpenCode config directory:

```bash
mkdir -p .opencode
cp -R opencode.json agents commands skills .opencode/
cp .env.example .env
```

Edit project-root `.env`, then launch with the explicit config path so prompt paths resolve inside `.opencode`:

```bash
set -a
. .env
set +a
OPENCODE_CONFIG="$PWD/.opencode/opencode.json" opencode
```

For project-local use, the env file is project-root `.env`, not `.opencode/.env`, unless you intentionally choose a different layout.

## MCP env troubleshooting

If Firecrawl MCP fails with a message like:

```text
Either FIRECRAWL_API_KEY or FIRECRAWL_API_URL must be provided
MCP error -32000: Connection closed
```

first check exported env visibility:

```bash
printenv OPENCODE_FIRECRAWL_API_URL
printenv OPENCODE_FIRECRAWL_RETRY_MAX_ATTEMPTS
```

If `printenv` is empty, the `.env` file was sourced without export. Add the `set -a` shell block above, reload the shell, and restart OpenCode.

Do not use SearXNG startup alone as proof that env export is correct. Some MCP servers can start even when their endpoint value is missing or invalid; Firecrawl validates its required URL/API-key inputs at startup.

Useful log checks:

```bash
ls -lt ~/.local/share/opencode/log/ | head
latest_log="$(ls -t ~/.local/share/opencode/log/*.log | head -n 1)"
grep -iE 'firecrawl|searxng|mcp|connection closed|error|stderr' "$latest_log" | tail -n 120
```

## Operating model

Use `team-lead` for normal work. It should delegate non-trivial work to the right specialist and integrate reports. Specialists can also be invoked directly when you intentionally want that role as the human-facing agent.

Key rules preserved by the prompts:

- no hallucinated facts; ask or mark only non-blocking residual uncertainty as `# VERIFY`;
- no claiming tests, commands, builds, deploys, or verification passed unless actually run and observed;
- no external research except through `@researcher`;
- no production deploy, push, destructive DB/infra operation, or credential change without explicit approval;
- real `.env` files are readable by agents by design for local config/debug/deploy workflows, but agents must not commit or print real secret values;
- long or fragile work should use `/checkpoint-auto`, `/checkpoint-create`, and `/checkpoint-resume`;
- project context should be captured and maintained in `AGENTS.md` via `/project-init`.

## Custom commands

- `/project-init` — create or update project-root `AGENTS.md` through team discovery. The suggested `AGENTS.md` structure is embedded directly in the command and in `agents-md-init/SKILL.md`.
- `/checkpoint-create` — save a durable session checkpoint. The checkpoint format is embedded directly in the command and in `work-state-checkpoint/SKILL.md`.
- `/checkpoint-auto` — enable live checkpoint updates after material progress, using the embedded checkpoint format.
- `/checkpoint-resume` — resume from a saved checkpoint and preserve the embedded checkpoint structure.

## Skill reference files

Some skills keep optional examples/templates under `references/` next to `SKILL.md`. The critical checkpoint and AGENTS.md templates are also embedded directly in their `SKILL.md` files and relevant slash commands so the workflow does not depend on sibling reference-file loading.

Keep references colocated with the skill in every install location:

```text
.opencode/skills/<skill>/references/<file>.md
~/.config/opencode/skills/<skill>/references/<file>.md
.claude/skills/<skill>/references/<file>.md
~/.claude/skills/<skill>/references/<file>.md
.agents/skills/<skill>/references/<file>.md
~/.agents/skills/<skill>/references/<file>.md
skills/<skill>/references/<file>.md    # source checkout only
```

If the same skill exists both globally and in a project, keep each copy's references beside that copy.

## Publication notes

The included `.env` may contain private self-hosted service URLs or API keys. Before publishing or sharing a fork publicly, remove `.env`, scrub private hostnames, review `.env.example`, and confirm no secrets or internal-only endpoints are committed.
