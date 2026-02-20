// Traditional Node.js callback pattern - error as first parameter
import { readFile } from "node:fs";

// Error-first callback function
function processFile(filename, callback) {
  // Read file with callback pattern
  readFile(filename, "utf8", (err, data) => {
    // First parameter is ALWAYS error (or null if no error)
    if (err) {
      // Pass error to callback - convention is (error, null)
      return callback(err, null);
    }

    // Process data
    const lines = data.split("\n").length;

    // Success - pass (null, result)
    callback(null, { filename, lines, size: data.length });
  });
}

// Using the callback
processFile("./package.json", (err, result) => {
  if (err) {
    console.error("Error reading file:", err.message);
    return;
  }

  console.log("File processed successfully:");
  console.log(`  Filename: ${result.filename}`);
  console.log(`  Lines: ${result.lines}`);
  console.log(`  Size: ${result.size} bytes`);
});

// Callback pattern rules:
// 1. First parameter is ALWAYS error (null if no error)
// 2. Second parameter is the result
// 3. Always check for error before using result
// 4. In 2026 - avoid creating new callback-based APIs