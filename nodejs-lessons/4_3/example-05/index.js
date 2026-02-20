import { performance, PerformanceObserver } from "node:perf_hooks";

console.log("=== Performance Profiling ===\n");

// 1. Measure Function Execution Time
console.log("1. Function Timing\n");

function measureTime(name, fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  console.log(`${name}: ${(end - start).toFixed(2)}ms`);
  return result;
}

// Test different array methods
const arr = Array.from({ length: 100000 }, (_, i) => i);

measureTime("forEach", () => {
  let sum = 0;
  arr.forEach((x) => sum += x);
  return sum;
});

measureTime("for loop", () => {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
});

measureTime("reduce", () => {
  return arr.reduce((sum, x) => sum + x, 0);
});

// 2. Performance Hooks (PerformanceObserver)
console.log("\n2. Performance Observer\n");

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`📊 ${entry.name}: ${entry.duration.toFixed(2)}ms`);
  });
});

obs.observe({ entryTypes: ["measure"] });

// Mark start
performance.mark("db-query-start");

// Simulate database query
await new Promise(resolve => setTimeout(resolve, 100));

performance.mark("db-query-end");

// Measure duration
performance.measure("db-query", "db-query-start", "db-query-end");

// Another operation
performance.mark("api-call-start");
await new Promise(resolve => setTimeout(resolve, 50));
performance.mark("api-call-end");
performance.measure("api-call", "api-call-start", "api-call-end");

// 3. Benchmark Multiple Approaches
console.log("\n3. Benchmarking\n");

async function benchmark(name, fn, iterations = 1000) {
  const start = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    await fn();
  }
  
  const end = performance.now();
  const total = end - start;
  const average = total / iterations;
  
  console.log(`${name}:`);
  console.log(`  Total: ${total.toFixed(2)}ms`);
  console.log(`  Average: ${average.toFixed(4)}ms`);
  console.log(`  Ops/sec: ${(1000 / average).toFixed(0)}`);
}

await benchmark("String concat", () => {
  let str = "";
  for (let i = 0; i < 100; i++) {
    str += "x";
  }
}, 100);

await benchmark("Array join", () => {
  const arr = [];
  for (let i = 0; i < 100; i++) {
    arr.push("x");
  }
  arr.join("");
}, 100);

// 4. Memory Usage Tracking
console.log("\n4. Memory Profiling\n");

function trackMemory(label) {
  const { heapUsed } = process.memoryUsage();
  console.log(`${label}: ${(heapUsed / 1024 / 1024).toFixed(2)} MB`);
}

trackMemory("Before allocation");

// Allocate memory
const bigArray = new Array(1000000).fill({ data: "test" });

trackMemory("After allocation");

// 5. CPU Time
console.log("\n5. CPU Usage\n");

const cpuStart = process.cpuUsage();

// CPU-intensive task
let result = 0;
for (let i = 0; i < 10000000; i++) {
  result += Math.sqrt(i);
}

const cpuEnd = process.cpuUsage(cpuStart);

console.log(`CPU User: ${(cpuEnd.user / 1000).toFixed(2)}ms`);
console.log(`CPU System: ${(cpuEnd.system / 1000).toFixed(2)}ms`);

// Cleanup
obs.disconnect();

console.log("\nProfiling Tools:");
console.log("✅ performance.now() - High-resolution timing");
console.log("✅ PerformanceObserver - Track performance marks");
console.log("✅ process.cpuUsage() - CPU time tracking");
console.log("✅ process.memoryUsage() - Memory consumption");
console.log("\nAdvanced Tools:");
console.log("- node --prof - CPU profiling");
console.log("- node --inspect - Chrome DevTools");
console.log("- clinic.js - Production profiling");
console.log("- 0x - Flamegraph generation");
