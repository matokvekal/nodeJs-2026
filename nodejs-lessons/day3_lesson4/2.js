// middleware/cors.js
import express from "express";
import cors from "cors";

const app = express();

// ===================================
// DANGEROUS: Basic CORS (Development ONLY!)
// ===================================
//   NEVER use this in production!
// app.use(cors()); // Allows ALL origins - major security risk!

// ===================================
// SECURE: Production CORS Configuration
// ===================================
// Define allowed origins from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "https://myapp.com",
  "https://www.myapp.com",
  "https://admin.myapp.com"
];

console.log("Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    // Origin validation function
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
      if (!origin) {
        console.log(" Request with no origin (likely server-to-server)");
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        console.log(` Allowed origin: ${origin}`);
        callback(null, true);
      } else {
        console.log(`  Blocked origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },

    // Allowed HTTP methods
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    // Allowed request headers
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],

    // Allow credentials (cookies, authorization headers)
    // Important: credentials require specific origin (cannot use *)
    credentials: true,

    // How long browsers can cache preflight response (in seconds)
    maxAge: 86400, // 24 hours

    // Expose custom headers to client JavaScript
    exposedHeaders: ["X-Total-Count", "X-Page-Number", "X-RateLimit-Remaining"]
  })
);

// ===================================
// Advanced: Dynamic Origin Validation with Wildcards
// ===================================
function corsOptionsWithWildcard(req, callback) {
  const origin = req.header("Origin");

  // Whitelist check with wildcard subdomain support
  const isAllowed = allowedOrigins.some((allowed) => {
    if (allowed === origin) return true;

    // Wildcard subdomain support (e.g., *.myapp.com)
    if (allowed.startsWith("*.")) {
      const domain = allowed.substring(2);
      return origin?.endsWith(domain);
    }

    return false;
  });

  callback(null, {
    origin: isAllowed,
    credentials: true
  });
}

// Alternative usage:
// app.use(cors(corsOptionsWithWildcard));

// ===================================
// Manual CORS Headers (without cors package)
// ===================================
// Useful if you need fine-grained control
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Only set CORS headers if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Max-Age", "86400");
  }

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // No content
  }

  next();
});

// Test routes
app.get("/api/data", (req, res) => {
  res.json({ message: "CORS is working!", data: [1, 2, 3] });
});

app.post("/api/data", (req, res) => {
  res.json({ message: "POST request successful" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 CORS-enabled server running on http://localhost:${PORT}`);
  console.log("\n🔒 CORS Security Best Practices:");
  console.log(" DO: Whitelist specific origins");
  console.log(" DO: Use credentials: true with specific origins");
  console.log(" DO: Set maxAge to cache preflight requests");
  console.log("  DON'T: Use origin: '*' with credentials: true");
  console.log("  DON'T: Use wildcard '*' in production");
  console.log("  DON'T: Allow all origins without validation");
});
