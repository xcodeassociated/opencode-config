# SQL Read-Only Patterns

## Safe start

```sql
BEGIN READ ONLY;
SET LOCAL statement_timeout = '5s';
SELECT current_database(), current_user;
```

Keep exploratory queries limited and prefer metadata/catalog sources before reading application rows.
