
● Step 1 — Start the server:
  node 3.js

  Step 2 — Test the endpoints:

  Check the data route (shows remaining requests in the response):
  curl http://localhost:3000/api/data

  Hit it 10 times in a row to watch the counter drop:
  1..10 | ForEach-Object { curl http://localhost:3000/api/data }

  Test the auth limiter (only 5 tries allowed — use wrong password to burn
  attempts):
  curl -X POST http://localhost:3000/auth/login -H "Content-Type:
  application/json" -d '{"username":"admin","password":"wrong"}'
  Run that 6 times — the 6th will return a 429.

  Test the health route (never rate-limited):
  curl http://localhost:3000/health

  Step 3 — What to look for in the response headers:

  Add -v to any curl command to see the headers:
  curl -v http://localhost:3000/api/data
  You'll see:
  RateLimit-Limit: 100
  RateLimit-Remaining: 99
  RateLimit-Reset: 1716567890

  Each request decrements Remaining. When it hits 0 you get:
  { "error": "Too many requests", "retryAfter": 123 }
  with HTTP status 429.