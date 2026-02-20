# Day 1 - Presentation 2: Async Patterns & Control Flow - Code Examples

---

## Example 1: Callback Pattern (Error-First Callback)

```javascript
// Traditional Node.js callback pattern - error as first parameter
import { readFile } from "node:fs";

// Error-first callback function
function processFile(filename, callback) {
  // Read file with callback pattern
  readFile(filename, "utf8", (err, data) => {
    // First parameter is ALWAYS error (or null if no error)
    if (err) {
      // Pass error to callback - convention is (error, null)
      return callback(err, null);
    }

    // Process data
    const lines = data.split("\n").length;

    // Success - pass (null, result)
    callback(null, { filename, lines, size: data.length });
  });
}

// Using the callback
processFile("./package.json", (err, result) => {
  if (err) {
    console.error("Error reading file:", err.message);
    return;
  }

  console.log("File processed successfully:");
  console.log(`  Filename: ${result.filename}`);
  console.log(`  Lines: ${result.lines}`);
  console.log(`  Size: ${result.size} bytes`);
});

// Callback pattern rules:
// 1. First parameter is ALWAYS error (null if no error)
// 2. Second parameter is the result
// 3. Always check for error before using result
// 4. In 2026 - avoid creating new callback-based APIs
```

---

## Example 2: Callback Hell Problem

```javascript
// This is why we moved to Promises - deeply nested callbacks ("Pyramid of Doom")
import { readFile, writeFile } from "node:fs";

// BAD - Callback Hell (don't write code like this!)
readFile("config.json", "utf8", (err, configData) => {
  if (err) {
    console.error("Error reading config:", err);
    return;
  }

  const config = JSON.parse(configData);

  readFile(config.dataFile, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading data:", err);
      return;
    }

    const processed = data.toUpperCase();

    writeFile("output.txt", processed, "utf8", (err) => {
      if (err) {
        console.error("Error writing output:", err);
        return;
      }

      console.log("All done!");
      // Imagine more nesting here... 😱
    });
  });
});

// Problems with callback hell:
// 1. Hard to read and understand
// 2. Difficult to handle errors
// 3. Code grows horizontally (nesting)
// 4. Hard to maintain and debug
```

---

## Example 3: Converting Callbacks to Promises with util.promisify

```javascript
// util.promisify converts callback-style functions to Promise-based
import { readFile } from "node:fs";
import { promisify } from "node:util";

// Convert callback-based readFile to Promise-based
const readFilePromise = promisify(readFile);

// Now we can use async/await instead of callbacks
async function readFileModern() {
  try {
    const data = await readFilePromise("./package.json", "utf8");
    const json = JSON.parse(data);
    console.log("Package name:", json.name);
    console.log("Version:", json.version);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

readFileModern();

// Modern approach: Use fs/promises directly (no need to promisify)
import { readFile as readFileAsync } from "node:fs/promises";

async function readFileBestPractice() {
  try {
    const data = await readFileAsync("./package.json", "utf8");
    console.log("File read successfully!");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

readFileBestPractice();
```

---

## Example 4: Creating Promises Manually

```javascript
// Understanding how to create custom Promises

// Example 1: Simple Promise creation
function delay(ms) {
  return new Promise((resolve, reject) => {
    // resolve - function to call with success value
    // reject - function to call with error

    if (ms < 0) {
      reject(new Error("Delay cannot be negative"));
      return;
    }

    setTimeout(() => {
      resolve(`Waited ${ms}ms`);
    }, ms);
  });
}

// Using the Promise
delay(1000)
  .then((result) => {
    console.log(result); // "Waited 1000ms"
    return delay(500); // Chain another promise
  })
  .then((result) => {
    console.log(result); // "Waited 500ms"
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

// Example 2: Promise that simulates async data fetching
function fetchUser(userId) {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      if (userId <= 0) {
        reject(new Error("Invalid user ID"));
        return;
      }

      // Simulate database result
      resolve({
        id: userId,
        name: "John Doe",
        email: "john@example.com"
      });
    }, 500);
  });
}

// Using async/await with custom Promise
async function getUser() {
  try {
    const user = await fetchUser(1);
    console.log("User fetched:", user);
  } catch (error) {
    console.error("Failed to fetch user:", error.message);
  }
}

getUser();
```

---

## Example 5: Promise.resolve and Promise.reject

```javascript
// Quick ways to create resolved or rejected Promises

// Promise.resolve - creates an immediately resolved Promise
const immediateSuccess = Promise.resolve("Success!");
immediateSuccess.then((value) => console.log(value)); // "Success!"

// Promise.reject - creates an immediately rejected Promise
const immediateFailure = Promise.reject(new Error("Failed!"));
immediateFailure.catch((error) => console.error(error.message)); // "Failed!"

// Useful for:
// 1. Converting sync values to Promises
function getValue(useCache) {
  if (useCache) {
    return Promise.resolve("cached-value"); // Cached, return immediately
  }
  // Fetch from network (returns Promise)
  return fetch("/api/data").then((res) => res.json());
}

// 2. Early returns in async functions
async function validateAndProcess(data) {
  if (!data) {
    return Promise.reject(new Error("Data is required")); // Early return
  }

  // Process data...
  return processData(data);
}

// 3. Testing
async function testFunction() {
  // Return resolved Promise for testing success case
  return Promise.resolve({ status: "ok", data: [1, 2, 3] });
}
```

---

## Example 6: async/await - Modern Async Pattern

```javascript
// async/await makes asynchronous code look synchronous

// async function ALWAYS returns a Promise
async function fetchUserData(userId) {
  // await pauses execution until Promise resolves
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );
  const user = await response.json();
  return user; // Automatically wrapped in Promise
}

// Calling async function
fetchUserData(1)
  .then((user) => console.log("User:", user.name))
  .catch((error) => console.error("Error:", error));

// Or use await (must be in async function or top-level in ES modules)
async function main() {
  try {
    const user = await fetchUserData(1);
    console.log("Email:", user.email);

    const posts = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${user.id}`
    ).then((res) => res.json());

    console.log(`User has ${posts.length} posts`);
  } catch (error) {
    console.error("Error in main:", error.message);
  }
}

main();

// Important notes:
// 1. await can only be used inside async functions (or top-level ESM)
// 2. async function always returns a Promise
// 3. Throwing an error in async function = rejected Promise
// 4. Use try/catch to handle errors
```

---

## Example 7: Error Handling with async/await

```javascript
// Comprehensive error handling patterns with async/await

// Example 1: Basic try/catch
async function fetchDataBasic() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Catch both network errors and thrown errors
    console.error("Fetch failed:", error.message);

    // Can re-throw to propagate error
    // throw error;

    // Or return default value
    return null;
  }
}

// Example 2: Handling different error types
async function fetchDataAdvanced(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Validate data
    if (!data || !data.id) {
      throw new Error("Invalid data format");
    }

    return data;
  } catch (error) {
    // Handle different error types
    if (error.name === "TypeError") {
      console.error("Network error or invalid JSON:", error.message);
    } else if (error.name === "AbortError") {
      console.error("Request was aborted");
    } else {
      console.error("Unknown error:", error.message);
    }

    // Log stack trace for debugging
    console.error("Stack:", error.stack);

    throw error; // Re-throw to let caller handle
  }
}

// Example 3: Error handling without try/catch (using .catch())
async function fetchDataAlternative() {
  return fetch("https://jsonplaceholder.typicode.com/posts/1")
    .then((res) => res.json())
    .catch((error) => {
      console.error("Error:", error.message);
      return null; // Return default value on error
    });
}

// Testing error handling
fetchDataBasic();
fetchDataAdvanced("https://jsonplaceholder.typicode.com/posts/1");
```

---

## Example 8: Promise.all - Parallel Execution

```javascript
// Promise.all runs multiple Promises in PARALLEL and waits for ALL to complete

async function fetchMultipleUsers() {
  try {
    console.log("Fetching multiple users in parallel...");
    const startTime = Date.now();

    // These requests run IN PARALLEL (simultaneously)
    const results = await Promise.all([
      fetch("https://jsonplaceholder.typicode.com/users/1").then((r) =>
        r.json()
      ),
      fetch("https://jsonplaceholder.typicode.com/users/2").then((r) =>
        r.json()
      ),
      fetch("https://jsonplaceholder.typicode.com/users/3").then((r) =>
        r.json()
      )
    ]);

    const endTime = Date.now();
    console.log(`Fetched ${results.length} users in ${endTime - startTime}ms`);

    // Results are in the SAME ORDER as the promises array
    results.forEach((user, index) => {
      console.log(`User ${index + 1}: ${user.name}`);
    });

    return results;
  } catch (error) {
    // If ANY promise rejects, Promise.all immediately rejects
    console.error("One of the requests failed:", error.message);
    throw error;
  }
}

// Comparison: Sequential vs Parallel
async function compareSequentialVsParallel() {
  // Sequential - SLOW (waits for each to finish)
  console.log("\n=== Sequential (slow) ===");
  const seqStart = Date.now();
  const user1 = await fetch(
    "https://jsonplaceholder.typicode.com/users/1"
  ).then((r) => r.json());
  const user2 = await fetch(
    "https://jsonplaceholder.typicode.com/users/2"
  ).then((r) => r.json());
  const user3 = await fetch(
    "https://jsonplaceholder.typicode.com/users/3"
  ).then((r) => r.json());
  console.log(`Sequential took: ${Date.now() - seqStart}ms`);

  // Parallel - FAST (all at once)
  console.log("\n=== Parallel (fast) ===");
  const parStart = Date.now();
  const [p1, p2, p3] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/users/1").then((r) => r.json()),
    fetch("https://jsonplaceholder.typicode.com/users/2").then((r) => r.json()),
    fetch("https://jsonplaceholder.typicode.com/users/3").then((r) => r.json())
  ]);
  console.log(`Parallel took: ${Date.now() - parStart}ms`);
}

fetchMultipleUsers();
compareSequentialVsParallel();
```

---

## Example 9: Promise.allSettled - Handle Success and Failure

```javascript
// Promise.allSettled waits for ALL promises and returns results for each
// Unlike Promise.all, it doesn't fail fast - continues even if some fail

async function fetchUsersAndPosts() {
  // Some of these might fail - allSettled handles both success and failure
  const results = await Promise.allSettled([
    fetch("https://jsonplaceholder.typicode.com/users/1").then((r) => r.json()),
    fetch("https://invalid-url-that-fails.com/data").then((r) => r.json()), // Will fail
    fetch("https://jsonplaceholder.typicode.com/posts/1").then((r) => r.json()),
    Promise.reject(new Error("Simulated error")) // Will fail
  ]);

  console.log("\n=== Promise.allSettled Results ===");

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      // Success - access value with result.value
      console.log(`Promise ${index + 1}: SUCCESS`);
      console.log("  Value:", result.value);
    } else {
      // Failure - access error with result.reason
      console.log(`Promise ${index + 1}: FAILED`);
      console.log("  Reason:", result.reason.message);
    }
  });

  // Filter successful results
  const successful = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  console.log(`\n${successful.length} out of ${results.length} succeeded`);

  return results;
}

// Use case: Fetching from multiple sources where some might fail
async function fetchFromMultipleSources() {
  const sources = [
    "https://jsonplaceholder.typicode.com/users/1",
    "https://jsonplaceholder.typicode.com/users/2",
    "https://jsonplaceholder.typicode.com/users/999" // Might not exist
  ];

  const results = await Promise.allSettled(
    sources.map((url) =>
      fetch(url).then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
    )
  );

  const validUsers = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  console.log(`Fetched ${validUsers.length} valid users`);
  return validUsers;
}

fetchUsersAndPosts();
fetchFromMultipleSources();
```

---

## Example 10: Promise.race and Promise.any

```javascript
// Promise.race: Returns when the FIRST promise settles (success or fail)
// Promise.any: Returns when the FIRST promise SUCCEEDS (ignores failures)

// Example 1: Promise.race - timeout implementation
async function fetchWithTimeout(url, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Request timeout")), timeoutMs);
  });

  const fetchPromise = fetch(url).then((r) => r.json());

  try {
    // Race between fetch and timeout - first to finish wins
    const result = await Promise.race([fetchPromise, timeoutPromise]);
    console.log("Fetch succeeded before timeout:", result);
    return result;
  } catch (error) {
    console.error("Race failed:", error.message);
    throw error;
  }
}

// Better approach in Node.js 20+: Use AbortSignal.timeout
async function fetchWithTimeoutModern(url, timeoutMs) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs)
    });
    return await response.json();
  } catch (error) {
    if (error.name === "TimeoutError") {
      console.error("Request timed out");
    }
    throw error;
  }
}

// Example 2: Promise.any - first successful response
async function fetchFromFastestSource() {
  // Fetch from multiple mirrors - use whichever responds first
  const mirrors = [
    "https://jsonplaceholder.typicode.com/users/1",
    "https://jsonplaceholder.typicode.com/users/1",
    "https://jsonplaceholder.typicode.com/users/1"
  ];

  try {
    // Returns the FIRST successful result (ignores failures)
    const result = await Promise.any(
      mirrors.map((url) => fetch(url).then((r) => r.json()))
    );

    console.log("Got response from fastest mirror:", result);
    return result;
  } catch (error) {
    // AggregateError - thrown when ALL promises fail
    console.error("All sources failed:", error.errors);
  }
}

// Testing
fetchWithTimeout("https://jsonplaceholder.typicode.com/posts/1", 5000);
fetchFromFastestSource();
```

---

## Example 11: finally - Always Execute Cleanup

```javascript
// finally block runs NO MATTER WHAT - success, error, or return

// Example 1: Resource cleanup
async function processFileWithCleanup(filename) {
  let fileHandle;

  try {
    console.log("Opening file...");
    const { open } = await import("node:fs/promises");
    fileHandle = await open(filename, "r");

    console.log("Reading file...");
    const content = await fileHandle.readFile("utf8");

    // Simulate processing
    return content.length;
  } catch (error) {
    console.error("Error processing file:", error.message);
    throw error;
  } finally {
    // This ALWAYS runs - even with error or early return
    if (fileHandle) {
      console.log("Closing file in finally block...");
      await fileHandle.close();
    }
    console.log("Cleanup complete!");
  }
}

// Example 2: Hiding loading spinner
async function fetchDataWithLoading() {
  let isLoading = true;
  console.log("Loading: ", isLoading);

  try {
    const data = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1"
    ).then((r) => r.json());

    console.log("Data fetched:", data.title);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error.message);
    throw error;
  } finally {
    // Hide loading spinner whether success or failure
    isLoading = false;
    console.log("Loading: ", isLoading);
  }
}

// Example 3: With Promise chain (not async/await)
fetch("https://jsonplaceholder.typicode.com/users/1")
  .then((response) => response.json())
  .then((user) => {
    console.log("User loaded:", user.name);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  })
  .finally(() => {
    console.log("Request complete - cleanup done");
  });

// Testing
processFileWithCleanup("./package.json");
fetchDataWithLoading();
```

---

## Example 12: for await...of with Async Iterators

```javascript
// for await...of allows iterating over async data sources

// Example 1: Async generator function
async function* generateNumbers() {
  for (let i = 1; i <= 5; i++) {
    // Simulate async operation (e.g., fetching from API)
    await new Promise((resolve) => setTimeout(resolve, 500));
    yield i; // Yield value asynchronously
  }
}

async function processAsyncGenerator() {
  console.log("Processing async generator...");

  // for await...of automatically waits for each Promise
  for await (const num of generateNumbers()) {
    console.log("Received number:", num);
  }

  console.log("Generator complete!");
}

// Example 2: Reading large file in chunks
async function processLargeFile() {
  const { open } = await import("node:fs/promises");

  const fileHandle = await open("./package.json", "r");

  try {
    let chunkNumber = 0;

    // Read file chunk by chunk using async iteration
    for await (const chunk of fileHandle.readableWebStream()) {
      chunkNumber++;
      console.log(`Chunk ${chunkNumber}: ${chunk.length} bytes`);
      // Process chunk here
    }

    console.log(`Processed ${chunkNumber} chunks`);
  } finally {
    await fileHandle.close();
  }
}

// Example 3: Async iteration over array of Promises
async function processMultipleUrls() {
  const urls = [
    "https://jsonplaceholder.typicode.com/posts/1",
    "https://jsonplaceholder.typicode.com/posts/2",
    "https://jsonplaceholder.typicode.com/posts/3"
  ];

  // Create async iterable from array
  async function* fetchUrls(urls) {
    for (const url of urls) {
      yield fetch(url).then((r) => r.json());
    }
  }

  // Process one at a time
  for await (const post of fetchUrls(urls)) {
    console.log("Post title:", post.title);
  }
}

processAsyncGenerator();
// processLargeFile();
processMultipleUrls();
```

---

## Example 13: AbortSignal for Cancellation

```javascript
// AbortSignal provides a standard way to cancel async operations

// Example 1: Multiple operations with same signal
async function fetchMultipleWithCancel() {
  const controller = new AbortController();
  const { signal } = controller;

  // Cancel after 2 seconds
  setTimeout(() => {
    console.log("Aborting all requests...");
    controller.abort();
  }, 2000);

  try {
    // All these requests share the same abort signal
    const results = await Promise.all(
      [
        fetch("https://jsonplaceholder.typicode.com/posts/1", { signal }),
        fetch("https://jsonplaceholder.typicode.com/posts/2", { signal }),
        fetch("https://jsonplaceholder.typicode.com/posts/3", { signal })
      ].map((p) => p.then((r) => r.json()))
    );

    console.log("All fetched:", results.length);
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Requests were cancelled");
    } else {
      console.error("Error:", error.message);
    }
  }
}

// Example 2: Manual checking of abort signal
async function longRunningTask(signal) {
  for (let i = 0; i < 10; i++) {
    // Check if aborted before each iteration
    if (signal.aborted) {
      throw new Error("Task was aborted");
    }

    console.log(`Processing step ${i + 1}/10`);
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  return "Task completed";
}

async function runLongTask() {
  const controller = new AbortController();

  // Cancel after 1.5 seconds
  setTimeout(() => controller.abort(), 1500);

  try {
    const result = await longRunningTask(controller.signal);
    console.log(result);
  } catch (error) {
    console.error("Task interrupted:", error.message);
  }
}

// Example 3: addEventListener with signal auto-removal
const controller = new AbortController();

// Event listener is automatically removed when signal aborts
document?.addEventListener?.(
  "click",
  () => {
    console.log("Clicked!");
  },
  { signal: controller.signal }
);

// Stop listening after 5 seconds
setTimeout(() => controller.abort(), 5000);

fetchMultipleWithCancel();
runLongTask();
```

---

## Comparison Table: Promise Methods

| Method                 | Returns When   | Fails When                  | Use Case                                        |
| ---------------------- | -------------- | --------------------------- | ----------------------------------------------- |
| **Promise.all**        | All succeed    | Any fails (fail-fast)       | All results needed, can't continue if one fails |
| **Promise.allSettled** | All complete   | Never (returns all results) | Want results even if some fail                  |
| **Promise.race**       | First settles  | First fails                 | Timeout, fastest source wins                    |
| **Promise.any**        | First succeeds | All fail (AggregateError)   | At least one success needed                     |

---

## Comparison Table: Async Patterns Evolution

| Pattern             | Syntax                      | Pros                          | Cons                          | Use in 2026            |
| ------------------- | --------------------------- | ----------------------------- | ----------------------------- | ---------------------- |
| **Callbacks**       | `fs.readFile(path, cb)`     | Simple, universal             | Callback hell, error handling | Legacy only            |
| **Promises**        | `.then().catch()`           | Chainable, better errors      | Still nesting                 | When needed            |
| **async/await**     | `await promise`             | Sync-like, clean              | Requires async function       | ✅ Preferred           |
| **Async Iterators** | `for await (const x of it)` | Stream-like, memory efficient | More complex                  | For streams/large data |

---

## Summary

Modern async patterns in Node.js:

1. **async/await** - The standard way to write async code (looks like sync code)
2. **Promise.all** - Run multiple operations in parallel
3. **Promise.allSettled** - Handle both success and failure gracefully
4. **try/catch/finally** - Robust error handling and cleanup
5. **for await...of** - Iterate over async data sources
6. **AbortSignal** - Cancel operations universally
7. **Avoid callbacks** - Use Promises/async-await for new code

Always prefer modern patterns for cleaner, more maintainable code!
