# Rate Limiting

Day 3, Lesson 4 - Example 3

## Install

```bash
npm install
```

## Run

```bash
node index.js
```

## Test Rate Limiting

### Test with curl:
```bash
# Make multiple requests quickly
for i in {1..10}; do 
  curl http://localhost:3000/api/data
  echo ""
done

# Test login rate limiting
for i in {1..7}; do 
  curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"wrong"}'
  echo ""
done
```

### Expected behavior:
- First 100 requests to `/api/` succeed
- 101st request returns 429 (Too Many Requests)
- First 5 login attempts allowed
- 6th login attempt blocked for 15 minutes

## Why Rate Limiting?

1. **Prevent Brute Force** - Limit login attempts
2. **Prevent DDoS** - Limit requests per IP
3. **Protect Resources** - Prevent expensive operations abuse
4. **Fair Usage** - Ensure resources for all users

## Production Tip

For production with multiple servers, use Redis store instead of memory:
```bash
npm install rate-limit-redis redis
```

This ensures rate limits work across all server instances.
