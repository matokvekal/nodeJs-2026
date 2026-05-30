// ─────────────────────────────────────────────────────────────────
//  IN-PROCESS MEMORY CACHE
//  This variable lives inside the Node.js process.
//  Each PM2 instance (pid) has its OWN copy — they do NOT share it.
//
//  Demo point for students:
//    pm2 start ticket-service -i 2   → two processes, pid 1001 and pid 1002
//    User buys on pid 1001 → cacheCount on 1001 decrements, 1002 stays the same
//    DB count is always correct for everyone
// ─────────────────────────────────────────────────────────────────

let cacheCount: number = 0;

export function getCacheCount(): number {
  return cacheCount;
}

// Called once at startup — seeds the cache from the real DB value
export function initCache(initialCount: number): void {
  cacheCount = initialCount;
  console.log(`[Cache] Initialized with ${cacheCount} available tickets (pid ${process.pid})`);
}

// Called after every successful purchase
export function decrementCache(): void {
  if (cacheCount > 0) cacheCount--;
}
