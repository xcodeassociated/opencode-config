---
name: archunit-tests
description: "Add architecture tests for Spring/Kotlin package boundaries, layers, naming, and dependency direction. Use for greenfield or architecture refactors."
license: MIT
---

# ArchUnit Tests

Use when enforcing backend architecture boundaries.

## Rules

- Test only meaningful boundaries. Do not encode noise.
- Use existing package names; do not invent layers.
- Prefer rules that catch costly mistakes: domain isolation, controller/service/repository dependencies, adapter boundaries.
- Keep tests readable and stable.

## Useful Rules

- Controllers do not access repositories directly.
- Domain does not depend on web, persistence, or framework adapters.
- Application services do not depend on controllers.
- Infrastructure adapters do not leak into domain APIs.
- Repository interfaces stay in the chosen architecture layer.
- Packages follow naming conventions.

## Kotlin/Spring Notes

- Use `ClassFileImporter` with explicit base package.
- Exclude generated/build/test fixtures when needed.
- Prefer package rules over annotation-only rules.

## Output

```md
Rules added:
Architecture boundary protected:
Packages covered:
Command run:
Known exclusions:
```
