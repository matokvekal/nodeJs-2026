# מדריך למרצה – יום 4 מצגת 15: Advanced Node Topics

**זמן:** 11:15–12:00
**מטרה:** היכרות עם AsyncLocalStorage, EventEmitter patterns, ו-worker_threads

---

## שקף 1 – פתיחה

ביום 4 למדנו WebSocket ו-Crypto. עכשיו נסיים עם נושאים מתקדמים שהופכים Node.js application מ"עובד" ל"production-ready".

**מה נלמד:**
- AsyncLocalStorage — Context propagation אוטומטי לאורך שרשרת async
- EventEmitter Patterns — Decoupling בין שכבות הקוד
- worker_threads — פתרון לחישובים כבדים שחוסמים את Event Loop
- Memory Leaks — זיהוי ומניעת דליפות זיכרון
- Graceful Shutdown — סגירה מסודרת של השרת

**מתי Event Loop נחסם?**

| סיבה | דוגמה | פתרון |
|------|-------|-------|
| חישוב מרובה | לולאה של מיליארד פעולות | worker_threads |
| Sync I/O | `fs.readFileSync` קובץ גדול | `fs.promises.readFile` |
| JSON.parse גדול | body של מגה-בייטים | Stream parsing |
| Regex catastrophic | `/(a+)+$/` על string ארוך | re2 library |

**מדוע AsyncLocalStorage חשוב?**
בלעדיו: `requestId` מועבר ידנית כ-parameter בכל פונקציה. עם AsyncLocalStorage: context זמין בכל מקום ללא העברה ידנית — כמו thread-local storage, אבל ל-async.

---

## שקף 2-3 – AsyncLocalStorage

**הבעיה:** שמירת requestId והעברתו לכל שכבות ה-

```js
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

const requestContext = new AsyncLocalStorage();

// Express middleware
app.use((req, res, next) => {
  const context = {
    requestId: randomUUID(),
    userId: req.user?.id,
    startTime: Date.now()
  };
  requestContext.run(context, next);
});

// Logger helper
function log(level, message, extra = {}) {
  const ctx = requestContext.getStore() ?? {};
  console.log(JSON.stringify({ level, message, ...ctx, ...extra }));
}

// בservice – אין req, אבל יש context
async function processOrder(orderId) {
  log("info", "Processing order", { orderId });
  // ...
}
```

**פלט:**

```json
{
  "level": "info",
  "message": "Processing order",
  "requestId": "abc-123",
  "userId": "user-456",
  "orderId": "ord-789"
}
```

AsyncLocalStorage עוקב אחרי context לאורך כל שרשרת async באופן אוטומטי.

---

## שקף 4-5 – EventEmitter

**דוגמה:**

```js
import { EventEmitter } from "node:events";

class OrderService extends EventEmitter {
  async createOrder(data) {
    const order = await Order.create(data);
    this.emit("order:created", order);
    return order;
  }
}

const orderService = new OrderService();

// שירות email לא מכיר את OrderService
orderService.on("order:created", async (order) => {
  await emailService.sendConfirmation(order.email, order);
});

// שירות inventory לא מכיר את OrderService
orderService.on("order:created", async (order) => {
  await inventoryService.decreaseStock(order.items);
});
```

Decoupling! אם מחר נוסיף SMS – רק `orderService.on('order:created', smsSend)`. לא נוגעים ב-createOrder.

---

## שקף 6-7 – worker_threads

**הבעיה – חסימת Event Loop:**

```js
// ❌ חוסם Event Loop!
app.get("/heavy", (req, res) => {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) sum += i; // 2-3 שניות!
  res.json({ sum });
});
// בזמן הזה: אין תגובה לשאר הבקשות!
```

**פתרון עם worker:**

```js
// heavy-worker.js
import { workerData, parentPort } from "node:worker_threads";
let sum = 0;
for (let i = 0; i < workerData.n; i++) sum += i;
parentPort.postMessage({ sum });
```

```js
// app.js
import { Worker } from "node:worker_threads";

app.get("/heavy", (req, res) => {
  const worker = new Worker("./heavy-worker.js", {
    workerData: { n: 1e9 }
  });
  worker.on("message", (result) => res.json(result));
  worker.on("error", (err) => res.status(500).json({ error: err.message }));
});
```

**הדגמה:** שליחת 2 בקשות – `/heavy` ו-`/health`. עם worker: שניהם מגיבים.

---

## שקף 8-9 – Memory Leaks

\*\*דוגמת leak:

```js
// ❌ Classic leak - cache without eviction
const cache = {};
app.get("/data/:id", (req, res) => {
  cache[req.params.id] = fetchData(req.params.id);
  // cache גדל ללא גבול!
});
```

**פתרון:**

```js
import LRU from "lru-cache";
const cache = new LRU({ max: 500, ttl: 1000 * 60 * 5 }); // 500 items, 5 min TTL
```

---

## שקף 12 – Graceful Shutdown

**דוגמה:**

```js
process.on("SIGTERM", async () => {
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 30_000);
});
```

Kubernetes שולח SIGTERM לפני סגירת container. אם לא מטפלים – בקשות פעילות נחתכות.

---

## סיכום

מצגת זו סיקרה:

- AsyncLocalStorage לניהול context אוטומטי
- EventEmitter patterns ל-decoupling
- worker_threads למשימות כבדות
- Memory leaks ואיך למנוע
- Graceful shutdown

**הערות:**

- מצגת קצרה (45 דקות)
- AsyncLocalStorage הכי שווה מהמצגת
