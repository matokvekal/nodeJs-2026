# Helmet - Security Headers

Day 3, Lesson 4 - Example 1

## Install

```bash
npm install
```

## Run

```bash
node index.js
```

## Test Security Headers

1. Visit http://localhost:3000 in browser
2. Open Developer Tools (F12)
3. Go to Network tab
4. Reload page
5. Click on the request
6. View Response Headers

You should see security headers like:
- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- No `X-Powered-By` header (hidden)

## What Helmet Protects Against

- **XSS** (Cross-Site Scripting) - via CSP headers
- **Clickjacking** - via X-Frame-Options
- **MIME sniffing** - via X-Content-Type-Options
- **Man-in-the-Middle** - via HSTS (forces HTTPS)
