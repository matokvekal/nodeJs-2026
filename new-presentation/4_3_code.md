# Day 4 - Presentation 3: Advanced Node Topics - Code Examples

---

## Example 1: AsyncLocalStorage - Context without Prop Drilling

```javascript
// utils/requestContext.js
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

// ===================================
// Create AsyncLocalStorage Instance
// ===================================
export const requestContext = new AsyncLocalStorage();

// ===================================
// Express Middleware
// ===================================
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

// Usage in app.js
import express from "express";

const app = express();

// Apply context middleware EARLY
app.use(requestContextMiddleware);

// ===================================
// Access Context Anywhere
// ===================================
// utils/logger.js
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

// No need to pass req everywhere!
log("info", "User action performed");

// ===================================
// Database Query with Auto-logging
// ===================================
// db/query.js
export async function query(sql, params) {
  const context = requestContext.getStore() || {};

  const startTime = Date.now();
  const result = await db.execute(sql, params);
  const duration = Date.now() - startTime;

  log("debug", "Database query executed", {
    requestId: context.requestId, // Automatically included!
    sql,
    duration,
    rows: result.rows.length
  });

  return result;
}

// ===================================
// Service Layer Example
// ===================================
// services/order.service.js
import { query } from "../db/query.js";
import { log } from "../utils/logger.js";

export async function createOrder(orderData) {
  // No need to pass requestId or userId!
  log("info", "Creating order", { orderData });

  const result = await query(
    "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *",
    [orderData.userId, orderData.total]
  );

  log("info", "Order created", { orderId: result.rows[0].id });

  return result.rows[0];
}

// ===================================
// Use Cases
// ===================================
//  Request ID tracking across all logs
//  User authentication context
//  Distributed tracing
//  Performance monitoring
//  Tenant isolation in multi-tenant apps
```

---

## Example 2: EventEmitter - Pub/Sub Pattern

```javascript
// services/order.service.js
import { EventEmitter } from "node:events";

// ===================================
// Create Service with EventEmitter
// ===================================
class OrderService extends EventEmitter {
  async createOrder(orderData) {
    // Create order
    const order = await Order.create(orderData);

    // Emit event (decoupled from implementation)
    this.emit("order:created", order);

    return order;
  }

  async cancelOrder(orderId) {
    const order = await Order.findByPk(orderId);
    await order.update({ status: "cancelled" });

    this.emit("order:cancelled", order);

    return order;
  }
}

export const orderService = new OrderService();

// ===================================
// Event Listeners (Subscribers)
// ===================================
// listeners/email.listener.js
import { orderService } from "../services/order.service.js";
import { sendEmail } from "../utils/email.js";

orderService.on("order:created", async (order) => {
  await sendEmail({
    to: order.customerEmail,
    subject: "Order Confirmation",
    template: "order-created",
    data: order
  });
});

orderService.on("order:cancelled", async (order) => {
  await sendEmail({
    to: order.customerEmail,
    subject: "Order Cancelled",
    template: "order-cancelled",
    data: order
  });
});

// listeners/inventory.listener.js
import { orderService } from "../services/order.service.js";

orderService.on("order:created", async (order) => {
  await decrementInventory(order.items);
});

orderService.on("order:cancelled", async (order) => {
  await incrementInventory(order.items);
});

// ===================================
// Advanced EventEmitter Patterns
// ===================================
import { EventEmitter, once, on } from "node:events";

// 1. Wait for single event (Promise)
const emitter = new EventEmitter();

async function waitForReady() {
  await once(emitter, "ready");
  console.log("Server is ready!");
}

emitter.emit("ready");

// 2. Async iterator over events
async function consumeData() {
  const emitter = new EventEmitter();

  // Start emitting data
  setInterval(() => emitter.emit("data", Math.random()), 1000);

  // Consume with for await...of
  for await (const [value] of on(emitter, "data")) {
    console.log("Data:", value);

    if (value > 0.9) break; // Stop condition
  }
}

// 3. Capture async errors in listeners
const safeEmitter = new EventEmitter({ captureRejections: true });

safeEmitter.on("data", async (value) => {
  // If this throws, EventEmitter catches it
  await processData(value);
});

safeEmitter.on("error", (err) => {
  console.error("Listener error:", err);
});

// 4. Symbol event names (prevent collisions)
const ORDER_CREATED = Symbol("order:created");

orderService.on(ORDER_CREATED, handleOrder);
orderService.emit(ORDER_CREATED, order);

// ===================================
// Memory Leak Warning
// ===================================
// EventEmitter warns when >10 listeners on same event
// Increase if you know what you're doing:
emitter.setMaxListeners(50);

// Or disable warning:
emitter.setMaxListeners(0);
```

---

## Example 3: worker_threads - CPU-Intensive Tasks

```javascript
// ===================================
// Heavy Computation (blocks Event Loop)
// ===================================
//   DON'T do this in main thread!
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

app.get("/slow", (req, res) => {
  const result = fibonacci(40); // Blocks ALL requests for ~1 second!
  res.json({ result });
});

// ===================================
// Worker Thread Solution
// ===================================
// worker.js
import { parentPort, workerData } from "node:worker_threads";

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Receive data from main thread
const result = fibonacci(workerData.n);

// Send result back
parentPort.postMessage({ result });

// ===================================
// Main Thread
// ===================================
// server.js
import { Worker } from "node:worker_threads";

app.get("/fast", async (req, res) => {
  const n = parseInt(req.query.n) || 40;

  // Run in worker thread
  const result = await runWorker("./worker.js", { n });

  res.json({ result });
});

function runWorker(workerPath, workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerPath, { workerData });

    worker.on("message", (data) => {
      resolve(data.result);
    });

    worker.on("error", reject);

    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker exited with code ${code}`));
      }
    });
  });
}

// ===================================
// Worker Pool (Reusable Workers)
// ===================================
import { Worker } from "node:worker_threads";
import os from "node:os";

class WorkerPool {
  constructor(workerPath, numWorkers = os.cpus().length) {
    this.workerPath = workerPath;
    this.workers = [];
    this.queue = [];

    // Create worker pool
    for (let i = 0; i < numWorkers; i++) {
      this.workers.push({
        worker: new Worker(workerPath),
        busy: false
      });
    }
  }

  async execute(data) {
    return new Promise((resolve, reject) => {
      this.queue.push({ data, resolve, reject });
      this.processQueue();
    });
  }

  processQueue() {
    if (this.queue.length === 0) return;

    // Find available worker
    const availableWorker = this.workers.find((w) => !w.busy);
    if (!availableWorker) return;

    const task = this.queue.shift();
    availableWorker.busy = true;

    const messageHandler = (result) => {
      availableWorker.busy = false;
      availableWorker.worker.off("message", messageHandler);
      task.resolve(result);
      this.processQueue();
    };

    availableWorker.worker.on("message", messageHandler);
    availableWorker.worker.postMessage(task.data);
  }

  async close() {
    await Promise.all(this.workers.map((w) => w.worker.terminate()));
  }
}

// Usage
const pool = new WorkerPool("./worker.js", 4);

app.get("/compute", async (req, res) => {
  const result = await pool.execute({ n: 40 });
  res.json({ result });
});

// ===================================
// Use Cases for worker_threads
// ===================================
//  Image/video processing
//  Cryptography (hashing, encryption)
//  Data compression
//  Heavy mathematical calculations
//  PDF generation
//   I/O operations (use async instead!)
```

---

## Example 4: Memory Leak Detection & Prevention

```javascript
// ===================================
// Common Memory Leak: Growing Cache
// ===================================
//   MEMORY LEAK
const cache = {};

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  if (!cache[userId]) {
    cache[userId] = await fetchUser(userId);
  }

  res.json(cache[userId]);
  // Cache grows forever! Never cleaned up
});

//  FIX: LRU Cache with Size Limit
import { LRUCache } from "lru-cache";

const cache = new LRUCache({
  max: 500, // Maximum 500 items
  ttl: 1000 * 60 * 5, // 5 minutes TTL
  updateAgeOnGet: true // Reset TTL on access
});

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  let user = cache.get(userId);

  if (!user) {
    user = await fetchUser(userId);
    cache.set(userId, user);
  }

  res.json(user);
});

// ===================================
// Common Memory Leak: Event Listeners
// ===================================
//   MEMORY LEAK
function setupConnection(userId) {
  const connection = createConnection();

  emitter.on("data", (data) => {
    connection.send(data);
  });

  // Connection closes but listener remains!
}

//  FIX: Remove Listener
function setupConnection(userId) {
  const connection = createConnection();

  const handler = (data) => {
    connection.send(data);
  };

  emitter.on("data", handler);

  connection.on("close", () => {
    emitter.removeListener("data", handler); // Clean up!
  });
}

// ===================================
// Common Memory Leak: Closures
// ===================================
//   MEMORY LEAK
function createLargeObject() {
  const huge = new Array(1000000).fill("data");

  return {
    getData: () => {
      // Closure holds reference to 'huge' forever
      return huge[0];
    }
  };
}

const objects = [];
for (let i = 0; i < 100; i++) {
  objects.push(createLargeObject()); // Leaks memory!
}

//  FIX: Don't capture large objects
function createLargeObject() {
  const huge = new Array(1000000).fill("data");
  const firstItem = huge[0]; // Extract what you need

  return {
    getData: () => firstItem // Closure only captures small value
  };
}

// ===================================
// Monitor Memory Usage
// ===================================
setInterval(() => {
  const { heapUsed, heapTotal, external, rss } = process.memoryUsage();

  console.log({
    heapUsed: Math.round(heapUsed / 1024 / 1024) + " MB",
    heapTotal: Math.round(heapTotal / 1024 / 1024) + " MB",
    external: Math.round(external / 1024 / 1024) + " MB",
    rss: Math.round(rss / 1024 / 1024) + " MB"
  });

  // Alert if heap usage > 500 MB
  if (heapUsed > 500 * 1024 * 1024) {
    console.error("⚠️ High memory usage detected!");
  }
}, 30000);

// ===================================
// WeakMap for Cache (Auto Cleanup)
// ===================================
const cache = new WeakMap();

function getCachedData(obj) {
  if (cache.has(obj)) {
    return cache.get(obj);
  }

  const data = expensiveComputation(obj);
  cache.set(obj, data);
  return data;
}

// When obj is garbage collected, cache entry is automatically removed!

// ===================================
// Detect Memory Leaks
// ===================================
// 1. Use Chrome DevTools (Heap Snapshot)
// node --inspect server.js
// Open chrome://inspect → Take heap snapshots over time

// 2. Use clinic.js
// npm install -g clinic
// clinic doctor -- node server.js

// 3. Force GC for testing
// node --expose-gc server.js
if (global.gc) {
  global.gc();
  console.log("Garbage collection performed");
}
```

---

## Example 5: Performance Profiling

```javascript
// ===================================
// Measure Function Execution Time
// ===================================
import { performance } from "node:perf_hooks";

function measureTime(fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  console.log(`Execution time: ${(end - start).toFixed(2)}ms`);
  return result;
}

// Usage
const data = measureTime(() => {
  return processLargeDataset(dataset);
});

// ===================================
// Performance Hooks (PerformanceObserver)
// ===================================
import { PerformanceObserver, performance } from "node:perf_hooks";

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});

obs.observe({ entryTypes: ["measure"] });

// Mark start
performance.mark("db-query-start");
await db.query("SELECT * FROM users");
performance.mark("db-query-end");

// Measure duration
performance.measure("db-query", "db-query-start", "db-query-end");

// ===================================
// Express Middleware Performance
// ===================================
app.use((req, res, next) => {
  const start = performance.now();

  res.on("finish", () => {
    const duration = performance.now() - start;

    console.log({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: duration.toFixed(2) + "ms"
    });

    // Alert on slow requests
    if (duration > 1000) {
      console.warn("⚠️ Slow request detected:", req.path);
    }
  });

  next();
});

// ===================================
// CPU Profiling
// ===================================
// node --prof server.js
// ... run load tests ...
// node --prof-process isolate-*-v8.log > profile.txt

// Analyze profile.txt to find bottlenecks

// ===================================
// Flamegraph with 0x
// ===================================
// npm install -g 0x
// 0x server.js
// ... run load tests ...
// Ctrl+C
// Opens flamegraph in browser

// ===================================
// Benchmarking
// ===================================
import Benchmark from "benchmark";

const suite = new Benchmark.Suite();

suite
  .add("Array forEach", () => {
    const arr = [1, 2, 3, 4, 5];
    arr.forEach((x) => x * 2);
  })
  .add("Array map", () => {
    const arr = [1, 2, 3, 4, 5];
    arr.map((x) => x * 2);
  })
  .add("for loop", () => {
    const arr = [1, 2, 3, 4, 5];
    for (let i = 0; i < arr.length; i++) {
      arr[i] * 2;
    }
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  .run();

// ===================================
// Optimize V8
// ===================================
// node --max-old-space-size=4096 server.js  // Increase heap size
// node --optimize-for-size server.js  // Reduce memory footprint
// node --trace-opt --trace-deopt server.js  // See V8 optimizations
```

---

## Example 6: Graceful Shutdown

```javascript
// server.js
import express from "express";
import { createServer } from "node:http";
import { disconnectDB } from "./db/connection.js";

const app = express();
const server = createServer(app);

// ===================================
// Track Active Connections
// ===================================
let connections = [];

server.on("connection", (connection) => {
  connections.push(connection);

  connection.on("close", () => {
    connections = connections.filter((c) => c !== connection);
  });
});

// ===================================
// Graceful Shutdown
// ===================================
async function gracefulShutdown(signal) {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  // 1. Stop accepting new requests
  server.close(() => {
    console.log(" HTTP server closed");
  });

  // 2. Close existing connections
  connections.forEach((conn) => conn.end());

  setTimeout(() => {
    connections.forEach((conn) => conn.destroy());
  }, 10000); // Force close after 10 seconds

  // 3. Close database connections
  await disconnectDB();
  console.log(" Database disconnected");

  // 4. Complete pending operations
  await flushLogs();
  await closeRedis();

  console.log(" Graceful shutdown complete");
  process.exit(0);
}

// ===================================
// Handle Termination Signals
// ===================================
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// ===================================
// Handle Uncaught Errors
// ===================================
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
  console.log(`Server running on port ${PORT}`);
});
```

---

## Comparison Table: Worker Strategies

| Strategy           | Use Case            | Pros               | Cons                |
| ------------------ | ------------------- | ------------------ | ------------------- |
| **Event Loop**     | I/O operations      | Simple, efficient  | Blocks on CPU tasks |
| **worker_threads** | CPU-intensive tasks | True parallelism   | Higher memory usage |
| **cluster**        | HTTP load balancing | Multiple processes | No shared memory    |
| **child_process**  | External programs   | Isolation          | Slower IPC          |

---

## Summary

Advanced Node.js patterns:

1. **AsyncLocalStorage** - Context propagation without prop drilling
2. **EventEmitter** - Decoupled pub/sub for services
3. **worker_threads** - Offload CPU tasks to separate threads
4. **Memory Leaks** - Use LRU cache, remove listeners, avoid large closures
5. **WeakMap** - Auto cleanup when objects are GC'd
6. **Performance** - measure(), PerformanceObserver, profiling
7. **Graceful Shutdown** - Close connections cleanly on SIGTERM
8. **Error Handling** - Catch uncaughtException, unhandledRejection

Use these patterns to build production-grade Node.js applications!
