import { createServer } from "node:http";

console.log("=== Graceful Shutdown Demo ===\n");

// Track Active Connections
let connections = [];
let isShuttingDown = false;

// Create HTTP server
const server = createServer((req, res) => {
  if (isShuttingDown) {
    res.writeHead(503, { "Connection": "close" });
    res.end("Server is shutting down");
    return;
  }

  // Simulate some work
  setTimeout(() => {
    res.writeHead(200);
    res.end("Hello World!");
  }, 100);
});

server.on("connection", (connection) => {
  connections.push(connection);
  console.log(`✅ New connection (total: ${connections.length})`);

  connection.on("close", () => {
    connections = connections.filter((c) => c !== connection);
    console.log(`❌ Connection closed (total: ${connections.length})`);
  });
});

// Graceful Shutdown
async function gracefulShutdown(signal) {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  isShuttingDown = true;

  // 1. Stop accepting new requests
  server.close(() => {
    console.log("✅ HTTP server closed (no new connections)");
  });

  console.log(`⏳ Waiting for ${connections.length} active connections to close...`);

  // 2. Close existing connections gracefully
  connections.forEach((conn) => conn.end());

  // 3. Force close after timeout
  setTimeout(() => {
    console.log("⚠️  Forcing close of remaining connections");
    connections.forEach((conn) => conn.destroy());
  }, 10000); // 10 seconds

  // 4. Simulate closing database
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log("✅ Database disconnected");

  // 5. Simulate flushing logs
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log("✅ Logs flushed");

  console.log("✅ Graceful shutdown complete");
  process.exit(0);
}

// Handle Termination Signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle Uncaught Errors
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection:", reason);
  gracefulShutdown("UNHANDLED_REJECTION");
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("\nTest graceful shutdown:");
  console.log("1. Make some requests: curl http://localhost:3000");
  console.log("2. Press Ctrl+C to trigger shutdown");
  console.log("3. Watch connections close gracefully\n");
});

// Simulate some background work
const interval = setInterval(() => {
  console.log(`💓 Heartbeat - Active connections: ${connections.length}`);
}, 5000);

// Clean up interval on shutdown
process.on("SIGTERM", () => clearInterval(interval));
process.on("SIGINT", () => clearInterval(interval));

console.log("Best Practices:");
console.log("✅ Stop accepting new requests immediately");
console.log("✅ Close existing connections gracefully");
console.log("✅ Set timeout for forced shutdown");
console.log("✅ Close database connections");
console.log("✅ Flush logs and cleanup resources");
console.log("✅ Handle SIGTERM, SIGINT signals");
console.log("✅ Log shutdown progress");
