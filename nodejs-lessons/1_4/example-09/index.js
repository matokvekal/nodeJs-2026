// Making HTTP requests with Node.js built-in fetch (Node 18+)

// GET request
async function getUser(userId) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );

    // Check status code
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const user = await response.json();
    console.log("User:", user);
    return user;
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
}

// POST request with JSON body
async function createPost(post) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(post)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const created = await response.json();
    console.log("Created post:", created);
    return created;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Request with timeout using AbortSignal
async function fetchWithTimeout(url, timeoutMs) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs)
    });

    return await response.json();
  } catch (error) {
      console.error("Request timed out after", timeoutMs, "ms");
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
}

// Request with custom headers and auth
async function fetchWithAuth(url, token) {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

      throw new Error("Unauthorized - invalid token");
    }

    return await response.json();
  } catch (error) {
    console.error("Auth error:", error.message);
    throw error;
  }
}

// Test the functions
getUser(1);
createPost({
  title: "Node.js 2026",
  body: "Modern Node.js with built-in fetch",
  userId: 1
});
fetchWithTimeout("https://jsonplaceholder.typicode.com/posts/1", 5000);