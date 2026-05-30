// ============================================================
// RATE LIMITING WITH express-rate-limit
// ============================================================
//
// WHY DO WE NEED RATE LIMITING?
// ------------------------------
// Without rate limiting, anyone can send thousands of requests
// per second to your server. This enables two major attacks:
//
//   1. BRUTE FORCE — An attacker tries millions of password
//      combinations on your /login endpoint until one works.
//      Rate limiting stops them after just 5 attempts.
//
//   2. DDoS (Distributed Denial of Service) — Flooding your
//      server with so many requests it runs out of memory/CPU
//      and stops responding to real users.
//
//   3. API ABUSE — Scraping all your data, exhausting your
//      paid third-party API quota, or overloading a slow
//      database query endpoint.
//
// HOW RATE LIMITING WORKS
// ------------------------
// A "sliding window" or "fixed window" counter tracks how many
// requests each IP address (or user) has made within a time
// window (e.g. the last 15 minutes). When the counter hits the
// limit, the server responds with HTTP 429 (Too Many Requests)
// and the client must wait for the window to reset.
//
// By default, counters are stored IN MEMORY (per process).
// In production with multiple server instances, use a shared
// store like Redis so all instances share the same counters.
//
// Install: npm install express-rate-limit
// Docs:    https://www.npmjs.com/package/express-rate-limit
// ============================================================

import express from "express";
import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json()); // Needed to parse JSON request bodies

// ===================================
// Basic Rate Limiting (Memory Store)
// ===================================
// This limiter applies to all routes under /api/.
// Each IP gets 10 requests per 15-minute window.
// On the 11th request, the server responds with 429.
const limiter = rateLimit({
  // --------------------------------------------------
  // windowMs: The size of the time window in milliseconds
  // --------------------------------------------------
  // 15 * 60 * 1000 = 15 minutes in ms.
  // After the window expires, the counter resets to 0
  // and the client can make requests again.
  windowMs: 15 * 60 * 1000, // 15 minutes

  // --------------------------------------------------
  // max: Maximum number of requests allowed per window
  // --------------------------------------------------
  // Each unique IP can make up to 10 requests per 15 min.
  // The 11th request will be rejected with a 429 response.
  max: 10,

  // --------------------------------------------------
  // message: The error text sent when limit is exceeded
  // --------------------------------------------------
  // This is the default message. It is overridden below
  // by our custom handler, but serves as a fallback.
  message: "Too many requests from this IP, please try again later",

  // --------------------------------------------------
  // standardHeaders: Add RateLimit-* headers to responses
  // --------------------------------------------------
  // When true, every response includes:
  //   RateLimit-Limit: 10           ← total allowed
  //   RateLimit-Remaining: 74       ← how many left
  //   RateLimit-Reset: 1716567890   ← unix timestamp of reset
  // Clients (apps/browsers) can read these to show countdowns.
  standardHeaders: true,

  // --------------------------------------------------
  // legacyHeaders: Disable old-style X-RateLimit-* headers
  // --------------------------------------------------
  // Older versions used X-RateLimit-Limit, X-RateLimit-Remaining
  // etc. These are non-standard. Setting false disables them.
  legacyHeaders: false,

  // --------------------------------------------------
  // keyGenerator: What to rate-limit BY
  // --------------------------------------------------
  // The default is req.ip (the client's IP address).
  // You can customise this — see the user-based limiter below.
  // Here we make it explicit for clarity.
  keyGenerator: (req) => {
    return req.ip; // Rate limit by IP address
  },

  // --------------------------------------------------
  // skip: Bypass rate limiting for certain requests
  // --------------------------------------------------
  // Returns true → skip the limiter for this request.
  // Health check and metrics endpoints should never be
  // rate-limited — they need to respond even under load
  // (e.g. a load balancer pinging /health to check if
  // the server is alive).
  skip: (req) => {
    return req.path === "/health" || req.path === "/metrics";
  },

  // --------------------------------------------------
  // handler: Custom response when limit is exceeded
  // --------------------------------------------------
  // Instead of the plain-text message above, we return
  // a structured JSON response with useful debug info.
  // HTTP 429 = "Too Many Requests" (the standard status code)
  handler: (req, res) => {
    console.log(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: "Too many requests",
      message: "You have exceeded the request limit. Please try again later.",
      // resetTime is a Unix timestamp in ms → convert to seconds
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Apply the limiter to all routes that start with /api/
// Any request to /api/something goes through this limiter first.
app.use("/api/", limiter);

// ===================================
// Strict Rate Limiting for Authentication
// ===================================
// Login endpoints need a MUCH tighter limit than general API.
// An attacker trying to brute-force a password with a
// dictionary of 10,000 words should be stopped after 5 tries.
//
// After 5 failed login attempts in 15 minutes, the IP is
// blocked from trying again until the window resets.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 login attempts per 15 minutes

  // --------------------------------------------------
  // skipSuccessfulRequests: true
  // --------------------------------------------------
  // A SUCCESSFUL login (HTTP 2xx) does NOT count against
  // the limit. Only FAILED attempts (HTTP 4xx/5xx) count.
  // This is important — legitimate users with correct
  // passwords should never be locked out.
  skipSuccessfulRequests: true,

  message: "Too many login attempts. Please try again in 15 minutes."
});

// Apply authLimiter only to the login route (not all /auth/ routes).
// The limiter middleware is passed as the second argument,
// before the route handler — it runs first and can short-circuit.
app.post("/auth/login", authLimiter, (req, res) => {
  const { username, password } = req.body;

  console.log(`Login attempt from IP: ${req.ip}`);

  // Mock authentication (in a real app, query a database and
  // compare a bcrypt hash — never store plain text passwords!)
  if (username === "admin" && password === "password") {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// ===================================
// Tiered Rate Limits
// ===================================
// Not all endpoints deserve the same limits.
// A cheap GET /articles call vs. a heavy POST /export that
// runs a 30-second database query should have very different
// quotas. "Tiered" means different limits for different routes.

// TIER 1 — General API: moderate traffic allowed
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 requests per 15 min
  message: "API rate limit exceeded"
});

// TIER 2 — Public content: more generous (no auth required,
// lower risk, may be called by widgets / embeds on other sites)
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // 500 requests per 15 min
  message: "Public API rate limit exceeded"
});

// TIER 3 — Expensive operation: very strict.
// /api/export might hit a slow DB query, generate a large file,
// or call a paid external service. One hour window, 10 max.
const expensiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // only 10 exports per hour
  message: "Hourly limit for this operation exceeded"
});

// Mount each limiter on its route prefix / specific route.
// Order matters: more specific routes should be defined before
// catch-all prefixes, but here they target different paths.
app.use("/api/", apiLimiter);
app.use("/public/", publicLimiter);

// expensiveLimiter is applied only to POST /api/export
// (more specific than the /api/ prefix above — it runs after
// apiLimiter AND expensiveLimiter, so both limits apply)
app.post("/api/export", expensiveLimiter, (req, res) => {
  res.json({ message: "Export started" });
});

// ===================================
// User-based Rate Limiting (not IP-based)
// ===================================
// IP-based limiting has a weakness: many users can share
// one IP (NAT, corporate network, university WiFi).
// Once any user on that IP hits the limit, ALL users are blocked.
//
// Solution: once the user is authenticated, rate-limit by
// their unique USER ID instead of their IP address.
// This way each user gets their own independent counter.
const userLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window (shorter — more responsive)
  max: 30, // 30 requests per minute per user

  // --------------------------------------------------
  // keyGenerator using user ID
  // --------------------------------------------------
  // If req.user exists (user is logged in), use their ID
  // as the rate-limit key. Otherwise fall back to IP.
  // The || (OR) means: "use user ID if available, else IP".
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },

  // --------------------------------------------------
  // skip: Only apply this limiter to authenticated users
  // --------------------------------------------------
  // !req.user means "user is NOT logged in" → skip the limiter.
  // Anonymous users are handled by the global IP-based limiter.
  skip: (req) => !req.user
});

// Mock authentication middleware — simulates a JWT decode step.
// In a real app this would verify a JWT from the Authorization
// header and attach the decoded user payload to req.user.
const mockAuth = (req, res, next) => {
  req.user = { id: "user123", name: "John Doe" }; // pretend we verified a JWT
  next(); // always call next() to continue to the next middleware
};

// Chain: mockAuth runs first → sets req.user → then userLimiter
// checks req.user.id as the key.
app.use("/api/user/", mockAuth, userLimiter);

// ===================================
// Test Routes
// ===================================
// HOW TO TEST RATE LIMITING:
//
//   On Mac/Linux (bash):
//     for i in {1..10}; do curl http://localhost:3000/api/data; done
//
//   On Windows (PowerShell):
//     1..10 | ForEach-Object { curl http://localhost:3000/api/data }
//
//   Watch the RateLimit-Remaining header drop with each request.
//   After 10 requests you will see a 429 response.
//
//   To test the auth limiter (limit is only 5):
//     Send 6 POST requests to /auth/login with wrong credentials.

// Returns current rate-limit status in the response body —
// helpful for students to see the counters in real time.
app.get("/api/data", (req, res) => {
  res.json({
    message: "API data",
    remaining: req.rateLimit?.remaining,  // requests left in this window
    limit: req.rateLimit?.limit,          // total allowed per window
    resetTime: new Date(req.rateLimit?.resetTime) // when the window resets
  });
});

app.get("/public/content", (req, res) => {
  res.json({ message: "Public content" });
});

// Health check — skipped by the limiter (see skip: above)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ===================================
// Start the Server
// ===================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Rate-limited server running on http://localhost:${PORT}`);
  console.log("\nRate Limits:");
  console.log("  /api/*        - 10 requests / 15 min");
  console.log("  /auth/login   - 5 attempts / 15 min");
  console.log("  /public/*     - 500 requests / 15 min");
  console.log("  /api/export   - 10 requests / hour");
  console.log("\nTest rate limiting:");
  console.log("  PowerShell: 1..10 | ForEach-Object { curl http://localhost:3000/api/data }");
  console.log("  Bash:       for i in {1..10}; do curl http://localhost:3000/api/data; done");
});
