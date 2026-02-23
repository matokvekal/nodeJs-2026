// Heavy Computation (blocks Event Loop)
//   DON'T do this in main thread!
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("=== Worker Threads Demo ===\n");

// Create a worker script dynamically
import { Worker } from "node:worker_threads";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";

// Create worker file
const workerCode = `
import { parentPort, workerData } from "node:worker_threads";

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(workerData.n);
parentPort.postMessage({ result });
`;

writeFileSync("fibonacci-worker.js", workerCode);

// Run Worker Function
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

// Test without worker (blocks!)
console.log("Computing fibonacci(40) in main thread...");
const start1 = Date.now();
const result1 = fibonacci(40);
const time1 = Date.now() - start1;
console.log(`Result: ${result1}`);
console.log(`Time: ${time1}ms`);
console.log("⚠️  Main thread was blocked for", time1, "ms!\n");

// Test with worker (non-blocking!)
console.log("Computing fibonacci(40) in worker thread...");
const start2 = Date.now();
const result2 = await runWorker("./fibonacci-worker.js", { n: 40 });
const time2 = Date.now() - start2;
console.log(`Result: ${result2}`);
console.log(`Time: ${time2}ms`);
console.log(" Main thread remained responsive!\n");

// Worker Pool (Reusable Workers)
class WorkerPool {
  constructor(workerPath, numWorkers = os.cpus().length) {
    this.workerPath = workerPath;
    this.workers = [];
    this.queue = [];

    console.log(`Creating worker pool with ${numWorkers} workers...`);

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

// Test worker pool
console.log("Testing worker pool with multiple tasks...");
const pool = new WorkerPool("./fibonacci-worker.js", 4);

const tasks = [35, 36, 37, 38, 39, 40];
const start3 = Date.now();

const results = await Promise.all(tasks.map((n) => pool.execute({ n })));

const time3 = Date.now() - start3;

console.log(
  "Results:",
  results.map((r) => r.result)
);
console.log(`Total time with pool: ${time3}ms`);

await pool.close();

console.log("\nUse Cases for worker_threads:");
console.log(" Image/video processing");
console.log(" Cryptography (hashing, encryption)");
console.log(" Data compression");
console.log(" Heavy mathematical calculations");
console.log(" PDF generation");
console.log("  I/O operations (use async instead!)");
