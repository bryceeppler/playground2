`❯ deno run --allow-net --watch --allow-read --no-check server.ts`

```sql
SELECT 
    DATE(created_at) AS created_date,
    COUNT(*) AS user_count
FROM 
    users
WHERE 
    created_at >= CURRENT_DATE - INTERVAL '365 days'
GROUP BY 
    created_date
ORDER BY 
    created_date ASC;
```