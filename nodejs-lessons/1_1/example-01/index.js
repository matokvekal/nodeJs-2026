// This example shows how to get V8 heap statistics
import v8 from "node:v8";

// Get heap statistics from V8 engine
const heapStats = v8.getHeapStatistics();

console.log(
  `Total Heap Size: ${(heapStats.total_heap_size / 1024 / 1024).toFixed(2)} MB`
);
console.log(
  `Used Heap Size: ${(heapStats.used_heap_size / 1024 / 1024).toFixed(2)} MB`
);
console.log(
  `Heap Size Limit: ${(heapStats.heap_size_limit / 1024 / 1024).toFixed(2)} MB`
);
console.log(
  `Total Available: ${(heapStats.total_available_size / 1024 / 1024).toFixed(2)} MB`
);

// Get the percentage of memory used
const percentUsed = (
  (heapStats.used_heap_size / heapStats.heap_size_limit) *
  100
).toFixed(2);
console.log(`Memory Usage: ${percentUsed}%`);

// Expected Output:
// V8 allocates memory in a heap
// Shows current memory consumption
// Helps identify memory leaks