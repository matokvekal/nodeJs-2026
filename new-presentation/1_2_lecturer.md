# מדריך למרצה – יום 1 מצגת 2: Async Patterns & Control Flow

**זמן:** 10:45–12:00 (75 דקות)
**מטרה:** התלמידים יכירו את כל דפוסי async ויבחרו async/await כסטנדרט

---

## הכנה מראש
- הכן קבצי דמו: `01-callbacks.js`, `02-promises.js`, `03-async-await.js`
- הכן דמו שמראה Callback Hell (5 רמות קינון)
- הכן דמו של `Promise.all` עם 3 בקשות API מקביליות

---

## שקף 1 – פתיחה (2 דקות)
**מה להגיד:**
> "במצגת הקודמת למדנו איך Node.js עובד. עכשיו נלמד איך אנחנו כותבים קוד אסינכרוני בצורה נכונה."

---

## שקף 2 – Callbacks (5 דקות – היסטוריה בלבד!)
**מה להגיד:**
> "5 דקות על Callbacks – רק כי תפגשו אותם בקוד ישן ובחבילות ישנות. לא נכתוב callbacks חדשים."

**הדגמת Callback Hell:**
```js
fs.readFile('a.txt', (err, a) => {
  fs.readFile('b.txt', (err, b) => {
    fs.readFile('c.txt', (err, c) => {
      // pyramid of doom!
    });
  });
});
```

**מסר:**
> "זה נקרא Callback Hell. util.promisify ממיר ל-Promises. בקוד חדש – לא נגע בזה."

---

## שקף 3 – Promise (8 דקות)
**מה להגיד:**
> "Promise הוא אובייקט שמייצג ערך עתידי. כמו קבלה מהמלצר – אתם לא מקבלים את האוכל עכשיו, אבל יש לכם הבטחה שיגיע."

**ציור:**
```
Promise
  ↓
pending → fulfilled (resolve)
       → rejected  (reject)
```

**דמו:**
```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve('data!'), 1000);
});
p.then(data => console.log(data));
```

---

## שקף 4 – יצירת Promise (5 דקות)
**מה להגיד:**
> "לרוב לא תיצרו Promise ידנית – תשתמשו בפונקציות שכבר מחזירות Promise. אבל חשוב להבין את המנגנון."

**דמו util.promisify:**
```js
import { promisify } from 'node:util';
import { readFile as readFileCb } from 'node:fs';
const readFile = promisify(readFileCb);
const content = await readFile('file.txt', 'utf8');
```

---

## שקף 5 – async/await ← **CORE** (15 דקות)
**מה להגיד:**
> "async/await הוא סינטקס שמאפשר לכתוב קוד אסינכרוני שנראה כמו סינכרוני. תחת המנוע – זה Promises בדיוק."

**דמו השוואה:**
```js
// Promise-style
fetchUser(id)
  .then(user => fetchOrders(user.id))
  .then(orders => sendResponse(orders));

// async/await – אותו דבר, קריא יותר
async function handler(id) {
  const user = await fetchUser(id);
  const orders = await fetchOrders(user.id);
  sendResponse(orders);
}
```

**שאלה לכיתה:** "אם await עוצר את הפונקציה, איך Node.js ממשיך לקבל בקשות?"
**תשובה:** "הפונקציה async עוצרת, אבל Event Loop ממשיך – זה עוצר רק את הפונקציה הספציפית, לא את התהליך!"

---

## שקף 6 – Error Handling (10 דקות)
**דמו Express 5:**
```js
// Express 5 - אוטומטי
app.get('/users/:id', async (req, res) => {
  const user = await userService.findById(req.params.id); // אם זרק - ישלח ל-error middleware
  res.json(user);
});

// Express 4 - ידני
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});
```

**דגש:**
> "אסור catch ריק! לפחות logger.error(err) לפני שממשיכים."

---

## שקף 7 – Promise.all (12 דקות)
**דמו סיטואציה אמיתית:**
```js
// ❌ סדרתי - איטי (1s + 1s + 1s = 3s)
const user = await fetchUser(id);
const orders = await fetchOrders(id);
const profile = await fetchProfile(id);

// ✅ מקביל - מהיר (max(1s, 1s, 1s) = 1s)
const [user, orders, profile] = await Promise.all([
  fetchUser(id),
  fetchOrders(id),
  fetchProfile(id)
]);
```

**allSettled דמו:**
```js
const results = await Promise.allSettled([
  fetchUser(1),
  fetchUser(999),  // will fail
  fetchUser(3)
]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log(r.value);
  else console.log('Failed:', r.reason);
});
```

---

## שקף 8 – Promise.race ו-any (8 דקות)
**דמו timeout מודרני:**
```js
// ✅ 2026 way - AbortSignal.timeout
const res = await fetch('https://api.slow.com', {
  signal: AbortSignal.timeout(5000)
});

// 🕐 old way - Promise.race
const res = await Promise.race([
  fetch('https://api.slow.com'),
  new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
]);
```

---

## שקף 9 – finally (5 דקות)
**דמו:**
```js
async function withDbConnection(fn) {
  const conn = await getConnection();
  try {
    return await fn(conn);
  } finally {
    await conn.release(); // תמיד!
  }
}
```

---

## שקף 10 – Async Iterators (7 דקות)
**דמו stream:**
```js
import { createReadStream } from 'node:fs';
const stream = createReadStream('./large-file.txt', 'utf8');

for await (const chunk of stream) {
  processChunk(chunk);  // מחכה לפני הchunk הבא
}
```

---

## שקף 11–12 – AbortSignal (5 דקות)
**מה להגיד:**
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
