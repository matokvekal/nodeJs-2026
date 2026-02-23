// Implementing retry logic for making reliable HTTP requests

// Retry with exponential backoff
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1}/${maxRetries + 1}...`);

      const response = await fetch(url, options);

      // Success - return response
      if (response.ok) {
        console.log(" Request succeeded");
        return response;
      }

      // Don't retry client errors (4xx) except 429
      if (
        response.status >= 400 &&
        response.status < 500 &&
        response.status !== 429
      ) {
        throw new Error(`HTTP ${response.status} - not retrying client error`);
      }

      // For 429, check Retry-After header
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        if (retryAfter) {
          const waitSeconds = Number(retryAfter);
          console.log(`Rate limited. Waiting ${waitSeconds}s...`);
          await new Promise((resolve) =>
            setTimeout(resolve, waitSeconds * 1000)
          );
          continue; // Retry without counting as attempt
        }
      }

      const error = new Error(`HTTP ${response.status}`);
      error.response = response;
      throw error;
    } catch (error) {
      lastError = error;

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s, 8s...
      const delay = Math.min(1000 * Math.pow(2, attempt), 30000); // Max 30s

      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 1000;
      const totalDelay = delay + jitter;

      console.log(
        `  Attempt failed. Retrying in ${(totalDelay / 1000).toFixed(2)}s...`
      );
      await new Promise((resolve) => setTimeout(resolve, totalDelay));
    }
  }

  // All retries exhausted
  throw new Error(
    `Failed after ${maxRetries + 1} attempts: ${lastError.message}`
  );
}

// Test with an unreliable endpoint
async function testRetry() {
  try {
    const response = await fetchWithRetry(
      "https://jsonplaceholder.typicode.com/posts/1",
      {},
      3 // Max 3 retries
    );

    const data = await response.json();
    console.log("Data:", data);
  } catch (error) {
    console.error("Final error:", error.message);
  }
}

testRetry();

// Retry strategy:
// - Retry 5xx errors (server errors)
// - Retry network errors (ECONNREFUSED, etc.)
// - Retry 429 (rate limit) with Retry-After
// - Don't retry 4xx errors (client errors)
// - Use exponential backoff with jitter
// - Set maximum retry delay (e.g., 30 seconds)
