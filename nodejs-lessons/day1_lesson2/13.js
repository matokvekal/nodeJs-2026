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