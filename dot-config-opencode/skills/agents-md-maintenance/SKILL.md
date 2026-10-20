---
name: agents-md-maintenance
description: Check and maintain a project's AGENTS.md after material changes to architecture, commands, deployment or conventions.
license: MIT
---

# AGENTS.md maintenance

Read a project's `AGENTS.md` when it exists and is relevant. Compare important directions against current repository evidence; do not follow stale claims without checking.

Update the guide **only when the task materially changes documented behavior**, such as setup/build/test commands, architecture, dependencies, security rules, data migration procedures or deployment. Routine refactors and bug fixes do not need a documentation edit if the guide remains accurate.

If `AGENTS.md` is missing, use built-in `/init` or `/project-init` when preparing a reusable project guide would add value; it is not a prerequisite for working on code.

Never introduce invented project facts or secrets. The `build` agent owns edits; consult the `researcher` agent only for external/current evidence when necessary.
