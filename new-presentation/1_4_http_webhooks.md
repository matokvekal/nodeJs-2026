# יום 1 – מצגת 4: HTTP Fundamentals + WebHooks

---

## שקף 1
**כותרת ראשית:** HTTP Fundamentals + WebHooks
**כותרת משנה:** http.createServer, Headers, Status Codes, WebHook, Idempotency

---

## שקף 2
**כותרת ראשית:** http.createServer
- מודול `http` מובנה ב-Node.js – שרת HTTP ללא תלויות חיצוניות
- `http.createServer((req, res) => { })` → callback עם `IncomingMessage` ו-`ServerResponse`
- `server.listen(port, host, callback)` → מתחיל להאזין לחיבורים
- **req** הוא Readable Stream, **res** הוא Writable Stream
- כל בקשה = callback חדש עם אובייקטי req/res חדשים
- בסיס של כל Framework כמו Express – הם עוטפים `http.createServer`

---

## שקף 3
**כותרת ראשית:** אובייקט Request (req)
- `req.method` → `'GET'`, `'POST'`, `'PUT'`, `'DELETE'`, `'PATCH'`
- `req.url` → הנתיב המבוקש כולל query string: `'/users?page=2'`
- `req.headers` → אובייקט headers באותיות קטנות: `req.headers['content-type']`
- `req` הוא **Readable Stream** – גוף הבקשה מגיע כ-chunks
- `req.socket` → גישה ל-TCP socket הבסיסי
- `req.httpVersion` → `'1.1'` או `'2.0'`

---

## שקף 4
**כותרת ראשית:** אובייקט Response (res)
- `res.statusCode = 200` → קוד סטטוס (לפני שליחה!)
- `res.setHeader('Content-Type', 'application/json')` → מגדיר header
- `res.writeHead(statusCode, headersObj)` → שורת סטטוס + headers בבת אחת
- `res.write(data)` → כותב חלק מגוף התגובה
- `res.end(data)` → מסיים ושולח את התגובה ללקוח
- לא ניתן לשלוח headers אחרי `res.write` / `res.end`

---

## שקף 5
**כותרת ראשית:** קודי סטטוס HTTP – Best Practice
- **2xx הצלחה:** `200 OK`, `201 Created`, `204 No Content`
- **3xx הפניה:** `301 Moved Permanently`, `304 Not Modified`
- **4xx שגיאת לקוח:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `422 Unprocessable Entity`, `429 Too Many Requests`
- **5xx שגיאת שרת:** `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`
- **כלל:** שלח קוד מדויק שמסביר **מה קרה** ולא תמיד 200
- `409 Conflict` – כשמשאב כבר קיים; `422` – ולידציה נכשלה

---

## שקף 6
**כותרת ראשית:** Headers חשובים
- `Content-Type: application/json` → מגדיר סוג תוכן התגובה
- `Content-Length` → אורך גוף התגובה בבתים
- `Authorization: Bearer <token>` → טוקן אימות בבקשה
- `Cache-Control: no-store` → מניעת caching
- `X-Request-Id: <uuid>` → מזהה ייחודי לבקשה לצורך מעקב
- `Retry-After: 60` → כמה שניות לחכות לפני ניסיון מחדש

---

## שקף 7
**כותרת ראשית:** פרסור URL עם WHATWG URL
- `new URL(req.url, 'http://localhost')` → אובייקט URL מלא
- `url.pathname` → הנתיב ללא query string: `'/api/users'`
- `url.searchParams.get('page')` → ערך פרמטר query
- `url.searchParams.has('filter')` → בדיקה אם פרמטר קיים
- `url.searchParams.forEach((v, k) => ...)` → מעבר על כל הפרמטרים
- תקן WHATWG URL מחליף את מודול `url` הישן

---

## שקף 8
**כותרת ראשית:** קריאת Body מבקשה
- גוף הבקשה מגיע כ-stream → יש לאסוף את ה-chunks
- שיטה מודרנית עם `for await`:
  ```js
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = JSON.parse(Buffer.concat(chunks).toString());
  ```
- יש לבדוק `Content-Type` לפני פרסור
- **הגבל גודל body!** – מניעת DDoS על ידי payload גדול
- ב-Express: `express.json({ limit: '10kb' })` עושה הכל אוטומטי

---

## שקף 9
**כותרת ראשית:** Streaming Response
- `res` הוא Writable Stream → ניתן לשלוח תגובה **בחלקים**
- `Transfer-Encoding: chunked` נשלח אוטומטית כשכותבים עם `res.write` מספר פעמים
- מאפשר שליחת נתונים גדולים ללא טעינה מלאה לזיכרון
- `pipeline(readableStream, res)` → שולח קובץ ישירות ל-response
- שימושי: שליחת קבצים גדולים, לוגים בזמן אמת, **Server-Sent Events**
- `res.setHeader('X-Content-Type-Options', 'nosniff')` להגנה בשליחת תוכן

---

## שקף 10
**כותרת ראשית:** AbortSignal בבקשה יוצאת
- `fetch(url, { signal: AbortSignal.timeout(5000) })` → timeout אוטומטי
- ביטול ידני: יצור `AbortController`, העבר `controller.signal`, קרא `controller.abort()`
- `AbortError` נזרק בעת ביטול → בדוק ב-`catch`
- ביטול בקשה משחרר את חיבור הרשת ומונע דליפת משאבים
- חשוב לביטול כשהלקוח מנתק או כשהתוצאה לא רלוונטית
- ב-שרת: `req.on('close', () => controller.abort())` – ביטול כשהלקוח ניתק

---

## שקף 11
**כותרת ראשית:** WebHook – מושג ושימוש
- **WebHook** = HTTP callback שנשלח משרת חיצוני **לשרת שלנו** כשאירוע מתרחש
- שרת חיצוני שולח POST עם נתונים על האירוע ל-URL שהגדרנו
- דוגמאות: תשלום מ-Stripe, push ל-GitHub, הודעה מ-Slack
- דפוס **Push** – נתונים מגיעים אלינו במקום שנשאל שוב ושוב (Polling)
- **אימות WebHook**: חתימת HMAC-SHA256 ב-header (`X-Signature-256`)
- **תגובה מיידית!** – תמיד 200 מהר, עיבוד אסינכרוני אחר כך

---

## שקף 12
**כותרת ראשית:** Idempotency ו-Retry Logic
- **Idempotency**: פעולה שניתן לבצע אותה פעמים ומשיגים אותה תוצאה
- `GET`, `PUT`, `DELETE` – idempotent; `POST` – לא idempotent
- **חשוב בـ WebHooks**: השרת השולח עלול לשלוח פעמיים (retry)
- פתרון: שמירת `webhookId` ב-DB ובדיקת כפילויות לפני עיבוד
- **Retry Logic**: exponential backoff – ניסיון אחרי 1s, 2s, 4s, 8s...
- `Idempotency-Key` header – שליחה בבקשות POST למניעת כפילויות

---

## שקף 13
**כותרת ראשית:** סיכום – יום 1 מצגת 4
- `http.createServer` – שרת HTTP גולמי; req ו-res הם Streams
- קודי סטטוס מדויקים: 2xx הצלחה, 4xx שגיאת לקוח, 5xx שגיאת שרת
- WHATWG URL – פרסור מודרני של כתובות ו-query params
- Streaming response – שליחת נתונים גדולים בחלקים
- `AbortSignal` – timeout וביטול בקשות יוצאות
- WebHook = Push model; אימות HMAC + Idempotency + Retry
