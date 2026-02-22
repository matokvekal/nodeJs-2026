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