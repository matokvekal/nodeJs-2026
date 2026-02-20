import { quiz_4_3 } from "../../data/quizzes/quiz_4_3.js";

export const slides = [
  {
    id: 1,
    type: "title",
    title: "Advanced Node Topics",
    subtitle:
      "AsyncLocalStorage, EventEmitter, worker_threads, Memory Leaks, Profiling"
  },
  {
    id: 2,
    title: "AsyncLocalStorage – Context ללא Drilling",
    bullets: [
      "הבעיה: להעביר requestId, userId לכל פונקציה בשרשרת",
      "AsyncLocalStorage: אחסון context שזמין בכל שרשרת async ללא העברת פרמטרים"
    ],
    code: `import { AsyncLocalStorage } from 'node:async_hooks';

export const requestContext = new AsyncLocalStorage();

// Middleware:
app.use((req, res, next) => {
  requestContext.run({ requestId: randomUUID(), userId: req.user?.id }, next);
});

// בכל מקום בקוד:
const { requestId } = requestContext.getStore();`
  },
  {
    id: 3,
    title: "AsyncLocalStorage – תבניות שימוש",
    bullets: [
      "Logger שמוסיף requestId אוטומטית",
      "שכבת DB קוראת getStore לפרטי המשתמש הנוכחי",
      "אין צורך להעביר req לכל פונקציה בשרשרת הקריאות",
      "ביצועים טובים – מבוסס על מנגנון מובנה ב-V8",
      "נתמך ב-pino, Fastify, ספריות מודרניות"
    ],
    code: `function log(level, msg) {
  const ctx = requestContext.getStore() ?? {};
  logger[level]({ ...ctx, msg });
}`
  },
  {
    id: 4,
    title: "EventEmitter – עקרונות",
    code: `import { EventEmitter } from 'node:events';

class OrderService extends EventEmitter {
  async createOrder(data) {
    const order = await Order.create(data);
    this.emit('order:created', order);
    return order;
  }
}

const orderService = new OrderService();
orderService.on('order:created', (order) => sendConfirmationEmail(order));
orderService.on('order:created', (order) => updateInventory(order));`,
    bullets: [
      "Decoupling: שכבות לא מכירות אחת את השנייה",
      "Pub/Sub pattern מובנה ב-Node.js"
    ]
  },
  {
    id: 5,
    title: "Advanced EventEmitter Patterns",
    bullets: [
      "events.once(emitter, 'ready') → מחזיר Promise מאירוע חד-פעמי",
      "events.on(emitter, 'data') → מחזיר AsyncIterator לצריכה עם for await",
      "captureRejections: true → תפיסת שגיאות ב-async listeners",
      "setMaxListeners(50) → מניעת false positive memory leak warning",
      "EventTarget – ממשק סטנדרטי תואם דפדפן (Node 14+)",
      "Symbol כשמות אירועים למניעת התנגשויות"
    ],
    code: `const ORDER_CREATED = Symbol('order:created');`
  },
  {
    id: 6,
    title: "worker_threads – CPU Tasks",
    bullets: [
      "Event Loop = חד-תהליכוני; חישוב כבד = חוסם הכל",
      "worker_threads = JavaScript בתהליכונים נפרדים"
    ],
    code: `import { Worker, isMainThread, workerData, parentPort } from 'node:worker_threads';

if (isMainThread) {
  const worker = new Worker('./heavy-task.js', { workerData: { numbers: [1,2,3] } });
  worker.on('message', (result) => console.log('Result:', result));
} else {
  const result = heavyCalculation(workerData.numbers);
  parentPort.postMessage(result);
}`
  },
  {
    id: 7,
    title: "worker_threads – תבניות",
    bullets: [
      "Worker Pool: מאגר workers זמינים למשימות",
      "SharedArrayBuffer – שיתוף זיכרון בין threads (זהירות! race conditions)",
      "isMainThread – בדיקה אם קוד רץ ב-main thread",
      "מספר workers מקסימלי = מספר ליבות CPU: os.cpus().length",
      "שימוש: עיבוד תמונה, קריפטוגרפיה כבדה, חישובים מתמטיים"
    ],
    code: `import { pool } from 'workerpool';
const workerPool = pool('./worker.js', { maxWorkers: os.cpus().length });
const result = await workerPool.exec('processData', [data]);`
  },
  {
    id: 8,
    title: "Memory Leaks – דפוסים נפוצים",
    bullets: [
      "Global variables שגדלים ללא גבול: cache[key] = data ← ללא eviction",
      "Event listeners שלא מוסרים",
      "Closures שמחזיקות reference לאובייקטים גדולים",
      "Promises שנוצרים ולא נפתרים (dangling promises)",
      "setInterval שלא נוקה בסגירת server",
      "פתרון לCache: Map עם TTL, lru-cache עם גודל מקסימלי"
    ],
    code: `emitter.on('data', handler); // ← אם לא removeListener → leak`
  },
  {
    id: 9,
    title: "Memory Leak Detection",
    code: `// מעקב פשוט
setInterval(() => {
  const { heapUsed, heapTotal } = process.memoryUsage();
  logger.info({ heapUsed: Math.round(heapUsed / 1024 / 1024) + 'MB' });
}, 30_000);`,
    bullets: [
      "process.memoryUsage() → heapUsed, heapTotal, rss, external",
      "Chrome DevTools: Memory tab → Heap Snapshot → השוואה בין snapshots",
      "--expose-gc → global.gc() לבדיקה ידנית",
      "WeakMap / WeakRef → reference שה-GC יכול לנקות",
      "FinalizationRegistry לניקוי אוטומטי כשאובייקט נמחק מ-heap"
    ]
  },
  {
    id: 10,
    title: "Performance Profiling",
    code: `// מדידת זמן
const start = performance.now();
await heavyOperation();
const duration = performance.now() - start;
console.log(\`Duration: \${duration.toFixed(2)}ms\`);`,
    bullets: [
      "node --inspect server.js → Chrome DevTools → Performance tab",
      "CPU Profile: מראה זמן CPU לכל פונקציה",
      "Flame Graph: ויזואליזציה של call stack לאורך זמן",
      "clinic.js (מ-NearForm) → כלי profiling מתקדם לייצור",
      "0x → מייצר flame graph מ-Node.js process"
    ]
  },
  {
    id: 11,
    title: "Performance Tips",
    bullets: [
      "Buffer.allocUnsafe כשמאתחלים מיד אחר כך (מהיר מ-alloc)",
      "הימנע מיצירת אובייקטים מיותרים בלולאות חמות",
      "Map / Set לחיפושים תכופים במקום Object",
      "Object.freeze מונע מ-V8 לעשות de-optimization בחלק מהמקרים",
      "process.nextTick בזהירות – עלול לחסום Event Loop אם מוגזם",
      "שמור streams פתוחים; אל תפתח/תסגור חיבורי DB בכל בקשה"
    ]
  },
  {
    id: 12,
    title: "Graceful Shutdown",
    code: `process.on('SIGTERM', async () => {
  logger.info('SIGTERM received - shutting down gracefully');
  server.close(async () => {
    await mongoose.disconnect();
    await redis.quit();
    process.exit(0);
  });
  // Force shutdown after 30s
  setTimeout(() => process.exit(1), 30_000);
});`,
    bullets: [
      "SIGTERM = Docker/K8s שולח לפני הריגת container",
      "סגור שרת HTTP → המתן לבקשות פעילות לסיום → סגור DB connections",
      "Health Check endpoint: GET /health → { status: 'ok' }"
    ]
  },
  {
    id: 13,
    title: "סיכום – יום 4 מצגת 15",
    bullets: [
      "AsyncLocalStorage = context ללא parameter drilling",
      "EventEmitter = decoupling בין שכבות + Pub/Sub pattern",
      "worker_threads = CPU tasks ללא חסימת Event Loop",
      "Memory Leaks: global vars, listeners, closures, dangling promises",
      "Performance profiling: node --inspect + DevTools + flame graphs",
      "Graceful Shutdown: SIGTERM → סגור server → disconnect DB"
    ]
  }
];
