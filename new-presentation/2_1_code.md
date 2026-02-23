# Day 2 - Presentation 1: Modules, NPM & Backend Architecture - Code Examples

---

## Example 1: ESM (ES Modules) - Modern Import/Export

```javascript
// ============================================
// File: utils/math.js - Named exports
// ============================================
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export const PI = 3.14159;

// Alternative: Export at end
function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}

export { multiply, divide };

// ============================================
// File: utils/logger.js - Default export
// ============================================
class Logger {
  constructor(name) {
    this.name = name;
  }

  log(message) {
    console.log(`[${this.name}] ${new Date().toISOString()} - ${message}`);
  }

  error(error) {
    console.error(`[${this.name}] ERROR:`, error.message);
  }
}

export default Logger;

// ============================================
// File: app.js - Importing modules
// ============================================
// Named imports
import { add, subtract, PI } from "./utils/math.js"; // .js extension required!

// Default import (can name it anything)
import Logger from "./utils/logger.js";

// Import all as namespace
import * as MathUtils from "./utils/math.js";

// Mixed: default + named
// import Logger, { add, PI } from './utils.js';

// Using imports
const logger = new Logger("App");
logger.log("Application started");

console.log("2 + 3 =", add(2, 3));
console.log("10 - 5 =", subtract(10, 5));
console.log("PI =", PI);

// Using namespace import
console.log("5 * 6 =", MathUtils.multiply(5, 6));
```

---

## Example 2: package.json - Essential Configuration

```json
{
  "name": "my-node-app",
  "version": "1.0.0",
  "description": "Modern Node.js application with ESM",
  "type": "module",
  "main": "src/index.js",
  "exports": {
    ".": "./src/index.js",
    "./utils": "./src/utils/index.js"
  },
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js",
    "dev:env": "node --watch --env-file=.env src/index.js",
    "test": "node --test",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  },
  "keywords": ["nodejs", "api", "backend"],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "dependencies": {
    "express": "^5.0.0"
  },
  "devDependencies": {
    "eslint": "^9.0.0",
    "prettier": "^3.0.0"
  }
}
```

```javascript
// Reading package.json in ESM
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Get directory of current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json
const packageJson = JSON.parse(
  await readFile(join(__dirname, "package.json"), "utf8")
);

console.log("App name:", packageJson.name);
console.log("Version:", packageJson.version);
console.log("Node version required:", packageJson.engines.node);
```

---

## Example 3: Environment Variables with --env-file

```bash
# ============================================
# File: .env (never commit to Git!)
# ============================================
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/mydb
API_KEY=secret_api_key_12345
JWT_SECRET=super_secret_jwt_key
LOG_LEVEL=debug

# Third-party API keys
STRIPE_API_KEY=sk_test_xxxxx
SENDGRID_API_KEY=SG.xxxxx
```

```bash
# ============================================
# File: .env.example (commit this to Git!)
# ============================================
NODE_ENV=development
PORT=3000
DATABASE_URL=your_database_connection_string
API_KEY=your_api_key
JWT_SECRET=your_jwt_secret
LOG_LEVEL=info

# Third-party API keys
STRIPE_API_KEY=your_stripe_key
SENDGRID_API_KEY=your_sendgrid_key
```

```javascript
// ============================================
// File: config/env.js - Environment config
// ============================================
// Run with: node --env-file=.env app.js

// Validate required environment variables
function validateEnv() {
  const required = ["DATABASE_URL", "API_KEY", "JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

validateEnv();

// Export typed configuration
export const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,

  // Database
  database: {
    url: process.env.DATABASE_URL
  },

  // Security
  security: {
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || "info"
  },

  // Feature flags
  features: {
    enableCache: process.env.ENABLE_CACHE === "true",
    maxUploadSize: Number(process.env.MAX_UPLOAD_SIZE) || 10 * 1024 * 1024 // 10MB
  }
};

// Using config
console.log("Environment:", config.env);
console.log("Server port:", config.port);
console.log("Database:", config.database.url ? "Connected" : "Not configured");
```

```bash
# .gitignore - Essential entries
node_modules/
.env
.env.local
*.log
dist/
coverage/
.DS_Store
```

---

## Example 4: ESLint Configuration (Modern Flat Config)

```javascript
// ============================================
// File: eslint.config.js (ESLint 9+)
// ============================================
import js from "@eslint/js";

export default [
  // Recommended rules
  js.configs.recommended,

  // Custom configuration
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly"
      }
    },

    rules: {
      // Error rules
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "off", // Allow console in Node.js
      "no-constant-condition": "error",
      "no-duplicate-case": "error",

      // Best practices
      eqeqeq: ["error", "always"], // Require === and !==
      curly: ["error", "all"], // Require braces for all control statements
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-var": "error", // Use let/const instead
      "prefer-const": "error",

      // Style
      semi: ["error", "always"],
      quotes: ["error", "single"],
      indent: ["error", 2],
      "comma-dangle": ["error", "always-multiline"]
    },

    ignores: ["node_modules/", "dist/", "coverage/"]
  }
];
```

```javascript
// Example: Code that passes ESLint
function calculateTotal(items) {
  if (!items || items.length === 0) {
    return 0;
  }

  const total = items.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  return total;
}

// Example: Code that fails ESLint
// var x = 1; // ERROR: no-var (use let or const)
// if (total == 100) {} // ERROR: eqeqeq (use ===)
// const unused = 5; // ERROR: no-unused-vars
```

---

## Example 5: Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

```javascript
// ============================================
// File: .prettierignore
// ============================================
node_modules/
dist/
coverage/
*.min.js
package-lock.json
```

```javascript
// Before Prettier
const user = {
  name: "John",
  email: "john@example.com",
  age: 30,
  active: true,
  roles: ["admin", "user"]
};

// After Prettier (automatically formatted)
const user = {
  name: "John",
  email: "john@example.com",
  age: 30,
  active: true,
  roles: ["admin", "user"]
};
```

---

## Example 6: Project Structure - Modern Backend Architecture

```
my-backend-app/
├── src/
│   ├── controllers/       # HTTP request handlers
│   │   ├── user.controller.js
│   │   └── post.controller.js
│   ├── services/          # Business logic
│   │   ├── user.service.js
│   │   └── post.service.js
│   ├── models/            # Data models
│   │   ├── user.model.js
│   │   └── post.model.js
│   ├── routes/            # Route definitions
│   │   ├── user.routes.js
│   │   └── post.routes.js
│   ├── middleware/        # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   ├── utils/             # Utility functions
│   │   ├── logger.js
│   │   └── validator.js
│   ├── config/            # Configuration
│   │   ├── env.js
│   │   └── database.js
│   ├── app.js             # Express app setup
│   └── index.js           # Server entry point
├── tests/
│   ├── unit/
│   └── integration/
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── prettier.config.json
├── package.json
└── README.md
```

```javascript
// ============================================
// File: src/index.js - Server entry point
// ============================================
import { createServer } from "node:http";
import app from "./app.js";
import { config } from "./config/env.js";
import { logger } from "./utils/logger.js";

const server = createServer(app);

// Start server
server.listen(config.port, () => {
  logger.log(`Server running on port ${config.port}`);
  logger.log(`Environment: ${config.env}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.log("SIGTERM received. Closing server...");
  server.close(() => {
    logger.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.log("SIGINT received. Closing server...");
  server.close(() => {
    logger.log("Server closed");
    process.exit(0);
  });
});
```

---

## Example 7: Layered Architecture - Controller/Service/Model Pattern

```javascript
// ============================================
// File: src/models/user.model.js - Data model
// ============================================
export class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.createdAt = data.createdAt || new Date();
  }

  // Validation
  validate() {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Name is required");
    }

    if (!this.email || !this.email.includes("@")) {
      throw new Error("Valid email is required");
    }
  }

  // Transform for API response
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt.toISOString()
    };
  }
}

// ============================================
// File: src/services/user.service.js - Business logic
// ============================================
import { User } from "../models/user.model.js";

// In-memory database (use real DB in production)
const users = new Map();
let nextId = 1;

export class UserService {
  // Find all users
  async findAll() {
    return Array.from(users.values());
  }

  // Find user by ID
  async findById(id) {
    const user = users.get(Number(id));
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  // Create new user
  async create(userData) {
    // Create and validate user
    const user = new User({
      id: nextId++,
      ...userData
    });

    user.validate();

    // Check for duplicate email
    const existing = Array.from(users.values()).find(
      (u) => u.email === user.email
    );

    if (existing) {
      throw new Error("Email already exists");
    }

    users.set(user.id, user);
    return user;
  }

  // Update user
  async update(id, updates) {
    const user = await this.findById(id);

    Object.assign(user, updates);
    user.validate();

    users.set(user.id, user);
    return user;
  }

  // Delete user
  async delete(id) {
    const user = await this.findById(id);
    users.delete(user.id);
    return user;
  }
}

// ============================================
// File: src/controllers/user.controller.js - HTTP handlers
// ============================================
import { UserService } from "../services/user.service.js";

const userService = new UserService();

export class UserController {
  // GET /api/users
  async getAll(req, res) {
    try {
      const users = await userService.findAll();
      res.json({ users: users.map((u) => u.toJSON()) });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/users/:id
  async getById(req, res) {
    try {
      const user = await userService.findById(req.params.id);
      res.json(user.toJSON());
    } catch (error) {
      if (error.message === "User not found") {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // POST /api/users
  async create(req, res) {
    try {
      const user = await userService.create(req.body);
      res.status(201).json(user.toJSON());
    } catch (error) {
      if (error.message.includes("already exists")) {
        res.status(409).json({ error: error.message });
      } else if (error.message.includes("required")) {
        res.status(422).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // PUT /api/users/:id
  async update(req, res) {
    try {
      const user = await userService.update(req.params.id, req.body);
      res.json(user.toJSON());
    } catch (error) {
      if (error.message === "User not found") {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // DELETE /api/users/:id
  async delete(req, res) {
    try {
      await userService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error.message === "User not found") {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
```

---

## Example 8: Dynamic Imports

```javascript
// Dynamic imports - load modules conditionally at runtime

// Conditional module loading
async function loadDatabase() {
  const dbType = process.env.DATABASE_TYPE || "mongodb";

  if (dbType === "mongodb") {
    const { MongoClient } = await import("mongodb");
    return new MongoClient(process.env.MONGO_URL);
  } else if (dbType === "postgres") {
    const { Client } = await import("pg");
    return new Client({ connectionString: process.env.PG_URL });
  }
}

// Lazy loading - load only when needed
async function processImage(imagePath) {
  // Don't load sharp unless we actually process an image
  const sharp = await import("sharp");

  return sharp.default(imagePath).resize(800, 600).toFile("output.jpg");
}

// Code splitting - load heavy modules on demand
async function generatePDF(data) {
  // Only load PDF library when PDF generation is requested
  const PDFDocument = await import("pdfkit");

  const doc = new PDFDocument.default();
  // ... generate PDF
  return doc;
}

// Plugin system - load plugins dynamically
async function loadPlugins(pluginNames) {
  const plugins = [];

  for (const name of pluginNames) {
    try {
      const plugin = await import(`./plugins/${name}.js`);
      plugins.push(plugin.default);
      console.log(` Loaded plugin: ${name}`);
    } catch (error) {
      console.error(`  Failed to load plugin ${name}:`, error.message);
    }
  }

  return plugins;
}

// Usage
const db = await loadDatabase();
const plugins = await loadPlugins(["auth", "logging", "cache"]);
```

---

## Example 9: CommonJS vs ESM - Interoperability

```javascript
// ============================================
// CommonJS module (legacy - user-cjs.js)
// ============================================
// Export
module.exports = {
  name: "John",
  greet() {
    console.log("Hello from CommonJS!");
  }
};

// Or
exports.name = "John";
exports.greet = function () {
  console.log("Hello!");
};

// ============================================
// Importing CommonJS in ESM
// ============================================
// ESM can import CommonJS - default import
import userCJS from "./user-cjs.js";
console.log(userCJS.name); // Works!

// Named imports don't work directly
// import { name } from './user-cjs.js'; // ERROR

// ============================================
// Importing ESM in CommonJS
// ============================================
// CommonJS CANNOT use regular require() for ESM
// Must use dynamic import()

// user-esm.js (ESM module)
export const name = "Jane";
export function greet() {
  console.log("Hello from ESM!");
}

// In CommonJS file:
(async () => {
  const userESM = await import("./user-esm.js");
  console.log(userESM.name); // Works!
  userESM.greet();
})();
```

---

## Example 10: Barrel Exports - Clean Imports

```javascript
// ============================================
// File: src/utils/string-utils.js
// ============================================
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str, length) {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

// ============================================
// File: src/utils/number-utils.js
// ============================================
export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

export function percentage(value, total) {
  return ((value / total) * 100).toFixed(2) + "%";
}

// ============================================
// File: src/utils/index.js - Barrel export
// ============================================
// Re-export everything from individual files
export * from "./string-utils.js";
export * from "./number-utils.js";

// Or with explicit exports
export { capitalize, truncate } from "./string-utils.js";
export { formatCurrency, percentage } from "./number-utils.js";

// ============================================
// Usage: Clean single import
// ============================================
// Instead of:
// import { capitalize } from './utils/string-utils.js';
// import { formatCurrency } from './utils/number-utils.js';

// Do this:
import { capitalize, formatCurrency } from "./utils/index.js";

console.log(capitalize("hello")); // Hello
console.log(formatCurrency(99.99)); // $99.99
```

---

## Comparison Table: CommonJS vs ESM

| Feature             | CommonJS (CJS)                 | ES Modules (ESM)                        |
| ------------------- | ------------------------------ | --------------------------------------- |
| **Syntax**          | `require()` / `module.exports` | `import` / `export`                     |
| **Loading**         | Synchronous                    | Asynchronous                            |
| **File extension**  | `.js` (default), `.cjs`        | `.js` (with `"type": "module"`), `.mjs` |
| **Top-level await** | No                             | Yes                                     |
| **`__dirname`**     | Available                      | Use `import.meta.url`                   |
| **Dynamic imports** | `require()` anywhere           | `await import()`                        |
| **Tree shaking**    | No                             | Yes                                     |
| **Browser support** | No (bundler needed)            | Native                                  |
| **Use in 2026**     | Legacy only                    | Recommended                             |

---

## Comparison Table: Dependencies Types

| Type                     | Install Command          | When Used                    | Example                   |
| ------------------------ | ------------------------ | ---------------------------- | ------------------------- |
| **dependencies**         | `npm install express`    | Production runtime           | express, mongoose         |
| **devDependencies**      | `npm install -D eslint`  | Development only             | eslint, prettier, nodemon |
| **peerDependencies**     | Declared in package.json | Plugin/library compatibility | react (for React plugins) |
| **optionalDependencies** | `npm install -O`         | Nice to have, not required   | fsevents (macOS only)     |

---

## Summary

Modern Node.js project setup in 2026:

1. **ESM** - Use `"type": "module"` and import/export
2. **package.json** - Define scripts, engines, dependencies
3. **Environment variables** - Use `--env-file` (Node 20.6+)
4. **ESLint** - Flat config (eslint.config.js) for code quality
5. **Prettier** - Automatic code formatting
6. **Project structure** - Layered architecture (Controller/Service/Model)
7. **Dynamic imports** - Lazy loading and code splitting
8. **Barrel exports** - Clean import statements

Always follow modern standards and best practices for maintainable code!
