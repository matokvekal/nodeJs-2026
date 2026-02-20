// This is why we moved to Promises - deeply nested callbacks ("Pyramid of Doom")
import { readFile, writeFile } from "node:fs";

// BAD - Callback Hell (don't write code like this!)
readFile("config.json", "utf8", (err, configData) => {
  if (err) {
    console.error("Error reading config:", err);
    return;
  }

  const config = JSON.parse(configData);

  readFile(config.dataFile, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading data:", err);
      return;
    }

    const processed = data.toUpperCase();

    writeFile("output.txt", processed, "utf8", (err) => {
      if (err) {
        console.error("Error writing output:", err);
        return;
      }

      console.log("All done!");
      // Imagine more nesting here... 😱
    });
  });
});

// Problems with callback hell:
// 1. Hard to read and understand
// 2. Difficult to handle errors
// 3. Code grows horizontally (nesting)
// 4. Hard to maintain and debug