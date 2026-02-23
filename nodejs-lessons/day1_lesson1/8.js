// Combine multiple abort signals - abort when ANY of them triggers

async function fetchWithMultipleAbortConditions() {
  // Create multiple abort controllers for different conditions
  const userAbortController = new AbortController();
  const timeoutController = new AbortController();

  // Simulate user clicking "cancel" after 1.5 seconds
  setTimeout(() => {
    console.log("User clicked cancel!");
    userAbortController.abort();
  }, 1500);

  // Set a timeout of 5 seconds
  setTimeout(() => {
    console.log("Timeout reached!");
    timeoutController.abort();
  }, 5000);

  try {
    // Abort when EITHER user cancels OR timeout is reached
    const combinedSignal = AbortSignal.any([
      userAbortController.signal,
      timeoutController.signal
    ]);

    const response = await fetch(
      "https://jsonplaceholder.typicode.com/photos",
      {
        signal: combinedSignal
      }
    );

    const photos = await response.json();
    console.log("Success! Fetched", photos.length, "photos");
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("Request aborted - either by user or timeout");
    } else {
      console.error("Error:", error.message);
    }
  }
}

fetchWithMultipleAbortConditions();