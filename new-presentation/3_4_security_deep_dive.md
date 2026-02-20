# יום 3 – מצגת 12: Security Deep Dive

---

## שקף 1
**כותרת ראשית:** Security Deep Dive
**כותרת משנה:** helmet, CORS, Rate Limiting, OWASP API Top 10, Secrets Management

---

## שקף 2
**כותרת ראשית:** OWASP API Top 10 – 2023
1. **Broken Object Level Authorization (BOLA)** – גישה לאובייקטים של אחרים
2. **Broken Authentication** – חולשות במנגנון אימות
3. **Broken Object Property Level Authorization** – Exposure/Mass Assignment
4. **Unrestricted Resource Consumption** – ללא Rate Limiting
5. **Broken Function Level Authorization** – גישה לפונקציות אדמין
6. **Unrestricted Access to Sensitive Business Flows**
7. **Server Side Request Forgery (SSRF)**
8. **Security Misconfiguration**
9. **Improper Inventory Management**
10. **Unsafe Consumption of APIs**

---

## שקף 3
**כותרת ראשית:** helmet – Security Headers
```js
import helmet from 'helmet';
app.use(helmet());
```
- מפעיל אוטומטית:
  - `X-Content-Type-Options: nosniff` – מונע MIME sniffing
  - `X-Frame-Options: SAMEORIGIN` – מונע Clickjacking
  - `Strict-Transport-Security` – מכריח HTTPS
  - `Content-Security-Policy` – מגביל מקורות תוכן
  - מסיר `X-Powered-By` – לא לחשוף stack
- שורה אחת = **עשרות הגנות**

---

## שקף 4
**כותרת ראשית:** CORS – ניהול גישה בין מקורות
```js
import cors from 'cors';
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400  // Preflight cache: 24 hours
}));
```
- ב-production: **לעולם לא** `origin: '*'` עם `credentials: true`
- `credentials: true` → מאפשר cookies ו-Authorization headers
- Preflight = OPTIONS request לפני בקשות מורכבות

---

## שקף 5
**כותרת ראשית:** Rate Limiting
```js
import rateLimit from 'express-rate-limit';

// General API
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Stricter for auth endpoints
app.use('/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }));
```
- `windowMs` – חלון זמן; `max` – בקשות מקסימליות לכל IP
- בייצור: שמור מונים ב-**Redis** (לא זיכרון שרת)
- ```js
  const limiter = rateLimit({ store: new RedisStore({ client: redis }) });
  ```
- `Retry-After` header מעדכן client כמה לחכות

---

## שקף 6
**כותרת ראשית:** Sanitization ו-Input Validation
- **Sanitization** = ניקוי קלט לפני עיבוד
- `express-mongo-sanitize` – מסיר אופרטורים של MongoDB (`$where`, `$gt`) מהקלט
- **XSS Prevention**: `DOMPurify` (client-side) / הימנעות מהכנסת HTML גולמי
- **SQL Injection**: parameterized queries (Sequelize, pg)
- **NoSQL Injection**: `express-mongo-sanitize`
- עקרון **Defense in Depth**: ולידציה ב-client + sanitize ב-server + validation ב-DB

---

## שקף 7
**כותרת ראשית:** BOLA – Broken Object Level Authorization
- **הבעיה**: המשתמש מבקש `GET /orders/999` שאינו שלו
- **זה הסיכון #1 ב-OWASP API Top 10**
- **תמיד** לאמת בעלות:
  ```js
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Not found', 404);
  if (order.userId.toString() !== req.user.id) {
    throw new AppError('Forbidden', 403);
  }
  ```
- לשלב בדיקת בעלות בשאילתה עצמה:
  ```js
  const order = await Order.findOne({ _id: id, userId: req.user.id });
  ```

---

## שקף 8
**כותרת ראשית:** Mass Assignment
- **הבעיה**: לקוח שולח `{ role: 'admin' }` ב-body → נשמר ב-DB
- **פתרון**: whitelist שדות מורשים בלבד
  ```js
  // ❌ מסוכן
  await User.findByIdAndUpdate(id, req.body);

  // ✅ בטוח
  const { name, email, bio } = req.body;  // explicit fields only
  await User.findByIdAndUpdate(id, { name, email, bio });
  ```
- Zod schema מגדיר בדיוק אילו שדות מותרים → מניעת Mass Assignment

---

## שקף 9
**כותרת ראשית:** Secrets Management
- `.env` לא ב-Git – **חוק ברזל**
- `.env.example` עם ערכים dummy לתיעוד
- בייצור: **AWS Secrets Manager**, **HashiCorp Vault**, **Kubernetes Secrets**
- **לעולם לא** ב-logs: סיסמאות, tokens, connection strings
- Rotation של secrets באופן קבוע
- **dotenv pitfall**: משתני סביבה ב-process.env = strings תמיד (`'3000'` לא `3000`)
- בדיקת קיום משתנים קריטיים ב-startup:
  ```js
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');
  ```

---

## שקף 10
**כותרת ראשית:** Security Headers Analysis
- `Content-Security-Policy`: מגביל מקורות JavaScript, CSS, images
  ```
  default-src 'self'; script-src 'self'; img-src *
  ```
- `X-Content-Type-Options: nosniff` – מונע דפדפן מ-"guessing" content-type
- `Strict-Transport-Security: max-age=31536000` – HTTPS לשנה קדימה
- `X-Frame-Options: DENY` – מניעת embedding ב-iframe
- `Referrer-Policy: no-referrer-when-downgrade`
- בדיקה: https://securityheaders.com

---

## שקף 11
**כותרת ראשית:** CSRF vs JWT
- **CSRF** (Cross-Site Request Forgery) – תקיפה שבה אתר זדוני שולח בקשה בשם המשתמש
- **Cookies** = פגיעות ל-CSRF → יש להוסיף CSRF token
- **JWT ב-Authorization header** = **חסין ל-CSRF** (דפדפן לא מוסיף headers אוטומטי)
- JWT ב-HttpOnly Cookie (לרענון) → יש להוסיף `SameSite=Strict`
- **SameSite=Strict**: Cookie לא נשלח בבקשות Cross-Site
- **SameSite=Lax**: Cookie לא נשלח ב-POST cross-site (פחות מגביל)

---

## שקף 12
**כותרת ראשית:** Security Checklist לייצור
- [ ] `helmet()` ראשון ב-middleware stack
- [ ] CORS עם origin list מפורש
- [ ] Rate limiting על כל endpoints, מחמיר על auth
- [ ] HTTPS only – redirect מ-HTTP לـ HTTPS
- [ ] Secrets ב-environment variables, לא בקוד
- [ ] Input validation + sanitization על כל input
- [ ] BOLA check לכל endpoint שמחזיר/משנה data של user
- [ ] Dependency audit: `npm audit` שבועי

---

## שקף 13
**כותרת ראשית:** סיכום – יום 3 מצגת 12
- OWASP API Top 10 = roadmap לאבטחה; BOLA הוא הסיכון המוביל
- `helmet()` + CORS מוגדר + Rate Limiting = שלישיית ההגנה הבסיסית
- Sanitization מגן מ-Injection; Zod מגן מ-Mass Assignment
- Secrets Management = לא ב-Git, לא ב-logs, Rotation קבוע
- JWT ב-header חסין ל-CSRF; Cookie ב-SameSite=Strict לרענון
- `npm audit` שבועי + security headers בדיקה תקופתית
