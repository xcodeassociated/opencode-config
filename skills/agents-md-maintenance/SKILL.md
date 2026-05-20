---
name: agents-md-maintenance
description: "Maintain project AGENTS.md instructions. Use at task start and finish to check existence, recommend /project-init when missing, verify guidance, and update stale project context."
license: MIT
---

# Goal

Keep `AGENTS.md` from becoming missing, stale, or contradicted by recent work. A stale guide feeds future agents false project context.

# When to Use

Use for repository tasks before planning or editing, and again before final reporting after successful work.

This skill is for all non-research agents. `@researcher` should not perform AGENTS.md maintenance; it can only return external facts to the invoking agent.

# Start-of-Task Check

1. Identify the project root or current git worktree root.
2. Check whether project-root `AGENTS.md` exists.
3. If missing, state clearly: `AGENTS.md is missing; run /project-init to create a comprehensive project guide with specialist delegation.`
4. Strongly recommend `/project-init` before substantive, multi-file, architectural, implementation, testing, deployment, or long-lived work.
5. Continue only for urgent/simple work or when the human/invoker explicitly proceeds. Mark the missing file as a context risk.

# Use Existing AGENTS.md

When `AGENTS.md` exists:

- Read the relevant sections before planning, editing, testing, or reporting.
- Treat it as project-specific guidance unless it conflicts with higher-priority instructions, repo evidence, or human answers.
- If it conflicts with observed reality, do not silently follow stale text. Fix it if you can; otherwise report the exact needed update.

# End-of-Task Verification

After successful work, compare the result against `AGENTS.md`.

Update or propose an update if the work changed any of these:

- application purpose, responsibilities, non-responsibilities, users, workflows, or integrations
- architecture, module boundaries, API contracts, persistence, auth/security, or domain rules
- build, run, lint, typecheck, test, verification, or deployment commands
- dependencies, tooling, package managers, SDK/JDK/Node/Bun versions, or generated clients
- Docker, Compose, Kubernetes, CI/CD, observability, backup/restore, rollback, env files, ports, or runtime assumptions
- data model, migrations, retention, PII/security flags, invariants, or data lifecycle
- project-specific conventions, gotchas, flaky areas, or open `# VERIFY` items

# Edit Rules

- If you have edit permission and the change is significant for future agents, update `AGENTS.md` in the same task.
- If you do not have edit permission, or were asked to stay read-only, return an `AGENTS.md update required` item with exact section name and proposed text.
- Preserve useful existing content. Patch the relevant section instead of replacing the whole guide blindly.
- Do not add secrets, private credentials, or unsupported claims.
- Use `# VERIFY` only for residual uncertainty, not for decisions that should be asked or resolved.

# Report Format

Include this in final or delegated reports:

```md
AGENTS.md status:
- Exists: yes/no
- Read relevant sections: yes/no/not applicable
- Update needed: yes/no
- Updated now: yes/no/not permitted
- Proposed update, if not edited:
```
