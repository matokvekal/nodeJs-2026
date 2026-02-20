# מדריך למרצה – יום 1 מצגת 4: HTTP Fundamentals + WebHooks

**זמן:** 14:45–16:30 (105 דקות)
**מטרה:** התלמידים יבנו שרת HTTP גולמי ויבינו WebHooks

---

## הכנה מראש
- הכן דמו של שרת HTTP פשוט
- הכן Postman/Insomnia לבדיקת בקשות
- הכן דמו של WebHook receiver (לדמות שליחה עם curl)

---

## שקף 2 – http.createServer (15 דקות)
**מה להגיד:**
> "לפני Express קיים http.createServer. Express בונה מעל זה. חשוב להבין את הבסיס."

**דמו:**
```js
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello World' }));
});

server.listen(3000, () => console.log('Server on port 3000'));
```

**הרץ ופתח ב-Postman**, הצג שה-req הוא stream ו-res הוא writable.

---

## שקף 3-4 – req ו-res (10 דקות)
**דמו routing בסיסי:**
```js
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && url.pathname === '/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ users: [] }));
  }

  res.writeHead(404);
  res.end('Not Found');
});
```

---

## שקף 5-6 – Status Codes (10 דקות)
**מה להגיד:**
> "Status codes הם שפת תקשורת. לקוח יודע מה קרה בלי לקרוא את ה-body. זה חשוב לـ APIs שצריכים לטפל בשגיאות."

**Quiz מהיר:**
- יצרנו משאב → ?
- משתמש לא נמצא → ?
- ולידציה נכשלה → ?
- הרשאות חסרות → ?

---

## שקף 7 – WHATWG URL (7 דקות)
**דמו:**
```js
const url = new URL('/users?page=2&sort=-name', 'http://localhost');
console.log(url.pathname);           // '/users'
console.log(url.searchParams.get('page'));  // '2'
console.log(url.searchParams.get('sort')); // '-name'
```

---

## שקף 8 – קריאת Body (10 דקות)
**דמו:**
```js
const server = createServer(async (req, res) => {
  if (req.method === 'POST') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString());
    console.log('Body:', body);
    res.writeHead(201);
    res.end(JSON.stringify({ created: true }));
  }
});
```

**דגש:** "תמיד לבדוק Content-Type. תמיד להגביל גודל body!"

---

## שקף 9 – Streaming Response (10 דקות)
**דמו SSE:**
```js
res.writeHead(200, {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache'
});

// שלח נתונים כל שניה
const interval = setInterval(() => {
  res.write(`data: ${JSON.stringify({ time: new Date() })}\n\n`);
}, 1000);

req.on('close', () => clearInterval(interval));
```

---

## שקף 10 – AbortSignal (8 דקות)
**דמו:**
```js
const controller = new AbortController();
req.on('close', () => controller.abort('client disconnected'));

try {
  const data = await fetch('https://api.slow.com', {
    signal: controller.signal
  });
} catch (err) {
  if (err.name === 'AbortError') console.log('Cancelled by client disconnect');
}
```

---

## שקף 11-12 – WebHooks (15 דקות) ← **חלק מהנה**
**מה להגיד:**
> "WebHooks הם Pull לעומת Push. במקום לבדוק כל 5 שניות אם משהו קרה, הצד השני מתקשר אלינו."

**דמו WebHook receiver:**
```js
app.post('/webhooks/stripe', express.raw({ type: '*/*' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const body = req.body.toString();

  // אמת חתימה HMAC
  const expected = createHmac('sha256', process.env.STRIPE_SECRET)
    .update(body)
    .digest('hex');

  const sigValue = sig.split(',').find(p => p.startsWith('v1=')).replace('v1=', '');

  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(sigValue))) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(body);
  console.log('Stripe event:', event.type);
  res.json({ received: true }); // תמיד 200 מהר!
});
```

**הסבר Idempotency עם דוגמה:** "Stripe עלול לשלוח פעמיים. שמרו את event.id ובדקו כפילויות."

---

## שקף 13 – סיכום (5 דקות)
**שאלות:**
1. מה ההבדל בין WebHook ל-Polling?
2. למה חשוב לאמת חתימת WebHook?
3. מה עושים עם הודעת WebHook כפולה?

---

## הערות מרצה
- **חיבור ליום 2**: "מחר נתחיל עם Express – שמבסס הכל על http.createServer שראינו היום"
- **שאלה על WebSockets**: "WebSockets זה לתקשורת דו-כיוונית – נלמד ביום 4"
