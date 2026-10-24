# OpenCode configuration & agent skills

Personal configuration for [OpenCode](https://opencode.ai/), with a separate collection of reusable agent skills. The repository uses two directory trees so each can be installed in its native location without changing its internal structure.

| Repository directory | Install to | Purpose |
| --- | --- | --- |
| [`dot-agents/`](./dot-agents/) | `~/.agents/` | Shared skills, discoverable by OpenCode and other tools that support the `.agents` convention. |
| [`dot-config-opencode/`](./dot-config-opencode/) | `~/.config/opencode/` | OpenCode v2 configuration, agent instructions, integrations, commands, plugins, and OpenCode-specific skills. |

## Repository layout

```text
.
├── .env.example                  # Environment variable template
├── .gitignore
├── dot-agents/
│   └── skills/
│       └── <skill-name>/
│           ├── SKILL.md          # Skill instructions
│           └── references/       # Optional references or scripts
└── dot-config-opencode/
    ├── .env.example              # OpenCode runtime environment template
    ├── AGENTS.md                 # Global instructions for agents
    ├── opencode.json             # Provider, model, agents, permissions, MCPs
    ├── cli.json                  # CLI/TUI preferences
    ├── agents/
    │   └── researcher.md         # Read-only research agent
    ├── commands/
    │   └── project-init.md       # Project initialization command
    ├── plugins/                  # Custom OpenCode hooks
    ├── skills/                   # OpenCode-specific skills
    ├── tests/                    # Plugin tests
    └── README.md                 # Detailed OpenCode setup and behavior
```

## 1. Shared skills: `~/.agents/skills`

The [`dot-agents/skills/`](./dot-agents/skills/) directory contains **75 reusable skills**, each defined by a `SKILL.md` file. Some also include reference documentation or supporting scripts.

The collection covers topics including:

- **Backend and persistence:** Spring Boot, Kotlin, JPA/Hibernate, R2DBC, Liquibase, and database design.
- **Architecture:** DDD, hexagonal architecture, events, read models, and design patterns.
- **Infrastructure:** Docker, Kubernetes, CI/CD, backups, and observability.
- **Frontend and testing:** React, Vite, Playwright, Vitest, API contracts, and TDD.
- **Engineering workflows:** Git safety, security, dependency management, documentation, and research.

These skills are kept separate from the OpenCode configuration to make the collection reusable. OpenCode discovers `~/.agents/skills/` automatically; a skill can be loaded on demand when relevant.

## 2. OpenCode configuration: `~/.config/opencode`

[`dot-config-opencode/`](./dot-config-opencode/) contains the OpenCode-specific setup:

- **Local model:** An OpenAI-compatible vLLM provider configured for `qwen/qwen3.8-flash-next`. The API base URL comes from `OPENCODE_VLLM_BASE_URL`.
- **Agent workflow:** The `build` agent is the default coding agent, with optional delegated work. The read-only `researcher` agent handles external research, using Firecrawl first and SearXNG as a fallback.
- **Planning and approval:** Global `AGENTS.md` instructs agents to maintain task plans and request human approval before major changes. These are behavioral instructions, not hard enforcement guarantees.
- **MCP integrations:** Firecrawl, SearXNG, and Playwright are enabled in the supplied configuration. Chrome DevTools, DuckDuckGo, and shadcn MCP servers are configured but disabled.
- **Hooks:** Local plugins implement the Firecrawl-first guard and researcher-specific settings.
- **Commands and skills:** `project-init` and five OpenCode-specific skills provide project initialization, agent-instruction maintenance, development, and research workflows.

For the detailed behavior and configuration notes, see the [OpenCode-specific README](./dot-config-opencode/README.md).

## Installation

**Prerequisites:** OpenCode v2; `rsync` for the copy-based setup below. Running the configured MCP servers may also require Bun (`bunx`) and their respective external services.

From the cloned repository root:

```bash
# Back up any existing configuration before replacing files.
mkdir -p "$HOME/.agents" "$HOME/.config/opencode"

# Install shared skills.
rsync -av dot-agents/ "$HOME/.agents/"

# Install OpenCode configuration and its dedicated skills.
rsync -av dot-config-opencode/ "$HOME/.config/opencode/"

# Create a local environment file only if one does not already exist.
if [ ! -f "$HOME/.config/opencode/.env" ]; then
  cp "$HOME/.config/opencode/.env.example" "$HOME/.config/opencode/.env"
fi
```

`rsync` merges files into the destinations and does **not** remove unrelated existing files. It **will overwrite** same-named destination files; make a backup first. To apply changes after a Git pull, run the two `rsync` commands again.

### Environment variables

Edit `~/.config/opencode/.env` to supply the values for your environment. The template includes:

- `OPENCODE_VLLM_BASE_URL` — OpenAI-compatible vLLM API endpoint.
- `OPENCODE_FIRECRAWL_*` — Firecrawl connection settings and API key.
- `OPENCODE_SEARXNG_*` — SearXNG connection settings.

The `.env` file is **not automatically sourced by your shell**. Before starting OpenCode from a shell, load it with:

```bash
set -a
. "$HOME/.config/opencode/.env"
set +a
opencode
```

Alternatively, load it from your shell startup configuration. The repository also includes a root [`.env.example`](./.env.example) with additional setup notes.

## Verify the installation

Check the JSON configuration and run the included plugin unit tests from the repository root:

```bash
python3 -m json.tool dot-config-opencode/opencode.json >/dev/null
node --test dot-config-opencode/tests/*.test.mjs
```

These checks validate the JSON syntax and isolated plugin logic; they do not prove that a running OpenCode service, model endpoint, or MCP server is reachable. Restart OpenCode and start a fresh session after applying configuration changes.

## Security and version control

Commit configuration, Markdown instructions, skill definitions, and example environment files. **Do not commit actual credentials or runtime state.** In particular:

- Keep `.env`, `service.json`, API keys, tokens, and private keys out of Git.
- Use the checked-in `.env.example` files as templates, never as a place for real secrets.
- Rotate credentials if they were accidentally committed, even if the file is later removed from the working tree.

The repository's root [`.gitignore`](./.gitignore) handles ignored paths across both directory trees. A single root ignore file is sufficient; nested `.gitignore` files are not required.

## References

- [OpenCode v2 configuration](https://opencode.ai/v2/docs/config)
- [OpenCode v2 skills](https://opencode.ai/v2/docs/skills)
- [OpenCode-specific notes in this repository](./dot-config-opencode/README.md)
