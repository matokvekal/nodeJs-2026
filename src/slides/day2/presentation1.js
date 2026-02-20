export const slides = [
  {
    id: 1,
    type: "title",
    title: "Modules, NPM & Backend Architecture",
    subtitle: "ESM, package.json, dotenv, ESLint, מבנה פרויקט"
  },
  {
    id: 2,
    title: "ESM – ברירת המחדל ב-2026",
    bullets: [
      "ESM (ECMAScript Modules) הוא תקן המודולים הרשמי של JavaScript",
      "import / export – לא require / module.exports",
      'להגדיר "type": "module" ב-package.json להפעלת ESM בכל הקבצים',
      "קבצים עם סיומת .mjs = תמיד ESM; .cjs = תמיד CommonJS",
      "Top-level await נתמך רק ב-ESM",
      "CJS עדיין קיים בחבילות ישנות אך ESM הוא הכיוון הנכון"
    ]
  },
  {
    id: 3,
    title: "הבדלים מעשיים CJS vs ESM",
    bullets: [
      "ב-CJS: טעינה סינכרונית; ב-ESM: טעינה אסינכרונית (statically analyzed)",
      "ב-ESM: אין __dirname/__filename → import.meta.url + fileURLToPath",
      "Named exports ב-ESM מאפשרים tree shaking יעיל",
      "ייבוא מ-CJS ל-ESM: אפשרי; ייבוא ESM מ-CJS: רק dynamic import()",
      "שגיאת ERR_REQUIRE_ESM – מנסים require על מודול ESM",
      "ב-ESM: חובה לציין סיומת קובץ בנתיב יחסי: import './utils/helper.js'"
    ]
  },
  {
    id: 4,
    title: "package.json – תעודת הזהות",
    bullets: [
      "name – שם החבילה (ייחודי אם מפרסמים ל-npm registry)",
      "version – Semantic Versioning: MAJOR.MINOR.PATCH",
      '"type": "module" – הגדרת ESM כברירת מחדל',
      "main – נקודת כניסה ראשית (ישן); exports – נקודת כניסה מודרנית",
      "dependencies – תלויות ייצור; devDependencies – תלויות פיתוח בלבד",
      "scripts – פקודות מותאמות: npm run dev, npm test"
    ]
  },
  {
    id: 5,
    title: "scripts ו-engines",
    bullets: [
      '"start": "node server.js" – הפעלת ייצור',
      '"dev": "node --watch server.js" – פיתוח עם reload אוטומטי',
      '"test": "node --test" – הרצת בדיקות',
      '"lint": "eslint src/" – בדיקת קוד',
      '"engines": { "node": ">=20.0.0" } – גרסת Node.js מינימלית נדרשת',
      '.nvmrc – מגדיר גרסת Node.js מדויקת לצוות: echo "20" > .nvmrc'
    ]
  },
  {
    id: 6,
    title: "שדה exports ב-package.json",
    bullets: [
      "exports שולט בצורה מדויקת אילו חלקים חשופים לצרכנים חיצוניים",
      "מחליף main עם יכולות מתקדמות",
      "נתיב שלא ב-exports → חסום לגישה מבחוץ",
      "אפשר להגדיר נתיבים שונים ל-import ול-require נפרד",
      "שדה זה הוא חיוני לספריות; פחות רלוונטי לאפליקציות"
    ],
    code: `"exports": {
  ".": "./src/index.js",
  "./utils": "./src/utils/index.js"
}`
  },
  {
    id: 7,
    title: "dotenv ומשתני סביבה",
    bullets: [
      "משתני סביבה = הפרדת קוד מ-תצורה (12-factor principle)",
      "dotenv טוען משתנים מ-.env ל-process.env",
      "Node.js 20.6+: node --env-file=.env server.js ← מובנה!",
      "חוק ברזל: .env לעולם לא נכנס ל-Git → להוסיף ל-.gitignore",
      ".env.example מתעד משתנים נדרשים ללא ערכים רגישים",
      "בייצור: משתני סביבה מוגדרים ברמת המערכת/שירות ענן, לא בקובץ"
    ]
  },
  {
    id: 8,
    title: "ESLint ב-2026",
    bullets: [
      "ESLint = ניתוח סטטי לקוד JavaScript/TypeScript",
      "מזהה באגים פוטנציאליים, דפוסים בעייתיים, בעיות סגנון",
      "Flat Config (eslint.config.js) – התקן החדש מ-ESLint v9",
      "הרחבת תצורות מוכנות: eslint:recommended, @typescript-eslint/recommended",
      'חוקים: "off", "warn", "error"',
      "הרצה: npx eslint src/ או כחלק מ-pre-commit hook"
    ]
  },
  {
    id: 9,
    title: "Prettier – עיצוב קוד אחיד",
    bullets: [
      "Prettier = כלי עיצוב קוד אוטומטי; מסיר ויכוחי סגנון מהצוות",
      '.prettierrc.json: { "semi": true, "singleQuote": true, "printWidth": 100 }',
      "eslint-config-prettier – מכבה חוקי ESLint שמתנגשים עם Prettier",
      '"format": "prettier --write src/" בـscripts',
      "אינטגרציה עם VS Code: Format on Save = אוטומטי",
      "סדר עבודה: ESLint מוצא בעיות לוגיות, Prettier מעצב"
    ]
  },
  {
    id: 10,
    title: "מבנה תיקיות Backend מודרני",
    bullets: [
      "config/ - תצורה, משתני סביבה, DB connection",
      "routes/ - הגדרת נתיבי API",
      "controllers/ - קבלת בקשות, החזרת תגובות",
      "services/ - לוגיקה עסקית (ללא תלות ב-HTTP)",
      "middleware/ - auth, validation, error handling",
      "models/ - Mongoose/Sequelize schemas",
      "utils/ - פונקציות עזר כלליות",
      "app.js – הגדרת Express + middlewares",
      "server.js – הפעלת שרת (נפרד מ-app לצורך בדיקות)"
    ]
  },
  {
    id: 11,
    title: "Layered Architecture – הפרדת שכבות",
    bullets: [
      "Route Layer: מיפוי נתיבים לפונקציות בלבד",
      "Controller Layer: קבלת req, שליחת res, קריאה לـ Service",
      "Service Layer: לוגיקה עסקית – לא מכיר את Express",
      "Repository Layer (אופציונלי): בידוד גישה למסד הנתונים",
      "יתרונות: בדיקות יחידה נוחות, החלפת רכיבים ללא שבירה",
      "כלל: Controller דק, Service שמן, Model אחראי על Schema"
    ]
  },
  {
    id: 12,
    title: "Clean Error Boundaries",
    bullets: [
      "כל שכבה אחראית על שגיאות שלה ומה מעלה לשכבה הבאה",
      "Service זורקת AppError עם statusCode וـmessage",
      "Controller מעביר שגיאות ל-next(err) (Express 4) או אוטומטי (Express 5)",
      "Error middleware מרכזי: מטפל בכל השגיאות במקום אחד",
      "בפיתוח: מחזיר stack trace; בייצור: הודעה כללית בלבד",
      "רישום ל-logger לפני כל תגובת שגיאה"
    ]
  },
  {
    id: 13,
    title: "סיכום – יום 2 מצגת 5",
    bullets: [
      'ESM הוא ברירת המחדל ב-2026 – "type": "module" ב-package.json',
      "exports ו-engines ו-scripts – שליטה מלאה בתצורת הפרויקט",
      "משתני סביבה עם --env-file או dotenv – לעולם לא ב-Git",
      "ESLint + Prettier = זוג חובה לכל פרויקט מקצועי",
      "מבנה תיקיות מסודר עם הפרדת שכבות = הבסיס לפרויקט תחזוקתי",
      "במצגת הבאה: Express 5 Deep Dive על גבי הארכיטקטורה הזו"
    ]
  }
];
