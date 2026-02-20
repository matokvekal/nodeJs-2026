# מדריך למרצה – יום 2 מצגת 6: Express 5 Deep Dive

**זמן:** 11:00–12:30 (90 דקות)
**מטרה:** התלמידים יבנו Express app מלא עם middleware, validation, ו-error handling

---

## הכנה מראש
- פרויקט בסיס מהמצגת הקודמת
- `npm install express@5 zod`
- הכן דמו של middleware chain visualization

---

## שקף 2 – Express 5 (10 דקות)
**מה להגיד:**
> "Express 5 הגיע! הדבר הכי חשוב: async handlers עכשיו מעבירים שגיאות אוטומטית. ב-Express 4 היית צריך next(err) ידנית."

**השוואה:**
```js
// Express 4 ← בעיות עם async
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await findUser(req.params.id);
    res.json(user);
  } catch (err) {
    next(err); // ← חובה ידנית
  }
});

// Express 5 ← אוטומטי!
app.get('/users/:id', async (req, res) => {
  const user = await findUser(req.params.id); // throw → error middleware
  res.json(user);
});
```

---

## שקף 3 – שרת בסיסי (8 דקות)
**Live coding:**
```js
// src/app.js
import express from 'express';
import userRoutes from './routes/users.routes.js';

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use('/api/v1/users', userRoutes);

export default app;

// src/server.js
import app from './app.js';
app.listen(process.env.PORT ?? 3000);
```

---

## שקף 4 – Routing (12 דקות)
**Live coding – `src/routes/users.routes.js`:**
```js
import { Router } from 'express';
import * as usersController from '../controllers/users.controller.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema } from '../schemas/user.schema.js';

const router = Router();

router.route('/')
  .get(usersController.getAll)
  .post(validate(createUserSchema), usersController.create);

router.route('/:id')
  .get(usersController.getOne)
  .put(validate(createUserSchema.partial()), usersController.update)
  .delete(usersController.remove);

export default router;
```

---

## שקף 5 – Controllers (10 דקות)
**Live coding – `src/controllers/users.controller.js`:**
```js
import * as userService from '../services/users.service.js';

export async function getAll(req, res) {
  const users = await userService.findAll(req.query);
  res.json({ data: users });
}

export async function getOne(req, res) {
  const user = await userService.findById(req.params.id);
  res.json({ data: user });
}

export async function create(req, res) {
  const user = await userService.create(req.validatedData);
  res.status(201).json({ data: user });
}
```

**הדגש:**
> "Controller דק – לא לוגיקה עסקית. שאלה: 'מה אם צריך לשלוח email על יצירת user?' → Service!"

---

## שקף 6-7 – Middleware Chain (15 דקות) ← **חשוב**
**ציור על הלוח:**
```
Request →
  [helmet] →
  [cors] →
  [express.json()] →
  [authenticate] →
  [validate] →
  [controller] →
Response ←
  [error middleware] ←
```

**דמו middleware:**
```js
function logger(req, res, next) {
  console.log(`${req.method} ${req.url} [${new Date().toISOString()}]`);
  next(); // ← חובה! בלי זה הבקשה נתקעת
}

app.use(logger);
```

**שאלה:** "מה קורה אם שכחנו next()?"
**תשובה:** "הבקשה נתקעת ולא מקבלת תגובה. timeout."

---

## שקף 8 – express.json() (5 דקות)
**דמו:**
```js
app.use(express.json({ limit: '10kb' })); // לפני routes!

app.post('/test', (req, res) => {
  console.log(req.body); // ← undefined בלי express.json()
  res.json(req.body);
});
```

---

## שקף 9 – Zod Validation (15 דקות)
**Live coding – `src/schemas/user.schema.js`:**
```js
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().int().min(18).optional()
});
```

**`src/middleware/validate.js`:**
```js
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({
        status: 422,
        title: 'Validation Error',
        errors: result.error.flatten().fieldErrors
      });
    }
    req.validatedData = result.data;
    next();
  };
}
```

**בדוק עם Postman:**
- POST /users עם body חוקי → 201
- POST /users עם body לא חוקי → 422 + פרטי שגיאה

---

## שקף 10 – Error Handler (10 דקות)
**Live coding – `src/middleware/error.js`:**
```js
export function errorHandler(err, req, res, next) {
  const status = err.statusCode ?? 500;
  const message = err.isOperational
    ? err.message
    : 'Something went wrong';

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(status).json({
    type: '/errors/' + (status === 500 ? 'internal' : 'client'),
    title: message,
    status,
    instance: req.originalUrl
  });
}

// ב-app.js - אחרון!
app.use(errorHandler);
```

---

## שקף 11 – problem+json (5 דקות)
**הסבר RFC 7807:**
> "problem+json = תקן לתגובות שגיאה. Client יודע מה לצפות תמיד."

---

## שקף 12-13 – מבנה ו-סיכום (5 דקות)
**הצג את המבנה שנבנה תוך כדי הלמידה.**

---

## הערות מרצה
- **Express 5 vs 4**: אם יש ב-package.json גרסה 4 – `npm install express@5` לשדרג
- **Zod vs Joi**: "Joi ותיקה, Zod מודרנית עם TypeScript תמיכה מובנית"
