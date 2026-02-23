# Day 1 - Presentation 1: Modern Node.js Runtime - Code Examples

---

## Example 1: V8 Memory Usage Information

```javascript
// This example shows how to get V8 heap statistics
import v8 from "node:v8";

// Get heap statistics from V8 engine
const heapStats = v8.getHeapStatistics();

console.log("=== V8 Heap Memory Statistics ===");
console.log(
  `Total Heap Size: ${(heapStats.total_heap_size / 1024 / 1024).toFixed(2)} MB`
);
console.log(
  `Used Heap Size: ${(heapStats.used_heap_size / 1024 / 1024).toFixed(2)} MB`
);
console.log(
  `Heap Size Limit: ${(heapStats.heap_size_limit / 1024 / 1024).toFixed(2)} MB`
);
console.log(
  `Total Available: ${(heapStats.total_available_size / 1024 / 1024).toFixed(2)} MB`
);

// Get the percentage of memory used
const percentUsed = (
  (heapStats.used_heap_size / heapStats.heap_size_limit) *
  100
).toFixed(2);
console.log(`Memory Usage: ${percentUsed}%`);

// Expected Output:
// V8 allocates memory in a heap
// Shows current memory consumption
// Helps identify memory leaks
```

---

## Example 2: Event Loop Phases - Execution Order

```javascript
// This demonstrates the phases of the Event Loop and their execution order

console.log("1: Synchronous code - runs first");

// process.nextTick - highest priority, runs before any other async operations
process.nextTick(() => {
  console.log("2: process.nextTick - runs before all other async tasks");
});

// Promise microtask - runs after nextTick but before timers
Promise.resolve().then(() => {
  console.log("3: Promise.then - microtask queue");
});

// queueMicrotask - another microtask, runs with Promise.then
queueMicrotask(() => {
  console.log("4: queueMicrotask - also in microtask queue");
});

// setTimeout - timer phase (macrotask)
setTimeout(() => {
  console.log("5: setTimeout 0ms - timer phase");
}, 0);

// setImmediate - check phase (after poll phase)
setImmediate(() => {
  console.log("6: setImmediate - check phase");
});

console.log("7: More synchronous code - runs second");

// Expected Output Order:
// 1, 7 (sync code)
// 2 (nextTick)
// 3, 4 (microtasks)
// 5, 6 (macrotasks - order may vary outside I/O callbacks)
```

---

## Example 3: setImmediate vs setTimeout Inside I/O Callback

```javascript
// Inside an I/O callback, setImmediate always runs before setTimeout(0)
import { readFile } from "node:fs";

readFile("./package.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  console.log("Inside I/O callback");

  // These will execute after the current I/O callback completes
  setTimeout(() => {
    console.log("setTimeout - timer phase");
  }, 0);

  setImmediate(() => {
    console.log("setImmediate - ALWAYS runs first inside I/O callback");
  });
});

// Expected Output:
// Inside I/O callback
// setImmediate - ALWAYS runs first inside I/O callback
// setTimeout - timer phase
```

---

## Example 4: Non-Blocking I/O in Action

```javascript
// Demonstrates how Node.js handles I/O asynchronously without blocking
import { readFile } from "node:fs/promises";

console.log("Start reading file...");

// Non-blocking file read - Node.js continues execution while waiting
readFile("./package.json", "utf8")
  .then((data) => {
    console.log("File read complete!");
    console.log("File size:", data.length, "characters");
  })
  .catch((err) => console.error("Error:", err));

// This line executes IMMEDIATELY without waiting for the file read
console.log("This runs BEFORE the file is read - non-blocking!");

// You can perform thousands of operations while waiting for I/O
for (let i = 0; i < 3; i++) {
  console.log(`Processing item ${i + 1}`);
}

// Expected Output:
// Start reading file...
// This runs BEFORE the file is read - non-blocking!
// Processing item 1
// Processing item 2
// Processing item 3
// File read complete!
// File size: XXX characters
```

---

## Example 5: Process Object - Environment Variables and Arguments

```javascript
// The process object provides information about the current Node.js process

// Environment Variables
console.log("=== Environment Variables ===");
console.log("Node Environment:", process.env.NODE_ENV || "development");
console.log("Port:", process.env.PORT || 3000);

// Command Line Arguments
// Run: node script.js arg1 arg2 arg3
console.log("\n=== Command Line Arguments ===");
console.log("All arguments:", process.argv);
console.log("Script path:", process.argv[1]);
console.log("User arguments:", process.argv.slice(2));

// Process Information
console.log("\n=== Process Information ===");
console.log("Process ID (PID):", process.pid);
console.log("Node.js Version:", process.version);
console.log("Platform:", process.platform);
console.log("Current Working Directory:", process.cwd());

// Memory Usage
const memUsage = process.memoryUsage();
console.log("\n=== Memory Usage ===");
console.log(`RSS: ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`);
console.log(`Heap Used: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);

// Exit code (0 = success, non-zero = error)
// Uncomment to exit: process.exit(0);
```

---

## Example 6: Built-in Fetch API (Node.js 18+)

```javascript
// Node.js 18+ includes fetch API built-in - no need for axios for simple requests

// Simple GET request
async function fetchData() {
  try {
    console.log("Fetching data from API...");

    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1"
    );

    // Check if response is ok (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log("Data received:", data);
    console.log("Title:", data.title);
    console.log("Completed:", data.completed);
  } catch (error) {
    console.error("Fetch error:", error.message);
  }
}

// POST request with JSON body
async function createPost() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "Node.js 2026",
        body: "Modern Node.js with built-in fetch!",
        userId: 1
      })
    });

    const newPost = await response.json();
    console.log("Created post:", newPost);
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

// Execute the functions
fetchData();
createPost();
```

---

## Example 7: AbortController for Request Timeout

```javascript
// AbortController allows you to cancel async operations

// Example 1: Timeout with AbortSignal.timeout (Node.js 20+)
async function fetchWithTimeout() {
  try {
    console.log("Fetching with 3 second timeout...");

    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      signal: AbortSignal.timeout(3000) // Automatically abort after 3 seconds
    });

    const data = await response.json();
    console.log("Success! Received", data.length, "posts");
  } catch (error) {
    if (error.name === "TimeoutError") {
      console.error("Request timed out after 3 seconds");
    } else if (error.name === "AbortError") {
      console.error("Request was aborted");
    } else {
      console.error("Error:", error.message);
    }
  }
}

// Example 2: Manual abort with AbortController
async function fetchWithManualAbort() {
  const controller = new AbortController();
  const { signal } = controller;

  // Abort after 2 seconds
  const timeoutId = setTimeout(() => {
    console.log("Aborting request...");
    controller.abort();
  }, 2000);

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users", {
      signal
    });

    const users = await response.json();
    console.log("Fetched", users.length, "users");
    clearTimeout(timeoutId); // Clear timeout if request succeeds
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Request was manually aborted");
    } else {
      console.error("Error:", error);
    }
  }
}

fetchWithTimeout();
fetchWithManualAbort();
```

---

## Example 8: AbortSignal.any() - Multiple Abort Conditions

```javascript
// Combine multiple abort signals - abort when ANY of them triggers

async function fetchWithMultipleAbortConditions() {
  // Create multiple abort controllers for different conditions
  const userAbortController = new AbortController();
  const timeoutController = new AbortController();

  // Simulate user clicking "cancel" after 1.5 seconds
  setTimeout(() => {
    console.log("User clicked cancel!");
    userAbortController.abort();
  }, 1500);

  // Set a timeout of 5 seconds
  setTimeout(() => {
    console.log("Timeout reached!");
    timeoutController.abort();
  }, 5000);

  try {
    // Abort when EITHER user cancels OR timeout is reached
    const combinedSignal = AbortSignal.any([
      userAbortController.signal,
      timeoutController.signal
    ]);

    const response = await fetch(
      "https://jsonplaceholder.typicode.com/photos",
      {
        signal: combinedSignal
      }
    );

    const photos = await response.json();
    console.log("Success! Fetched", photos.length, "photos");
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Request aborted - either by user or timeout");
    } else {
      console.error("Error:", error.message);
    }
  }
}

fetchWithMultipleAbortConditions();
```

---

## Example 9: --watch Mode (Node.js 18+)

```javascript
// Save this as server-demo.js and run: node --watch server-demo.js
// Node will automatically restart when you modify and save this file

let requestCount = 0;

console.log("Server started at:", new Date().toLocaleTimeString());

// Simulate a simple server
setInterval(() => {
  requestCount++;
  console.log(
    `Request #${requestCount} processed at ${new Date().toLocaleTimeString()}`
  );
}, 2000);

// Try changing this message and save the file - Node will auto-restart!
console.log("Watching for file changes... Edit this file to see auto-restart!");

// Expected behavior:
// When you modify and save this file, Node.js automatically restarts
// No need for nodemon!
```

---

## Example 10: --env-file for Environment Variables (Node.js 20.6+)

```javascript
// Create a .env file with:
// PORT=4000
// NODE_ENV=development
// DATABASE_URL=mongodb://localhost:27017/mydb
// API_KEY=secret123

// Then run: node --env-file=.env server.js

console.log("=== Environment Variables Loaded ===");
console.log("Port:", process.env.PORT);
console.log("Environment:", process.env.NODE_ENV);
console.log("Database URL:", process.env.DATABASE_URL);
console.log("API Key:", process.env.API_KEY ? "LOADED (hidden)" : "NOT LOADED");

// No need for dotenv package anymore!
// Node.js loads .env variables natively

// Simulate server starting
const port = process.env.PORT || 3000;
console.log(`\nServer would start on port ${port}`);

// Best practice: Never commit .env to Git
// Create .env.example instead:
/*
PORT=3000
NODE_ENV=development
DATABASE_URL=your_database_url
API_KEY=your_api_key
*/
```

---

## Example 11: try/catch/finally for Resource Cleanup

```javascript
// The finally block ALWAYS executes - perfect for cleanup

import { open } from "node:fs/promises";

async function processFileWithCleanup(filePath) {
  let fileHandle;

  try {
    console.log("Opening file...");
    fileHandle = await open(filePath, "r");

    console.log("Reading file...");
    const content = await fileHandle.readFile("utf8");

    // Simulate an error during processing
    if (content.length < 10) {
      throw new Error("File content too short");
    }

    console.log("Processing content...");
    console.log("First 50 characters:", content.substring(0, 50));

    return content;
  } catch (error) {
    // Handle errors (file not found, read error, processing error)
    console.error("Error occurred:", error.message);

    // Log the error type
    if (error.code === "ENOENT") {
      console.error("File not found!");
    } else {
      console.error("Processing failed");
    }

    // Re-throw if you want calling code to handle it
    // throw error;
  } finally {
    // This ALWAYS runs - even if there was an error or early return
    if (fileHandle) {
      console.log("Closing file handle... (cleanup in finally)");
      await fileHandle.close();
    }
    console.log("Cleanup complete!");
  }
}

// Test with existing file
processFileWithCleanup("./package.json");

// Test with non-existent file
// processFileWithCleanup('./nonexistent.txt');
```

---

## Example 12: Uncaught Exceptions and Unhandled Rejections

```javascript
// Global error handlers - last line of defense

// Handle uncaught exceptions (synchronous errors)
process.on("uncaughtException", (error, origin) => {
  console.error("=== UNCAUGHT EXCEPTION ===");
  console.error("Error:", error.message);
  console.error("Origin:", origin);
  console.error("Stack:", error.stack);

  // Log to file or error tracking service
  // Then exit gracefully
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("=== UNHANDLED PROMISE REJECTION ===");
  console.error("Reason:", reason);
  console.error("Promise:", promise);

  // In production: log and exit
  process.exit(1);
});

// Example: This will trigger unhandledRejection
// Uncomment to test:
// Promise.reject(new Error('Unhandled promise rejection!'));

// Example: This will trigger uncaughtException
// Uncomment to test (after a delay to see other examples):
// setTimeout(() => {
//   throw new Error('Uncaught exception!');
// }, 100);

console.log("Error handlers are set up. Application running...");

// Best Practice:
// - Always handle errors in try/catch or .catch()
// - These global handlers are for UNEXPECTED errors only
// - Always log errors before exiting
// - Use error monitoring services in production (Sentry, Datadog, etc.)
```

---

## Comparison Table: Microtasks vs Macrotasks

| Feature             | Microtasks                                            | Macrotasks                                                 |
| ------------------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| **Examples**        | Promise.then(), queueMicrotask(), process.nextTick()  | setTimeout(), setInterval(), setImmediate(), I/O callbacks |
| **Priority**        | High - execute before next macrotask                  | Lower - execute in phases                                  |
| **When Execute**    | After current operation, before next event loop phase | In specific event loop phases                              |
| **Use Case**        | Quick operations, state updates                       | Timers, I/O operations, deferred work                      |
| **Can Starve Loop** | Yes - too many microtasks block macrotasks            | No - each phase has limits                                 |

---

## Comparison Table: setImmediate vs setTimeout(0)

| Aspect          | setImmediate                      | setTimeout(0)                |
| --------------- | --------------------------------- | ---------------------------- |
| **Phase**       | Check phase                       | Timers phase                 |
| **Inside I/O**  | Always fires first                | Fires after setImmediate     |
| **Outside I/O** | Order not guaranteed              | Order not guaranteed         |
| **Use Case**    | Defer execution to next iteration | Schedule after minimum delay |
| **Recommended** | Yes - more predictable in I/O     | Use setImmediate instead     |

---

## Summary

Modern Node.js (2026) provides powerful built-in features:

1. **V8 Engine** - JIT compilation, efficient garbage collection
2. **Event Loop** - Non-blocking I/O with defined phases
3. **Microtasks** - High-priority tasks (Promises, nextTick)
4. **Built-in fetch** - No need for axios for simple HTTP requests
5. **AbortSignal** - Universal cancellation mechanism
6. **--watch mode** - Auto-restart on file changes
7. **--env-file** - Native environment variable loading
8. **try/catch/finally** - Reliable resource cleanup

Always use modern patterns and APIs for cleaner, more maintainable code!
