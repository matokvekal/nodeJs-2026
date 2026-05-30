// ============================================================
// CROSS-ORIGIN RESOURCE SHARING (CORS)
// ============================================================
//
// WHY DOES CORS EXIST?
// --------------------
// Browsers enforce a rule called the "Same-Origin Policy":
// JavaScript running on https://siteA.com is NOT allowed to
// make fetch/XHR requests to https://siteB.com by default.
//
// "Origin" = protocol + domain + port.
//   https://myapp.com:443  ≠  https://api.myapp.com:443
//   (different subdomain = different origin!)
//
// This policy protects users. Without it, a malicious website
// could silently call your bank's API using your browser's
// stored cookies and transfer money on your behalf.
//
// WHAT IS CORS?
// -------------
// CORS is the mechanism that lets a SERVER say:
//   "I trust requests from https://myapp.com — let them through."
//
// The server does this by adding special headers to its response:
//   Access-Control-Allow-Origin: https://myapp.com
//
// The browser reads that header and decides whether to give
// the JavaScript code access to the response data.
//
// WHAT IS A PREFLIGHT REQUEST?
// ----------------------------
// For "complex" requests (POST/PUT/DELETE with JSON body,
// custom headers like Authorization), the browser first sends
// an OPTIONS request to ask "are you OK with this?".
// This is called a PREFLIGHT. Only if the server approves
// does the browser send the real request.
//
// CORS is a BROWSER security feature. It does not protect
// your server from curl, Postman, or server-to-server calls —
// those tools ignore CORS headers entirely.
//
// Install: npm install cors
// Docs:    https://www.npmjs.com/package/cors
// ============================================================

import express from "express";
import cors from "cors";

const app = express();

// ===================================
// DANGEROUS: Basic CORS (Development ONLY!)
// ===================================
// cors() with NO options sets:
//   Access-Control-Allow-Origin: *
// This means ANY website in the world can call your API.
// Combined with credentials: true this is a critical
// security hole — NEVER ship this to production!
//
// app.use(cors()); // <-- DO NOT use in production

// ===================================
// SECURE: Production CORS Configuration
// ===================================
// We read the allowed origins from an environment variable
// so we can configure them per environment (dev/staging/prod)
// without changing code. We fall back to a hardcoded list
// during local development when the env var is not set.
//
// process.env.ALLOWED_ORIGINS might look like:
//   "https://myapp.com,https://www.myapp.com"
// The ?. (optional chaining) prevents a crash if it's undefined.
// .split(",") converts the string into an array.
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "https://myapp.com",
  "https://www.myapp.com",
  "https://admin.myapp.com"
];

console.log("Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    // --------------------------------------------------
    // origin: Which domains are allowed to call this API
    // --------------------------------------------------
    // Instead of a static value, we use a FUNCTION so we
    // can run custom logic for each request.
    //
    // Parameters:
    //   origin   — the value of the "Origin" header sent by
    //              the browser (e.g. "https://myapp.com").
    //              It is UNDEFINED for non-browser requests
    //              (curl, Postman, server-to-server calls).
    //   callback — call it with (error, allow):
    //              callback(null, true)  → allow the request
    //              callback(new Error()) → block the request
    origin: function (origin, callback) {
      // Allow requests that have NO origin header.
      // This covers: curl, Postman, mobile apps, and
      // server-to-server API calls — none of which send
      // an Origin header, and all of which are fine to allow.
      if (!origin) {
        console.log("Request with no origin (likely server-to-server)");
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        // Origin is on our whitelist → allow
        console.log(`Allowed origin: ${origin}`);
        callback(null, true);
      } else {
        // Origin is NOT on our whitelist → block with an error.
        // The browser will show a CORS error in the console.
        console.log(`Blocked origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },

    // --------------------------------------------------
    // methods: Which HTTP methods are permitted
    // --------------------------------------------------
    // The browser checks this during the preflight OPTIONS
    // request. If the method your JavaScript uses (e.g. DELETE)
    // is not listed here, the browser blocks the request before
    // it even leaves the browser.
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    // --------------------------------------------------
    // allowedHeaders: Which request headers JS can send
    // --------------------------------------------------
    // Only listed headers are allowed in the fetch() call.
    //   Content-Type   → needed to send JSON bodies
    //   Authorization  → needed to send JWT tokens ("Bearer ...")
    //   X-Requested-With → common AJAX indicator header
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],

    // --------------------------------------------------
    // credentials: true — Allow cookies & auth headers
    // --------------------------------------------------
    // When credentials: true, the browser will include:
    //   - Cookies (document.cookie)
    //   - HTTP Authentication headers
    //   - TLS client certificates
    //
    // IMPORTANT RULE: credentials: true CANNOT be combined
    // with origin: '*'. You must specify exact origins.
    // Browsers enforce this — it's a hard requirement.
    credentials: true,

    // --------------------------------------------------
    // maxAge: How long browsers cache the preflight result
    // --------------------------------------------------
    // Without maxAge, the browser sends a preflight OPTIONS
    // request before EVERY complex request — expensive!
    // maxAge: 86400 tells the browser to cache the preflight
    // result for 24 hours (86400 seconds), so subsequent
    // requests skip the preflight entirely.
    maxAge: 86400, // 24 hours

    // --------------------------------------------------
    // exposedHeaders: Custom headers JavaScript can read
    // --------------------------------------------------
    // By default, browser JS can only read a small set of
    // "safe" response headers. If your API sends custom
    // headers (e.g. pagination info), you must list them
    // here so JavaScript code can access them via:
    //   response.headers.get('X-Total-Count')
    exposedHeaders: ["X-Total-Count", "X-Page-Number", "X-RateLimit-Remaining"]
  })
);

// ===================================
// Advanced: Dynamic Origin Validation with Wildcards
// ===================================
// Sometimes you want to allow ALL subdomains of a domain,
// e.g. feature-123.myapp.com (preview deployments).
// The cors package doesn't support wildcards natively,
// so we write our own validation function.
//
// Usage: app.use(cors(corsOptionsWithWildcard));
//        (pass the function directly, not its result)
function corsOptionsWithWildcard(req, callback) {
  const origin = req.header("Origin");

  const isAllowed = allowedOrigins.some((allowed) => {
    // Exact match — fastest check, try it first
    if (allowed === origin) return true;

    // Wildcard subdomain support.
    // If allowedOrigins contains "*.myapp.com", we check
    // whether the incoming origin ENDS WITH ".myapp.com".
    // e.g. "preview-42.myapp.com".endsWith(".myapp.com") → true
    if (allowed.startsWith("*.")) {
      const domain = allowed.substring(2); // strip the "*"
      return origin?.endsWith(domain);
    }

    return false;
  });

  // The callback shape is the same as the origin function above,
  // but here we return a full options object instead of a boolean.
  callback(null, {
    origin: isAllowed,
    credentials: true
  });
}

// To activate wildcard support, swap this in:
// app.use(cors(corsOptionsWithWildcard));

// ===================================
// Manual CORS Headers (without the cors package)
// ===================================
// If you don't want to install the cors package, you can
// set the CORS headers by hand in a middleware function.
// This is useful to understand what cors() does under the hood.
//
// STUDENT NOTE: In a real project, use the cors package.
// This manual approach is shown here for learning purposes.
app.use((req, res, next) => {
  const origin = req.headers.origin; // what domain sent this request?

  // Only add CORS headers when the origin is on our whitelist.
  // Setting these headers for blocked origins would be insecure.
  if (origin && allowedOrigins.includes(origin)) {
    // Tell the browser: "This specific origin is allowed."
    // We echo back the request's origin instead of "*" so that
    // credentials (cookies) are permitted by the browser.
    res.setHeader("Access-Control-Allow-Origin", origin);

    // Allow the browser to send cookies / Authorization headers.
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // List which HTTP methods are allowed for cross-origin calls.
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );

    // List which request headers JavaScript is allowed to send.
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    // Cache this preflight approval for 24 hours (in seconds).
    res.setHeader("Access-Control-Max-Age", "86400");
  }

  // Handle preflight (OPTIONS) requests.
  // Before a complex request (e.g. POST with JSON), the browser
  // sends OPTIONS to ask "is this allowed?". We respond with
  // 204 No Content — the headers above are the entire answer.
  // Without this, the browser would wait for a body that never comes.
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // 204 = No Content (preflight approved)
  }

  // For real GET/POST/etc. requests, pass on to the next middleware.
  next();
});

// ===================================
// Test Routes
// ===================================
// HOW TO TEST CORS:
//   Option A — from another browser tab / HTML file:
//     fetch("http://localhost:3000/api/data")
//       .then(r => r.json()).then(console.log)
//     If the Origin isn't in allowedOrigins, you'll see
//     a red CORS error in the console.
//
//   Option B — from Postman or curl (no CORS restriction):
//     curl http://localhost:3000/api/data
//     This always works because it bypasses the browser.

app.get("/api/data", (req, res) => {
  res.json({ message: "CORS is working!", data: [1, 2, 3] });
});

app.post("/api/data", (req, res) => {
  res.json({ message: "POST request successful" });
});

// ===================================
// Start the Server
// ===================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CORS-enabled server running on http://localhost:${PORT}`);
  console.log("\nCORS Security Best Practices:");
  console.log("  DO: Whitelist specific origins");
  console.log("  DO: Use credentials: true with specific origins");
  console.log("  DO: Set maxAge to cache preflight requests");
  console.log("  DON'T: Use origin: '*' with credentials: true");
  console.log("  DON'T: Use wildcard '*' in production");
  console.log("  DON'T: Allow all origins without validation");
});
