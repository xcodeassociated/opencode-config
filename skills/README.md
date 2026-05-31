# Portable Agent Skills

These skill directories use the Agent Skills format: one directory per skill, with a `SKILL.md` file containing YAML frontmatter followed by Markdown instructions.

## Frontmatter policy

Keep skill frontmatter intentionally small and portable:

```yaml
---
name: skill-name
description: "What this skill does and when an agent should use it."
license: MIT
---
```

Rules:

- `name` must match the skill directory name and use lowercase letters, numbers, and single hyphens only.
- `description` is the main automatic-trigger signal. Put the key use case and trigger words near the start.
- Keep descriptions under 1024 characters.
- Do not add `compatibility`, `metadata`, `allowed-tools`, `when_to_use`, `disable-model-invocation`, `context`, `agent`, `model`, `effort`, `paths`, or other client-specific fields unless the skill is intentionally being forked for one client.
- Do not use `allowed-tools` or shell/tool preapproval fields in shared skills. Let each client or local config handle permissions.

## Portable install locations

Copy or symlink the skill directories into the location used by the client:

- OpenCode project skills: `.opencode/skills/<skill-name>/SKILL.md`
- OpenCode global skills: `~/.config/opencode/skills/<skill-name>/SKILL.md`
- Claude Code project skills: `.claude/skills/<skill-name>/SKILL.md`
- Claude Code personal skills: `~/.claude/skills/<skill-name>/SKILL.md`
- Codex project skills: `.agents/skills/<skill-name>/SKILL.md`
- Codex personal skills: `~/.agents/skills/<skill-name>/SKILL.md`
- GitHub Copilot project skills: `.github/skills/<skill-name>/SKILL.md`, `.claude/skills/<skill-name>/SKILL.md`, or `.agents/skills/<skill-name>/SKILL.md`
- GitHub Copilot personal skills: `~/.copilot/skills/<skill-name>/SKILL.md` or `~/.agents/skills/<skill-name>/SKILL.md`

This repository keeps the portable source set under `skills/`. Installers or dotfile tooling can mirror this directory into the client-specific location.

## Activation note

Most clients expose only the skill `name` and `description` during discovery, then load the full `SKILL.md` after the agent chooses the skill or the user invokes it explicitly. Therefore, do not rely on arbitrary metadata to make a skill trigger. Use clear descriptions and explicit invocation when the skill is critical.

## Reference files

Some skills keep code-heavy examples under `references/` next to `SKILL.md` to reduce default context size. Treat these files as optional, explicit reads rather than automatic skill content.

OpenCode documents skill discovery at `.opencode/skills/<name>/SKILL.md`, `~/.config/opencode/skills/<name>/SKILL.md`, `.claude/skills/<name>/SKILL.md`, `~/.claude/skills/<name>/SKILL.md`, `.agents/skills/<name>/SKILL.md`, and `~/.agents/skills/<name>/SKILL.md`. For a reference file, keep the same skill-relative path: `references/<file>.md`.

When an agent needs examples, it should read `<root>/<skill-name>/references/<file>.md` explicitly from the installed root, or from `skills/<skill-name>/references/<file>.md` in the source checkout. Do not assume OpenCode auto-loads reference files with the skill.

