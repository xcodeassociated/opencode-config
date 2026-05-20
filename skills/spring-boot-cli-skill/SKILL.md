---
name: spring-boot-cli-skill
description: "Create or update Spring Boot projects with current Boot requirements. Use for scaffolding, starters, Gradle/Maven setup, and Boot upgrades."
license: MIT
---

# Spring Boot CLI Skill

Use for Spring Boot project setup and upgrades.

## Current Baseline

- Spring Boot 4 is current GA line.
- Requires Java 17+.
- Kotlin apps require Kotlin 2.2+.
- Native image requires GraalVM 25+.
- Based on Jakarta EE 11 / Servlet 6.1.
- Use latest Boot 3.5.x only when compatibility blocks Boot 4.

## Rules

- Verify current versions through `@researcher` for greenfield or upgrade work.
- Prefer Gradle Kotlin DSL for Kotlin projects unless repo uses Maven.
- Use Spring Boot BOM/dependency management.
- Choose starters deliberately; Boot 4 modular starters may need explicit additions.
- Include actuator for production services.

## Output

```md
Boot version:
Java/Kotlin version:
Starters:
Build tool:
Compatibility notes:
Commands:
```
