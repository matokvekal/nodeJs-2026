// Inside an I/O callback, setImmediate always runs before setTimeout(0)
import { readFile } from "node:fs";

readFile("./package.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  console.log("Inside I/O callback");

  // These will execute after the current I/O callback completes
  setTimeout(() => {
    console.log("setTimeout - timer phase");
  }, 0);

  setImmediate(() => {
    console.log("setImmediate - ALWAYS runs first inside I/O callback");
  });
});

// Expected Output:
// Inside I/O callback
// setImmediate - ALWAYS runs first inside I/O callback
// setTimeout - timer phase