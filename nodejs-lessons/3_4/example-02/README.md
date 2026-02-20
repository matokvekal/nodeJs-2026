# CORS Configuration

Day 3, Lesson 4 - Example 2

## Install

```bash
npm install
```

## Run

```bash
ALLOWED_ORIGINS=https://myapp.com,https://www.myapp.com node index.js
```

## Test CORS

### Test with curl:
```bash
# Allowed origin - should work
curl -H "Origin: https://myapp.com" http://localhost:3000/api/data -v

# Blocked origin - should fail
curl -H "Origin: https://evil.com" http://localhost:3000/api/data -v
```

### Test with browser:
1. Create a simple HTML file with fetch request
2. Serve from allowed origin
3. Try accessing the API

## What is CORS?

**Cross-Origin Resource Sharing** - Security mechanism that allows a web page from one domain to access resources from another domain.

## Common CORS Errors

- `No 'Access-Control-Allow-Origin' header` - Origin not whitelisted
- `Credentials mode is 'include', but... '*'` - Can't use wildcard with credentials
- `Method ... not allowed by Access-Control-Allow-Methods` - HTTP method not whitelisted
