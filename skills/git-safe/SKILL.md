---
name: git-safe
description: "Protect user work and repository state. Use before edits, branch changes, commits, rebases, resets, cleaning, or risky git operations."
license: MIT
---

# Git Safe

Use before Git operations that can affect user work.

## Rules

- Check `git status --short` before edits and before final handoff.
- Never overwrite uncommitted user changes.
- Ask before `reset --hard`, `clean`, `rebase`, `checkout`, `switch`, `restore`, `stash`, or force push.
- Never push without explicit human approval.
- Commit only after showing diff and getting approval.

## Safe Commands

```bash
git status --short
git diff
git diff --cached
git log --oneline -n 20
git branch --show-current
```

## Handoff

State branch, dirty files, staged files, and whether any changes are uncommitted.
