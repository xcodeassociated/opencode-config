---
name: spring-transaction-propagation
description: "Configure and test Spring transaction boundaries and propagation. Use for @Transactional placement, proxy/self-invocation issues, Kotlin public/open methods, REQUIRED/REQUIRES_NEW/MANDATORY/NESTED, rollback rules, TransactionTemplate, and JUnit 5 integration tests."
license: MIT
---

# Spring Transaction Propagation

## Reference Files

OpenCode documents skill loading for this `SKILL.md`; sibling reference files are not guaranteed to be loaded automatically. Read them explicitly only when examples/templates are needed.

Relative to this skill directory:
- `references/kotlin-junit5-tests.md` — Kotlin/JUnit 5 propagation, proxy, REQUIRES_NEW, MANDATORY, and rollback tests.

If the read tool needs a concrete path, use `<root>/<skill-name>/references/<file>` with one of these documented skill roots: `.opencode/skills`, `~/.config/opencode/skills`, `.claude/skills`, `~/.claude/skills`, `.agents/skills`, `~/.agents/skills`, or source checkout `skills`. Prefer the root that contains the loaded `SKILL.md`; do not mix references from another copy of the same skill.

Use for Spring transaction boundaries, propagation, proxy behavior, rollback expectations, and integration tests.

Operational default: put `@Transactional` on public service-layer methods invoked through a Spring bean proxy. Avoid relying on private/self-invoked/final methods for transactional behavior.

## Load Related Skills

- JPA repository/write behavior: `jpa-repository-patterns`, `spring-data-saveall-batch-writes`.
- Read/write model and outbox consistency: `spring-data-jpa-read-write-models`, `read-model-outbox-propagation`.
- Persistence choice: `spring-persistence-selection`.
- Test design: `spring-test-ability-pattern`.

If a related skill is unavailable in your role, return a handoff recommendation.

## Proxy Rules

- Spring proxy-mode transaction advice applies when calls enter through the Spring proxy.
- Self-invocation inside the same class bypasses proxy advice, so an inner `@Transactional` method may not start its own propagation behavior.
- Public service methods are the safest default across JDK and class-based proxies.
- Kotlin classes/methods must be proxyable: use the Kotlin Spring/all-open plugin or explicit `open` where class-based proxies are needed.
- Private methods, final methods, and final classes cannot be advised by CGLIB proxies.
- Prefer splitting propagation-specific operations into another Spring service over calling annotated methods from the same class.

## Propagation Selection

- `REQUIRED`: default for command/service workflows; join current transaction or create one.
- `REQUIRES_NEW`: independent transaction; useful for audit/outbox-like side effects that must commit separately, but it needs another DB connection and can increase pool pressure.
- `MANDATORY`: require an existing transaction; good for internal APIs that must not run standalone.
- `SUPPORTS`: participate if present; otherwise non-transactional.
- `NOT_SUPPORTED`: suspend transaction; useful for work that must avoid holding DB locks/transactions.
- `NEVER`: fail if a transaction exists.
- `NESTED`: savepoint-based and transaction-manager-dependent; do not treat as a portable replacement for `REQUIRES_NEW`.

## Rollback Rules

- By default, unchecked exceptions roll back; checked exceptions may need explicit rollback rules.
- Do not swallow exceptions that should roll back the transaction.
- When command success depends on external writes, define whether failures roll back, compensate, or become asynchronous repair.
- Avoid long DB transactions around slow remote calls unless the consistency requirement justifies the availability/lock cost.

## Testing Rules

- Use integration tests for propagation behavior; unit tests cannot prove proxy behavior.
- Do not annotate propagation-outcome tests with `@Transactional` unless intentionally controlling the test transaction.
- Assert actual committed/rolled-back database state after service calls.
- Test self-invocation bugs by verifying the intended independent transaction does or does not commit.
- Use `TransactionTemplate` when tests need explicit transaction boundaries.

## Review Checklist

```md
Transactional boundary:
Invocation path through Spring proxy:
Kotlin proxyability:
Propagation choice:
Rollback rule:
Remote call / outbox / read-model interaction:
Connection pool impact:
Integration tests:
Risks / # VERIFY:
```
