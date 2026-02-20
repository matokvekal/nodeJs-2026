// Working with HTTP headers
import http from "node:http";
import crypto from "node:crypto";

const server = http.createServer((req, res) => {
  // Reading request headers
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