import { quiz_2_4 } from "../../data/quizzes/quiz_2_4.js";

export const slides = [
  {
    id: 1,
    type: "title",
    title: "סדנה מעשית – בניית Mini REST API",
    subtitle: "CRUD + Validation + Error Handling + Swagger"
  },
  {
    id: 2,
    title: "מה בונים היום?",
    bullets: [
      "API לניהול משימות (Tasks) – CRUD מלא",
      "Stack: Node.js 20+, Express 5, Zod, Swagger",
      "נתיבים: GET/POST /api/v1/tasks, GET/PUT/DELETE /api/v1/tasks/:id",
      "Validation עם Zod על כל endpoint",
      "Error Handling מרכזי עם AppError",
      "Swagger UI בـ /api-docs",
      "Data: in-memory array (ללא DB בסדנה זו)"
    ]
  },
  {
    id: 3,
    title: "מבנה הפרויקט",
    code: `tasks-api/
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
└── swagger.js`
  },
  {
    id: 4,
    title: "Zod Schema לTask",
    code: `import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().datetime().optional()
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskIdSchema = z.object({
  id: z.string().uuid()
});`
  },
  {
    id: 5,
    title: "Validate Middleware",
    code: `export function validate(schema) {
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
}`
  },
  {
    id: 6,
    title: "Tasks Service",
    code: `import { randomUUID } from 'node:crypto';
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
}`
  },
  {
    id: 7,
    title: "Tasks Controller",
    code: `import * as taskService from '../services/tasks.service.js';

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
}`
  },
  {
    id: 8,
    title: "Tasks Router",
    code: `import { Router } from 'express';
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

export default router;`
  },
  {
    id: 9,
    title: "Error Middleware",
    code: `export function errorHandler(err, req, res, next) {
  const status = err.statusCode ?? 500;
  const isOperational = err.isOperational ?? false;

  console.error(err);

  res.status(status).json({
    type: '/errors/' + (err.code ?? 'internal'),
    title: isOperational ? err.message : 'Internal Server Error',
    status,
    instance: req.originalUrl
  });
}`,
    bullets: [
      "isOperational = true: שגיאה צפויה (404, validation)",
      "isOperational = false: שגיאת תכנות (500)"
    ]
  },
  {
    id: 10,
    title: "Swagger Setup",
    code: `import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const spec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Tasks API', version: '1.0.0' }
  },
  apis: ['./src/routes/*.js']
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));`,
    bullets: [
      "npm install swagger-ui-express swagger-jsdoc",
      "תיעוק זמין בـ http://localhost:3000/api-docs"
    ]
  },
  {
    id: 11,
    title: "Testing בסיסי",
    code: `import { test, describe } from 'node:test';
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
});`
  },
  {
    id: 12,
    title: "Checklist לבדיקה",
    bullets: [
      "☐ GET /api/v1/tasks – מחזיר מערך עם meta.total",
      "☐ POST /api/v1/tasks – יוצר task, מחזיר 201",
      "☐ POST /api/v1/tasks עם body לא תקין – מחזיר 422 עם פרטי שגיאה",
      "☐ GET /api/v1/tasks/:id – מחזיר task או 404",
      "☐ PUT /api/v1/tasks/:id – מעדכן task",
      "☐ DELETE /api/v1/tasks/:id – מוחק task, מחזיר 204",
      "☐ /api-docs – Swagger UI נטען",
      "☐ בדיקות unit לـ service עוברות"
    ]
  },
  {
    id: 13,
    title: "סיכום – יום 2 מצגת 8",
    bullets: [
      "CRUD API שלם: routes → controllers → services",
      "Zod validation בכל endpoint",
      "Error middleware מרכזי עם problem+json format",
      "Swagger UI לתיעוד אינטראקטיבי",
      "node:test לבדיקות unit של ה-service",
      "מחר (יום 3): נחבר את ה-API הזה למסד נתונים אמיתי"
    ]
  }
];
