# מדריך למרצה – יום 1 מצגת 1: Modern Node.js Runtime 2026

**זמן:** 09:00–10:30 (90 דקות)
**מטרה:** התלמידים יבינו איך Node.js עובד מבפנים – V8, libuv, Event Loop

---

## הכנה מראש

- הכן דמו של `node --watch` על קובץ שמשנה console.log
- הכן diagram של Event Loop Phases (ציור על הלוח)
- בדוק שיש Node.js 20+ מותקן על כל מחשב
- הכן קובץ `demo-event-loop.js` להדגמה

---

## שקף 1 – פתיחה (3 דקות)

**מה להגיד:**

> "היום נתחיל מהיסוד. לפני שנבנה APIs וטיפולים בנתונים, חשוב שתבינו איך Node.js עובד מבפנים. זה יעזור לכם לאבחן באגים ולכתוב קוד טוב יותר."

## https://nodejs.org/docs/latest/api/

## שקף 2 – מה זה Node.js? (5 דקות)

**מה להגיד:**

> "Node.js הוא לא שפה – JavaScript היא השפה. Node.js הוא **סביבת ריצה** שמאפשרת ל-JavaScript לרוץ על השרת, מחוץ לדפדפן. זה כמו Chrome בלי ממשק גרפי, אבל עם APIs לקבצים, רשת ועוד."

**נקודה חשובה:** הדגש שה-Non-Blocking I/O הוא מה שמבדיל את Node.js – תוסיף שבדפדפן JavaScript גם חד-תהליכוני, אבל השרת מנצל זאת לטפל בהרבה בקשות.

---

## שקף 3 – V8 (7 דקות)

**מה להגיד:**

> "V8 הוא המנוע שמריץ את הקוד שלכם. הוא לוקח JavaScript ומתרגם ל-machine code. חשוב להבין את מבנה הזיכרון כי זה יעזור לכם להבין memory leaks אחר כך."

**ציור על הלוח:**

```
┌─────────────────────────────┐
│         V8 Heap             │
│  ┌──────────┐ ┌──────────┐  │
│  │ New Space│ │ Old Space│  │
│  │ (2MB)   │ │ (1GB+)  │  │
│  └──────────┘ └──────────┘  │
└─────────────────────────────┘
        ↑
   Stack (Call Stack)
```

---

## שקף 4 – libuv (8 דקות)

**מה להגיד:**

> "libuv היא הלב השני של Node.js. V8 מריץ JavaScript, libuv מטפל בכל מה שאסינכרוני. כשאתם קוראים קובץ, Node.js לא חוסם ומחכה – הוא שולח את המשימה ל-libuv ומיד ממשיך."

**דגש:** Thread Pool – ברירת מחדל 4 threads. אפשר לשנות עם `UV_THREADPOOL_SIZE`. שאל: "מה קורה אם מריצים 5 פעולות I/O מקביליות?"

---

## שקף 5 – Event Loop Phases (15 דקות) ← **CORE**

**מה להגיד:**

> "זה החלק הכי חשוב. Event Loop הוא לולאה שרצה ללא הפסקה ומבצעת callbacks. כל סיבוב עובר דרך שלבים מוגדרים."

**ציור מפורט על הלוח:**

```
   ┌─────────────────────────────┐
   │            timers           │ setTimeout, setInterval
   └──────────┬──────────────────┘
              │
   ┌──────────▼──────────────────┐
   │     pending callbacks       │
   └──────────┬──────────────────┘
              │
   ┌──────────▼──────────────────┐
   │          poll               │ ← רוב הזמן כאן, מחכה ל-I/O
   └──────────┬──────────────────┘
              │
   ┌──────────▼──────────────────┐
   │          check              │ setImmediate
   └──────────┬──────────────────┘
              │
   ┌──────────▼──────────────────┐
   │      close callbacks        │
   └─────────────────────────────┘
```

**דמו:**

```js
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
Promise.resolve().then(() => console.log("promise"));
process.nextTick(() => console.log("nextTick"));
console.log("sync");
// סדר: sync → nextTick → promise → timeout/immediate (לא מובטח)
```

---

## שקף 6 – Microtasks vs Macrotasks (10 דקות)

**מה להגיד:**

> "Microtasks הם כמו 'כתר VIP' – הם תמיד נכנסים ראשונים לפני כל macrotask הבא. זה למה Promise.then תמיד יפעל לפני setTimeout."

**דמו מהיר:**

```js
console.log("1");
setTimeout(() => console.log("4: setTimeout"), 0);
Promise.resolve().then(() => console.log("3: promise"));
process.nextTick(() => console.log("2: nextTick"));
// פלט: 1, 2, 3, 4
```

---

## שקף 7 – setImmediate vs setTimeout (7 דקות)

**מה להגיד:**

> "ב-99% מהמקרים לא תצטרכו להחליט ביניהם. אבל כשאתם בתוך I/O callback – setImmediate תמיד יפעל קודם, וזה מובטח."

---

## שקף 8 – Non-Blocking I/O (8 דקות)

**מה להגיד:**

> "זה הסיפור של Node.js. שרת מסורתי (Java/PHP) יוצר thread לכל בקשה. Node.js – thread אחד לכולם. בזמן שבקשה מחכה לDB, Node.js מטפל ב-100 בקשות אחרות."

**אנלוגיה:**

> "דמיינו מלצר שמגיש ל-50 שולחנות. מלצר מסורתי חוכה ליד כל שולחן עד שהמטבח גמר. Node.js = מלצר שמפזר הזמנות ומטפל בכולם ביחד."

---

## שקף 9 – process object (7 דקות)

**דמו מהיר:**

```js
console.log(process.env.NODE_ENV);
console.log(process.argv); // node script.js arg1 arg2
console.log(process.memoryUsage());
process.on("uncaughtException", (err) => {
  console.error("Unhandled!", err);
  process.exit(1);
});
```

---

## שקף 10 – Built-in Fetch (5 דקות)

**מה להגיד:**

> "Node.js 18+ מגיע עם fetch כמו בדפדפן. אין צורך ב-axios לשימושים פשוטים."

**דמו:**

```js
const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
const data = await response.json();
console.log(data);
```

---

## שקף 11 – AbortController (7 דקות)

**מה להגיד:**

> "AbortController זה כמו כפתור 'ביטול' אוניברסלי. עובד עם fetch, streams, event listeners."

**דמו timeout:**

```js
try {
  const res = await fetch("https://slow-api.com", {
    signal: AbortSignal.timeout(3000)
  });
} catch (err) {
  if (err.name === "TimeoutError") console.log("Request timed out!");
}
```

---

## שקף 12 – כלים מודרניים (5 דקות)

**דמו --watch:**

```bash
node --watch server.js
# ערוך קובץ → Node מפעיל מחדש אוטומטית
```

**דמו --env-file:**

```bash
echo "PORT=4000" > .env
node --env-file=.env server.js
```

---

## שקף 13 – try/catch/finally (5 דקות)

**דמו cleanup:**

```js
async function processFile(path) {
  const file = await open(path);
  try {
    const data = await file.read();
    return processData(data);
  } finally {
    await file.close(); // תמיד נסגר!
  }
}
```

---

## שקף 14 – סיכום (3 דקות)

**שאלות לבדיקת הבנה:**

1. מה ההבדל בין V8 לـ libuv?
2. מה קורה לפני Microtask או Macrotask?
3. למה Node.js יכול לטפל בהרבה בקשות מקביליות?

**הכנה למצגת הבאה:**

> "עכשיו שאתם מבינים את הבסיס, נדבר על Async Patterns – הכלים שמשתמשים ב-Event Loop."

---

## הערות מרצה

- **בשאלה על Generators**: "אנחנו מדלגים על Generators לעומק – מפונה ליום 4 אם יש זמן"
- תרסמו את ה-Event Loop diagram כ-reference לאורך כל הקורס
- הזמן בין 10 לתלמיד שאוהב לשאול הרבה
