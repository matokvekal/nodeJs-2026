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