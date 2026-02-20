# מדריך למרצה – יום 4 מצגת 15: Advanced Node Topics

**זמן:** 11:15–12:00 (45 דקות)
**מטרה:** התלמידים יכירו AsyncLocalStorage, EventEmitter patterns, ו-worker_threads

---

## הכנה מראש
- הכן demo-async-local.js
- הכן demo-worker.js
- `npm install pino` (לדמו logging)

---

## שקף 2-3 – AsyncLocalStorage (15 דקות) ← **חשוב ומגניב**
**מה להגיד:**
> "הבעיה: יש לנו requestId. אנחנו צריכים אותו ב-controller, ב-service, ב-DB layer, ב-logger. האם נעביר req לכל מקום? לא!"

**Live demo:**
```js
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

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
  log('info', 'Processing order', { orderId });
  // ...
}
```

**פלט:**
```json
{ "level": "info", "message": "Processing order", "requestId": "abc-123", "userId": "user-456", "orderId": "ord-789" }
```

**מה להגיד:**
> "זה magic? לא! AsyncLocalStorage עוקב אחרי context לאורך כל שרשרת async."

---

## שקף 4-5 – EventEmitter (10 דקות)
**Live demo:**
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

// שירות email לא מכיר את OrderService
orderService.on('order:created', async (order) => {
  await emailService.sendConfirmation(order.email, order);
});

// שירות inventory לא מכיר את OrderService
orderService.on('order:created', async (order) => {
  await inventoryService.decreaseStock(order.items);
});
```

**מה להגיד:**
> "Decoupling! אם מחר נוסיף SMS – רק `orderService.on('order:created', smsSend)`. לא נגע ב-createOrder."

---

## שקף 6-7 – worker_threads (15 דקות)
**Live demo – בעיה:**
```js
// ❌ חוסם Event Loop!
app.get('/heavy', (req, res) => {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) sum += i; // 2-3 שניות!
  res.json({ sum });
});
// בזמן הזה: אין תגובה לשאר הבקשות!
```

**פתרון עם worker:**
```js
// heavy-worker.js
import { workerData, parentPort } from 'node:worker_threads';
let sum = 0;
for (let i = 0; i < workerData.n; i++) sum += i;
parentPort.postMessage({ sum });
```

```js
// app.js
import { Worker } from 'node:worker_threads';

app.get('/heavy', (req, res) => {
  const worker = new Worker('./heavy-worker.js', {
    workerData: { n: 1e9 }
  });
  worker.on('message', (result) => res.json(result));
  worker.on('error', (err) => res.status(500).json({ error: err.message }));
});
```

**הדגמה:** שלח 2 בקשות – `/heavy` ו-`/health`. ב-worker: שניהם מגיבים.

---

## שקף 8-9 – Memory Leaks (5 דקות)
**דמו leak:**
```js
// ❌ Classic leak - cache without eviction
const cache = {};
app.get('/data/:id', (req, res) => {
  cache[req.params.id] = fetchData(req.params.id);
  // cache גדל ללא גבול!
});
```

**פתרון:**
```js
import LRU from 'lru-cache';
const cache = new LRU({ max: 500, ttl: 1000 * 60 * 5 }); // 500 items, 5 min TTL
```

---

## שקף 12 – Graceful Shutdown (5 דקות)
**Live coding:**
```js
process.on('SIGTERM', async () => {
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 30_000);
});
```

**מה להגיד:**
> "K8s שולח SIGTERM לפני שסוגר container. אם לא מטפלים – בקשות פעילות נחתכות!"

---

## הערות מרצה
- **מצגת קצרה**: 45 דקות – אל תאריך
- **AsyncLocalStorage**: הכי שווה מהמצגת הזו – הקדש לה הזמן
