# מדריך למרצה – יום 1 מצגת 4: HTTP Fundamentals + WebHooks

**זמן:** 14:45–16:30
**מטרה:** בניית שרת HTTP והבנת מנגנון WebHooks

---

## שקף 1 – פתיחה

סיימנו את הבסיס: Event Loop, Async, Streams. עכשיו מרכיבים את הכל לשרת HTTP אמיתי.

**מה נלמד:**
- `http.createServer` – מה Express בנוי עליו מתחת
- `req` ו-`res` – אובייקטי Stream שכבר מכירים
- Status codes – שפת התקשורת עם הלקוח
- WHATWG URL API – parsing מודרני
- WebHooks – מה זה Push ולמה עדיף על Polling
- Idempotency – עיקרון חיוני לבניית מערכות אמינות

**קשר לנושאים קודמים:**
- `req` הוא Readable Stream – אותו דבר שלמדנו ב-Streams
- `res` הוא Writable Stream – יכולים להגיש נתונים ב-chunks
- כל handler הוא async callback שרץ דרך Event Loop

**פרמטרי HTTP בסיסיים:**

| מרכיב | תיאור | דוגמה |
|-------|-------|-------|
| Method | פעולה מבוקשת | GET, POST, PUT, DELETE |
| URL | נתיב המשאב | /api/v1/users/42 |
| Headers | מטא-דאטה | Content-Type, Authorization |
| Body | תוכן הבקשה | JSON, form data |
| Status Code | תוצאת הבקשה | 200, 404, 500 |

---

## שקף 2 – http.createServer

Express 5 (ו-Express 4 לפניו) בנויים על גבי `http.createServer` ממודול ה-core. הבנת הבסיס חשובה לדיבוג בעיות וכתיבת middleware מתקדם.

**דוגמת שרת בסיסי:**

```js
import { createServer } from "node:http";

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Hello World" }));
});

server.listen(3000, () => console.log("Server on port 3000"));
```

**נקודה חשובה:** `req` הוא Readable stream ו-`res` הוא Writable stream – מושגים שנלמדו במצגת הקודמת.

---

## שקף 3-4 – req ו-res

**דוגמת routing בסיסי:**

```js
const server = createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "GET" && url.pathname === "/users") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ users: [] }));
  }

  res.writeHead(404);
  res.end("Not Found");
});
```

---

## שקף 5-6 – Status Codes

Status codes הם שפת התקשורת בין שרת ללקוח ב-HTTP. הלקוח יודע מה קרה מבלי לקרוא את ה-body, מה שמאפשר טיפול אוטומטי בשגיאות ותקשורת בין-מערכתית.

**דוגמאות נפוצות:**

- 201 Created – יצירת משאב חדש הצליחה
- 404 Not Found – משאב לא קיים
- 400 Bad Request – ולידציה נכשלה
- 401 Unauthorized – חסר authentication
- 403 Forbidden – יש authentication אבל חסרות הרשאות

---

## שקף 7 – WHATWG URL

**דוגמת שימוש ב-URL API:**

```js
const url = new URL("/users?page=2&sort=-name", "http://localhost");
console.log(url.pathname); // '/users'
console.log(url.searchParams.get("page")); // '2'
console.log(url.searchParams.get("sort")); // '-name'
```

---

## שקף 8 – קריאת Body

**דוגמה:**

```js
const server = createServer(async (req, res) => {
  if (req.method === "POST") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString());
    console.log("Body:", body);
    res.writeHead(201);
    res.end(JSON.stringify({ created: true }));
  }
});
```

**שיטות עבודה מומלצות:** תמיד לבדוק את `Content-Type` header ולהגביל גודל body מקסימלי למניעת DoS attacks.

---

## שקף 9 – Streaming Response

**דוגמת Server-Sent Events (SSE):**

```js
res.writeHead(200, {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache"
});

// שלח נתונים כל שניה
const interval = setInterval(() => {
  res.write(`data: ${JSON.stringify({ time: new Date() })}\n\n`);
}, 1000);

req.on("close", () => clearInterval(interval));
```

---

## שקף 10 – AbortSignal

**דוגמת ביטול בקשה כאשר הלקוח מתנתק:**

```js
const controller = new AbortController();
req.on("close", () => controller.abort("client disconnected"));

try {
  const data = await fetch("https://api.slow.com", {
    signal: controller.signal
  });
} catch (err) {
  if (err.name === "AbortError") console.log("Cancelled by client disconnect");
}
```

---

## שקף 11-12 – WebHooks

**Push לעומת Pull:**
WebHooks הם מנגנון Push – במקום polling (בדיקה פעילה כל מספר שניות אם משהו קרה), השירות החיצוני שולח HTTP request לשרת שלנו כשאירוע מתרחש.

**דוגמת WebHook receiver עם אימות חתימה (Stripe):**

```js
app.post("/webhooks/stripe", express.raw({ type: "*/*" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  const body = req.body.toString();

  // אמת חתימה HMAC
  const expected = createHmac("sha256", process.env.STRIPE_SECRET)
    .update(body)
    .digest("hex");

  const sigValue = sig
    .split(",")
    .find((p) => p.startsWith("v1="))
    .replace("v1=", "");

  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(sigValue))) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(body);
  console.log("Stripe event:", event.type);
  res.json({ received: true }); // תמיד להחזיר 200 מהר!
});
```

**Idempotency:** שירותים כמו Stripe עלולים לשלוח את אותו webhook פעמיים (במקרה של timeout או retry). יש לשמור את `event.id` במסד נתונים ולבדוק כפילויות לפני עיבוד.

---

## שקף 13 – סיכום

**שאלות לסיכום:**

1. מה ההבדל בין WebHook ל-Polling?
2. למה חשוב לאמת חתימת WebHook?
3. מה עושים עם הודעת WebHook כפולה?

**תשובות עיקריות:**

- WebHook = Push (השרת החיצוני יוזם), Polling = Pull (אנחנו שואלים כל הזמן)
- אימות חתימה מונע התקפות זיוף והזרקת נתונים מזויפים
- Idempotency: שמירת event ID ובדיקת כפילויות לפני עיבוד

**חיבור ליום 2:** ביום הבא נלמד Express 5 שבונה על גבי `http.createServer` ומספק abstractions נוחות למה שבנינו היום ידנית.
