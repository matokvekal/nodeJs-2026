export const slides = [
  {
    id: 1,
    type: "title",
    title: "Express 5 Deep Dive",
    subtitle: "Routing, Controllers, Middleware, Validation, Error Handling"
  },
  {
    id: 2,
    title: "Express 5 – מה חדש?",
    bullets: [
      "שוחרר רשמית אחרי שנים של פיתוח בגרסת Beta",
      "תמיכה מובנית ב-async handlers – שגיאות מגיעות אוטומטית ל-error middleware",
      "הסרת מתודות שהוצאו משימוש: app.del(), req.param()",
      "req.query מחזיר אובייקט פשוט ללא prototype",
      "path-to-regexp עודכן לגרסה חדשה – תחביר שונה לפרמטרים אופציונליים",
      "התקנה: npm install express@5"
    ]
  },
  {
    id: 3,
    title: "יצירת שרת Express בסיסי",
    code: `import express from 'express';

const app = express();
app.use(express.json({ limit: '10kb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(process.env.PORT ?? 3000, () => {
  console.log('Server running on port 3000');
});`,
    bullets: [
      "app.js – הגדרת app; server.js – הפעלת server (נפרד לבדיקות)",
      "process.env.PORT ?? 3000 – ברירת מחדל לפורט"
    ]
  },
  {
    id: 4,
    title: "Routing – express.Router",
    bullets: [
      "express.Router() יוצר מודול ניתוב עצמאי",
      "app.use('/api/users', userRouter) – חיבור עם prefix",
      "פרמטרים דינמיים: router.get('/:id', handler) → req.params.id",
      "שרשור נתיבים: router.route('/').get(getAll).post(create)",
      "router.param('id', middleware) – middleware ספציפי לפרמטר",
      "קובץ נתיבים נפרד לכל ישות: users.routes.js, posts.routes.js"
    ]
  },
  {
    id: 5,
    title: "Controllers – הפרדת אחריות",
    bullets: [
      "Controller = פונקציה שמקבלת req, res (ו-next)",
      "אחראי: קריאת נתונים מ-req, קריאה לـ Service, החזרת תגובה",
      "לא אחראי: לוגיקה עסקית – זה של ה-Service",
      "ב-Express 5: אין צורך ב-try/catch – שגיאות מועברות אוטומטית",
      "ב-Express 4: try { } catch(err) { next(err); }"
    ],
    code: `export async function getUser(req, res) {
  const user = await userService.findById(req.params.id);
  res.json(user);
}`
  },
  {
    id: 6,
    title: "Middleware Chain – עקרונות",
    bullets: [
      "Middleware = פונקציה שמבצעת פעולה בין קבלת הבקשה להחזרת תגובה",
      "חתימה: (req, res, next) – חובה לקרוא next() כדי להמשיך",
      "app.use(middleware) – חל על כל הבקשות",
      "app.use('/api', middleware) – חל רק על נתיבים עם prefix",
      "router.get('/path', middleware1, middleware2, handler) – סדר ← חשוב",
      "סדר רישום: middlewares מורצים בסדר שנרשמו"
    ]
  },
  {
    id: 7,
    title: "Middlewares מובנים ונפוצים",
    bullets: [
      "express.json({ limit: '10kb' }) – פענוח body JSON",
      "express.urlencoded({ extended: true }) – פענוח form data",
      "express.static('public') – הגשת קבצים סטטיים",
      "helmet() – כותרות אבטחה (מהחבילה helmet)",
      "cors({ origin: process.env.ALLOWED_ORIGIN }) – הגדרת CORS",
      "morgan('combined') – לוגים לכל בקשה (פיתוח)"
    ]
  },
  {
    id: 8,
    title: "express.json() לעומק",
    bullets: [
      "express.json() מפרסר body של בקשות עם Content-Type: application/json",
      "ללא הפעלתו: req.body === undefined",
      "{ limit: '10kb' } – הגבלת גודל למניעת DDoS",
      "{ strict: true } – ברירת מחדל; מקבל רק אובייקטים ומערכים בשורש",
      "שגיאת פרסור JSON → מועברת אוטומטית לـ error middleware",
      "יש להפעיל לפני הגדרת הנתיבים"
    ]
  },
  {
    id: 9,
    title: "Validation עם Zod (מועדף ב-2026)",
    bullets: [
      "Zod – ספריית ולידציה עם TypeScript support מובנה",
      "מגדיר schema ומשתמש בו לאימות req.body",
      "Middleware ולידציה גנרי שמקבל schema ומחזיר 400 עם שגיאות",
      "Zod מועדף על Joi ב-2026 – TypeScript integration, smaller bundle",
      "safeParse מחזיר { success, data, error } ולא זורק"
    ],
    code: `const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().int().min(0).optional()
});`
  },
  {
    id: 10,
    title: "Central Error Handler",
    bullets: [
      "Error middleware ב-Express מזוהה על ידי 4 פרמטרים: (err, req, res, next)",
      "חייב להיות אחרון לאחר כל הנתיבים ב-app.js",
      "AppError class עם statusCode, message, isOperational",
      "ב-Express 5: async handlers אוטומטית מגיעים לכאן"
    ],
    code: `app.use((err, req, res, next) => {
  const status = err.statusCode ?? 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';
  res.status(status).json({ error: { message, status } });
});`
  },
  {
    id: 11,
    title: "problem+json – תקן תגובות שגיאה",
    bullets: [
      "application/problem+json – [RFC 7807] – תקן לתגובות שגיאה ב-APIs",
      "שדות: type, title, status, detail, instance",
      "עקביות בתגובות שגיאה מאפשרת ללקוחות לטפל בשגיאות בצורה אחידה",
      "res.setHeader('Content-Type', 'application/problem+json')"
    ],
    code: `{
  "type": "https://api.example.com/errors/validation",
  "title": "Validation Error",
  "status": 422,
  "detail": "Email is required",
  "instance": "/api/users"
}`
  },
  {
    id: 12,
    title: "מבנה פרויקט Express שלם",
    code: `src/
├── config/db.js           # חיבור למסד נתונים
├── routes/users.routes.js # הגדרת נתיבים
├── controllers/users.controller.js
├── services/users.service.js
├── middleware/
│   ├── auth.middleware.js
│   ├── validate.middleware.js
│   └── error.middleware.js
├── models/user.model.js
└── utils/AppError.js
app.js                     # Express app
server.js                  # server.listen`
  },
  {
    id: 13,
    title: "סיכום – יום 2 מצגת 6",
    bullets: [
      "Express 5 מביא async error handling מובנה ושיפורים חשובים",
      "Routing מאורגן עם express.Router ו-Controllers נפרדים",
      "Middlewares = אבן הבניין של Express לכל חיתוך רוחבי",
      "Zod לולידציה – TypeScript-friendly, מועדף ב-2026",
      "Central error handler עם AppError + problem+json",
      "במצגת הבאה: REST API Design Modern"
    ]
  }
];
