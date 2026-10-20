---
name: developer-bug-fix
description: Diagnose and fix a defect with focused regression verification, normally handled directly by the `build` agent.
license: MIT
---

# Bug-fix workflow

1. Read the failure report and inspect the implementation and tests.
2. Reproduce the defect or identify concrete evidence for its cause. For large logs, filter and summarize targeted intervals before loading them into the active context.
3. Add/update a focused regression test when practical.
4. Make the smallest correct fix without unrelated rewrites.
5. Run the focused test and relevant surrounding checks; report exactly what passed and what could not be run.
6. Handle normal debugging entirely within the current `build` agent session. Only for separable, high-context work (for example substantial log triage while another `build` agent independently implements the fix, or an independent UI verification) may the primary `build` agent delegate a **bounded** task to another `build` agent following global `AGENTS.md` rules.
7. Consult the `researcher` agent via the primary `build` agent if solving the bug requires external/current evidence. Do not use shell HTTP commands for documentation research.

Ask the user only for missing information that materially affects the expected behavior or safety of the fix.
