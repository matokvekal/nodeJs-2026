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
      console.error("Request timed out after 3 seconds");
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
      console.error("Request was manually aborted");
    } else {
      console.error("Error:", error);
    }
  }
}

fetchWithTimeout();
fetchWithManualAbort();