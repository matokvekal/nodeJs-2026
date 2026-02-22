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


  results.forEach((result, index) => {
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
    .map((r) => r.value);

  console.log(`Fetched ${validUsers.length} valid users`);
  return validUsers;
}

fetchUsersAndPosts();
fetchFromMultipleSources();