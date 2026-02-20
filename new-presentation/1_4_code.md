# Day 1 - Presentation 4: HTTP Fundamentals + WebHooks - Code Examples

---

## Example 1: Basic HTTP Server with http.createServer

```javascript
// Creating a basic HTTP server with Node.js built-in http module
import http from "node:http";

// Create HTTP server
const server = http.createServer((req, res) => {
  // req - IncomingMessage (Readable Stream) - the request from client
  // res - ServerResponse (Writable Stream) - our response to client

  console.log(`${req.method} ${req.url}`);

  // Set status code and headers
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  // Send response body
  res.end("<h1>Hello from Node.js HTTP Server!</h1>");
});

// Start server on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, "localhost", () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log("Press Ctrl+C to stop");
});

// Handle server errors
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error("Server error:", error);
  }
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
```

---

## Example 2: HTTP Request Object - Reading Request Data

```javascript
// Understanding the HTTP request object
import http from "node:http";

const server = http.createServer((req, res) => {
  // Request method: GET, POST, PUT, DELETE, PATCH, etc.
  console.log("Method:", req.method);

  // Request URL (path + query string)
  console.log("URL:", req.url);

  // HTTP version
  console.log("HTTP Version:", req.httpVersion);

  // Request headers (always lowercase)
  console.log("Headers:", req.headers);
  console.log("User-Agent:", req.headers["user-agent"]);
  console.log("Content-Type:", req.headers["content-type"]);

  // Remote address
  console.log("Client IP:", req.socket.remoteAddress);

  // Build response
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify(
      {
        method: req.method,
        url: req.url,
        headers: req.headers
      },
      null,
      2
    )
  );
});

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
  console.log("Try: curl http://localhost:3000/api/users?page=1");
});
```

---

## Example 3: Routing - Handling Different Paths and Methods

```javascript
// Simple routing based on URL and HTTP method
import http from "node:http";
import { URL } from "node:url";

const server = http.createServer((req, res) => {
  // Parse URL with query parameters
  const baseURL = `http://${req.headers.host}`;
  const url = new URL(req.url, baseURL);

  // Extract path and method
  const { pathname } = url;
  const method = req.method;

  // Route: GET /
  if (method === "GET" && pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome!</h1><p>Try /api/users or /api/posts</p>");
    return;
  }

  // Route: GET /api/users
  if (method === "GET" && pathname === "/api/users") {
    // Get query parameters
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "10";

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        users: [
          { id: 1, name: "John" },
          { id: 2, name: "Jane" }
        ],
        pagination: { page: Number(page), limit: Number(limit) }
      })
    );
    return;
  }

  // Route: GET /api/users/:id
  const userMatch = pathname.match(/^\/api\/users\/(\d+)$/);
  if (method === "GET" && userMatch) {
    const userId = userMatch[1];

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        id: Number(userId),
        name: "John Doe",
        email: "john@example.com"
      })
    );
    return;
  }

  // Route: POST /api/users
  if (method === "POST" && pathname === "/api/users") {
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "User created",
        id: 123
      })
    );
    return;
  }

  // 404 - Route not found
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      error: "Not Found",
      path: pathname
    })
  );
});

server.listen(3000, () => {
  console.log("Server with routing: http://localhost:3000");
});
```

---

## Example 4: Parsing URL and Query Parameters

```javascript
// Working with URLs and query strings
import http from "node:http";
import { URL } from "node:url";

const server = http.createServer((req, res) => {
  const baseURL = `http://${req.headers.host}`;
  const url = new URL(req.url, baseURL);

  console.log("\n=== URL Parsing ===");
  console.log("Full URL:", url.href);
  console.log("Pathname:", url.pathname); // /api/search
  console.log("Search:", url.search); // ?q=nodejs&page=2
  console.log("Query params:", Object.fromEntries(url.searchParams));

  // Get individual query parameters
  const searchQuery = url.searchParams.get("q");
  const page = url.searchParams.get("page") || "1";
  const sort = url.searchParams.get("sort") || "relevance";

  // Check if parameter exists
  const hasFilter = url.searchParams.has("filter");

  // Get all values for a parameter (for arrays: ?tag=js&tag=node)
  const tags = url.searchParams.getAll("tag");

  // Iterate over all parameters
  console.log("\nAll query parameters:");
  url.searchParams.forEach((value, key) => {
    console.log(`  ${key}: ${value}`);
  });

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify(
      {
        query: searchQuery,
        page: Number(page),
        sort,
        hasFilter,
        tags
      },
      null,
      2
    )
  );
});

server.listen(3000, () => {
  console.log(
    "Test: http://localhost:3000/api/search?q=nodejs&page=2&tag=js&tag=node"
  );
});
```

---

## Example 5: Reading Request Body (POST/PUT/PATCH)

```javascript
// Reading and parsing JSON request body
import http from "node:http";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // Only handle POST to /api/users
  if (method === "POST" && url === "/api/users") {
    try {
      // Collect body chunks (req is a Readable Stream)
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }

      // Convert chunks to string
      const body = Buffer.concat(chunks).toString();

      // Parse JSON
      const data = JSON.parse(body);

      // Validate required fields
      if (!data.name || !data.email) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "name and email are required"
          })
        );
        return;
      }

      // Success - return created user
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "User created",
          user: {
            id: Date.now(),
            ...data,
            createdAt: new Date().toISOString()
          }
        })
      );
    } catch (error) {
      // Handle parsing errors
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Invalid JSON",
          message: error.message
        })
      );
    }
    return;
  }

  // 404 for other routes
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
  console.log("\nTest with curl:");
  console.log("curl -X POST http://localhost:3000/api/users \\");
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"name":"John","email":"john@example.com"}\'');
});
```

---

## Example 6: HTTP Status Codes - Using Correct Codes

```javascript
// Using appropriate HTTP status codes
import http from "node:http";

// Mock database
const users = [
  { id: 1, name: "John", email: "john@example.com" },
  { id: 2, name: "Jane", email: "jane@example.com" }
];

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // GET /api/users/:id
  const match = url.match(/^\/api\/users\/(\d+)$/);
  if (method === "GET" && match) {
    const userId = Number(match[1]);
    const user = users.find((u) => u.id === userId);

    if (!user) {
      // 404 Not Found - resource doesn't exist
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    // 200 OK - successful GET
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
    return;
  }

  // POST /api/users
  if (method === "POST" && url === "/api/users") {
    try {
      const body = await parseBody(req);

      // Validation failed
      if (!body.email || !body.email.includes("@")) {
        // 422 Unprocessable Entity - validation error
        res.writeHead(422, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid email" }));
        return;
      }

      // Check if user already exists
      if (users.some((u) => u.email === body.email)) {
        // 409 Conflict - resource already exists
        res.writeHead(409, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Email already exists" }));
        return;
      }

      // 201 Created - resource successfully created
      const newUser = { id: users.length + 1, ...body };
      users.push(newUser);

      res.writeHead(201, {
        "Content-Type": "application/json",
        Location: `/api/users/${newUser.id}` // URI of created resource
      });
      res.end(JSON.stringify(newUser));
      return;
    } catch (error) {
      // 400 Bad Request - malformed request (invalid JSON)
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid JSON" }));
      return;
    }
  }

  // DELETE /api/users/:id
  if (method === "DELETE" && match) {
    const userId = Number(match[1]);
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    users.splice(index, 1);

    // 204 No Content - successful delete, no response body
    res.writeHead(204);
    res.end();
    return;
  }

  // 405 Method Not Allowed - method not supported for this path
  res.writeHead(405, {
    "Content-Type": "application/json",
    Allow: "GET, POST" // List allowed methods
  });
  res.end(JSON.stringify({ error: "Method not allowed" }));
});

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString());
}

server.listen(3000, () => console.log("Server on http://localhost:3000"));

// Common Status Codes:
// 200 OK - Successful GET, PUT, PATCH
// 201 Created - Successful POST (resource created)
// 204 No Content - Successful DELETE, no body to return
// 400 Bad Request - Malformed request (invalid JSON, etc.)
// 401 Unauthorized - Not authenticated
// 403 Forbidden - Authenticated but not authorized
// 404 Not Found - Resource doesn't exist
// 409 Conflict - Resource already exists
// 422 Unprocessable Entity - Validation failed
// 429 Too Many Requests - Rate limit exceeded
// 500 Internal Server Error - Server error
```

---

## Example 7: Important HTTP Headers

```javascript
// Working with HTTP headers
import http from "node:http";
import crypto from "node:crypto";

const server = http.createServer((req, res) => {
  // Reading request headers
  console.log("\n=== Request Headers ===");
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Authorization:", req.headers["authorization"]);
  console.log("User-Agent:", req.headers["user-agent"]);
  console.log("Accept:", req.headers["accept"]);

  // Generate request ID for tracing
  const requestId = crypto.randomUUID();

  // Setting response headers
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Request-Id", requestId);
  res.setHeader("X-Powered-By", "Node.js");

  // Security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Cache control
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Multiple headers at once with writeHead
  res.writeHead(200, {
    "Content-Type": "application/json",
    "X-Custom-Header": "Custom Value"
  });

  res.end(
    JSON.stringify({
      message: "Headers set successfully",
      requestId
    })
  );
});

server.listen(3000, () => {
  console.log("Server on http://localhost:3000");
});

// Important Headers:
// Request:
// - Authorization: Bearer token / API key
// - Content-Type: Type of request body
// - Accept: Expected response type
// - User-Agent: Client information
//
// Response:
// - Content-Type: Type of response body
// - Cache-Control: Caching directives
// - Location: URI of created resource (with 201)
// - Retry-After: Seconds to wait (with 429, 503)
// - X-Request-Id: Request tracking ID
```

---

## Example 8: Streaming Response - Sending Large Data

```javascript
// Streaming responses for large files or data
import http from "node:http";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { stat } from "node:fs/promises";

const server = http.createServer(async (req, res) => {
  const { url } = req;

  // Stream a large file
  if (url === "/download/largefile") {
    try {
      const filePath = "./package.json";
      const stats = await stat(filePath);

      // Set headers before streaming
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Content-Length": stats.size,
        "Content-Disposition": 'attachment; filename="package.json"'
      });

      // Stream file to response using pipeline
      await pipeline(createReadStream(filePath), res);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error streaming file");
    }
    return;
  }

  // Server-Sent Events (SSE) - real-time updates
  if (url === "/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    });

    // Send update every second
    let counter = 0;
    const intervalId = setInterval(() => {
      counter++;

      // SSE format: "data: message\n\n"
      res.write(
        `data: ${JSON.stringify({
          message: "Update",
          count: counter,
          time: new Date().toISOString()
        })}\n\n`
      );

      if (counter >= 10) {
        clearInterval(intervalId);
        res.end();
      }
    }, 1000);

    // Clean up on client disconnect
    req.on("close", () => {
      clearInterval(intervalId);
      console.log("Client disconnected");
    });
    return;
  }

  // Chunked response - sending data in parts
  if (url === "/chunked") {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked"
    });

    // Send data in chunks
    res.write("Chunk 1\n");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.write("Chunk 2\n");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.write("Chunk 3\n");
    res.end();
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(3000, () => {
  console.log("Server on http://localhost:3000");
  console.log("Try:");
  console.log("  http://localhost:3000/download/largefile");
  console.log("  http://localhost:3000/events");
  console.log("  http://localhost: 3000/chunked");
});
```

---

## Example 9: Making HTTP Requests with Built-in fetch

```javascript
// Making HTTP requests with Node.js built-in fetch (Node 18+)

// GET request
async function getUser(userId) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );

    // Check status code
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const user = await response.json();
    console.log("User:", user);
    return user;
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
}

// POST request with JSON body
async function createPost(post) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(post)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const created = await response.json();
    console.log("Created post:", created);
    return created;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Request with timeout using AbortSignal
async function fetchWithTimeout(url, timeoutMs) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs)
    });

    return await response.json();
  } catch (error) {
    if (error.name === "TimeoutError") {
      console.error("Request timed out after", timeoutMs, "ms");
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
}

// Request with custom headers and auth
async function fetchWithAuth(url, token) {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    if (response.status === 401) {
      throw new Error("Unauthorized - invalid token");
    }

    return await response.json();
  } catch (error) {
    console.error("Auth error:", error.message);
    throw error;
  }
}

// Test the functions
getUser(1);
createPost({
  title: "Node.js 2026",
  body: "Modern Node.js with built-in fetch",
  userId: 1
});
fetchWithTimeout("https://jsonplaceholder.typicode.com/posts/1", 5000);
```

---

## Example 10: WebHook Receiver - Handling Incoming WebHooks

```javascript
// Receiving and processing WebHooks
import http from "node:http";
import crypto from "node:crypto";

// Secret key for webhook signature verification (shared with webhook sender)
const WEBHOOK_SECRET = "your-secret-key-here";

// Store processed webhook IDs to prevent duplicates (idempotency)
const processedWebhooks = new Set();

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // WebHook endpoint
  if (method === "POST" && url === "/webhooks/github") {
    try {
      // 1. Read the request body
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = Buffer.concat(chunks).toString();

      // 2. Verify webhook signature (security!)
      const signature = req.headers["x-hub-signature-256"];
      if (!verifySignature(body, signature, WEBHOOK_SECRET)) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid signature" }));
        return;
      }

      // 3. Parse the payload
      const payload = JSON.parse(body);
      const webhookId = payload.id || crypto.randomUUID();

      // 4. Check for duplicates (idempotency)
      if (processedWebhooks.has(webhookId)) {
        console.log("Webhook already processed:", webhookId);
        // Return 200 even for duplicates (webhook sender will stop retrying)
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "already processed" }));
        return;
      }

      // 5. Respond IMMEDIATELY (don't make webhook sender wait)
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "received" }));

      // 6. Process webhook ASYNCHRONOUSLY (after responding)
      processWebhookAsync(webhookId, payload);
    } catch (error) {
      console.error("Webhook error:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid webhook" }));
    }
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

// Verify HMAC signature
function verifySignature(body, signature, secret) {
  if (!signature) return false;

  // Compute expected signature
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(body);
  const expected = "sha256=" + hmac.digest("hex");

  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

// Process webhook asynchronously (runs AFTER we responded)
async function processWebhookAsync(webhookId, payload) {
  try {
    console.log(`\nProcessing webhook ${webhookId}...`);
    console.log("Event:", payload.event);
    console.log("Data:", payload.data);

    // Mark as processed
    processedWebhooks.add(webhookId);

    // Simulate long processing (database update, external API call, etc.)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(`Webhook ${webhookId} processed successfully`);

    // Clean up old webhook IDs (prevent memory leak)
    if (processedWebhooks.size > 10000) {
      const oldest = Array.from(processedWebhooks).slice(0, 5000);
      oldest.forEach((id) => processedWebhooks.delete(id));
    }
  } catch (error) {
    console.error(`Error processing webhook ${webhookId}:`, error);
    // In production: retry or send to dead letter queue
  }
}

server.listen(3000, () => {
  console.log("WebHook receiver on http://localhost:3000/webhooks/github");
});

// WebHook best practices:
// 1. Verify signature (HMAC-SHA256)
// 2. Respond IMMEDIATELY (200 OK)
// 3. Process asynchronously
// 4. Handle duplicates (idempotency)
// 5. Log everything for debugging
```

---

## Example 11: Idempotency - Preventing Duplicate Processing

```javascript
// Implementing idempotency for safe retries
import http from "node:http";
import crypto from "node:crypto";

// In-memory store (use Redis/database in production)
const idempotencyStore = new Map();

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // POST /api/payments - idempotent endpoint
  if (method === "POST" && url === "/api/payments") {
    try {
      // 1. Get idempotency key from header (client provides this)
      const idempotencyKey = req.headers["idempotency-key"];

      if (!idempotencyKey) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Idempotency-Key header required"
          })
        );
        return;
      }

      // 2. Check if we've processed this request before
      if (idempotencyStore.has(idempotencyKey)) {
        const cachedResponse = idempotencyStore.get(idempotencyKey);

        console.log("Returning cached response for key:", idempotencyKey);

        // Return the SAME response as before
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(cachedResponse));
        return;
      }

      // 3. Parse request body
      const body = await parseBody(req);

      // 4. Process payment (this should only happen ONCE per idempotency key)
      console.log("Processing NEW payment for key:", idempotencyKey);
      const result = await processPayment(body);

      // 5. Store result with idempotency key
      idempotencyStore.set(idempotencyKey, result);

      // 6. Return response
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString());
}

async function processPayment(paymentData) {
  // Simulate payment processing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    id: crypto.randomUUID(),
    amount: paymentData.amount,
    status: "completed",
    processedAt: new Date().toISOString()
  };
}

server.listen(3000, () => {
  console.log("Server on http://localhost:3000");
  console.log("\nTest idempotency with curl:");
  console.log(
    "KEY=$(uuidgen); curl -X POST http://localhost:3000/api/payments \\"
  );
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -H "Idempotency-Key: $KEY" \\');
  console.log("  -d '{\"amount\":100}'");
  console.log("\n(Run same command twice - second returns cached result)");
});

// Idempotency key should:
// 1. Be unique per logical operation
// 2. Be provided by CLIENT (not generated by server)
// 3. Be stored with result for 24+ hours
// 4. Return same response for same key
```

---

## Example 12: Retry Logic with Exponential Backoff

```javascript
// Implementing retry logic for making reliable HTTP requests

// Retry with exponential backoff
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1}/${maxRetries + 1}...`);

      const response = await fetch(url, options);

      // Success - return response
      if (response.ok) {
        console.log("✅ Request succeeded");
        return response;
      }

      // Don't retry client errors (4xx) except 429
      if (
        response.status >= 400 &&
        response.status < 500 &&
        response.status !== 429
      ) {
        throw new Error(`HTTP ${response.status} - not retrying client error`);
      }

      // For 429, check Retry-After header
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        if (retryAfter) {
          const waitSeconds = Number(retryAfter);
          console.log(`Rate limited. Waiting ${waitSeconds}s...`);
          await new Promise((resolve) =>
            setTimeout(resolve, waitSeconds * 1000)
          );
          continue; // Retry without counting as attempt
        }
      }

      const error = new Error(`HTTP ${response.status}`);
      error.response = response;
      throw error;
    } catch (error) {
      lastError = error;

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s, 8s...
      const delay = Math.min(1000 * Math.pow(2, attempt), 30000); // Max 30s

      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 1000;
      const totalDelay = delay + jitter;

      console.log(
        `❌ Attempt failed. Retrying in ${(totalDelay / 1000).toFixed(2)}s...`
      );
      await new Promise((resolve) => setTimeout(resolve, totalDelay));
    }
  }

  // All retries exhausted
  throw new Error(
    `Failed after ${maxRetries + 1} attempts: ${lastError.message}`
  );
}

// Test with an unreliable endpoint
async function testRetry() {
  try {
    const response = await fetchWithRetry(
      "https://jsonplaceholder.typicode.com/posts/1",
      {},
      3 // Max 3 retries
    );

    const data = await response.json();
    console.log("Data:", data);
  } catch (error) {
    console.error("Final error:", error.message);
  }
}

testRetry();

// Retry strategy:
// - Retry 5xx errors (server errors)
// - Retry network errors (ECONNREFUSED, etc.)
// - Retry 429 (rate limit) with Retry-After
// - Don't retry 4xx errors (client errors)
// - Use exponential backoff with jitter
// - Set maximum retry delay (e.g., 30 seconds)
```

---

## Comparison Table: HTTP Status Codes

| Code    | Name                  | When to Use                         | Example                  |
| ------- | --------------------- | ----------------------------------- | ------------------------ |
| **200** | OK                    | Successful GET, PUT, PATCH          | Read/update succeeded    |
| **201** | Created               | Successful POST (created resource)  | User created             |
| **204** | No Content            | Successful DELETE, no response body | Delete succeeded         |
| **400** | Bad Request           | Malformed request, invalid JSON     | Parse error              |
| **401** | Unauthorized          | Not authenticated                   | Missing/invalid token    |
| **403** | Forbidden             | Authenticated but not authorized    | Insufficient permissions |
| **404** | Not Found             | Resource doesn't exist              | User ID not in database  |
| **409** | Conflict              | Resource already exists             | Email already registered |
| **422** | Unprocessable Entity  | Validation failed                   | Invalid email format     |
| **429** | Too Many Requests     | Rate limit exceeded                 | API rate limit hit       |
| **500** | Internal Server Error | Unexpected server error             | Unhandled exception      |

---

## Comparison Table: Request Methods (HTTP Verbs)

| Method     | Idempotent | Safe   | Use Case                | Body |
| ---------- | ---------- | ------ | ----------------------- | ---- |
| **GET**    | ✅ Yes     | ✅ Yes | Retrieve resource       | No   |
| **POST**   | ❌ No      | ❌ No  | Create resource         | Yes  |
| **PUT**    | ✅ Yes     | ❌ No  | Replace entire resource | Yes  |
| **PATCH**  | ❌ No      | ❌ No  | Partial update          | Yes  |
| **DELETE** | ✅ Yes     | ❌ No  | Delete resource         | No   |

**Idempotent**: Multiple identical requests have same effect as single request  
**Safe**: Doesn't modify server state

---

## Summary

HTTP fundamentals and best practices in Node.js 2026:

1. **http.createServer** - Built-in HTTP server, no dependencies needed
2. **Status codes** - Use correct codes (200, 201, 404, 422, etc.)
3. **Headers** - Content-Type, Authorization, security headers
4. **URL parsing** - Use WHATWG URL API for query parameters
5. **Request body** - Read with for-await-of, parse JSON
6. **Streaming** - For large files, use pipeline()
7. **fetch API** - Built-in (Node 18+), modern HTTP client
8. **WebHooks** - Verify signature, respond immediately, process async
9. **Idempotency** - Prevent duplicate processing with idempotency keys
10. **Retry logic** - Exponential backoff with jitter

Always prioritize security, proper error handling, and HTTP standards!
