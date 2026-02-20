console.log("=== Memory Leak Detection & Prevention ===\n");

// Common Memory Leak: Growing Cache
console.log("1. Growing Cache Problem\n");

// ❌ MEMORY LEAK
const badCache = {};
let cacheSize = 0;

function addToBadCache(key, value) {
  badCache[key] = value;
  cacheSize++;
  console.log(`Bad cache size: ${cacheSize} items`);
  // This grows forever! Never cleaned up
}

// Add some items
for (let i = 0; i < 10; i++) {
  addToBadCache(`key${i}`, { data: "x".repeat(100) });
}

// ✅ FIX: LRU Cache with Size Limit
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;

    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    // Remove if exists
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Add to end
    this.cache.set(key, value);

    // Remove oldest if over limit
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  size() {
    return this.cache.size;
  }
}

const goodCache = new LRUCache(5);

console.log("\n✅ Good cache (LRU, max 5):");
for (let i = 0; i < 10; i++) {
  goodCache.set(`key${i}`, { data: "x".repeat(100) });
  console.log(`Good cache size: ${goodCache.size()} items`);
}

// Common Memory Leak: Event Listeners
console.log("\n2. Event Listener Problem\n");

import { EventEmitter } from "node:events";

const emitter = new EventEmitter();

// ❌ MEMORY LEAK
function badConnectionSetup(userId) {
  const connection = { userId, data: [] };

  emitter.on("data", (data) => {
    connection.data.push(data);
  });

  console.log(`❌ Added listener for user ${userId} (never removed!)`);
  // Connection closes but listener remains!
}

// ✅ FIX: Remove Listener
function goodConnectionSetup(userId) {
  const connection = { userId, data: [] };

  const handler = (data) => {
    connection.data.push(data);
  };

  emitter.on("data", handler);
  console.log(`✅ Added listener for user ${userId}`);

  // Simulate cleanup
  setTimeout(() => {
    emitter.removeListener("data", handler);
    console.log(`✅ Removed listener for user ${userId}`);
  }, 100);
}

badConnectionSetup(1);
badConnectionSetup(2);
goodConnectionSetup(3);

setTimeout(() => {
  console.log(`\nActive listeners: ${emitter.listenerCount("data")}`);
}, 200);

// Monitor Memory Usage
console.log("\n3. Memory Monitoring\n");

function logMemoryUsage() {
  const { heapUsed, heapTotal, external, rss } = process.memoryUsage();

  console.log({
    heapUsed: Math.round(heapUsed / 1024 / 1024) + " MB",
    heapTotal: Math.round(heapTotal / 1024 / 1024) + " MB",
    external: Math.round(external / 1024 / 1024) + " MB",
    rss: Math.round(rss / 1024 / 1024) + " MB"
  });
}

logMemoryUsage();

// WeakMap for Cache (Auto Cleanup)
console.log("\n4. WeakMap Auto Cleanup\n");

const weakCache = new WeakMap();

function getCachedData(obj) {
  if (weakCache.has(obj)) {
    return weakCache.get(obj);
  }

  const data = { expensive: "computation result" };
  weakCache.set(obj, data);
  return data;
}

let obj1 = { id: 1 };
let obj2 = { id: 2 };

getCachedData(obj1);
getCachedData(obj2);
console.log("✅ WeakMap caches 2 objects");

// When obj is garbage collected, cache entry is automatically removed!
obj1 = null;
console.log("✅ Set obj1 to null - WeakMap will auto-cleanup on GC");

console.log("\nBest Practices:");
console.log("✅ Use LRU cache with size limits");
console.log("✅ Always remove event listeners when done");
console.log("✅ Use WeakMap for object-keyed caches");
console.log("✅ Monitor memory usage in production");
console.log("✅ Avoid capturing large objects in closures");
console.log("❌ Don't let caches grow unbounded");
console.log("❌ Don't forget to remove event listeners");
