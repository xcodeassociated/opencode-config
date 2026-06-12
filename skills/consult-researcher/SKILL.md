---
name: consult-researcher
description: "Delegate external or current facts to the researcher. Use for versions, docs, APIs, laws, CVEs, platform limits, or uncertain online facts."
license: MIT
---

# Consult Researcher

Use `@researcher` for external/current facts instead of guessing. If names, versions, docs scope, or source requirements are unclear, researcher returns `Clarification Requests` to the invoker; the invoker answers from evidence or asks the human with `question`. Researcher may always `question` the human directly when a blocking question would stall the research, or when the brief routes questions straight to the human. If researcher runs nested (its invoker is itself delegated), nested `question` calls do not surface in the TUI — researcher returns the question in `Clarification Requests` and the invoker relays.

## Trigger

- Dependency versions, compatibility, release notes, migrations.
- Official docs, specs, APIs, platform limits.
- CVEs, CVSS, advisories, security posture.
- Legal/regulatory facts.
- Tool behavior that may have changed.
- Library/framework details not present in the repo.
- Organization-specific topic where approved docs or internal evidence may exist.

## Do Not Use For

- Local code inspection.
- Repo facts available from files/tools.
- Pure reasoning from supplied facts.
- External lookup by non-research agents directly.

## Delegation Brief

```md
Research goal:
Needed facts:
Preferred sources:
Freshness requirement:
Repo/human context already known:
Question route:
Stop/ask conditions:
Expected output:
```

## Output Required From Researcher

- concise answer;
- source list/citations or tool evidence;
- version/date sensitivity;
- assumptions and conflicts;
- `Clarification Requests` when blocked.
