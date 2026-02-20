// Comprehensive error handling patterns with async/await

// Example 1: Basic try/catch
async function fetchDataBasic() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Catch both network errors and thrown errors
    console.error("Fetch failed:", error.message);

    // Can re-throw to propagate error
    // throw error;

    // Or return default value
    return null;
  }
}

// Example 2: Handling different error types
async function fetchDataAdvanced(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Validate data
    if (!data || !data.id) {
      throw new Error("Invalid data format");
    }

    return data;
  } catch (error) {
    // Handle different error types
      console.error("Network error or invalid JSON:", error.message);
      console.error("Request was aborted");
    } else {
      console.error("Unknown error:", error.message);
    }

    // Log stack trace for debugging
    console.error("Stack:", error.stack);

    throw error; // Re-throw to let caller handle
  }
}

// Example 3: Error handling without try/catch (using .catch())
async function fetchDataAlternative() {
  return fetch("https://jsonplaceholder.typicode.com/posts/1")
    .then((res) => res.json())
    .catch((error) => {
      console.error("Error:", error.message);
      return null; // Return default value on error
    });
}

// Testing error handling
fetchDataBasic();
fetchDataAdvanced("https://jsonplaceholder.typicode.com/posts/1");