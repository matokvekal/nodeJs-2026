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