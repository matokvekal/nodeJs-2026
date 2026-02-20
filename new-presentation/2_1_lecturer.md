# מדריך למרצה – יום 2 מצגת 5: Modules, NPM & Backend Architecture

**זמן:** 09:00–10:45 (105 דקות)
**מטרה:** התלמידים ידעו לאתחל פרויקט מקצועי עם ESM, dotenv, ESLint, ומבנה תיקיות

---

## הכנה מראש
- צור פרויקט חדש תוך כדי – `mkdir demo-project && cd demo-project && npm init -y`
- הכן `.env.example` לדמו
- הכן `.eslintrc.js` ו-`.prettierrc.json`

---

## שקף 2 – ESM (12 דקות)
**מה להגיד:**
> "ESM הוא העתיד. CommonJS עדיין קיים בחבילות ישנות אבל קוד חדש = ESM בלבד."

**דמו:**
```js
// utils/math.js
export function add(a, b) { return a + b; }
export const PI = 3.14159;
export default function multiply(a, b) { return a * b; }

// main.js
import multiply, { add, PI } from './utils/math.js';
// שים לב: חובה .js בסוף!
```

**package.json:**
```json
{ "type": "module" }
```

**שאלה:** "למה צריך את הסיומת .js ב-import ב-ESM?"
**תשובה:** "כי ה-spec דורש URL מלא. Node.js לא מוסיף סיומות אוטומטית ב-ESM."

---

## שקף 3 – CJS vs ESM (8 דקות)
**דמו __dirname:**
```js
// CJS
const path = require('path');
console.log(__dirname); // ✅

// ESM - לא עובד!
console.log(__dirname); // ❌ ReferenceError

// ESM - פתרון
import { fileURLToPath } from 'node:url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
```

---

## שקף 4-5 – package.json (10 דקות)
**Live coding:**
```bash
npm init -y
```

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

## שקף 6 – exports (7 דקות)
**מה להגיד:**
> "exports שדה = שליטה מה חשוף מהחבילה שלנו. נתיב שלא ב-exports = חסום."

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
import 'dotenv/config';
console.log(process.env.DATABASE_URL);
```

**הדגש security:**
> "`.env` לא נכנס ל-Git. **אי פעם**. זה סיכון אבטחה קריטי."

```bash
echo ".env" >> .gitignore
```

---

## שקף 8-9 – ESLint + Prettier (15 דקות)
**Live setup:**
```bash
npm install -D eslint @eslint/js prettier eslint-config-prettier
```

```js
// eslint.config.js
import js from '@eslint/js';
export default [
  js.configs.recommended,
  { rules: { 'no-unused-vars': 'warn', 'no-console': 'off' } }
];
```

```json
// .prettierrc.json
{ "semi": true, "singleQuote": true, "printWidth": 100 }
```

**הרץ lint וראה שגיאות – תקן ורץ שוב**

---

## שקף 10-11 – מבנה תיקיות (15 דקות)
**Live coding – צור את המבנה יחד עם הכיתה:**
```bash
mkdir -p src/{config,routes,controllers,services,middleware,models,utils}
touch src/app.js src/server.js
```

**הסבר כל תיקייה תוך כדי יצירה:**

```js
// src/app.js
import express from 'express';
const app = express();
app.use(express.json());
export default app;

// src/server.js
import app from './app.js';
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
```

---

## שקף 12 – Clean Error Boundaries (8 דקות)
**מה להגיד:**
> "AppError class זה contract בין הלוגיקה לـ error middleware. כל שגיאה תפעולית עוברת דרכו."

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

## שקף 13 – סיכום (5 דקות)
**Review:**
> "עכשיו יש לנו foundation מקצועי. מצגת הבאה בונים Express 5 מעל הבסיס הזה."

---

## הערות מרצה
- **dotenv**: הדגש שב-production לא משתמשים ב-.env – variables מוגדרים ב-server/K8s/cloud
- **ESM errors**: תלמידים יטעו ב-import paths – הזכר חובת .js
