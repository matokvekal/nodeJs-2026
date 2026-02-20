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