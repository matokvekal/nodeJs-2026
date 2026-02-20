# יום 1 – מצגת 1: Modern Node.js Runtime 2026

---

## שקף 1
**כותרת ראשית:** Modern Node.js Runtime 2026
**כותרת משנה:** איך Node.js באמת עובד מבפנים

---

## שקף 2
**כותרת ראשית:** מה זה Node.js?
- סביבת ריצה לـ JavaScript מחוץ לדפדפן – בנויה על מנוע V8 של Chrome
- מאפשר לכתוב קוד שרת, כלי command-line ואוטומציה ב-JavaScript
- אירוע-מונחה (Event-Driven), לא-חוסם (Non-Blocking I/O)
- רץ על Windows, Mac, Linux – חד-תהליכוני אך ניתן לעבודה מקבילית
- מהיר מאוד לפעולות I/O: קריאת קבצים, בקשות HTTP, מסד נתונים
- לא מתאים לחישובים CPU כבדים – לכך יש worker_threads

---

## שקף 3
**כותרת ראשית:** V8 – מנוע ה-JavaScript
- מנוע JavaScript בקוד פתוח של Google – מריץ גם Chrome וגם Node.js
- מתרגם JavaScript לקוד מכונה ישירות (Just-In-Time compilation)
- מנהל זיכרון: **Heap** לאובייקטים, **Stack** לקריאות פונקציות
- Garbage Collector ב-V8 פועל בשני שלבים: Scavenge לאובייקטים חדשים, Mark-Sweep לישנים
- **New Space** (2MB) לאובייקטים קצרי חיים, **Old Space** (1GB+) לאובייקטים שורדים
- V8 מיישם את כל תכונות ES2015+ ומעלה

---

## שקף 4
**כותרת ראשית:** libuv – ספריית ה-Async
- ספריית C בקוד פתוח שמספקת את ה-Event Loop וה-Thread Pool ל-Node.js
- מנהלת I/O אסינכרוני: קבצים, רשת, DNS, Timer
- **Thread Pool** (ברירת מחדל: 4 threads) – לפעולות שה-OS לא תומך בהן אסינכרונית
- ניתן לשנות גודל ה-Thread Pool: `UV_THREADPOOL_SIZE=8`
- libuv זמין גם לשפות אחרות, לא רק ל-Node.js
- השילוב V8 + libuv = Node.js

---

## שקף 5
**כותרת ראשית:** Event Loop – שלבים (Phases)
- ה-Event Loop הוא לב פועם של Node.js – מריץ callback אחר callback
- **timers** – מריץ callbacks של `setTimeout` ו-`setInterval` שפג תוקפם
- **pending callbacks** – callbacks של שגיאות I/O מהסבב הקודם
- **poll** – מחכה ל-I/O חדש ומריץ callbacks שלו (הרוב של העבודה)
- **check** – מריץ callbacks של `setImmediate`
- **close callbacks** – סגירת סוקטים ומשאבים

---

## שקף 6
**כותרת ראשית:** Microtasks vs Macrotasks
- **Microtasks** מתבצעים מיד אחרי כל callback, לפני המשך ה-Event Loop
- `Promise.then / catch / finally` → נכנס לתור **microtask**
- `queueMicrotask()` → הוספה ישירה לתור microtask
- **Macrotasks**: `setTimeout`, `setInterval`, `setImmediate`, I/O callbacks
- `process.nextTick` → רץ לפני כל microtask אחר (דרגת עדיפות גבוהה ביותר)
- סדר הפעלה: `nextTick` ← `queueMicrotask` / Promises ← Macrotasks

---

## שקף 7
**כותרת ראשית:** setImmediate vs setTimeout
- `setTimeout(fn, 0)` – מריץ callback ב-timers phase, לא מיידי
- `setImmediate(fn)` – מריץ callback ב-check phase, אחרי ה-poll
- בתוך callback של I/O: `setImmediate` תמיד לפני `setTimeout(fn,0)`
- מחוץ ל-I/O callback: הסדר אינו מובטח ותלוי בזמן ריצה
- `process.nextTick` רץ לפני שניהם – שימוש בזהירות!
- לרוב שימוש ב-`setImmediate` עדיף כי הוא יותר צפוי

---

## שקף 8
**כותרת ראשית:** Non-Blocking I/O
- Node.js שולח פעולות I/O ל-libuv ומיד ממשיך לעבוד
- אין המתנה ("חסימה") עד שהפעולה מסתיימת
- הפלא: שרת אחד יכול לטפל באלפי בקשות מקביליות
- **דוגמה:** קריאת קובץ → Node.js ממשיך, כשהקובץ מוכן – callback נקרא
- חשוב: אין לבצע חישובים כבדים בלולאה הראשית – זה חוסם את כולם!
- פתרון לחישובים: worker_threads או child_process

---

## שקף 9
**כותרת ראשית:** אובייקט process
- `process.env` – גישה למשתני סביבה (`process.env.PORT`, `process.env.NODE_ENV`)
- `process.argv` – מערך הארגומנטים שהועברו בהרצת הסקריפט
- `process.exit(code)` – יציאה מהתהליך; קוד 0 = הצלחה, אחר = שגיאה
- `process.on('uncaughtException', handler)` – תפיסת שגיאות לא מטופלות
- `process.on('unhandledRejection', handler)` – תפיסת Promise לא מטופל
- `process.memoryUsage()` – מידע על שימוש זיכרון בזמן אמת

---

## שקף 10
**כותרת ראשית:** Built-in Fetch (Undici)
- Node.js 18+ מגיע עם `fetch` מובנה בלי צורך בהתקנת חבילה
- מבוסס על ספריית **undici** – לקוח HTTP מהיר ומודרני
- API זהה ל-`fetch` בדפדפן – קריאה אחידה בצד שרת ולקוח
- תומך ב-`AbortController` לביטול בקשות
- מחזיר `Response` עם `.json()`, `.text()`, `.body` (ReadableStream)
- לא צריך עוד `axios` לשימושים פשוטים – fetch עושה את העבודה

---

## שקף 11
**כותרת ראשית:** AbortController ו-AbortSignal
- `AbortController` מאפשר לבטל פעולות אסינכרוניות בצורה אחידה
- `controller.abort()` – שולח signal לביטול לכל מי שמאזין
- `AbortSignal.timeout(ms)` – יוצר signal שמתבטל אוטומטית אחרי זמן
- `AbortSignal.any([sig1, sig2])` – ביטול כשאחד מה-signals מופעל
- עובד עם: `fetch`, `fs.readFile`, EventEmitter, Streams
- מנגנון מפתח למניעת **דליפות זיכרון** ו-**timeout** נכון

---

## שקף 12
**כותרת ראשית:** כלים מודרניים: --watch, --env-file, node:test
- `node --watch server.js` – מפעיל מחדש אוטומטית כשקובץ משתנה (Node 18+)
- `node --env-file=.env server.js` – טוען משתני סביבה מקובץ (Node 20.6+)
- `node:test` – מודול בדיקות מובנה, ללא צורך ב-Jest/Mocha (Node 18+)
- הרצת בדיקות: `node --test *.test.js`
- שלושת הכלים מפחיתים תלות בחבילות חיצוניות
- `node --version` תמיד להריץ לפני כדי לוודא גרסה נכונה

---

## שקף 13
**כותרת ראשית:** try / catch / finally לניקוי משאבים
- `try` – קוד שעלול לזרוק שגיאה
- `catch(err)` – מטפל בשגיאה; `err.message`, `err.name`, `err.stack`
- `finally` – רץ תמיד, גם אם יש שגיאה וגם אם אין
- שימוש מרכזי ב-`finally`: סגירת חיבורים, שחרור locks, ניקוי resources
- עם `async/await`: `catch` תופס גם rejections של Promises
- אסור להשאיר `catch` ריק בייצור – תמיד לפחות לרשום ל-log

---

## שקף 14
**כותרת ראשית:** סיכום – יום 1 מצגת 1
- Node.js = V8 (JavaScript engine) + libuv (async I/O) + Node APIs
- ה-Event Loop מריץ callbacks בשלבים מוגדרים; microtasks קודמים ל-macrotasks
- Non-Blocking I/O מאפשר יעילות גבוהה בטיפול בבקשות מקביליות
- `process.env`, `process.argv`, `process.exit` – כלי יסוד לאפליקציה
- `fetch` מובנה, `AbortSignal`, `--watch`, `--env-file` – Node.js מודרני 2026
- `try/catch/finally` – דפוס חובה לניקוי משאבים נכון
