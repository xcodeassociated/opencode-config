---
name: git-workspace-check
description: "Check branch and dirty worktree before modifying files or handing off. Use at the start and end of implementation or infra work."
license: MIT
---

# Git Workspace Check

Use once before a work slice and once before handoff.

## Commands

```bash
git branch --show-current
git status --short
git diff --stat
git diff --cached --stat
```

## Rules

- Identify user-owned changes before editing.
- Do not stage unrelated files.
- Do not hide dirty state.
- Mention untracked files if relevant.
- If worktree is unexpectedly dirty, stop or isolate edits.

## Output

```md
Branch:
Dirty files:
Staged files:
Untracked files:
Safe to proceed:
```
