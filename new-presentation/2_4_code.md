# Day 2 - Presentation 4: Practical Workshop - Code Examples

---

## Workshop Goal: Build Mini REST API for Tasks

Complete CRUD REST API with modern patterns:

- **Resource**: Tasks (title, description, priority, dueDate)
- **Stack**: Node.js 20+, Express 5, Zod validation
- **Features**: CRUD, validation, error handling, Swagger docs
- **Storage**: In-memory Map (no database needed)

---

## Example 1: Project Setup

```json
// package.json
{
  "name": "tasks-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js"
  },
  "dependencies": {
    "express": "^5.0.0",
    "zod": "^3.22.4",
    "swagger-ui-express": "^5.0.0",
    "swagger-jsdoc": "^6.2.8"
  },
  "devDependencies": {
    "eslint": "^8.56.0",
    "prettier": "^3.2.4"
  }
}
```

```bash
# Setup commands
npm init -y
npm install express@5 zod swagger-ui-express swagger-jsdoc

# Project structure
mkdir -p src/{routes,controllers,services,middleware,schemas,utils}
touch src/{app.js,server.js}
touch src/routes/tasks.routes.js
touch src/controllers/tasks.controller.js
touch src/services/tasks.service.js
touch src/middleware/{validate.js,error.js}
touch src/schemas/task.schema.js
touch src/utils/AppError.js
echo "PORT=3000" > .env
```

---

## Example 2: AppError Class (Custom Error)

```javascript
// src/utils/AppError.js
export default class AppError extends Error {
  constructor(message, statusCode = 500, code = "internal_error") {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Expected errors

    Error.captureStackTrace(this, this.constructor);
  }

  // Factory methods for common errors
  static notFound(resource = "Resource") {
    return new AppError(`${resource} not found`, 404, "not_found");
  }

  static badRequest(message) {
    return new AppError(message, 400, "bad_request");
  }

  static unauthorized(message = "Authentication required") {
    return new AppError(message, 401, "unauthorized");
  }

  static forbidden(message = "Insufficient permissions") {
    return new AppError(message, 403, "forbidden");
  }

  static conflict(message) {
    return new AppError(message, 409, "conflict");
  }
}

// Usage:
// throw AppError.notFound('Task');
// throw AppError.badRequest('Invalid priority value');
```

---

## Example 3: Zod Schemas for Validation

```javascript
// src/schemas/task.schema.js
import { z } from "zod";

// Schema for creating a task
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),

  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),

  priority: z.enum(["low", "medium", "high"]).default("medium"),

  dueDate: z.string().datetime({ message: "Invalid ISO 8601 date" }).optional()
});

// Schema for updating a task (all fields optional)
export const updateTaskSchema = createTaskSchema.partial();

// Schema for validating URL params
export const taskIdSchema = z.object({
  id: z.string().uuid("Invalid task ID format")
});

// Schema for query params (filtering/sorting)
export const taskQuerySchema = z.object({
  priority: z.enum(["low", "medium", "high"]).optional(),
  sort: z.enum(["createdAt", "-createdAt", "title", "-title"]).optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  page: z.coerce.number().int().positive().default(1)
});

// Advanced: Multiple validation targets
export function validateRequest(schemas) {
  return (req, res, next) => {
    const errors = {};

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.body = result.error.flatten().fieldErrors;
      } else {
        req.validatedData = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.params = result.error.flatten().fieldErrors;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.query = result.error.flatten().fieldErrors;
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        type: "/errors/validation",
        title: "Validation Failed",
        status: 422,
        errors
      });
    }

    next();
  };
}
```

---

## Example 4: Validate Middleware

```javascript
// src/middleware/validate.js

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Zod validation failed
      return res.status(422).json({
        type: "/errors/validation",
        title: "Validation Error",
        status: 422,
        errors: result.error.flatten().fieldErrors
        // Example errors format:
        // { title: ['Title is required'], priority: ['Invalid enum value'] }
      });
    }

    // Store validated data on request
    req.validatedData = result.data;
    next();
  };
}

// Validate URL params
export function validateParams(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        type: "/errors/bad-request",
        title: "Invalid Parameters",
        status: 400,
        errors: result.error.flatten().fieldErrors
      });
    }

    next();
  };
}

// Validate query parameters
export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        type: "/errors/bad-request",
        title: "Invalid Query Parameters",
        status: 400,
        errors: result.error.flatten().fieldErrors
      });
    }

    req.query = result.data; // Replace with validated/transformed data
    next();
  };
}
```

---

## Example 5: Tasks Service (Business Logic)

```javascript
// src/services/tasks.service.js
import { randomUUID } from "node:crypto";
import AppError from "../utils/AppError.js";

// In-memory storage (replace with DB later)
const tasks = new Map();

// Get all tasks with optional filtering
export function getAllTasks(filters = {}) {
  let results = [...tasks.values()];

  // Filter by priority
  if (filters.priority) {
    results = results.filter((task) => task.priority === filters.priority);
  }

  // Sort
  if (filters.sort) {
    const sortField = filters.sort.startsWith("-")
      ? filters.sort.substring(1)
      : filters.sort;
    const sortOrder = filters.sort.startsWith("-") ? -1 : 1;

    results.sort((a, b) => {
      if (a[sortField] < b[sortField]) return -1 * sortOrder;
      if (a[sortField] > b[sortField]) return 1 * sortOrder;
      return 0;
    });
  }

  return results;
}

// Create new task
export function createTask(data) {
  const task = {
    id: randomUUID(),
    ...data,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.set(task.id, task);
  return task;
}

// Get task by ID
export function findById(id) {
  const task = tasks.get(id);

  if (!task) {
    throw AppError.notFound("Task");
  }

  return task;
}

// Update task
export function updateTask(id, data) {
  const task = findById(id); // Throws if not found

  const updated = {
    ...task,
    ...data,
    id: task.id, // Prevent ID change
    createdAt: task.createdAt, // Preserve creation date
    updatedAt: new Date().toISOString()
  };

  tasks.set(id, updated);
  return updated;
}

// Delete task
export function deleteTask(id) {
  const task = findById(id); // Throws if not found
  tasks.delete(id);
  return task;
}

// Mark task as completed
export function completeTask(id) {
  const task = findById(id);

  if (task.completed) {
    throw AppError.badRequest("Task is already completed");
  }

  const updated = {
    ...task,
    completed: true,
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.set(id, updated);
  return updated;
}

// Get statistics
export function getStats() {
  const allTasks = [...tasks.values()];

  return {
    total: allTasks.length,
    completed: allTasks.filter((t) => t.completed).length,
    pending: allTasks.filter((t) => !t.completed).length,
    byPriority: {
      high: allTasks.filter((t) => t.priority === "high").length,
      medium: allTasks.filter((t) => t.priority === "medium").length,
      low: allTasks.filter((t) => t.priority === "low").length
    }
  };
}
```

---

## Example 6: Tasks Controller (Request Handlers)

```javascript
// src/controllers/tasks.controller.js
import * as taskService from "../services/tasks.service.js";

// GET /api/v1/tasks
export async function getAll(req, res) {
  const { priority, sort } = req.query;

  const tasks = taskService.getAllTasks({ priority, sort });

  res.json({
    data: tasks,
    meta: {
      total: tasks.length,
      filters: { priority, sort }
    }
  });
}

// POST /api/v1/tasks
export async function create(req, res) {
  const task = taskService.createTask(req.validatedData);

  res.status(201).location(`/api/v1/tasks/${task.id}`).json({ data: task });
}

// GET /api/v1/tasks/:id
export async function getOne(req, res) {
  const task = taskService.findById(req.params.id);

  res.json({ data: task });
}

// PUT /api/v1/tasks/:id
export async function update(req, res) {
  const task = taskService.updateTask(req.params.id, req.validatedData);

  res.json({ data: task });
}

// DELETE /api/v1/tasks/:id
export async function remove(req, res) {
  taskService.deleteTask(req.params.id);

  res.status(204).send();
}

// POST /api/v1/tasks/:id/complete
export async function complete(req, res) {
  const task = taskService.completeTask(req.params.id);

  res.json({ data: task });
}

// GET /api/v1/tasks/stats
export async function stats(req, res) {
  const statistics = taskService.getStats();

  res.json({ data: statistics });
}
```

---

## Example 7: Tasks Router

```javascript
// src/routes/tasks.routes.js
import { Router } from "express";
import {
  validate,
  validateParams,
  validateQuery
} from "../middleware/validate.js";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  taskQuerySchema
} from "../schemas/task.schema.js";
import * as controller from "../controllers/tasks.controller.js";

const router = Router();

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks
 *     parameters:
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/", validateQuery(taskQuerySchema), controller.getAll);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               priority: { type: string, enum: [low, medium, high] }
 *     responses:
 *       201:
 *         description: Task created
 */
router.post("/", validate(createTaskSchema), controller.create);

// Special route: Get stats (must be BEFORE /:id route!)
router.get("/stats", controller.stats);

router.get("/:id", validateParams(taskIdSchema), controller.getOne);

router.put(
  "/:id",
  validateParams(taskIdSchema),
  validate(updateTaskSchema),
  controller.update
);

router.delete("/:id", validateParams(taskIdSchema), controller.remove);

router.post("/:id/complete", validateParams(taskIdSchema), controller.complete);

export default router;
```

---

## Example 8: Error Handling Middleware

```javascript
// src/middleware/error.js
import AppError from "../utils/AppError.js";

// Handle 404 - Route not found
export function notFoundHandler(req, res, next) {
  const error = new AppError(
    `Route ${req.method} ${req.originalUrl} not found`,
    404,
    "route_not_found"
  );

  next(error);
}

// Global error handler
export function errorHandler(err, req, res, next) {
  // Default values
  const statusCode = err.statusCode ?? 500;
  const isOperational = err.isOperational ?? false;
  const code = err.code ?? "internal_error";

  // Log error (in production, use proper logger)
  console.error("❌ Error:", {
    message: err.message,
    statusCode,
    code,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });

  // Send error response (RFC 7807 format)
  res.status(statusCode).json({
    type: `/errors/${code}`,
    title: isOperational ? err.message : "Internal Server Error",
    status: statusCode,
    instance: req.originalUrl,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err
    })
  });
}

// Async handler wrapper (Express 5 handles this automatically!)
// Keep for backward compatibility
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
```

---

## Example 9: Swagger Configuration

```javascript
// swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tasks API",
      version: "1.0.0",
      description: "A simple REST API for managing tasks",
      contact: {
        name: "API Support",
        email: "support@example.com"
      }
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server"
      }
    ],
    components: {
      schemas: {
        Task: {
          type: "object",
          required: ["title"],
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string", maxLength: 100 },
            description: { type: "string", maxLength: 500 },
            priority: { type: "string", enum: ["low", "medium", "high"] },
            completed: { type: "boolean" },
            dueDate: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Error: {
          type: "object",
          properties: {
            type: { type: "string" },
            title: { type: "string" },
            status: { type: "number" },
            instance: { type: "string" }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.js"] // Path to route files with JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app) {
  // Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Tasks API Documentation"
    })
  );

  // JSON spec
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log("📚 Swagger docs available at http://localhost:3000/api-docs");
}
```

---

## Example 10: Complete App Setup

```javascript
// src/app.js
import express from "express";
import tasksRouter from "./routes/tasks.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/error.js";
import { setupSwagger } from "../swagger.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/v1/tasks", tasksRouter);

// Swagger documentation
setupSwagger(app);

// Error handling (MUST be last!)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
```

```javascript
// src/server.js
import app from "./app.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});
```

---

## Example 11: Testing the API (Manual)

```bash
# Run the server
npm run dev

# Test endpoints
# 1. Create task
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Node.js","priority":"high","description":"Complete course"}'

# 2. Get all tasks
curl http://localhost:3000/api/v1/tasks

# 3. Get specific task
curl http://localhost:3000/api/v1/tasks/{UUID}

# 4. Update task
curl -X PUT http://localhost:3000/api/v1/tasks/{UUID} \
  -H "Content-Type: application/json" \
  -d '{"title":"Master Node.js","priority":"high"}'

# 5. Complete task
curl -X POST http://localhost:3000/api/v1/tasks/{UUID}/complete

# 6. Delete task
curl -X DELETE http://localhost:3000/api/v1/tasks/{UUID}

# 7. Get stats
curl http://localhost:3000/api/v1/tasks/stats

# 8. Filter by priority
curl http://localhost:3000/api/v1/tasks?priority=high

# 9. Sort by title
curl http://localhost:3000/api/v1/tasks?sort=title

# 10. Validation error (missing title)
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"description":"No title"}'
# Response: 422 Unprocessable Entity with validation errors
```

---

## Comparison Table: Error Types

| Error Type           | Status | isOperational | When to Use            |
| -------------------- | ------ | ------------- | ---------------------- |
| **Validation Error** | 422    | ✅ Yes        | Zod validation fails   |
| **Not Found**        | 404    | ✅ Yes        | Resource doesn't exist |
| **Bad Request**      | 400    | ✅ Yes        | Invalid input format   |
| **Conflict**         | 409    | ✅ Yes        | Duplicate resource     |
| **Internal Error**   | 500    | ❌ No         | Unexpected bugs        |

**isOperational = true**: Expected/handled errors (safe to expose message)  
**isOperational = false**: Programming errors (hide details)

---

## Summary

Complete Mini REST API built with:

1. **Layered Architecture** - Routes → Controllers → Services
2. **Zod Validation** - Type-safe request validation
3. **Custom Error Class** - AppError with factory methods
4. **Error Middleware** - Centralized error handling (RFC 7807)
5. **Swagger Documentation** - Auto-generated from JSDoc
6. **In-memory Storage** - Map (easily replaced with DB)
7. **Modern Patterns** - ESM, async/await, Express 5

Visit `http://localhost:3000/api-docs` to explore the API interactively!
