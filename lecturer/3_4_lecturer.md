# הרחבות : – יום 3 מצגת 12: Security Deep Dive

**זמן:** 15:00–16:30
**מטרה:** הוספת שכבות הגנה ל-API והיכרות עם OWASP API Top 10

---

## שקף 1 – פתיחה

יש לנו API עם Auth — אבל Auth לבד לא מספיק. אפשר לעקוף Auth אם יש BOLA. אפשר לגנוב secrets אם הם ב-GitHub. עכשיו נוסיף שכבות הגנה.

**מה נלמד:**

- OWASP API Top 10 — הרשימה שכל מפתח חייב להכיר
- helmet — security headers בשורה אחת
- CORS — מי מורשה לגשת ל-API
- Rate Limiting — הגנה מפני DoS ו-brute force
- Sanitization — מניעת NoSQL/SQL injection
- BOLA — הבעיה מספר 1 ב-API security
- Mass Assignment — חולשה שקל להתעלם ממנה
- Secrets Management — .env לא שייך ל-Git, אי פעם

**OWASP API Top 10 — תיאור קצר:**

| #   | שם                                | תיאור                         |
| --- | --------------------------------- | ----------------------------- |
| 1   | BOLA                              | גישה למשאב של משתמש אחר       |
| 2   | Broken Auth                       | JWT חלש, חסר refresh rotation |
| 3   | Broken Object Level Auth          | הרשאות לא נבדקות              |
| 4   | Unrestricted Resource Consumption | חסר rate limiting             |
| 5   | Broken Function Level Auth        | endpoints חשופים לשגיאה       |
| 6   | Mass Assignment                   | עדכון שדות לא מורשים          |
| 7   | Security Misconfiguration         | CORS רחב, headers חסרים       |
| 8   | Injection                         | SQL/NoSQL/Command injection   |
| 9   | Improper Assets Management        | API versions ישנות חשופות     |
| 10  | Unsafe Consumption of APIs        | סמיכות עיוורת ב-3rd party     |

---

## שקף 2 – OWASP API Top 10

OWASP (Open Web Application Security Project) מפרסם את רשימת הסיכונים המובילים ב-API security. זהו מקור המידע המרכזי לאבטחת APIs.

**BOLA (#1 ברשימה):**
שגיאה נפוצה: `Task.findById(req.params.id)` ללא בדיקה שה-task שייך למשתמש הנוכחי. זו בעיית BOLA קלאסית.

---

## שקף 3 – helmet

\*\*דוגמה:

```js
import helmet from "helmet";
app.use(helmet());
```

\*\*Headers שנוספים:

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Powered-By: (נמחק!)
```

שורה אחת של קוד מוסיפה עשרות הגנות security. מומלץ תמיד.

---

## שקף 4 – CORS

\*\*דוגמה:

```js
import cors from "cors";

app.use(
  cors({
    origin: ["https://myapp.com", "https://admin.myapp.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);
```

**שגיאה נפוצה:**

```js
// ❌ מסוכן! כוכבית + credentials = לא עובד ב-browser
app.use(cors({ origin: "*", credentials: true }));

// ✅ נכון
app.use(
  cors({ origin: process.env.ALLOWED_ORIGIN?.split(","), credentials: true })
);
```

---

## שקף 5 – Rate Limiting

\*\*דוגמה:

```js
import rateLimit from "express-rate-limit";

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Too many requests", retryAfter: "15 minutes" }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // מחמיר לauth
  message: { error: "Too many login attempts" }
});

app.use("/api/", generalLimiter);
app.use("/auth/login", authLimiter);
```

\*\*בדיקה עם curl:

```bash
# שלח 6 בקשות ל-login ורואה 429
for i in {1..6}; do
  curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

---

## שקף 6 – Sanitization

\*\*דוגמת NoSQL Injection:

```js
// ❌ מסוכן - query injection
// POST /auth/login { "email": { "$gt": "" }, "password": "anything" }
const user = await User.findOne({ email: req.body.email });

// ✅ עם sanitization
import mongoSanitize from "express-mongo-sanitize";
app.use(mongoSanitize()); // מסיר $ ו-. מכל הinput
```

**הדגמה:**

```
Input: { "email": { "$gt": "" } }
After sanitize: { "email": {} }  ← operator הוסר
```

---

## שקף 7 – BOLA Demo

\*\*הדגמת הבעיה והפתרון:

```js
// Setup: User A יש task #1, User B יש task #2
// User B מנסה לגשת ל-task #1

// ❌ BOLA - לא בטוח
router.get("/:id", authenticate, async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.json(task); // User B קיבל את הtask של User A!
});

// ✅ בטוח
router.get("/:id", authenticate, async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user.id // ownership check!
  });
  if (!task) throw new AppError("Not found", 404);
  res.json(task);
});
```

---

## שקף 8 – Mass Assignment

\*\*דוגמה:

```js
// ❌ מסוכן
// POST /users { "name": "Alice", "role": "admin" }
await User.findByIdAndUpdate(id, req.body); // role עודכן!

// ✅ בטוח
const { name, email, bio } = req.body; // whitelist
await User.findByIdAndUpdate(id, { name, email, bio });
```

**Zod כפתרון:**

```js
const updateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional()
  // role לא נמצא כאן = לא יועבר
});
```

---

## שקף 9 – Secrets Management

שגיאה נפוצה מספר 1: העלאת קובץ .env ל-GitHub. סורקים אוטומטיים מוצאים סודות תוך שניות.

\*\*הדגמה:
echo "JWT_SECRET=super_secret_123" >> .env
git add .env
git status # ← אל תעשה commit!
git checkout .env
echo ".env" >> .gitignore

```

---

## שקף 11 – CSRF vs JWT

JWT ב-Authorization header לא חשוף ל-CSRF כי הדפדפן לא מוסיף את ה-header אוטומטית. Cookies חשופים ל-CSRF, לכן Refresh Token נשמר ב-HttpOnly Cookie עם SameSite=Strict.

---

## שקף 12 – Security Checklist

סקירה של כל הפריטים ברשימת ה-checklist.

---

## סיכום

מצגת זו סיקרה:
- OWASP API Top 10
- helmet לheaders אבטחה
- CORS configuration
- Rate limiting
- NoSQL injection prevention
- BOLA (הבעיה המרכזית)
- Mass assignment
- Secrets management
- CSRF vs JWT

**כלים שימושיים:**
- `npm audit` לבדיקת חולשות בתלויות
- securityheaders.com לבדיקת headers
```
