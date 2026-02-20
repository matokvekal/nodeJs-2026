// finally block runs NO MATTER WHAT - success, error, or return

// Example 1: Resource cleanup
async function processFileWithCleanup(filename) {
  let fileHandle;

  try {
    console.log("Opening file...");
    const { open } = await import("node:fs/promises");
    fileHandle = await open(filename, "r");

    console.log("Reading file...");
    const content = await fileHandle.readFile("utf8");

    // Simulate processing
    return content.length;
  } catch (error) {
    console.error("Error processing file:", error.message);
    throw error;
  } finally {
    // This ALWAYS runs - even with error or early return
    if (fileHandle) {
      console.log("Closing file in finally block...");
      await fileHandle.close();
    }
    console.log("Cleanup complete!");
  }
}

// Example 2: Hiding loading spinner
async function fetchDataWithLoading() {
  let isLoading = true;
  console.log("Loading: ", isLoading);

  try {
    const data = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1"
    ).then((r) => r.json());

    console.log("Data fetched:", data.title);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error.message);
    throw error;
  } finally {
    // Hide loading spinner whether success or failure
    isLoading = false;
    console.log("Loading: ", isLoading);
  }
}

// Example 3: With Promise chain (not async/await)
fetch("https://jsonplaceholder.typicode.com/users/1")
  .then((response) => response.json())
  .then((user) => {
    console.log("User loaded:", user.name);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  })
  .finally(() => {
    console.log("Request complete - cleanup done");
  });

// Testing
processFileWithCleanup("./package.json");
fetchDataWithLoading();