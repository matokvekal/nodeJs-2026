// Node.js 18+ includes fetch API built-in - no need for axios for simple requests

// Simple GET request
async function fetchData() {
  try {
    console.log("Fetching data from API...");

    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1"
    );

    // Check if response is ok (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log("Data received:", data);
    console.log("Title:", data.title);
    console.log("Completed:", data.completed);
  } catch (error) {
    console.error("Fetch error:", error.message);
  }
}

// POST request with JSON body
async function createPost() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "Node.js 2026",
        body: "Modern Node.js with built-in fetch!",
        userId: 1
      })
    });

    const newPost = await response.json();
    console.log("Created post:", newPost);
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

// Execute the functions
fetchData();
createPost();