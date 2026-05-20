---
name: tester-bug-reproduction
description: "Reproduce bugs before fixes. Use for reported defects, flaky failures, regressions, and tester-to-developer handoffs."
license: MIT
---

# Tester Bug Reproduction

Use before sending a bug to developer.

## Rules

- Reproduce the bug exactly when possible.
- Minimize steps and data.
- Capture environment, branch, commit, URL, user/role, payload, and response.
- If not reproducible, report attempts and missing variables.
- Do not diagnose beyond evidence unless obvious.

## Reproduction Report

```md
Bug title:
Environment:
Preconditions:
Steps:
Expected:
Actual:
Evidence:
Frequency:
Minimal payload/URL:
Potential owner:
```

## Good Evidence

- curl command.
- `.http` request.
- Screenshot or trace.
- Logs with secrets removed.
- Failing test name.
