# מדריך למרצה – יום 2 מצגת 5: Modules, NPM & Backend Architecture

**זמן:** 09:00–10:45
**מטרה:** איתחול פרויקט מקצועי עם ESM, dotenv, ESLint, ומבנה תיקיות תקני

---

## שקף 1 – פתיחה

ביום 1 בנינו את הבסיס: הבנו איך Node.js עובד, כתבנו Async code, ויצרנו שרת HTTP בסיסי. היום נבנה את הפרויקט המקצועי שיהיה הבסיס לכל מה שנלמד ביום 2 ו-3.

**מה נלמד:**
- ESM – מערכת המודולים הסטנדרטית ב-2026
- package.json – הלב של כל פרויקט Node.js
- dotenv ו-`--env-file` – ניהול קונפיגורציה בטוח
- ESLint + Prettier – איכות קוד אוטומטית
- מבנה תיקיות Layered Architecture – routes/controllers/services

**הבדל בין CommonJS ל-ESM:**

| תכונה | CommonJS (ישן) | ESM (מודרני) |
|-------|--------------|-------------|
| Import | `require()` | `import ... from` |
| Export | `module.exports` | `export` / `export default` |
| ביצוע | דינמי (runtime) | סטטי (parsed לפני ביצוע) |
| `__dirname` | זמין גלובלית | דורש `import.meta.url` |
| Top-level await | לא נתמך | נתמך |

**כלל ה-2026:** כל קוד חדש = ESM בלבד. CommonJS רק לחבילות ישנות.

---

## שקף 2 – ESM

ESM (ECMAScript Modules) הוא מערכת המודולים הסטנדרטית ל-JavaScript. CommonJS עדיין קיים בחבילות ישנות ובקוד לגאסי, אך כל קוד חדש צריך להיכתב ב-ESM.

**דוגמה:**

```js
// utils/math.js
export function add(a, b) {
  return a + b;
}
export const PI = 3.14159;
export default function multiply(a, b) {
  return a * b;
}

// main.js
import multiply, { add, PI } from "./utils/math.js";
```

**חיוני ב-package.json:**

```json
{ "type": "module" }
```

**הערה חשובה:** ב-ESM, חובה לכלול את הסיומת `.js` ב-import paths. זה נדרש על פי ה-spec כיוון ש-ESM דורש URL מלא. Node.js לא מוסיף סיומות אוטומטית כמו ב-CommonJS.

---

## שקף 3 – CJS vs ESM

**הבדל מרכזי – \_\_dirname:**

```js
// CJS
const path = require("path");
console.log(__dirname); // ✅

// ESM - לא עובד!
console.log(__dirname); // ❌ ReferenceError

// ESM - פתרון
import { fileURLToPath } from "node:url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
```

---

## שקף 4-5 – package.json

**איתחול פרויקט:**

```bash
npm init -y
```

**דוגמת package.json מקצועית:**

```json
{
  "name": "my-api",
  "version": "1.0.0",
  "type": "module",
  "engines": { "node": ">=20.0.0" },
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch --env-file=.env server.js",
    "test": "node --test",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  }
}
```

---

## שקף 6 – exports

השדה `exports` ב-package.json מאפשר שליטה מלאה על מה חשוף מהחבילה. נתיב שלא מוגדר ב-`exports` אינו נגיש ל-import, מה שמאפשר הסתרה של מימושים פנימיים.

**דוגמה:**

```json
{
  "exports": {
    ".": "./src/index.js",
    "./utils": "./src/utils/index.js"
  }
}
```

כך `import { helper } from 'my-pkg/internal'` ייכשל — הנתיב הפנימי חסום.

**Semantic Versioning (SemVer) – גרסאות חבילות:**

| סמל | משמעות | דוגמה |
|-----|--------|-------|
| `^4.2.0` | כל 4.x.x (לא breaking changes) | `^4.2.0` → `4.9.1` ✓ |
| `~4.2.0` | רק patch: 4.2.x | `~4.2.0` → `4.2.9` ✓ |
| `4.2.0` | גרסה מדויקת בלבד | `4.2.0` בלבד |

**אבטחת תלויות:**

```bash
npm audit           # בדיקת חולשות ידועות
npm audit fix       # תיקון אוטומטי
npm outdated        # רשימת חבילות מיושנות
```

---

## שקף 7 – dotenv (10 דקות)

**Live demo:**

```bash
# .env
DATABASE_URL=mongodb://localhost:27017/mydb
JWT_SECRET=my_secret_key
PORT=3000
```

```js
// Node 20.6+ - מובנה!
// node --env-file=.env server.js

// גרסאות ישנות
import "dotenv/config";
console.log(process.env.DATABASE_URL);
```

**הדגש security:**

> "`.env` לא נכנס ל-Git. **אי פעם**. זה סיכון אבטחה קריטי."

```bash
echo ".env" >> .gitignore
```

---

## שקף 8-9 – ESLint + Prettier

**התקנה:**

```bash
npm install -D eslint @eslint/js prettier eslint-config-prettier
```

**קובץ קונפיגורציה ESLint 9:**

```js
// eslint.config.js
import js from "@eslint/js";
export default [
  js.configs.recommended,
  { rules: { "no-unused-vars": "warn", "no-console": "off" } }
];
```

```json
// .prettierrc.json
{ "semi": true, "singleQuote": true, "printWidth": 100 }
```

---

## שקף 10-11 – מבנה תיקיות

**יצירת המבנה:**

```bash
mkdir -p src/{config,routes,controllers,services,middleware,models,utils}
touch src/app.js src/server.js
```

**תפקיד כל תיקייה:**

- `config/` – קונפיגורציות (DB, API keys)
- `routes/` – הגדרת endpoints
- `controllers/` – לוגיקת טיפול בבקשות
- `services/` – business logic
- `middleware/` – auth, validation, error handling
- `models/` – מבני נתונים
- `utils/` – פונקציות עזר כלליות

**דוגמת הפרדה app/server:**

```js
// src/app.js
import express from "express";
const app = express();
app.use(express.json());
export default app;

// src/server.js
import app from "./app.js";
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
```

---

## שקף 12 – Clean Error Boundaries

קלאס `AppError` מספק contract בין הלוגיקה העסקית ל-error middleware. כל שגיאה תפעולית (operational error) עוברת דרכו.

**דוגמה:**

```js
// src/utils/AppError.js
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
```

---

## שקף 13 – סיכום

עכשיו קיים foundation מקצועי לפרויקט Node.js עם:

- מערכת מודולים ESM מודרנית
- ניהול קונפיגורציה בטוח
- כלי איכות קוד (ESLint, Prettier)
- מבנה תיקיות סקיילבילי ומובנה

המצגת הבאה תתמקד ב-Express 5 מעל הבסיס הזה.

**הערות חשובות:**

- בסביבת production משתמשים ב-environment variables מהשרת/Kubernetes/cloud provider, לא בקובץ .env
- טעות נפוצה: חוסר סיומת `.js` ב-import paths ב-ESM
