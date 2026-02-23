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