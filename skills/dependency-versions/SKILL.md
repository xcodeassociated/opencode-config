---
name: dependency-versions
description: "Research current dependency versions and compatibility from primary sources. Use before adding, upgrading, or pinning libraries/tools."
license: MIT
---

# Dependency Versions

Never guess versions or compatibility. Use primary sources and report unknowns instead of inventing answers.

Use when choosing or upgrading dependency versions.

## Source Priority

1. Official docs.
2. Release notes/changelog.
3. Maven Central, npm registry, GitHub releases.
4. Compatibility matrices.
5. Secondary articles only for context.

## Rules

- State date checked.
- If dependency name, ecosystem, version range, or compatibility target is ambiguous, return clarification requests to the invoker.
- Do not trust stale examples.
- Verify compatibility with Java/Kotlin/Spring/React/Vite/Bun as applicable.
- Prefer managed versions from Spring Boot BOM when using Spring.
- Avoid pinning transitive dependencies unless required.
- Report breaking changes before implementation.

## Output

```md
Dependency:
Current project version:
Recommended version:
Reason:
Compatibility:
Breaking changes:
Install command:
Sources/date checked:
```
