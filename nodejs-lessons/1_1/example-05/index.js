// The process object provides information about the current Node.js process

// Environment Variables
console.log("Node Environment:", process.env.NODE_ENV || "development");
console.log("Port:", process.env.PORT || 3000);

// Command Line Arguments
// Run: node script.js arg1 arg2 arg3
console.log("All arguments:", process.argv);
console.log("Script path:", process.argv[1]);
console.log("User arguments:", process.argv.slice(2));

// Process Information
console.log("Process ID (PID):", process.pid);
console.log("Node.js Version:", process.version);
console.log("Platform:", process.platform);
console.log("Current Working Directory:", process.cwd());

// Memory Usage
const memUsage = process.memoryUsage();
console.log(`RSS: ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`);
console.log(`Heap Used: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);

// Exit code (0 = success, non-zero = error)
// Uncomment to exit: process.exit(0);