# Day 2 - Presentation 2: Express 5 Deep Dive - Code Examples

---

## Example 1: Setting Up Express 5 Application

```javascript
// ============================================
// File: src/app.js - Express application setup
// ============================================
import express from "express";

// Create Express application
const app = express();

// Built-in middleware
app.use(express.json({ limit: "10kb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Simple route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Express 5!",
    version: "5.0.0",
    features: [
      "async error handling",
      "improved routing",
      "better TypeScript support"
    ]
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;

// ============================================
// File: src/server.js - Server entry point
// ============================================
import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
```

---

## Example 2: Express Router - Modular Routing

```javascript
// ============================================
// File: src/routes/users.routes.js
// ============================================
import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';

const router = Router();

// Basic routes
router.get('/', userController.getAll);
router.post('/', userController.create);

// Routes with parameters
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

// Route chaining (cleaner syntax)
router.route('/:id')
  .get(userController.getById)
  .put(userController.update)
  .delete(userController.delete);

// Nested routes
router.get('/:id/posts', userController.getUserPosts);
router.post('/:id/posts', userController.createUserPost);

// Query parameters route
// Example: GET /users/search?name=John&age=30&active=true
router.get('/search', (req, res) => {
  const { name, age, active } = req.query;

  res.json({
    query: { name, age: Number(age), active: active === 'true' },
    results: [] // In real app, filter from database
  });
});

export default router;

// ============================================
// File: src/app.js - Mount router
// ============================================
import express from 'express';
import userRoutes from './routes/users.routes.js';

const app = express();

// Mount router with prefix
app.use('/api/v1/users', userRoutes);

export default app;
```

---

## Example 3: Controllers - Request Handlers

```javascript
// ============================================
// File: src/controllers/user.controller.js
// ============================================
import * as userService from '../services/user.service.js';

// Get all users
export async function getAll(req, res) {
  // Query parameters for filtering
  const { page = 1, limit = 10, sort = 'createdAt' } = req.query;

  const users = await userService.findAll({
    page: Number(page),
    limit: Number(limit),
    sort
  });

  res.json({
    data: users,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total: users.length
    }
  });
}

// Get single user by ID
export async function getById(req, res) {
  const user = await userService.findById(req.params.id);
  res.json({ data: user });
}

// Create new user
export async function create(req, res) {
  // req.body is parsed by express.json() middleware
  const user = await userService.create(req.body);

  res.status(201)
    .location(`/api/v1/users/${user.id}`) // Set Location header
    .json({ data: user });
}

// Update user
export async function update(req, res) {
  const user = await userService.update(req.params.id, req.body);
  res.json({ data: user });
}

// Delete user
export async function delete(req, res) {
  await userService.delete(req.params.id);
  res.status(204).send(); // 204 No Content - no response body
}

// Express 5: No try/catch needed! Errors automatically go to error middleware
// Express 4 would require try/catch + next(error) in each handler
```

---

## Example 4: Middleware - The Power of Express

```javascript
// ============================================
// Custom Middleware Examples
// ============================================

// 1. Logger middleware - runs for every request
function logger(req, res, next) {
  const start = Date.now();

  // Log after response is sent
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
    );
  });

  next(); // MUST call next() to continue to next middleware
}

// 2. Request ID middleware - adds unique ID to each request
import crypto from "node:crypto";

function requestId(req, res, next) {
  const id = crypto.randomUUID();
  req.id = id;
  res.setHeader("X-Request-ID", id);
  next();
}

// 3. Authentication middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Verify token (simplified - use real JWT verification)
    const decoded = verifyToken(token);
    req.user = decoded; // Add user to request object
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// 4. Authorization middleware (must run after authenticate)
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}

// 5. Rate limiting middleware
const requestCounts = new Map();

function rateLimit(maxRequests = 10, windowMs = 60000) {
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();

    // Get or create request log for this IP
    const log = requestCounts.get(ip) || {
      count: 0,
      resetTime: now + windowMs
    };

    // Reset if window expired
    if (now > log.resetTime) {
      log.count = 0;
      log.resetTime = now + windowMs;
    }

    // Check limit
    if (log.count >= maxRequests) {
      res.setHeader("Retry-After", Math.ceil((log.resetTime - now) / 1000));
      return res.status(429).json({ error: "Too many requests" });
    }

    // Increment and save
    log.count++;
    requestCounts.set(ip, log);

    next();
  };
}

// ============================================
// Using middleware
// ============================================
import express from "express";

const app = express();

// Global middleware - applies to ALL routes
app.use(express.json());
app.use(logger);
app.use(requestId);

// Path-specific middleware
app.use("/api", rateLimit());

// Route-specific middleware
app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "Protected data", user: req.user });
});

// Multiple middleware in route
app.delete(
  "/admin/users/:id",
  authenticate,
  authorize("admin", "superadmin"),
  async (req, res) => {
    // Only admins reach here
    await deleteUser(req.params.id);
    res.status(204).send();
  }
);
```

---

## Example 5: Error Handling Middleware

```javascript
// ============================= // Custom error class
// ============================================
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes from programming errors

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

// ============================================
// Error handling middleware (MUST be last!)
// ============================================
function errorHandler(err, req, res, next) {
  // Log error details
  console.error("Error:", err);

  // Default to 500 server error
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Development vs Production responses
  if (process.env.NODE_ENV === "development") {
    // Show full error in development
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Hide details in production
    if (err.isOperational) {
      // Operational error - safe to send to client
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Programming error - don't leak details
      console.error("💥 PROGRAMMING ERROR:", err);
      res.status(500).json({
        status: "error",
        message: "Something went wrong"
      });
    }
  }
}

// 404 handler for undefined routes
function notFound(req, res, next) {
  const error = new AppError(`Cannot ${req.method} ${req.path}`, 404);
  next(error); // Pass to error handler
}

// ============================================
// Usage in app
// ============================================
import express from "express";

const app = express();

// Routes
app.get("/api/users/:id", async (req, res) => {
  const user = await userService.findById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404); // Express 5: auto-caught!
  }

  res.json({ data: user });
});

// Express 5: Async errors are automatically caught
app.post("/api/users", async (req, res) => {
  // If this throws, Express 5 catches it automatically
  const user = await userService.create(req.body);
  res.status(201).json({ data: user });
});

// 404 handler (before error handler)
app.use(notFound);

// Global error handler (MUST be last!)
app.use(errorHandler);
```

---

## Example 6: Validation Middleware with Zod

```javascript
// ============================================
// File: src/schemas/user.schema.js
// ============================================
import { z } from "zod";

// Schema for creating user
export const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  age: z.number().int().min(18).max(120).optional(),
  role: z.enum(["user", "admin", "moderator"]).default("user")
});

// Schema for updating user (all fields optional)
export const updateUserSchema = createUserSchema.partial();

// ============================================
// File: src/middleware/validate.js
// ============================================
import { z } from "zod";

// Validate request body
export function validateBody(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated; // Replace with validated data
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json({
          error: "Validation failed",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
}

// Validate request params
export function validateParams(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.params);
      req.params = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid parameters",
          details: error.errors
        });
      }
      next(error);
    }
  };
}

// ============================================
// Usage in routes
// ============================================
import { Router } from "express";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema.js";
import { validateBody } from "../middleware/validate.js";
import * as userController from "../controllers/user.controller.js";

const router = Router();

// POST with validation
router.post("/", validateBody(createUserSchema), userController.create);

// PUT with validation
router.put("/:id", validateBody(updateUserSchema), userController.update);

export default router;
```

---

## Example 7: Response Helper Middleware

```javascript
// ============================================
// Add helper methods to response object
// ============================================
function responseHelpers(req, res, next) {
  // Success response
  res.success = (data, statusCode = 200) => {
    res.status(statusCode).json({
      status: "success",
      data
    });
  };

  // Created response
  res.created = (data, location) => {
    if (location) {
      res.setHeader("Location", location);
    }
    res.status(201).json({
      status: "success",
      data
    });
  };

  // Error response
  res.error = (message, statusCode = 500) => {
    res.status(statusCode).json({
      status: "error",
      message
    });
  };

  // Paginated response
  res.paginated = (data, page, limit, total) => {
    res.json({
      status: "success",
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  };

  next();
}

// ============================================
// Usage
// ============================================
import express from "express";

const app = express();

app.use(responseHelpers);

app.get("/api/users/:id", async (req, res) => {
  const user = await findUser(req.params.id);
  res.success(user); // Helper method!
});

app.post("/api/users", async (req, res) => {
  const user = await createUser(req.body);
  res.created(user, `/api/users/${user.id}`);
});

app.get("/api/users", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { users, total } = await findUsers(page, limit);
  res.paginated(users, page, limit, total);
});
```

---

## Example 8: Serving Static Files

```javascript
import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Serve static files from 'public' directory
app.use(express.static("public"));

// Custom static folder with options
app.use(
  "/uploads",
  express.static("uploads", {
    maxAge: "1d", // Cache for 1 day
    index: false, // Don't serve index.html
    dotfiles: "deny" // Don't serve hidden files
  })
);

// Multiple static folders
app.use(express.static(join(__dirname, "../public")));
app.use("/assets", express.static(join(__dirname, "../assets")));

// Now files are accessible:
// public/style.css → http://localhost:3000/style.css
// uploads/photo.jpg → http://localhost:3000/uploads/photo.jpg
// public/index.html → http://localhost:3000/ (if no routes match)
```

---

## Example 9: CORS Configuration

```javascript
import express from "express";
import cors from "cors";

const app = express();

// 1. Simple CORS - Allow all origins (development only!)
app.use(cors());

// 2. Specific origin
app.use(
  cors({
    origin: "https://myapp.com"
  })
);

// 3. Multiple origins
app.use(
  cors({
    origin: ["https://app1.com", "https://app2.com"]
  })
);

// 4. Dynamic origin (function)
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["https://app.com", "http://localhost:3000"];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow
      } else {
        callback(new Error("Not allowed by CORS")); // Block
      }
    }
  })
);

// 5. Full configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["X-Request-ID"],
    credentials: true, // Allow cookies
    maxAge: 86400 // Cache preflight for 24 hours
  })
);

// 6. Route-specific CORS
app.get("/public-api", cors(), (req, res) => {
  res.json({ message: "Public endpoint" });
});

app.get("/private-api", cors({ origin: "https://trusted.com" }), (req, res) => {
  res.json({ message: "Private endpoint" });
});
```

---

## Example 10: Security Headers with Helmet

```javascript
import express from "express";
import helmet from "helmet";

const app = express();

// Basic helmet (recommended defaults)
app.use(helmet());

// CustomizeOld helmet
app.use(
  helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.example.com"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },

    // HTTP Strict Transport Security
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },

    // Other headers
    frameguard: { action: "deny" }, // X-Frame-Options: DENY
    xssFilter: true, // X-XSS-Protection
    noSniff: true, // X-Content-Type-Options: nosniff
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
  })
);

// Headers that helmet set:
// X-Content-Type-Options: nosniff
// X-Frame-Options: SAMEORIGIN
// X-XSS-Protection: 0
// Strict-Transport-Security: max-age=15552000; includeSubDomains
// Content-Security-Policy: ...
```

---

## Comparison Table: Express 4 vs Express 5

| Feature                    | Express 4                      | Express 5            |
| -------------------------- | ------------------------------ | -------------------- |
| **Async error handling**   | Manual try/catch + next(error) | ✅ Automatic         |
| **Promises in middleware** | Not supported                  | ✅ Supported         |
| **Router improvements**    | Basic                          | ✅ Enhanced          |
| **TypeScript support**     | Poor                           | ✅ Much better       |
| **path-to-regexp**         | v0.1.7                         | ✅ v6.2.0 (breaking) |
| **req.param()**            | Deprecated                     | ❌ Removed           |
| **app.del()**              | Deprecated                     | ❌ Removed           |
| **Performance**            | Good                           | ✅ Better            |

---

## Comparison Table: Middleware Order

| Order | Middleware Type | Example                   | Description              |
| ----- | --------------- | ------------------------- | ------------------------ |
| 1     | Body parsers    | `express.json()`          | Parse request body first |
| 2     | Security        | `helmet()`, `cors()`      | Security headers         |
| 3     | Logging         | `morgan()`, custom logger | Log all requests         |
| 4     | Static files    | `express.static()`        | Serve static assets      |
| 5     | Routes          | `app.use('/api', router)` | Application routes       |
| 6     | 404 handler     | Custom notFound           | Handle undefined routes  |
| 7     | Error handler   | Custom errorHandler       | Must be last!            |

---

## Summary

Express 5 modern patterns:

1. **Automatic async error handling** - No try/catch needed
2. **Modular routing** - express.Router() for organization
3. **Middleware chain** - Composable, reusable functions
4. **Validation** - Zod schemas with dedicated middleware
5. **Error handling** - Centralized error middleware
6. **Security** - Helmet, CORS, rate limiting
7. **Response helpers** - Clean, consistent API responses
8. **Static files** - express.static() for assets

Express 5 makes building robust APIs easier and more maintainable!
