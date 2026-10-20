# MongoDB Read-Only Patterns

```javascript
db.collection.find({}, {field: 1}).limit(20).maxTimeMS(5000)
db.collection.countDocuments({}, {maxTimeMS: 5000})
db.collection.aggregate([
  {$sample: {size: 1000}},
  {$group: {_id: "$status", count: {$sum: 1}}}
], {maxTimeMS: 10000})
db.collection.getIndexes()
```
