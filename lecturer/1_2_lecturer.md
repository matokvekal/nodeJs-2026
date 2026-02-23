# הרחבות : – יום 1 מצגת 2: Async Patterns & Control Flow

**זמן:** 10:45–12:00 (75 דקות)
**מטרה:** הכרת כל דפוסי async ובחירת async/await כסטנדרט

---

## שקף 1 – פתיחה

במצגת הקודמת ראינו איך Node.js עובד מבפנים. עכשיו נלמד איך לכתוב קוד אסינכרוני בצורה נכונה.

**מעבר מהיסטוריה לעתיד:** מ-Callbacks דרך Promises ל-async/await מודרני.

---

## שקף 2 – Callbacks (היסטוריה בלבד!)

**זמן מוגבל:** 5 דקות בלבד - Callbacks מופיעים בקוד ישן ובחבילות ישנות. בקוד חדש לא כותבים callbacks.

**דוגמת Callback Hell (Pyramid of Doom):**

```js
fs.readFile("a.txt", (err, a) => {
  fs.readFile("b.txt", (err, b) => {
    fs.readFile("c.txt", (err, c) => {
      // pyramid of doom!
    });
  });
});
```

**הבעיה:** קינון עמוק, קשה לקריאה, טיפול בשגיאות מסורבל.

**הפתרון:** util.promisify ממיר callbacks קיימים ל-Promises. בקוד חדש - שימוש ב-fs/promises ישירות.

---

## שקף 3 – Promise

Promise הוא אובייקט שמייצג ערך עתידי.

**אנלוגיה:** כמו קבלה מהמלצר – לא מקבלים את האוכל מיד, אבל יש הבטחה שיגיע.

**מצבי Promise:**

```
Promise
  ↓
pending → fulfilled (resolve)
       → rejected  (reject)
```

**חשוב:** ברגע שPromise הפך ל-settled (fulfilled או rejected), המצב שלו לא משתנה.

**דוגמת יצירה:**

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve("data!"), 1000);
});
p.then((data) => console.log(data));
```

---

## שקף 4 – יצירת Promise

**עקרון:** ברוב המקרים לא יוצרים Promise ידנית – משתמשים בפונקציות שכבר מחזירות Promise. אבל חשוב להבין את המנגנון.

**דוגמת util.promisify - המרת callbacks קיימים:**

```js
import { promisify } from "node:util";
import { readFile } from "node:fs";

const readFileAsync = promisify(readFile);
const content = await readFileAsync("file.txt", "utf8");
```

**בקוד מודרני – ישירות מ-fs/promises:**

```js
import { readFile } from "node:fs/promises";
const content = await readFile("file.txt", "utf8");
```

---

## שקף 5 – async/await ← **ליבת המודול**

async/await הוא סינטקס שמאפשר לכתוב קוד אסינכרוני שנראה כמו סינכרוני. תחת המנוע – זה Promises בדיוק.

**זמין מאז:** Node.js 7.6+ (ES2017)

**השוואת סגנונות:**

```js
// Promise-style
fetchUser(id)
  .then((user) => fetchOrders(user.id))
  .then((orders) => sendResponse(orders));

// async/await – אותו דבר, קריא יותר
async function handler(id) {
  const user = await fetchUser(id);
  const orders = await fetchOrders(user.id);
  sendResponse(orders);
}
```

**שאלה נפוצה:** אם await "עוצר" את הפונקציה, איך Node.js ממשיך לקבל בקשות?

**תשובה:** הפונקציה async מושעת (suspended), אבל Event Loop ממשיך לפעול. await עוצר רק את הפונקציה הספציפית, לא את כל התהליך! זה המודל Non-Blocking בפעולה.

**טיפול בשגיאות ב-async/await** נעשה עם try/catch מסורתי - פשוט וברור.

**השוואת Express 5 ל-Express 4:**

```js
// Express 5 - Promise-aware (אוטומטי)
app.get("/users/:id", async (req, res) => {
  const user = await userService.findById(req.params.id);
  // אם נזרקת שגיאה - Express 5 שולח אוטומטית ל-error middleware
  res.json(user);
});

// Express 4 - טיפול ידני נדרש
app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err); // חובה להעביר ל-error middleware ידנית
  }
});
```

\*\*Best Practice חיוני:

מקבילות (Concurrency) היא המפתח לביצועים.

**בעיה נפוצה - ביצוע סדרתי:**

```js
//   איטי - סדרתי (1s + 1s + 1s = 3s)
const user = await fetchUser(id);
const orders = await fetchOrders(id);
const profile = await fetchProfile(id);

//  מהיר - מקביל (max(1s, 1s, 1s) = 1s)
const [user, orders, profile] = await Promise.all([
  fetchUser(id),
  fetchOrders(id),
  fetchProfile(id)
]);
```

**התנהגות:** Promise.all נכשל כולו אם אחד נכשל.

**Promise.allSettled - גרסה סלחנית:**

```js
const results = await Promise.allSettled([
  fetchUser(1),
  fetchUser(999), // ייכשל
  fetchUser(3)
]);

results.forEach((r) => {
  if (r.status === "fulfilled") console.log("Success:", r.value);
  else console.log("Failed:", r.reason);
});
```

**Promise.race:** החזרת התוצאה של הראשון שמסיים (הצלחה או כשלון).

**דוגמת timeout - הדרך המודרנית ב-2026:**

```js
//  Modern approach - AbortSignal.timeout (Node 18+)
const res = await fetch("https://api.slow.com", {
  signal: AbortSignal.timeout(5000)
});

// 🕐 Old approach - Promise.race
const res = await Promise.race([
  fetch("https://api.slow.com"),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), 5000)
  )
]);
```

**Promise.any:** החזרת הראשון שמצליח, התעלמות מכשלונות.

---

## שקף 9 – finally

finally מבצע cleanup - רץ תמיד, בהצלחה או בכשלון.

**דוגמת שחרור משאבים:**

```js
async function withDbConnection(fn) {
  const conn = await getConnection();
  try {
    return await fn(conn);
  } finally {
    await conn.release(); // רץ תמיד - גם בשגיאה!
  }
}
```

**Use Cases נפוצים:** סגירת קבצים, שחרור connections, cleanup של resources.

---

## שקף 10 – Async Iterators

for await...of מאפשר איטרציה על async collections.

**דוגמת stream processing:**

```js
import { createReadStream } from "node:fs";
const stream = createReadStream("./large-file.txt", "utf8");

for await (const chunk of stream) {
  processChunk(chunk); // מחכה לפני chunk הבא
}
```

**יתרון:** קוד קריא, טיפול בשגיאות עם try/catch, backpressure אוטומטי.

---

## שקף 11–12 – AbortSignal

AbortSignal = מנגנון ביטול (cancellation) אוניברסלי.

**תמיכה נרחבת:** fetch, streams, setTimeout, event listeners.

**Best Practice:** תמיד לתמוך ב-AbortSignal ב-APIs ארוכי טווח.

---

## שקף 13 – סיכום

**נקודות מרכזיות לבדיקה:**

1. מה ההבדל בין `Promise.all` ל-`Promise.allSettled`?
   - all: נכשל אם אחד נכשל | allSettled: תמיד מחזיר תוצאות

2. מה קורה לקוד אחרי `await`?
   - הפונקציה מושעת, Event Loop ממשיך, קוד ממשיך אחרי resolve

3. מתי משתמשים ב-`for await`?
   - לאיטרציה על async collections כמו streams

**תזכורת:** async/await הוא הסטנדרט המודרני ב-2026.

> "AbortSignal = מנגנון ביטול אחיד. יש לנו כבר fetch שמקבל signal, streams, setTimeout – הכל תומך בזה."

---

## שקף 13 – סיכום (3 דקות)

**שאלות:**

1. מה ההבדל בין `Promise.all` ל-`Promise.allSettled`?
2. מה קורה לקוד שאחרי `await` כשהוא מחכה?
3. מתי נשתמש ב-`for await`?

---

## הערות מרצה

- **זמן חסוך**: אם יש חוסר זמן, קצר את שקף 10-11 (Async Iterators) ל-3 דקות
- **שאלות נפוצות**: "האם await חוסם את Server?" → לא! חוסם רק את הפונקציה הספציפית
- Generators נדחו ליום 4 – ציין זאת אם שואלים
