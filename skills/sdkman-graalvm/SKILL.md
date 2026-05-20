---
name: sdkman-graalvm
description: "Use SDKMAN/GraalVM for JVM setup and native-image work. Verify current versions before pinning Java, Kotlin, GraalVM, or Spring Boot."
license: MIT
---

# SDKMAN and GraalVM

Use for JVM toolchain setup.

## Rules

- Verify current supported versions before pinning.
- Use `.sdkmanrc` when the project needs reproducible local JVM tooling.
- Spring Boot 4 requires Java 17+, Kotlin 2.2+ for Kotlin apps, and GraalVM 25+ for native images.
- Prefer current LTS Java unless project constraints require otherwise.
- Native image requires explicit testing; do not assume JVM behavior matches native.

## Commands

```bash
sdk env install
sdk env
java -version
native-image --version
```

## Output

```md
Java version:
GraalVM version:
Reason:
.sdkmanrc needed:
Native-image implications:
```
