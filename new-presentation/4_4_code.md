# Day 4 - Presentation 4: Testing & Code Quality - Code Examples

---

## Example 1: node:test - Basic Unit Tests

```javascript
// tests/math.test.js
import { test, describe } from "node:test";
import assert from "node:assert/strict";

// Functions to test
function add(a, b) {
  return a + b;
}

function divide(a, b) {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}

// ===================================
// Test Suite
// ===================================
describe("Math Operations", () => {
  test("adds two numbers", () => {
    assert.equal(add(2, 3), 5);
    assert.equal(add(-1, 1), 0);
    assert.equal(add(0, 0), 0);
  });

  test("divides two numbers", () => {
    assert.equal(divide(10, 2), 5);
    assert.equal(divide(9, 3), 3);
  });

  test("throws on division by zero", () => {
    assert.throws(() => divide(10, 0), { message: "Division by zero" });
  });
});

// ===================================
// Run Tests
// ===================================
// node --test tests/math.test.js
// or
// node --test tests/**/*.test.js
```

```bash
# Run all tests
node --test

# Run specific file
node --test tests/user.test.js

# Run with coverage
node --test --experimental-test-coverage

# Watch mode (Node 20+)
node --test --watch
```

---

## Example 2: Assertions (node:assert/strict)

```javascript
// tests/assertions.test.js
import { test } from "node:test";
import assert from "node:assert/strict";

test("assert.equal - strict equality (===)", () => {
  assert.equal(2 + 2, 4);
  assert.equal("hello", "hello");
});

test("assert.notEqual", () => {
  assert.notEqual(5, 10);
  assert.notEqual("foo", "bar");
});

test("assert.deepEqual - deep object comparison", () => {
  assert.deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
  assert.deepEqual([1, 2, 3], [1, 2, 3]);
});

test("assert.ok - truthy value", () => {
  assert.ok(true);
  assert.ok(1);
  assert.ok("string");
  assert.ok([]);
  assert.ok({});
});

test("assert.match - regex matching", () => {
  assert.match("hello world", /world/);
  assert.match("test@example.com", /^[\w.-]+@[\w.-]+\.\w+$/);
});

test("assert.throws - synchronous error", () => {
  function badFunction() {
    throw new Error("Something went wrong");
  }

  assert.throws(() => badFunction(), { message: "Something went wrong" });

  // With regex
  assert.throws(() => badFunction(), /went wrong/);
});

test("assert.rejects - async error", async () => {
  async function asyncBadFunction() {
    throw new Error("Async error");
  }

  await assert.rejects(() => asyncBadFunction(), { message: "Async error" });
});

test("assert.doesNotThrow", () => {
  assert.doesNotThrow(() => {
    const result = 2 + 2;
  });
});

test("assert.ifError - error is falsy", () => {
  assert.ifError(null); // Passes
  assert.ifError(undefined); // Passes
  // assert.ifError(new Error('fail'));  // Throws
});
```

---

## Example 3: Hooks (before, after, beforeEach, afterEach)

```javascript
// tests/user.service.test.js
import {
  test,
  describe,
  before,
  after,
  beforeEach,
  afterEach
} from "node:test";
import assert from "node:assert/strict";
import { sequelize } from "../db/sequelize.js";
import { User } from "../models/User.model.js";
import * as userService from "../services/user.service.js";

describe("User Service", () => {
  // ===================================
  // Setup & Teardown
  // ===================================

  // Runs ONCE before all tests
  before(async () => {
    console.log("Setting up database...");
    await sequelize.sync({ force: true }); // Reset DB
  });

  // Runs ONCE after all tests
  after(async () => {
    console.log("Cleaning up...");
    await sequelize.close();
  });

  // Runs BEFORE EACH test
  beforeEach(async () => {
    console.log("Clearing users table...");
    await User.destroy({ where: {}, truncate: true });
  });

  // Runs AFTER EACH test
  afterEach(() => {
    console.log("Test completed");
  });

  // ===================================
  // Tests
  // ===================================

  test("creates a user", async () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123"
    };

    const user = await userService.createUser(userData);

    assert.ok(user.id);
    assert.equal(user.name, "John Doe");
    assert.equal(user.email, "john@example.com");
  });

  test("finds user by email", async () => {
    await User.create({
      name: "Jane",
      email: "jane@example.com",
      password: "pass"
    });

    const user = await userService.findByEmail("jane@example.com");

    assert.ok(user);
    assert.equal(user.name, "Jane");
  });

  test("throws if user not found", async () => {
    await assert.rejects(() => userService.findById(999), {
      message: "User not found"
    });
  });
});
```

---

## Example 4: Mocking with node:test

```javascript
// tests/order.service.test.js
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import * as orderService from "../services/order.service.js";
import * as emailService from "../services/email.service.js";

test("sends confirmation email on order creation", async (t) => {
  // ===================================
  // Mock Function
  // ===================================
  const mockSendEmail = t.mock.fn(async (options) => {
    return { messageId: "mock-id-123" };
  });

  // Replace emailService.sendEmail with mock
  t.mock.method(emailService, "sendEmail", mockSendEmail);

  // Create order
  const order = await orderService.createOrder({
    userId: 1,
    items: [{ productId: 1, quantity: 2 }],
    total: 50
  });

  // ===================================
  // Verify Mock Was Called
  // ===================================
  assert.equal(mockSendEmail.mock.calls.length, 1);

  // Check call arguments
  const callArgs = mockSendEmail.mock.calls[0].arguments;
  assert.equal(callArgs[0].to, "user@example.com");
  assert.equal(callArgs[0].subject, "Order Confirmation");
  assert.match(callArgs[0].template, /order-created/);
});

test("retries on email failure", async (t) => {
  // ===================================
  // Mock with Different Return Values
  // ===================================
  let callCount = 0;

  const mockSendEmail = t.mock.fn(async () => {
    callCount++;
    if (callCount < 3) {
      throw new Error("Network error");
    }
    return { messageId: "success" };
  });

  t.mock.method(emailService, "sendEmail", mockSendEmail);

  await orderService.createOrder({
    /* ... */
  });

  // Should have retried 3 times
  assert.equal(mockSendEmail.mock.calls.length, 3);
});

// ===================================
// Mock Object Methods
// ===================================
test("mocks database query", async (t) => {
  const mockQuery = t.mock.fn(async (sql) => {
    return { rows: [{ id: 1, name: "Test" }] };
  });

  t.mock.method(db, "query", mockQuery);

  const result = await userService.getAllUsers();

  assert.equal(mockQuery.mock.calls.length, 1);
  assert.equal(result.length, 1);
});

// ===================================
// Restore Original Implementation
// ===================================
test("restores after mock", async (t) => {
  const original = emailService.sendEmail;

  t.mock.method(emailService, "sendEmail", async () => ({ sent: true }));

  // Use mock...

  // Restore happens automatically at end of test
  // Or manually:
  emailService.sendEmail = original;
});
```

---

## Example 5: Integration Tests (HTTP)

```javascript
// tests/auth.integration.test.js
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { app } from "../app.js";
import { sequelize } from "../db/sequelize.js";

let server;
let baseURL;

describe("Auth API Integration Tests", () => {
  before(async () => {
    // Start server
    await sequelize.sync({ force: true });
    server = app.listen(0); // Random available port
    const address = server.address();
    baseURL = `http://localhost:${address.port}`;
  });

  after(async () => {
    await server.close();
    await sequelize.close();
  });

  // ===================================
  // Test POST /auth/register
  // ===================================
  test("POST /auth/register - creates new user", async () => {
    const response = await fetch(`${baseURL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        password: "password123"
      })
    });

    assert.equal(response.status, 201);

    const data = await response.json();
    assert.ok(data.data.user.id);
    assert.equal(data.data.user.email, "test@example.com");
    assert.ok(data.data.accessToken);
  });

  test("POST /auth/register - rejects duplicate email", async () => {
    // First registration
    await fetch(`${baseURL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "User",
        email: "duplicate@example.com",
        password: "pass"
      })
    });

    // Duplicate registration
    const response = await fetch(`${baseURL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "User2",
        email: "duplicate@example.com",
        password: "pass"
      })
    });

    assert.equal(response.status, 409); // Conflict

    const data = await response.json();
    assert.match(data.error, /already/i);
  });

  // ===================================
  // Test POST /auth/login
  // ===================================
  test("POST /auth/login - authenticates user", async () => {
    // Register first
    await fetch(`${baseURL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Login Test",
        email: "login@example.com",
        password: "mypassword"
      })
    });

    // Login
    const response = await fetch(`${baseURL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "login@example.com",
        password: "mypassword"
      })
    });

    assert.equal(response.status, 200);

    const data = await response.json();
    assert.ok(data.data.accessToken);
  });

  test("POST /auth/login - rejects wrong password", async () => {
    const response = await fetch(`${baseURL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "login@example.com",
        password: "wrongpassword"
      })
    });

    assert.equal(response.status, 401);
  });

  // ===================================
  // Test Protected Route
  // ===================================
  test("GET /auth/me - requires authentication", async () => {
    const response = await fetch(`${baseURL}/auth/me`);

    assert.equal(response.status, 401);
  });

  test("GET /auth/me - returns user with valid token", async () => {
    // Login to get token
    const loginResponse = await fetch(`${baseURL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "login@example.com",
        password: "mypassword"
      })
    });

    const { data } = await loginResponse.json();
    const token = data.accessToken;

    // Access protected route
    const response = await fetch(`${baseURL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    assert.equal(response.status, 200);

    const userData = await response.json();
    assert.equal(userData.data.email, "login@example.com");
  });
});
```

---

## Example 6: Code Coverage with c8

```bash
# Install c8
npm install -D c8

# Run tests with coverage
npx c8 node --test

# With thresholds
npx c8 --check-coverage --lines 80 --functions 80 node --test

# Include all files
npx c8 --all node --test

# Output formats
npx c8 --reporter=html node --test  # HTML report
npx c8 --reporter=lcov node --test  # LCOV format

# Exclude files
npx c8 --exclude='tests/**' --exclude='**/*.test.js' node --test
```

```json
// package.json
{
  "scripts": {
    "test": "node --test",
    "test:coverage": "c8 --all --reporter=html --reporter=text node --test",
    "test:watch": "node --test --watch",
    "test:ci": "c8 --check-coverage --lines 80 --functions 80 --branches 75 node --test"
  }
}
```

---

## Example 7: Debugging Tests

```javascript
// tests/debug.test.js
import { test } from "node:test";
import assert from "node:assert/strict";

test("debugging example", () => {
  const user = {
    id: 1,
    name: "John",
    email: "john@example.com"
  };

  // Add breakpoint here (or use 'debugger;')
  debugger;

  assert.equal(user.name, "John");
});
```

```bash
# Debug tests with Chrome DevTools
node --inspect-brk --test tests/debug.test.js

# Then open chrome://inspect in Chrome browser
# Click "inspect" on the remote target

# VS Code: Add to launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "skipFiles": ["<node_internals>/**"],
  "program": "${workspaceFolder}/tests/debug.test.js",
  "args": ["--test"],
  "console": "integratedTerminal"
}
```

---

## Example 8: Logging with pino

```javascript
// utils/logger.js
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",

  // Pretty print in development
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,

  // Custom serializers
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: req.headers,
      remoteAddress: req.socket?.remoteAddress
    }),
    res: (res) => ({
      statusCode: res.statusCode
    }),
    err: pino.stdSerializers.err
  }
});

// ===================================
// Usage
// ===================================
import { logger } from "./utils/logger.js";

// Log levels: trace, debug, info, warn, error, fatal
logger.info("Server started");
logger.warn({ userId: 123 }, "User not found");
logger.error({ err: error }, "Database connection failed");

// Child logger with context
const reqLogger = logger.child({ requestId: "123-456" });
reqLogger.info("Processing request");
reqLogger.info("Request completed");
// Both logs will include requestId

// ===================================
// Express Middleware
// ===================================
import pinoHttp from "pino-http";

app.use(pinoHttp({ logger }));

// Automatically logs every request:
// {
//   "level": 30,
//   "req": { "method": "GET", "url": "/api/users" },
//   "res": { "statusCode": 200 },
//   "responseTime": 12,
//   "msg": "request completed"
// }

// ===================================
// AsyncLocalStorage Integration
// ===================================
import { AsyncLocalStorage } from "node:async_hooks";

const als = new AsyncLocalStorage();

app.use((req, res, next) => {
  const requestId = randomUUID();
  const store = { requestId, logger: logger.child({ requestId }) };
  als.run(store, next);
});

// In any function:
function logAction(action) {
  const store = als.getStore();
  store.logger.info({ action }, "User action");
  // Automatically includes requestId!
}
```

```bash
# Install pino
npm install pino pino-pretty pino-http

# Use in development
NODE_ENV=development node server.js

# Production (JSON logs)
NODE_ENV=production node server.js
```

---

## Example 9: ESLint Configuration

```javascript
// eslint.config.js (ESLint 9+, flat config)
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    },

    rules: {
      // Error prevention
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "off", // Allow console.log
      "no-debugger": "error",

      // Best practices
      eqeqeq: ["error", "always"], // Require ===
      curly: ["error", "all"], // Require braces
      "no-var": "error", // Use let/const
      "prefer-const": "error",

      // Style
      indent: ["error", 2],
      quotes: ["error", "single"],
      semi: ["error", "always"],
      "comma-dangle": ["error", "never"]
    }
  },

  {
    // Test files
    files: ["**/*.test.js"],
    rules: {
      "no-unused-expressions": "off"
    }
  }
];
```

```json
// package.json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "devDependencies": {
    "eslint": "^9.0.0",
    "globals": "^14.0.0"
  }
}
```

---

## Example 10: Complete Test Example

```javascript
// tests/complete.test.js
import { test, describe, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { app } from "../app.js";
import { sequelize } from "../db/sequelize.js";
import { User } from "../models/User.model.js";

let server;
let baseURL;

describe("Complete Application Tests", () => {
  // Setup
  before(async () => {
    await sequelize.sync({ force: true });
    server = app.listen(0);
    const address = server.address();
    baseURL = `http://localhost:${address.port}`;
  });

  // Teardown
  after(async () => {
    await server.close();
    await sequelize.close();
  });

  // Clean before each test
  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true });
  });

  // Tests
  describe("User Registration", () => {
    test("creates user with valid data", async () => {
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "John Doe",
          email: "john@example.com",
          password: "Password123!"
        })
      });

      assert.equal(response.status, 201);
      const data = await response.json();
      assert.ok(data.data.user.id);
    });

    test("rejects invalid email", async () => {
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test",
          email: "invalid-email",
          password: "pass"
        })
      });

      assert.equal(response.status, 422);
    });
  });

  describe("Authentication", () => {
    let authToken;

    beforeEach(async () => {
      // Register user
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Auth Test",
          email: "auth@example.com",
          password: "password123"
        })
      });

      const data = await response.json();
      authToken = data.data.accessToken;
    });

    test("accesses protected route with token", async () => {
      const response = await fetch(`${baseURL}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      assert.equal(response.status, 200);
    });

    test("rejects access without token", async () => {
      const response = await fetch(`${baseURL}/auth/me`);

      assert.equal(response.status, 401);
    });
  });
});
```

---

## Comparison Table: Testing Frameworks

| Framework     | Built-in       | Assertions      | Mocking          | Speed | Popularity |
| ------------- | -------------- | --------------- | ---------------- | ----- | ---------- |
| **node:test** | Yes (Node 18+) | node:assert     | Built-in         | Fast  | Growing    |
| **Jest**      | No             | Included        | Excellent        | Slow  | Very high  |
| **Vitest**    | No             | Included        | Excellent        | Fast  | High       |
| **Mocha**     | No             | Separate (Chai) | Separate (Sinon) | Fast  | High       |
| **AVA**       | No             | Included        | External         | Fast  | Medium     |

---

## Summary

Testing & Code Quality best practices:

1. **node:test** - Built-in test runner (Node 18+)
2. **Assertions** - Use node:assert/strict for type safety
3. **Hooks** - before/after/beforeEach for setup/teardown
4. **Mocking** - t.mock.fn() and t.mock.method() for dependencies
5. **Integration Tests** - Use fetch() to test HTTP endpoints
6. **Coverage** - c8 for code coverage analysis
7. **Debugging** - node --inspect-brk --test for breakpoints
8. **Logging** - pino for structured, fast logging
9. **Linting** - ESLint to catch errors before runtime
10. **CI/CD** - Run tests with coverage checks in pipelines

Write tests first, debug faster, ship with confidence!
