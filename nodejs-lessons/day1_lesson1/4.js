// Demonstrates how Node.js handles I/O asynchronously without blocking
import { readFile } from "node:fs/promises";

console.log("Start reading file...");

// Non-blocking file read - Node.js continues execution while waiting
readFile("./package.json", "utf8")
  .then((data) => {
    console.log("File read complete!");
    console.log("File size:", data.length, "characters");
  })
  .catch((err) => console.error("Error:", err));

// This line executes IMMEDIATELY without waiting for the file read
console.log("This runs BEFORE the file is read - non-blocking!");

// You can perform thousands of operations while waiting for I/O
for (let i = 0; i < 3; i++) {
  console.log(`Processing item ${i + 1}`);
}

// Expected Output:
// Start reading file...
// This runs BEFORE the file is read - non-blocking!
// Processing item 1
// Processing item 2
// Processing item 3
// File read complete!
// File size: XXX characters