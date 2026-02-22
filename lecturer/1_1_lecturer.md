# הרחבות : – יום 1 מצגת 1: Modern Node.js Runtime 2026

**זמן:** 09:00–10:30 (90 דקות)
**מטרה:** הבנת עבודת Node.js מבפנים – V8, libuv, Event Loop

---

## שקף 1 – פתיחה

היום נתחיל מהיסוד. לפני לבנות APIs וטיפול בנתונים, חשוב להבין איך Node.js עובד מבפנים. זה יעזור לאבחן באגים ולכתוב קוד טוב יותר.

**מה נלמד היום:**

- איך Node.js עובד מבפנים: V8, libuv, Event Loop
- מה זה Non-Blocking I/O ולמה זה חשוב
- כלים מובנים חדשים ב-Node.js 20+
- איך להתחיל לחשוב כמו מפתח Node.js

**למה זה חשוב:**
מפתח שמבין את הארכיטקטורה של Node.js יכתוב קוד מהיר יותר, ידע לאבחן memory leaks, ויבין למה הסרת sleep/delay לא עוזרת כשה-Event Loop חסום.

**דוקומנטציה רשמית:** https://nodejs.org/docs/latest/api/

---

## שקף 2 – מה זה Node.js?

Node.js הוא לא שפה – JavaScript היא השפה. Node.js הוא **סביבת ריצה** (runtime) שמאפשרת ל-JavaScript לרוץ על השרת, מחוץ לדפדפן.

**אנלוגיה:** זה כמו Chrome בלי ממשק גרפי, אבל עם APIs מובנים לקבצים, רשת, מערכת הפעלה ועוד.

**נקודת מפתח:** Non-Blocking I/O הוא מה שמבדיל את Node.js. גם בדפדפן JavaScript חד-תהליכוני, אבל בשרת המודל הזה מנוצל כדי לטפל באלפי בקשות במקביל.

**ארכיטקטורת Node.js – זרימת בקשה:**

```
1. לקוח שולח בקשה
   ↓
2. הבקשה נכנסת ל-Event Queue
   ↓
3. Event Loop בודק את התור ברציפות
   ↓
4. משימות פשוטות (non-blocking) → מטופלות ב-main thread
   משימות כבדות (I/O, crypto) → מועברות ל-Thread Pool (libuv)
   ↓
5. כשהמשימה הכבדה גמרה → callback חוזר ל-Callback Queue
   ↓
6. Event Loop מעבד את ה-callback ושולח תשובה
```

**מה Node.js מצוין לבנות:**

- שרתי Web ו-REST APIs
- אפליקציות Real-time (צ'אטים, התראות חיות)
- כלי command-line
- מיקרו-שירותים (microservices)

**מתי לא להשתמש ב-Node.js:**

- חישובים כבדים של CPU (Machine Learning, קידוד וידאו) — ייחסמו את ה-Event Loop
- במקרים כאלה: Worker Threads, שפה אחרת, או microservice נפרד

---

## שקף 3 – V8 Engine

V8 הוא מנוע Google's open-source JavaScript שמריץ את קוד ה-JavaScript. פותח במקור עבור Chrome ב-2008, ועכשיו הוא הלב של Node.js.

**מה V8 עושה:**

- לוקח JavaScript ומתרגם אותו ל-machine code (JIT Compilation)
- מספק garbage collection אוטומטי
- מיישם תקני ECMAScript ו-WebAssembly

**מדוע זה חשוב:** הבנת מבנה הזיכרון חיונית לאבחון memory leaks בהמשך.

**בדיקת גרסת V8:**

```js
console.log(`V8 version: ${process.versions.v8}`);
```

**דיאגרמת V8 Heap:**

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

**עוד על V8:** V8 משתמש ב-JIT (Just-In-Time) compilation, Hidden Classes לאופטימיזציות, ו-efficient garbage collection למניעת memory leaks.

---

## שקף 4 – libuv

libuv היא הלב השני של Node.js. בעוד V8 מריץ JavaScript, libuv מטפלת בכל מה שאסינכרוני.

**איך זה עובד:** בעת קריאה לקובץ, Node.js לא חוסם ומחכה – המשימה נשלחת ל-libuv והתוכנה ממשיכה מיד.

**Thread Pool:** ברירת מחדל 4 threads. ניתן לשנות עם `UV_THREADPOOL_SIZE`.

**שאלה לדיון:** מה קורה כשמריצים 5 פעולות I/O מקביליות עם Thread Pool של 4?

---

## שקף 5 – Event Loop Phases ← **ליבת המודול**

זה החלק הכי חשוב. Event Loop הוא לולאה שרצה ללא הפסקה ומבצעת callbacks. כל סיבוב (iteration) עובר דרך שלבים מוגדרים.

**סדר הביצוע המלא:**

| סדר | סוג              | דוגמאות                     |
| --- | ---------------- | --------------------------- |
| 1   | קוד סינכרוני     | כל שורה רגילה               |
| 2   | process.nextTick | process.nextTick(() => ...) |
| 3   | Microtasks       | Promise.resolve().then(...) |
| 4   | Timers           | setTimeout, setInterval     |
| 5   | Check            | setImmediate                |
| 6   | Close            | socket.on('close')          |

**כלל אצבע:** בין כל phase, Node.js מרוקן את כל ה-Microtasks ו-nextTick לפני שעובר לשלב הבא.

**מדוע זה חשוב:** Event Loop מאפשר ל-Node.js לטפל באלפי connections במקביל עם thread אחד בלבד.

**דיאגרמת Event Loop Phases:**

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

**דוגמת קוד - סדר הפעולות:**

```js
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
Promise.resolve().then(() => console.log("promise"));
process.nextTick(() => console.log("nextTick"));
console.log("sync");
// סדר פלט: sync → nextTick → promise → timeout/immediate (לא מובטח)
```

**הסבר:** Synchronous code → nextTick → Microtasks (Promises) → Timers → Check (setImmediate)

---

## שקף 6 – Microtasks vs Macrotasks

Microtasks הם כמו 'כרטיס VIP' – הם תמיד מבוצעים לפני כל macrotask הבא. זה למה Promise.then תמיד יפעל לפני setTimeout.

**Microtasks:** Promises, process.nextTick  
**Macrotasks:** setTimeout, setInterval, setImmediate

**נקודה חשובה:** בין כל phase של Event Loop, Node.js מריץ את כל ה-Microtasks לפני המעבר לphase הבא.

\*\*דוגמה:

```js
console.log("1");
setTimeout(() => console.log("4: setTimeout"), 0);
Promise.resolve().then(() => console.log("3: promise"));
process.nextTick(() => console.log("2: nextTick"));
// פלט: 1, 2, 3, 4
```

---

## שקף 7 – setImmediate vs setTimeout

ב-99% מהמקרים אין צורך להחליט ביניהם.

**ההבדל המעשי:** בתוך I/O callback, setImmediate תמיד יפעל קודםמכןבר, וזה מובטח.

**מחוץ ל-I/O callback:** הסדר בין setTimeout(0) ל-setImmediate לא מובטח - תלוי בביצועי המערכת.

---

## שקף 8 – Non-Blocking I/O

זה הסיפור של Node.js. שרת מסורתי (Java/PHP) יוצר thread לכל בקשה. Node.js – thread אחד לכולם.

**היתרון:** בזמן שבקשה מחכה ל-DB, Node.js מטפל ב-100 בקשות אחרות במקביל.

**אנלוגיה:** מלצר שמגיש ל-50 שולחנות:

- **מסורתי:** חוכה ליד כל שולחן עד שהמטבח גמר
- **Node.js:** מפזר הזמנות ומטפל בכולם במקביל

**מתי לא להשתמש ב-Node.js:** משימות CPU-intensive (חישובים כבדים) עלולות לחסום את ה-Event Loop. במקרים כאלה - worker threads או microservices.

---

## שקף 9 – process object

אובייקט global שמספק מידע ושליטה על תהליך Node.js הנוכחי.

**דוגמאות:**

```js
// משתני סביבה
console.log(process.env.NODE_ENV);

// פרמטרים משורת הפקודה
console.log(process.argv); // node script.js arg1 arg2

// מידע על שימוש בזיכרון
console.log(process.memoryUsage());

// טיפול בשגיאות קריטיות
process.on("uncaught Exception", (err) => {
  console.error("Unhandled!", err);
  process.exit(1);
});
```

---

## שקף 10 – Built-in Fetch

Node.js 18+ מגיע עם fetch מובנה כמו בדפדפן.

**יתרון:** ללא צורך ב-axios או חבילות חיצוניות לשימושים פשוטים.

**דוגמה:**

```js
const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
const data = await response.json();
console.log(data);
```

**רקע:** מבוסס על undici – HTTP client המאופטם של Node.js.

---

## שקף 11 – AbortController

מנגנון ביטול (cancellation) אוניברסלי לפעולות async.

**שימושים:** fetch, streams, event listeners

**דוגמת timeout:**

```js
try {
  const res = await fetch("https://slow-api.com", {
    signal: AbortSignal.timeout(3000)
  });
} catch (err) {
  if (err.name === "TimeoutError") console.log("Request timed out!");
}
```

**Use Case:** כשהלקוח מתנתק, ניתן לבטל פעולות קשורות.

---

## שקף 12 – כלים מודרניים

**--watch mode (חדש ב-Node 18+):**

```bash
node --watch server.js
# שינוי בקובץ → אתחול מחדש אוטומטית
```

**יתרון:** ללא צורך ב-nodemon!

**--env-file (חדש ב- Node 20.6+):**

```bash
echo "PORT=4000" > .env
node --env-file=.env server.js
```

**יתרון:** ללא צורך ב-dotenv package!

---

## שקף 13 – try/catch/finally

שיטת cleanup נכונה למשאבים כמו קבצים וחיבורי DB.

**דוגמה:**

```js
async function processFile(path) {
  const file = await open(path);
  try {
    const data = await file.read();
    return processData(data);
  } finally {
    await file.close(); // תמיד נסגר - גם בשגιאה!
  }
}
```

**חשוב:** finally מרוצה תמיד – גם עם return או שגיאה.

---

## שקף 14 – סיכום

**נקודות מרכזיות:**

1. מה ההבדל בין V8 ל-libuv?
   - V8: מריץ JavaScript | libuv: מטפל ב-async I/O

2. מה קורה לפני Microtask או Macrotask?
   - Microtasks מבוצעים בין כל event loop phase

3. למה Node.js יכול לטפל באלפי בקשות מקביליות?
   - Non-blocking I/O + Event Loop

**מעבר:** Async Patterns – כלים לעבודה עם Event Loop.
