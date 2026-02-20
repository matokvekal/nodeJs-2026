# מדריך למרצה – יום 3 מצגת 12: Security Deep Dive

**זמן:** 15:00–16:30 (90 דקות)
**מטרה:** התלמידים יוסיפו שכבות הגנה ל-API ויכירו OWASP API Top 10

---

## הכנה מראש
- `npm install helmet cors express-rate-limit express-mongo-sanitize`
- הכן `curl` commands לדמו rate limiting
- הכן דמו של BOLA (גישה ל-task של user אחר)

---

## שקף 2 – OWASP API Top 10 (10 דקות)
**מה להגיד:**
> "OWASP = Open Web Application Security Project. הם מפרסמים את רשימת הסיכונים המובילים. זה ה-bible של אבטחת API."

**הדגש BOLA (#1):**
> "90% מהdeveloper junior שכותבים – `Task.findById(req.params.id)` – לא בודקים אם זה ה-task של *המשתמש הנוכחי*. זה BOLA."

---

## שקף 3 – helmet (8 דקות)
**Live demo:**
```js
import helmet from 'helmet';
app.use(helmet()); // זה הכל!
```

**הצג ב-Postman/DevTools את ה-headers:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Powered-By: (נמחק!)
```

**מה להגיד:**
> "שורה אחת = עשרות הגנות. אין סיבה לא להשתמש."

---

## שקף 4 – CORS (10 דקות)
**Live demo:**
```js
import cors from 'cors';

app.use(cors({
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

**שגיאה נפוצה:**
```js
// ❌ מסוכן! כוכבית + credentials = לא עובד ב-browser
app.use(cors({ origin: '*', credentials: true }));

// ✅ נכון
app.use(cors({ origin: process.env.ALLOWED_ORIGIN?.split(','), credentials: true }));
```

**הדגם CORS error בdeveloper tools**

---

## שקף 5 – Rate Limiting (12 דקות)
**Live demo:**
```js
import rateLimit from 'express-rate-limit';

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests', retryAfter: '15 minutes' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // מחמיר לauth
  message: { error: 'Too many login attempts' }
});

app.use('/api/', generalLimiter);
app.use('/auth/login', authLimiter);
```

**דמו:**
```bash
# שלח 6 בקשות ל-login ורואה 429
for i in {1..6}; do
  curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

---

## שקף 6 – Sanitization (8 דקות)
**NoSQL Injection demo:**
```js
// ❌ מסוכן - query injection
// POST /auth/login { "email": { "$gt": "" }, "password": "anything" }
const user = await User.findOne({ email: req.body.email });

// ✅ עם sanitization
import mongoSanitize from 'express-mongo-sanitize';
app.use(mongoSanitize()); // מסיר $ ו-. מכל הinput
```

**הדגמה:**
```
Input: { "email": { "$gt": "" } }
After sanitize: { "email": {} }  ← operator הוסר
```

---

## שקף 7 – BOLA Demo (15 דקות) ← **הכי חשוב!**
**Live demo – BOLA:**
```js
// Setup: User A יש task #1, User B יש task #2
// User B מנסה לגשת ל-task #1

// ❌ BOLA - לא בטוח
router.get('/:id', authenticate, async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.json(task); // User B קיבל את הtask של User A!
});

// ✅ בטוח
router.get('/:id', authenticate, async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user.id  // ownership check!
  });
  if (!task) throw new AppError('Not found', 404);
  res.json(task);
});
```

**הדגמה עם Postman:** שלח request עם token של user B לtask של user A.

---

## שקף 8 – Mass Assignment (8 דקות)
**Demo:**
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

## שקף 9 – Secrets Management (8 דקות)
**מה להגיד:**
> "מספר 1 של developer blunders – push של .env לgithub. GitHub scanners מוצאים אותם תוך שניות."

```bash
# הדגם:
echo "JWT_SECRET=super_secret_123" >> .env
git add .env
git status  # ← אל תעשה commit!
git checkout .env
echo ".env" >> .gitignore
```

---

## שקף 11 – CSRF vs JWT (5 דקות)
**מה להגיד:**
> "JWT בheader = לא CSRF. הדפדפן לא מוסיף Authorization header אוטומטית. Cookie = CSRF. לכן Refresh Token בHttpOnly Cookie + SameSite=Strict."

---

## שקף 12 – Security Checklist (5 דקות)
**Review מהיר** – עברו על כל item ביחד עם הכיתה.

---

## הערות מרצה
- **npm audit**: "הרצו `npm audit` עכשיו בפרויקט שלכם – תופתעו"
- **securityheaders.com**: "הכנסו כתובת של אתר שאתם מכירים – ראו את הציון"
