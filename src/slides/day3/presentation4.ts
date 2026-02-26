import type { Slide } from "../../types";
import { quiz_3_4 } from "../../data/quizzes/quiz_3_4";

export const slides: Slide[] = [
  {
    id: 1,
    type: "title",
    title: "Security Deep Dive",
    subtitle:
      "helmet, CORS, Rate Limiting, OWASP API Top 10, Secrets Management"
  },
  {
    id: 2,
    title: "OWASP API Top 10 – 2023",
    bullets: [
      "1. Broken Object Level Authorization (BOLA) – גישה לאובייקטים של אחרים",
      "2. Broken Authentication – חולשות במנגנון אימות",
      "3. Broken Object Property Level Authorization – Exposure/Mass Assignment",
      "4. Unrestricted Resource Consumption – ללא Rate Limiting",
      "5. Broken Function Level Authorization – גישה לפונקציות אדמין",
      "6. Unrestricted Access to Sensitive Business Flows",
      "7. Server Side Request Forgery (SSRF)",
      "8. Security Misconfiguration",
      "9. Improper Inventory Management",
      "10. Unsafe Consumption of APIs"
    ]
  },
  {
    id: 3,
    title: "helmet – Security Headers",
    code: `import helmet from 'helmet';
app.use(helmet());`,
    bullets: [
      "מפעיל אוטומטית:",
      "- X-Content-Type-Options: nosniff – מונע MIME sniffing",
      "- X-Frame-Options: SAMEORIGIN – מונע Clickjacking",
      "- Strict-Transport-Security – מכריח HTTPS",
      "- Content-Security-Policy – מגביל מקורות תוכן",
      "- מסיר X-Powered-By – לא לחשוף stack",
      "שורה אחת = עשרות הגנות"
    ]
  },
  {
    id: 4,
    title: "CORS – ניהול גישה בין מקורות",
    code: `import cors from 'cors';
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400  // Preflight cache: 24 hours
}));`,
    bullets: [
      "ב-production: לעולם לא origin: '*' עם credentials: true",
      "credentials: true → מאפשר cookies ו-Authorization headers",
      "Preflight = OPTIONS request לפני בקשות מורכבות"
    ]
  },
  {
    id: 5,
    title: "Rate Limiting",
    code: `import rateLimit from 'express-rate-limit';

// General API
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Stricter for auth endpoints
app.use('/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }));`,
    bullets: [
      "windowMs – חלון זמן; max – בקשות מקסימליות לכל IP",
      "בייצור: שמור מונים ב-Redis (לא זיכרון שרת)",
      "Retry-After header מעדכן client כמה לחכות"
    ],
    code2: `const limiter = rateLimit({ store: new RedisStore({ client: redis }) });`
  },
  {
    id: 6,
    title: "Sanitization ו-Input Validation",
    bullets: [
      "Sanitization = ניקוי קלט לפני עיבוד",
      "express-mongo-sanitize – מסיר אופרטורים של MongoDB ($where, $gt) מהקלט",
      "XSS Prevention: DOMPurify (client-side) / הימנעות מהכנסת HTML גולמי",
      "SQL Injection: parameterized queries (Sequelize, pg)",
      "NoSQL Injection: express-mongo-sanitize",
      "עקרון Defense in Depth: ולידציה ב-client + sanitize ב-server + validation ב-DB"
    ]
  },
  {
    id: 7,
    title: "BOLA – Broken Object Level Authorization",
    bullets: [
      "הבעיה: המשתמש מבקש GET /orders/999 שאינו שלו",
      "זה הסיכון #1 ב-OWASP API Top 10",
      "תמיד לאמת בעלות:",
      "לשלב בדיקת בעלות בשאילתה עצמה:"
    ],
    code: `const order = await Order.findById(req.params.id);
if (!order) throw new AppError('Not found', 404);
if (order.userId.toString() !== req.user.id) {
  throw new AppError('Forbidden', 403);
}`,
    code2: `const order = await Order.findOne({ _id: id, userId: req.user.id });`
  },
  {
    id: 8,
    title: "Mass Assignment",
    bullets: [
      'הבעיה: לקוח שולח { role: "admin" } ב-body → נשמר ב-DB',
      "פתרון: whitelist שדות מורשים בלבד",
      "Zod schema מגדיר בדיוק אילו שדות מותרים → מניעת Mass Assignment"
    ],
    code: `//   מסוכן
await User.findByIdAndUpdate(id, req.body);

//  בטוח
const { name, email, bio } = req.body;  // explicit fields only
await User.findByIdAndUpdate(id, { name, email, bio });`
  },
  {
    id: 9,
    title: "Secrets Management",
    bullets: [
      ".env לא ב-Git – חוק ברזל",
      ".env.example עם ערכים dummy לתיעוד",
      "בייצור: AWS Secrets Manager, HashiCorp Vault, Kubernetes Secrets",
      "לעולם לא ב-logs: סיסמאות, tokens, connection strings",
      "Rotation של secrets באופן קבוע",
      "dotenv pitfall: משתני סביבה ב-process.env = strings תמיד ('3000' לא 3000)",
      "בדיקת קיום משתנים קריטיים ב-startup:"
    ],
    code: `if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');`
  },
  {
    id: 10,
    title: "Security Headers Analysis",
    bullets: [
      "Content-Security-Policy: מגביל מקורות JavaScript, CSS, images",
      "X-Content-Type-Options: nosniff – מונע דפדפן מ-guessing content-type",
      "Strict-Transport-Security: max-age=31536000 – HTTPS לשנה קדימה",
      "X-Frame-Options: DENY – מניעת embedding ב-iframe",
      "Referrer-Policy: no-referrer-when-downgrade",
      "בדיקה: https://securityheaders.com"
    ],
    code: `default-src 'self'; script-src 'self'; img-src *`
  },
  {
    id: 11,
    title: "CSRF vs JWT",
    bullets: [
      "CSRF (Cross-Site Request Forgery) – תקיפה שבה אתר זדוני שולח בקשה בשם המשתמש",
      "Cookies = פגיעות ל-CSRF → יש להוסיף CSRF token",
      "JWT ב-Authorization header = חסין ל-CSRF (דפדפן לא מוסיף headers אוטומטי)",
      "JWT ב-HttpOnly Cookie (לרענון) → יש להוסיף SameSite=Strict",
      "SameSite=Strict: Cookie לא נשלח בבקשות Cross-Site",
      "SameSite=Lax: Cookie לא נשלח ב-POST cross-site (פחות מגביל)"
    ]
  },
  {
    id: 12,
    title: "Security Checklist לייצור",
    bullets: [
      "☐ helmet() ראשון ב-middleware stack",
      "☐ CORS עם origin list מפורש",
      "☐ Rate limiting על כל endpoints, מחמיר על auth",
      "☐ HTTPS only – redirect מ-HTTP לـ HTTPS",
      "☐ Secrets ב-environment variables, לא בקוד",
      "☐ Input validation + sanitization על כל input",
      "☐ BOLA check לכל endpoint שמחזיר/משנה data של user",
      "☐ Dependency audit: npm audit שבועי"
    ]
  },
  {
    id: 13,
    title: "סיכום – יום 3 מצגת 12",
    bullets: [
      "OWASP API Top 10 = roadmap לאבטחה; BOLA הוא הסיכון המוביל",
      "helmet() + CORS מוגדר + Rate Limiting = שלישיית ההגנה הבסיסית",
      "Sanitization מגן מ-Injection; Zod מגן מ-Mass Assignment",
      "Secrets Management = לא ב-Git, לא ב-logs, Rotation קבוע",
      "JWT ב-header חסין ל-CSRF; Cookie ב-SameSite=Strict לרענון",
      "npm audit שבועי + security headers בדיקה תקופתית"
    ]
  }
];
