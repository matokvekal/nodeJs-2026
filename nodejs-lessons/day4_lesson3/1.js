// utils/requestContext.js
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

// Create AsyncLocalStorage Instance
export const requestContext = new AsyncLocalStorage();

// Express Middleware
export function requestContextMiddleware(req, res, next) {
  const context = {
    requestId: randomUUID(),
    userId: req.user?.id,
    ip: req.ip,
    method: req.method,
    path: req.path,
    startTime: Date.now()
  };

  // Run the rest of the request in this context
  requestContext.run(context, next);
}

// Logger that uses context
export function log(level, message, meta = {}) {
  const context = requestContext.getStore() || {};

  console.log(
    JSON.stringify({
      level,
      message,
      requestId: context.requestId,
      userId: context.userId,
      ...meta,
      timestamp: new Date().toISOString()
    })
  );
}

// Demo without Express
console.log("=== AsyncLocalStorage Demo ===\n");

// Simulate multiple concurrent async operations
async function processRequest(userId, operation) {
  const context = {
    requestId: randomUUID(),
    userId,
    operation
  };

  return requestContext.run(context, async () => {
    log("info", "Request started");

    await simulateAsyncWork(100);
    log("info", "Processing...");

    await simulateAsyncWork(50);
    log("info", "Request completed");
  });
}

function simulateAsyncWork(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Run multiple requests concurrently
await Promise.all([
  processRequest("user123", "getData"),
  processRequest("user456", "updateProfile"),
  processRequest("user789", "deleteItem")
]);

console.log("\n Notice how each request's logs have their own requestId!");
console.log(" No need to pass context through every function!");
console.log("\nUse Cases:");
console.log("- Request ID tracking across all logs");
console.log("- User authentication context");
console.log("- Distributed tracing");
console.log("- Performance monitoring");
console.log("- Tenant isolation in multi-tenant apps");
