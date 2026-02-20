// Save this as server-demo.js and run: node --watch server-demo.js
// Node will automatically restart when you modify and save this file

let requestCount = 0;

console.log("Server started at:", new Date().toLocaleTimeString());

// Simulate a simple server
setInterval(() => {
  requestCount++;
  console.log(
    `Request #${requestCount} processed at ${new Date().toLocaleTimeString()}`
  );
}, 2000);

// Try changing this message and save the file - Node will auto-restart!
console.log("Watching for file changes... Edit this file to see auto-restart!");

// Expected behavior:
// When you modify and save this file, Node.js automatically restarts
// No need for nodemon!