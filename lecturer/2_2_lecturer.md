# הרחבות : – יום 2 מצגת 6: Express 5 Deep Dive

**זמן:** 11:00–12:30
**מטרה:** בניית Express app מלא עם middleware, validation, ו-error handling

---

## שקף 1 – פתיחה

בנינו את מבנה הפרויקט. עכשיו מרכיבים את שכבת ה-HTTP עם Express 5 — הגרסה המודרנית שסוף סוף מטפלת ב-async errors אוטומטית.

**מה נלמד:**

- Express 5 ושינוי המהפכני: async error propagation אוטומטי
- Router, Controllers, Services – Separation of Concerns
- Middleware chain – הסדר חשוב!
- Zod validation – הדרך המודרנית לאמת input
- Central error handler – נקודה אחת לכל השגיאות
- RFC 7807 `problem+json` – תקן לתגובות שגיאה

**שרשרת Middleware – הסדר הנכון:**

```
Request →
  [helmet] →          (security headers)
  [cors] →            (cross-origin)
  [express.json()] →  (parse body)
  [authenticate] →    (JWT check)
  [validate] →        (Zod schema)
  [controller] →      (business logic)
Response ←
  [errorHandler] ←    (central error)
```

**שגיאה נפוצה:** `express.json()` חייב לבוא לפני הRoutes, אחרת `req.body` יהיה `undefined`.

---

## שקף 2 – Express 5

Express 5 מביא שינוי מהפכני: async handlers מעבירים שגיאות אוטומטית ל-error middleware. ב-Express 4 היה צורך בקריאה ידנית ל-`next(err)` בכל try-catch block.

**השוואה בין גרסאות:**

```js
// Express 4 ← בעיות עם async
app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await findUser(req.params.id);
    res.json(user);
  } catch (err) {
    next(err); // ← חובה ידנית
  }
});

// Express 5 ← אוטומטי!
app.get("/users/:id", async (req, res) => {
  const user = await findUser(req.params.id); // throw → error middleware
  res.json(user);
});
```

---

## שקף 3 – שרת בסיסי

**דוגמה:**

```js
// src/app.js
import express from "express";
import userRoutes from "./routes/users.routes.js";

const app = express();
app.use(express.json({ limit: "10kb" }));
app.use("/api/v1/users", userRoutes);

export default app;

// src/server.js
import app from "./app.js";
app.listen(process.env.PORT ?? 3000);
```

---

## שקף 4 – Routing

**דוגמת `src/routes/users.routes.js`:**

```js
import { Router } from "express";
import * as usersController from "../controllers/users.controller.js";
import { validate } from "../middleware/validate.js";
import { createUserSchema } from "../schemas/user.schema.js";

const router = Router();

router
  .route("/")
  .get(usersController.getAll)
  .post(validate(createUserSchema), usersController.create);

router
  .route("/:id")
  .get(usersController.getOne)
  .put(validate(createUserSchema.partial()), usersController.update)
  .delete(usersController.remove);

export default router;
```

---

## שקף 5 – Controllers

**דוגמת `src/controllers/users.controller.js`:**

```js
import * as userService from "../services/users.service.js";

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

**עקרון חשוב:** Controller צריך להיות דק, ללא לוגיקה עסקית. פעולות כמו שליחת email על יצירת user שייכות ל-Service layer.

---

## שקף 6-7 – Middleware Chain

**דיאגרמת הזרימה:**

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

**דוגמת middleware:**

```js
function logger(req, res, next) {
  console.log(`${req.method} ${req.url} [${new Date().toISOString()}]`);
  next(); // ← חובה! בלי זה הבקשה נתקעת
}

app.use(logger);
```

**שגיאה נפוצה:** שכחת `next()` גורמת לבקשה להתקע בלי תגובה עד timeout.

---

## שקף 8 – express.json()

**דוגמה:**

```js
app.use(express.json({ limit: "10kb" })); // לפני routes!

app.post("/test", (req, res) => {
  console.log(req.body); // ← undefined בלי express.json()
  res.json(req.body);
});
```

---

## שקף 9 – Zod Validation

**דוגמת `src/schemas/user.schema.js`:**

```js
import { z } from "zod";

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
        title: "Validation Error",
        errors: result.error.flatten().fieldErrors
      });
    }
    req.validatedData = result.data;
    next();
  };
}
```

**בדיקה:**

- POST /users עם body חוקי → 201
- POST /users עם body לא חוקי → 422 + פרטי שגיאה

---

## שקף 10 – Error Handler

**דוגמת `src/middleware/error.js`:**

```js
export function errorHandler(err, req, res, next) {
  const status = err.statusCode ?? 500;
  const message = err.isOperational ? err.message : "Something went wrong";

  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  res.status(status).json({
    type: "/errors/" + (status === 500 ? "internal" : "client"),
    title: message,
    status,
    instance: req.originalUrl
  });
}

// ב-app.js - אחרון!
app.use(errorHandler);
```

---

## שקף 11 – problem+json

RFC 7807 מגדיר תקן לתגובות שגיאה ב-API. שימוש ב-problem+json מאפשר ללקוח לדעת מה לצפות תמיד במבנה אחיד.

---

## שקף 12-13 – סיכום

במצגת זו בנינו Express application מלא עם:

- Routing מובנה
- Controllers ו-Services מופרדים
- Validation עם Zod
- Error handling מרכזי
- Middleware chain הגיוני

**הערות:**

- לשדרוג מ-Express 4 ל-5: `npm install express@5`
- Zod vs Joi: Zod מודרנית יותר עם תמיכת TypeScript מובנית, Joi ותיקה ומופצת
