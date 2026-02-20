# יום 4 – מצגת 15: Advanced Node Topics

---

## שקף 1
**כותרת ראשית:** Advanced Node Topics
**כותרת משנה:** AsyncLocalStorage, EventEmitter, worker_threads, Memory Leaks, Profiling

---

## שקף 2
**כותרת ראשית:** AsyncLocalStorage – Context ללא Drilling
- **הבעיה**: להעביר `requestId`, `userId` לכל פונקציה בשרשרת
- **AsyncLocalStorage**: אחסון context שזמין בכל שרשרת async ללא העברת פרמטרים
```js
import { AsyncLocalStorage } from 'node:async_hooks';

export const requestContext = new AsyncLocalStorage();

// Middleware:
app.use((req, res, next) => {
  requestContext.run({ requestId: randomUUID(), userId: req.user?.id }, next);
});

// בכל מקום בקוד:
const { requestId } = requestContext.getStore();
```

---

## שקף 3
**כותרת ראשית:** AsyncLocalStorage – תבניות שימוש
- Logger שמוסיף `requestId` אוטומטית:
  ```js
  function log(level, msg) {
    const ctx = requestContext.getStore() ?? {};
    logger[level]({ ...ctx, msg });
  }
  ```
- שכבת DB קוראת `getStore` לפרטי המשתמש הנוכחי
- **אין** צורך להעביר `req` לכל פונקציה בשרשרת הקריאות
- ביצועים טובים – מבוסס על מנגנון מובנה ב-V8
- נתמך ב-pino, Fastify, ספריות מודרניות

---

## שקף 4
**כותרת ראשית:** EventEmitter – עקרונות
```js
import { EventEmitter } from 'node:events';

class OrderService extends EventEmitter {
  async createOrder(data) {
    const order = await Order.create(data);
    this.emit('order:created', order);
    return order;
  }
}

const orderService = new OrderService();
orderService.on('order:created', (order) => sendConfirmationEmail(order));
orderService.on('order:created', (order) => updateInventory(order));
```
- **Decoupling**: שכבות לא מכירות אחת את השנייה
- **Pub/Sub** pattern מובנה ב-Node.js

---

## שקף 5
**כותרת ראשית:** Advanced EventEmitter Patterns
- `events.once(emitter, 'ready')` → מחזיר **Promise** מאירוע חד-פעמי
- `events.on(emitter, 'data')` → מחזיר **AsyncIterator** לצריכה עם `for await`
- `captureRejections: true` → תפיסת שגיאות ב-async listeners
- `setMaxListeners(50)` → מניעת false positive memory leak warning
- `EventTarget` – ממשק סטנדרטי תואם דפדפן (Node 14+)
- **Symbol כשמות אירועים** למניעת התנגשויות:
  ```js
  const ORDER_CREATED = Symbol('order:created');
  ```

---

## שקף 6
**כותרת ראשית:** worker_threads – CPU Tasks
- Event Loop = חד-תהליכוני; **חישוב כבד = חוסם הכל**
- `worker_threads` = JavaScript בתהליכונים נפרדים
```js
import { Worker, isMainThread, workerData, parentPort } from 'node:worker_threads';

if (isMainThread) {
  const worker = new Worker('./heavy-task.js', { workerData: { numbers: [1,2,3] } });
  worker.on('message', (result) => console.log('Result:', result));
} else {
  const result = heavyCalculation(workerData.numbers);
  parentPort.postMessage(result);
}
```

---

## שקף 7
**כותרת ראשית:** worker_threads – תבניות
- **Worker Pool**: מאגר workers זמינים למשימות:
  ```js
  import { pool } from 'workerpool';
  const workerPool = pool('./worker.js', { maxWorkers: os.cpus().length });
  const result = await workerPool.exec('processData', [data]);
  ```
- `SharedArrayBuffer` – שיתוף זיכרון בין threads (זהירות! race conditions)
- `isMainThread` – בדיקה אם קוד רץ ב-main thread
- מספר workers מקסימלי = מספר ליבות CPU: `os.cpus().length`
- שימוש: עיבוד תמונה, קריפטוגרפיה כבדה, חישובים מתמטיים

---

## שקף 8
**כותרת ראשית:** Memory Leaks – דפוסים נפוצים
- **Global variables** שגדלים ללא גבול: `cache[key] = data` ← ללא eviction
- **Event listeners** שלא מוסרים:
  ```js
  emitter.on('data', handler); // ← אם לא removeListener → leak
  ```
- **Closures** שמחזיקות reference לאובייקטים גדולים
- **Promises** שנוצרים ולא נפתרים (dangling promises)
- `setInterval` שלא נוקה בסגירת server
- **פתרון לCache**: `Map` עם TTL, `lru-cache` עם גודל מקסימלי

---

## שקף 9
**כותרת ראשית:** Memory Leak Detection
```js
// מעקב פשוט
setInterval(() => {
  const { heapUsed, heapTotal } = process.memoryUsage();
  logger.info({ heapUsed: Math.round(heapUsed / 1024 / 1024) + 'MB' });
}, 30_000);
```
- `process.memoryUsage()` → `heapUsed`, `heapTotal`, `rss`, `external`
- Chrome DevTools: **Memory tab** → Heap Snapshot → השוואה בין snapshots
- `--expose-gc` → `global.gc()` לבדיקה ידנית
- `WeakMap` / `WeakRef` → reference שה-GC יכול לנקות
- **FinalizationRegistry** לניקוי אוטומטי כשאובייקט נמחק מ-heap

---

## שקף 10
**כותרת ראשית:** Performance Profiling
```js
// מדידת זמן
const start = performance.now();
await heavyOperation();
const duration = performance.now() - start;
console.log(`Duration: ${duration.toFixed(2)}ms`);
```
- `node --inspect server.js` → Chrome DevTools → Performance tab
- **CPU Profile**: מראה זמן CPU לכל פונקציה
- **Flame Graph**: ויזואליזציה של call stack לאורך זמן
- `clinic.js` (מ-NearForm) → כלי profiling מתקדם לייצור
- `0x` → מייצר flame graph מ-Node.js process

---

## שקף 11
**כותרת ראשית:** Performance Tips
- `Buffer.allocUnsafe` כשמאתחלים מיד אחר כך (מהיר מ-`alloc`)
- הימנע מיצירת אובייקטים מיותרים בלולאות חמות
- `Map` / `Set` לחיפושים תכופים במקום `Object`
- `Object.freeze` מונע מ-V8 לעשות de-optimization בחלק מהמקרים
- `process.nextTick` בזהירות – עלול לחסום Event Loop אם מוגזם
- שמור streams פתוחים; אל תפתח/תסגור חיבורי DB בכל בקשה

---

## שקף 12
**כותרת ראשית:** Graceful Shutdown
```js
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received - shutting down gracefully');
  server.close(async () => {
    await mongoose.disconnect();
    await redis.quit();
    process.exit(0);
  });
  // Force shutdown after 30s
  setTimeout(() => process.exit(1), 30_000);
});
```
- **SIGTERM** = Docker/K8s שולח לפני הריגת container
- סגור שרת HTTP → המתן לבקשות פעילות לסיום → סגור DB connections
- **Health Check endpoint**: `GET /health` → `{ status: 'ok' }`

---

## שקף 13
**כותרת ראשית:** סיכום – יום 4 מצגת 15
- `AsyncLocalStorage` = context ללא parameter drilling
- `EventEmitter` = decoupling בין שכבות + Pub/Sub pattern
- `worker_threads` = CPU tasks ללא חסימת Event Loop
- Memory Leaks: global vars, listeners, closures, dangling promises
- Performance profiling: `node --inspect` + DevTools + flame graphs
- Graceful Shutdown: SIGTERM → סגור server → disconnect DB
