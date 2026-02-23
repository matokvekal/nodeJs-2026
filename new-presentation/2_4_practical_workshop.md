# יום 2 – מצגת 8: סדנה מעשית – Mini REST API

---

## שקף 1

**כותרת ראשית:** סדנה מעשית – בניית Mini REST API
**כותרת משנה:** CRUD + Validation + Error Handling + Swagger
**זמן עבודה:** 90 דקות (15:00–16:30)

---

## שקף 2

**כותרת ראשית:** 🎯 מטרת הסדנה
**כל מה שלמדנו היום – עכשיו נבנה בעצמנו!**

- Express 5 עם ESM
- Validation עם Zod
- Error Handling מקצועי
- Clean Architecture (routes → controllers → services)
- Swagger documentation
- Tests בסיסיים

**התוצאה:** Tasks API מלא שעובד!

---

## שקף 3

**כותרת ראשית:** 📋 מה בונים היום?

**🎯 API Endpoints:**

```
GET    /api/v1/tasks          → קבלת כל המשימות
POST   /api/v1/tasks          → יצירת משימה חדשה
GET    /api/v1/tasks/:id      → קבלת משימה ספציפית
PUT    /api/v1/tasks/:id      → עידכון משימה
DELETE /api/v1/tasks/:id      → מחיקת משימה
```

**🔧 Stack:**

- Node.js 20+ + Express 5
- Zod ל-validation
- Swagger לתיעוד
- In-memory storage (Map)

**📦 Task Object:**

```js
{
  id: "uuid",
  title: "string (1-100)",
  description: "string (optional)",
  priority: "low | medium | high",
  dueDate: "ISO datetime (optional)",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

---

## שקף 4

**כותרת ראשית:** 🚀 שלב 1: אתחול הפרויקט
**פקודות להרצה:**

```bash
mkdir tasks-api
cd tasks-api
npm init -y
npm install express@5 zod
npm install -D swagger-ui-express swagger-jsdoc
```

**עדכון ב-package.json:**

```json
{
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js"
  }
}
```

**יצירת קובץ .env:**

```
PORT=3000
```

⏱️ **זמן משוער:** 5 דקות

---

## שקף 5

**כותרת ראשית:** 📁 שלב 2: מבנה התיקיות
**צרו את המבנה הבא:**

```bash
mkdir -p src/routes src/controllers src/services src/middleware src/schemas src/utils
touch src/app.js src/server.js swagger.js
```

**התוצאה:**

```
tasks-api/
├── package.json          ← "type": "module"
├── .env                  ← PORT=3000
├── swagger.js            ← תיעוד API
└── src/
    ├── server.js         ← נקודת כניסה
    ├── app.js            ← Express app config
    ├── routes/
    │   └── tasks.routes.js   ← הגדרת endpoints
    ├── controllers/
    │   └── tasks.controller.js  ← טיפול req/res
    ├── services/
    │   └── tasks.service.js     ← לוגיקה עסקית
    ├── middleware/
    │   ├── validate.js      ← Zod validation
    │   └── error.js         ← Error handler
    ├── schemas/
    │   └── task.schema.js   ← Zod schemas
    └── utils/
        └── AppError.js      ← Custom error class
```

**💡 עקרון הארכיטקטורה:**

```
Request → Route → Middleware → Controller → Service → Response
                │                              │
            Validation                      Business Logic
```

⏱️ **זמן משוער:** 2 דקות

---

## שקף 6

**כותרת ראשית:** 🔧 שלב 3: AppError + Error Middleware

**🚨 אסטרטגיית Error Handling:**

```
Error Occurs
    ↓
האם זו שגיאה צפויה?  (isOperational = true)
    │
    ├─ כן  → החזר ללקוח עם מסר ברור (404, 422...)
    │
    └─ לא → שגיאת תכנות! החזר 500 גנרי
```

**ליצור קובץ `src/utils/AppError.js`:**

```js
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
```

**ליצור קובץ `src/middleware/error.js`:**

```js
export function errorHandler(err, req, res, next) {
  const status = err.statusCode ?? 500;
  const isOperational = err.isOperational ?? false;

  res.status(status).json({
    type: "/errors/" + (status === 500 ? "internal" : "client"),
    title: isOperational ? err.message : "Internal Server Error",
    status
  });
}
```

⏱️ **זמן משוער:** 5 דקות

---

## שקף 7

**כותרת ראשית:** 📝 שלב 4: Zod Schema לTask

**📋 מבנה Task:**

```
┌──────────────────────────────┐
│        TASK OBJECT        │
├──────────────────────────────┤
│ id          ← UUID      │
│ title       ← 1-100 chars│
│ description ← optional   │
│ priority    ← enum       │
│ dueDate     ← optional   │
│ createdAt   ← auto       │
└──────────────────────────────┘
```

**ליצור קובץ `src/schemas/task.schema.js`:**

```js
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().datetime().optional()
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskIdSchema = z.object({
  id: z.string().uuid()
});
```

⏱️ **זמן משוער:** 5 דקות

---

## שקף 8

**כותרת ראשית:** שלב 5: Validate Middleware

**🔄 Middleware Chain:**

```
Request
   ↓
express.json()  ← parse body
   ↓
validate(schema) ← Zod validation
   │
   ├─  Valid   → req.validatedData = data → next()
   │
   └─   Invalid → 422 + errors
```

**ליצור קובץ `src/middleware/validate.js`:**

```js
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({
        type: "/errors/validation",
        title: "Validation Error",
        status: 422,
        errors: result.error.flatten().fieldErrors
      });
    }
    req.validatedData = result.data;
    next();
  };
}
```

⏱️ **זמן משוער:** 5 דקות

---

## שקף 9

**כותרת ראשית:** 💾 שלב 6: Tasks Service (In-Memory)

**📊 Data Structure:**

```
tasks (Map)
   │
   ├─ "uuid-1" → { id, title, priority, ... }
   ├─ "uuid-2" → { id, title, priority, ... }
   └─ "uuid-3" → { id, title, priority, ... }
```

**🎯 Service Methods:**

```
getAllTasks()      → [...tasks.values()]
createTask(data)   → new task + save to Map
findById(id)       → task or throw AppError(404)
updateTask(id, data) → update + return
deleteTask(id)     → remove from Map
```

**ליצור קובץ `src/services/tasks.service.js`:**

```js
import { randomUUID } from "node:crypto";
import { AppError } from "../utils/AppError.js";

const tasks = new Map();

export function getAllTasks(filters = {}) {
  return [...tasks.values()];
}

export function createTask(data) {
  const task = { id: randomUUID(), ...data, createdAt: new Date() };
  tasks.set(task.id, task);
  return task;
}

export function findById(id) {
  const task = tasks.get(id);
  if (!task) throw new AppError("Task not found", 404);
  return task;
}

export function updateTask(id, data) {
  const task = findById(id);
  Object.assign(task, data, { updatedAt: new Date() });
  return task;
}

export function deleteTask(id) {
  const task = findById(id);
  tasks.delete(id);
  return task;
}
```

⏱️ **זמן משוער:** 10 דקות

---

## שקף 10

**כותרת ראשית:** 🎮 שלב 7: Tasks Controller
**ליצור קובץ `src/controllers/tasks.controller.js`:**

```js
import * as taskService from "../services/tasks.service.js";

export async function getAll(req, res) {
  const tasks = taskService.getAllTasks();
  res.json({ data: tasks, meta: { total: tasks.length } });
}

export async function create(req, res) {
  const task = taskService.createTask(req.validatedData);
  res.status(201).json({ data: task });
}

export async function getOne(req, res) {
  const task = taskService.findById(req.params.id);
  res.json({ data: task });
}

export async function update(req, res) {
  const task = taskService.updateTask(req.params.id, req.validatedData);
  res.json({ data: task });
}

export async function remove(req, res) {
  taskService.deleteTask(req.params.id);
  res.status(204).send();
}
```

⏱️ **זמן משוער:** 10 דקות

---

## שקף 11

**כותרת ראשית:** 🛣️ שלב 8: Tasks Router

**🔀 Routes Structure:**

```
GET    /api/v1/tasks          ← getAll
POST   /api/v1/tasks          ← validate + create
                               │
GET    /api/v1/tasks/:id      ← getOne
PUT    /api/v1/tasks/:id      ← validate + update
DELETE /api/v1/tasks/:id      ← remove
```

**🔗 Middleware Order:**

```
route → validate(schema) → controller
          │
          └─ חיוני לפני controller!
```

**ליצור קובץ `src/routes/tasks.routes.js`:**

```js
import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema.js";
import * as controller from "../controllers/tasks.controller.js";

const router = Router();

router
  .route("/")
  .get(controller.getAll)
  .post(validate(createTaskSchema), controller.create);

router
  .route("/:id")
  .get(controller.getOne)
  .put(validate(updateTaskSchema), controller.update)
  .delete(controller.remove);

export default router;
```

⏱️ **זמן משוער:** 5 דקות

---

## שקף 12

**כותרת ראשית:** 🏗️ שלב 9: app.js + server.js

**📦 Application Layers:**

```
server.js  ← Entry point + Port listening
    │
    ↓
 app.js    ← Express config + Routes + Middleware
    │
    ├─ express.json()    ← Body parser
    ├─ Routes            ← /api/v1/tasks
    └─ errorHandler      ← אחרון!
```

**💡 סדר חשוב:**

1. Body parsers (express.json)
2. Routes
3. Error handler (חייב להיות אחרון!)

**ליצור קובץ `src/app.js`:**

```js
import express from "express";
import taskRoutes from "./routes/tasks.routes.js";
import { errorHandler } from "./middleware/error.js";

const app = express();

app.use(express.json());
app.use("/api/v1/tasks", taskRoutes);
app.use(errorHandler); // אחרון!

export default app;
```

**ליצור קובץ `src/server.js`:**

```js
import app from "./app.js";
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
```

⏱️ **זמן משוער:** 5 דקות

---

## שקף 13

**כותרת ראשית:** 🧪 שלב 10: בדיקה ראשונה!

**הרץ את השרת:**

```bash
npm run dev
```

**בדוק ב-Postman/Thunder Client:**

```
POST http://localhost:3000/api/v1/tasks
Content-Type: application/json

{
  "title": "My First Task",
  "priority": "high"
}
```

**אמור לקבל:** 201 Created + task object עם id

**בדיקות נוספות:**

```
GET    http://localhost:3000/api/v1/tasks        → רשימת tasks
GET    http://localhost:3000/api/v1/tasks/:id    → task ספציפי
PUT    http://localhost:3000/api/v1/tasks/:id    → עידכון
DELETE http://localhost:3000/api/v1/tasks/:id    → 204 No Content
```

⏱️ **זמן משוער:** 5 דקות

---

## שקף 14

**כותרת ראשית:** 📚 שלב 11 (אופציונלי): Swagger
**ליצור קובץ `swagger.js`:**

```js
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const spec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Tasks API", version: "1.0.0" }
  },
  apis: ["./src/routes/*.js"]
});

export function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
}
```

**בשימוש ב-app.js:**

```js
import { setupSwagger } from "../swagger.js";
// ... אחרי הגדרת routes
setupSwagger(app);
```

**לפתוח:** `http://localhost:3000/api-docs`

⏱️ **זמן משוער:** 10 דקות

---

## שקף 15

**כותרת ראשית:** 🧪 שלב 12 (אופציונלי): Testing בסיסי
**ליצור תיקייה `tests/` וקובץ `tests/tasks.service.test.js`:**

```js
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createTask, findById } from "../src/services/tasks.service.js";

describe("Tasks Service", () => {
  test("should create a task", () => {
    const task = createTask({ title: "Test", priority: "high" });
    assert.equal(task.title, "Test");
    assert.ok(task.id);
  });

  test("should throw 404 for missing task", () => {
    assert.throws(() => findById("non-existent"), { statusCode: 404 });
  });
});
```

**להריץ:**

```bash
node --test tests/
```

⏱️ **זמן משוער:** 10 דקות

---

## שקף 16

**כותרת ראשית:** Checklist סופי – וודא שהכל עובד!

- [ ] `GET /api/v1/tasks` – מחזיר מערך עם meta.total
- [ ] `POST /api/v1/tasks` – יוצר task, מחזיר 201
- [ ] `POST /api/v1/tasks` עם body לא תקין – מחזיר 422 עם פרטי שגיאה
- [ ] `GET /api/v1/tasks/:id` – מחזיר task או 404
- [ ] `PUT /api/v1/tasks/:id` – מעדכן task
- [ ] `DELETE /api/v1/tasks/:id` – מוחק task, מחזיר 204
- [ ] `/api-docs` – Swagger UI נטען (אופציונלי)
- [ ] בדיקות unit לـ service עוברות (אופציונלי)

---

## שקף 17

**כותרת ראשית:** 🎉 מזל טוב! בנית API מקצועי
**מה השגנו:**

CRUD API שלם: routes → controllers → services  
 Zod validation בכל endpoint  
 Error middleware מרכזי עם problem+json format  
 Swagger UI לתיעוד אינטראקטיבי  
 `node:test` לבדיקות unit של ה-service

**💡 העיקר:** הבנתם את הארכיטקטורה!

**🚀 מחר (יום 3):** נחבר את אותו ה-API למסד נתונים אמיתי (MongoDB) – הקוד כמעט לא ישתנה!

---

## שקף 18

**כותרת ראשית:** 🆘 שגיאות נפוצות ופתרונות

**בעיה:** `Cannot find module`  
**פתרון:** ודא ש-`"type": "module"` ב-package.json וכל import מסתיים ב-`.js`

**בעיה:** `req.body` הוא `undefined`  
**פתרון:** ודא ש-`app.use(express.json())` נמצא **לפני** הroutes

**בעיה:** Error middleware לא עובד  
**פתרון:** ודא שיש לו **4 פרמטרים** `(err, req, res, next)` ושהוא **אחרון** ב-app.js

**בעיה:** Validation לא עובדת  
**פתרון:** ודא ש-`validate(schema)` מופיע **לפני** הcontroller בroute
