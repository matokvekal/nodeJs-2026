// This demonstrates the phases of the Event Loop and their execution order

console.log("1: Synchronous code - runs first");

// process.nextTick - highest priority, runs before any other async operations
process.nextTick(() => {
  console.log("2: process.nextTick - runs before all other async tasks");
});

// Promise microtask - runs after nextTick but before timers
Promise.resolve().then(() => {
  console.log("3: Promise.then - microtask queue");
});

// queueMicrotask - another microtask, runs with Promise.then
queueMicrotask(() => {
  console.log("4: queueMicrotask - also in microtask queue");
});

// setTimeout - timer phase (macrotask)
setTimeout(() => {
  console.log("5: setTimeout 0ms - timer phase");
}, 0);

// setImmediate - check phase (after poll phase)
setImmediate(() => {
  console.log("6: setImmediate - check phase");
});

console.log("7: More synchronous code - runs second");

// Expected Output Order:
// 1, 7 (sync code)
// 2 (nextTick)
// 3, 4 (microtasks)
// 5, 6 (macrotasks - order may vary outside I/O callbacks)