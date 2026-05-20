---
name: mongo-read-only
description: "Run safe MongoDB read-only analysis. Use for profiling collections, indexes, data quality, query behavior, and schema assumptions."
license: MIT
---

# Mongo Read-Only

Use before Mongo analysis.

## Hard Rules

- No writes: no insert, update, delete, drop, createIndex, rename, aggregate `$out`, or `$merge`.
- Use read-only credentials.
- Use projection, `limit`, and `maxTimeMS`.
- Prefer samples for large collections.
- Use `explain` for query plans.
- Do not dump sensitive data.

## Safe Patterns

```javascript
db.collection.find({}, {field: 1}).limit(20).maxTimeMS(5000)
db.collection.countDocuments({}, {maxTimeMS: 5000})
db.collection.aggregate([
  {$sample: {size: 1000}},
  {$group: {_id: "$status", count: {$sum: 1}}}
], {maxTimeMS: 10000})
db.collection.getIndexes()
```

## Output

```md
Collection:
Query:
Limit/sample:
Findings:
Risks:
```
