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