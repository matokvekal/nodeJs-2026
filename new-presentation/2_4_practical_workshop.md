# יום 2 – מצגת 8: סדנה מעשית – Mini REST API

---

## שקף 1
**כותרת ראשית:** סדנה מעשית – בניית Mini REST API
**כותרת משנה:** CRUD + Validation + Error Handling + Swagger

---

## שקף 2
**כותרת ראשית:** מה בונים היום?
- API לניהול משימות (Tasks) – CRUD מלא
- **Stack**: Node.js 20+, Express 5, Zod, Swagger
- **נתיבים**: `GET/POST /api/v1/tasks`, `GET/PUT/DELETE /api/v1/tasks/:id`
- **Validation** עם Zod על כל endpoint
- **Error Handling** מרכזי עם AppError
- **Swagger UI** בـ `/api-docs`
- **Data**: in-memory array (ללא DB בסדנה זו)

---

## שקף 3
**כותרת ראשית:** מבנה הפרויקט
```
tasks-api/
├── package.json      (type: module, express@5)
├── .env              (PORT=3000)
├── src/
│   ├── app.js
│   ├── server.js
│   ├── routes/tasks.routes.js
│   ├── controllers/tasks.controller.js
│   ├── services/tasks.service.js
│   ├── middleware/
│   │   ├── validate.js
│   │   └── error.js
│   ├── schemas/task.schema.js    (Zod)
│   └── utils/AppError.js
└── swagger.js
```

---

## שקף 4
**כותרת ראשית:** Zod Schema לTask
```js
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().datetime().optional()
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskIdSchema = z.object({
  id: z.string().uuid()
});
```

---

## שקף 5
**כותרת ראשית:** Validate Middleware
```js
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({
        type: '/errors/validation',
        title: 'Validation Error',
        status: 422,
        errors: result.error.flatten().fieldErrors
      });
    }
    req.validatedData = result.data;
    next();
  };
}
```

---

## שקף 6
**כותרת ראשית:** Tasks Service
```js
import { randomUUID } from 'node:crypto';
import AppError from '../utils/AppError.js';

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
  if (!task) throw new AppError('Task not found', 404);
  return task;
}
```

---

## שקף 7
**כותרת ראשית:** Tasks Controller
```js
import * as taskService from '../services/tasks.service.js';

export async function getAll(req, res) {
  const tasks = taskService.getAllTasks();
  res.json({ data: tasks, meta: { total: tasks.length } });
}

export async function create(req, res) {
  const task = taskService.createTask(req.validatedData);
  res.status(201).json({ data: task });
}

export async function update(req, res) {
  const task = taskService.updateTask(req.params.id, req.validatedData);
  res.json({ data: task });
}
```

---

## שקף 8
**כותרת ראשית:** Tasks Router
```js
import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema.js';
import * as controller from '../controllers/tasks.controller.js';

const router = Router();

router.route('/')
  .get(controller.getAll)
  .post(validate(createTaskSchema), controller.create);

router.route('/:id')
  .get(controller.getOne)
  .put(validate(updateTaskSchema), controller.update)
  .delete(controller.remove);

export default router;
```

---

## שקף 9
**כותרת ראשית:** Error Middleware
```js
export function errorHandler(err, req, res, next) {
  const status = err.statusCode ?? 500;
  const isOperational = err.isOperational ?? false;

  console.error(err);

  res.status(status).json({
    type: '/errors/' + (err.code ?? 'internal'),
    title: isOperational ? err.message : 'Internal Server Error',
    status,
    instance: req.originalUrl
  });
}
```
- **isOperational = true**: שגיאה צפויה (404, validation)
- **isOperational = false**: שגיאת תכנות (500)

---

## שקף 10
**כותרת ראשית:** Swagger Setup
```js
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const spec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Tasks API', version: '1.0.0' }
  },
  apis: ['./src/routes/*.js']
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
```
- `npm install swagger-ui-express swagger-jsdoc`
- תיעוד זמין בـ `http://localhost:3000/api-docs`

---

## שקף 11
**כותרת ראשית:** Testing בסיסי
```js
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createTask, findById } from '../src/services/tasks.service.js';

describe('Tasks Service', () => {
  test('should create a task', () => {
    const task = createTask({ title: 'Test', priority: 'high' });
    assert.equal(task.title, 'Test');
    assert.ok(task.id);
  });

  test('should throw 404 for missing task', () => {
    assert.throws(() => findById('non-existent'), { statusCode: 404 });
  });
});
```

---

## שקף 12
**כותרת ראשית:** Checklist לבדיקה
- [ ] `GET /api/v1/tasks` – מחזיר מערך עם meta.total
- [ ] `POST /api/v1/tasks` – יוצר task, מחזיר 201
- [ ] `POST /api/v1/tasks` עם body לא תקין – מחזיר 422 עם פרטי שגיאה
- [ ] `GET /api/v1/tasks/:id` – מחזיר task או 404
- [ ] `PUT /api/v1/tasks/:id` – מעדכן task
- [ ] `DELETE /api/v1/tasks/:id` – מוחק task, מחזיר 204
- [ ] `/api-docs` – Swagger UI נטען
- [ ] בדיקות unit לـ service עוברות

---

## שקף 13
**כותרת ראשית:** סיכום – יום 2 מצגת 8
- CRUD API שלם: routes → controllers → services
- Zod validation בכל endpoint
- Error middleware מרכזי עם problem+json format
- Swagger UI לתיעוד אינטראקטיבי
- `node:test` לבדיקות unit של ה-service
- **מחר** (יום 3): נחבר את ה-API הזה למסד נתונים אמיתי
