---
name: data-profiling
description: "Profile existing data safely. Use for row counts, distributions, nulls, duplicates, outliers, quality checks, and migration readiness."
license: MIT
---

# Data Profiling

Use to understand existing data before design, migration, or bug analysis.

## Rules

- Read-only only.
- Use limits, samples, and timeouts.
- Do not dump sensitive data.
- Prefer aggregate summaries over raw records.
- Record every query used.
- Mark whether findings are from full data, bounded sample, or estimate.

## Profile

- Row/document counts.
- Null percentages.
- Distinct values and cardinality.
- Min/max/average for numerics and dates.
- Length ranges for strings.
- Duplicate candidates.
- Orphaned references.
- Status/enum values actually present.
- Growth and temporal patterns.

## Output

```md
Scope:
Sample/limits:
Counts:
Distributions:
Quality issues:
Migration risks:
Queries used:
Confidence:
```
