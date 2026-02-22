// The finally block ALWAYS executes - perfect for cleanup

import { open } from "node:fs/promises";

async function processFileWithCleanup(filePath) {
  let fileHandle;

  try {
    console.log("Opening file...");
    fileHandle = await open(filePath, "r");

    console.log("Reading file...");
    const content = await fileHandle.readFile("utf8");

    // Simulate an error during processing
    if (content.length < 10) {
      throw new Error("File content too short");
    }

    console.log("Processing content...");
    console.log("First 50 characters:", content.substring(0, 50));

    return content;
  } catch (error) {
    // Handle errors (file not found, read error, processing error)
    console.error("Error occurred:", error.message);

    // Log the error type
    if (error.code === "ENOENT") {
      console.error("File not found!");
    } else {
      console.error("Processing failed");
    }

    // Re-throw if you want calling code to handle it
    // throw error;
  } finally {
    // This ALWAYS runs - even if there was an error or early return
    if (fileHandle) {
      console.log("Closing file handle... (cleanup in finally)");
      await fileHandle.close();
    }
    console.log("Cleanup complete!");
  }
}

// Test with existing file
processFileWithCleanup("./package.json");

// Test with non-existent file
// processFileWithCleanup('./nonexistent.txt');
