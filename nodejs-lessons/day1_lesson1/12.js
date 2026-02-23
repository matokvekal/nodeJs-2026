// Global error handlers - last line of defense

// Handle uncaught exceptions (synchronous errors)
//Catches synchronous errors that aren't handled by try/catch blocks
process.on("uncaughtException", (error, origin) => {
  console.error("Error:", error.message);
  console.error("Origin:", origin);
  console.error("Stack:", error.stack);

  // Log to file or error tracking service
  // Then exit gracefully
  process.exit(1);
});

// Handle unhandled promise rejections
//Catches promise rejections that don't have a .catch() handler
process.on("unhandledRejection", (reason, promise) => {
  console.error("Reason:", reason);
  console.error("Promise:", promise);

  // In production: log and exit
  process.exit(1);
});

// Example: This will trigger unhandledRejection
// Uncomment to test:
// Promise.reject(new Error('Unhandled promise rejection!'));

// Example: This will trigger uncaughtException
// Uncomment to test (after a delay to see other examples):
// setTimeout(() => {
//   throw new Error('Uncaught exception!');
// }, 100);

console.log("Error handlers are set up. Application running...");

// Best Practice:
// - Always handle errors in try/catch or .catch()
// - These global handlers are for UNEXPECTED errors only
// - Always log errors before exiting
// - Use error monitoring services in production (Sentry, Datadog, etc.)
