// middleware/rateLimit.js
import express from "express";
import rateLimit from "express-rate-limit";

const app = express();

// ===================================
// Basic Rate Limiting (Memory Store)
// ===================================
// Protects against brute force and DDoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes time window
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
  
  // Return rate limit info in standard headers
  standardHeaders: true, // RateLimit-* headers
  legacyHeaders: false, // Disable old X-RateLimit-* headers

  // Custom key generator (default is req.ip)
  keyGenerator: (req) => {
    return req.ip; // Rate limit by IP address
  },

  // Skip certain requests (e.g., health checks)
  skip: (req) => {
    return req.path === "/health" || req.path === "/metrics";
  },

  // Custom handler when limit is exceeded
  handler: (req, res) => {
    console.log(`⚠️  Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: "Too many requests",
      message: "You have exceeded the request limit. Please try again later.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000) // seconds until reset
    });
  }
});

// Apply to all API routes
app.use("/api/", limiter);

// ===================================
// Strict Rate Limiting for Authentication
// ===================================
// Prevent brute force login attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 login attempts per 15 minutes
  skipSuccessfulRequests: true, // Don't count successful logins
  message: "Too many login attempts. Please try again in 15 minutes."
});

// Mock login route
app.post("/auth/login", authLimiter, (req, res) => {
  // Simulate login logic
  const { username, password } = req.body;
  
  console.log(`Login attempt from IP: ${req.ip}`);
  
  // Mock authentication
  if (username === "admin" && password === "password") {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// ===================================
// Tiered Rate Limits
// ===================================
// Different limits for different endpoints

// Moderate for general API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "API rate limit exceeded"
});

// Generous for public content
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: "Public API rate limit exceeded"
});

// Very strict for expensive operations
const expensiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: "Hourly limit for this operation exceeded"
});

app.use("/api/", apiLimiter);
app.use("/public/", publicLimiter);
app.post("/api/export", expensiveLimiter, (req, res) => {
  res.json({ message: "Export started" });
});

// ===================================
// User-based Rate Limiting (not IP-based)
// ===================================
// Rate limit by authenticated user ID instead of IP
const userLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per user
  
  keyGenerator: (req) => {
    // Rate limit by user ID if authenticated, otherwise by IP
    return req.user?.id || req.ip;
  },
  
  skip: (req) => !req.user // Skip if not authenticated
});

// Mock authentication middleware
const mockAuth = (req, res, next) => {
  // In real app, extract from JWT token
  req.user = { id: "user123", name: "John Doe" };
  next();
};

app.use("/api/user/", mockAuth, userLimiter);

// ===================================
// Test Routes
// ===================================
app.get("/api/data", (req, res) => {
  res.json({ 
    message: "API data",
    remaining: req.rateLimit?.remaining,
    limit: req.rateLimit?.limit,
    resetTime: new Date(req.rateLimit?.resetTime)
  });
});

app.get("/public/content", (req, res) => {
  res.json({ message: "Public content" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" }); // Not rate limited
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚦 Rate-limited server running on http://localhost:${PORT}`);
  console.log("\n📊 Rate Limits:");
  console.log("  /api/*        - 100 requests / 15 min");
  console.log("  /auth/login   - 5 attempts / 15 min");
  console.log("  /public/*     - 500 requests / 15 min");
  console.log("  /api/export   - 10 requests / hour");
  console.log("\n🧪 Test rate limiting:");
  console.log("  Run: for i in {1..10}; do curl http://localhost:3000/api/data; done");
});
