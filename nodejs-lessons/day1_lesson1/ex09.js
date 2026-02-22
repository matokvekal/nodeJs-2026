// Save this as ex09.js and run: node --watch ex09.js
// Node will automatically restart when you modify and save this file

let requestCount = 0;

console.log("Server started at  :", new Date().toLocaleTimeString());

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
// No need for nodemon!
