# מדריך למרצה – יום 4 מצגת 16: Testing & Code Quality

**זמן:** 13:00–14:30
**מטרה:** כתיבת בדיקות unit ואינטגרציה ל-API

---

## שקף 1 – פתיחה

זהו השיעור האחרון של הקורס. בנינו API מלא עם Auth, Security, WebSocket ו-Crypto. עכשיו נלמד איך לוודא שהוא אכן עובד כמצופה — ולאורך זמן.

**מה נלמד:**
- Testing Pyramid — מבנה נכון של בדיקות
- node:test — מודול בדיקות מובנה ב-Node.js (ללא צורך ב-Jest)
- Assertions — assert.equal, assert.rejects, assert.deepEqual
- Mocking — בידוד יחידות בלי תלויות חיצוניות
- Integration Tests — בדיקת API endpoint מלא עם fetch
- Coverage עם c8 — כמה % מהקוד בודקים
- Debugging — node --inspect
- pino — Structured logging לפרודקשן
- CI/CD — GitHub Actions

**למה בדיקות?**

| בלי בדיקות | עם בדיקות |
|-----------|----------|
| Bug ב-production | Bug נתפס ב-CI |
| פחד לשנות קוד | Refactor בביטחון |
| Debug ידני | הבדיקה מראה היכן הכשל |
| ריגרסיות חוזרות | ריגרסיה נתפסת מיד |

**node:test vs Jest:**
- `node:test` — מובנה ב-Node.js 18+, אפס תלויות
- `Jest` — ecosystem עשיר, snapshot testing, watch mode
- **לפרויקט חדש ב-2026:** `node:test` מספיק לרוב הצרכים

---

## שקף 2 – Testing Pyramid

\*\*הפירמידה:

```
        /\
       /E2E\
      /──────\
     /Integr. \
    /────────────\
   /   Unit Tests  \
  /──────────────────\
```

Unit tests = מהירים, הרבה. E2E = איטיים, מעט. הפירמידה מציגה יחס נכון.

---

## שקף 3 – node:test

**דוגמת `tests/task.service.test.js`:**

```js
import { test, describe, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { Task } from "../src/models/task.model.js";
import * as taskService from "../src/services/tasks.service.js";

const TEST_USER_ID = new mongoose.Types.ObjectId();

describe("Task Service", () => {
  before(async () => {
    await mongoose.connect(
      process.env.MONGODB_URI_TEST ?? "mongodb://localhost:27017/test_db"
    );
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  test("should create a task", async () => {
    const task = await taskService.create(
      { title: "Test Task" },
      TEST_USER_ID.toString()
    );
    assert.equal(task.title, "Test Task");
    assert.equal(task.status, "todo");
    assert.ok(task._id);
  });

  test("should throw 404 for non-existent task", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await assert.rejects(
      () => taskService.findById(fakeId, TEST_USER_ID.toString()),
      { message: "Task not found" }
    );
  });
});
```

**הרצה:**

```bash
node --test tests/task.service.test.js
```

---

## שקף 4 – Assertions

**דוגמאות:**

```js
assert.equal(1 + 1, 2);
assert.deepEqual({ a: 1 }, { a: 1 });
assert.ok(true);
assert.throws(() => JSON.parse("invalid"), SyntaxError);
assert.match("hello world", /world/);

// Async
await assert.rejects(
  async () => {
    throw new Error("oops");
  },
  { message: "oops" }
);
```

---

## שקף 5 – Mocking

**דוגמת mock email service:**

```js
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import * as emailService from "../src/services/email.service.js";
import { UserService } from "../src/services/user.service.js";

test("sends welcome email on user creation", async (t) => {
  // Mock the email service
  const sendEmailMock = t.mock.method(emailService, "sendWelcome", async () => {
    return { sent: true };
  });

  const userService = new UserService(emailService);
  await userService.register({ name: "Alice", email: "alice@test.com" });

  assert.equal(sendEmailMock.mock.calls.length, 1);
  assert.equal(sendEmailMock.mock.calls[0].arguments[0], "alice@test.com");
});
```

Mocking מאפשר בידוד – בודקים `userService.register` מבלי תלות ב-email server אמיתי.

---

## שקף 6 – Integration Tests

**דוגמה:**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { fetch } from "undici";

test("POST /api/tasks creates a task", async () => {
  // 1. Login first
  const loginRes = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test@test.com", password: "test123" })
  });
  const { accessToken } = await loginRes.json();

  // 2. Create task
  const res = await fetch("http://localhost:3000/api/v1/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({ title: "My Task", priority: "high" })
  });

  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.data.title, "My Task");
});
```

---

## שקף 7 – Coverage עם c8

**דוגמה:**

```bash
npx c8 node --test tests/**/*.test.js

# Output:
File              | % Stmts | % Branch | % Funcs | % Lines
src/services      |   95.2  |   88.4   |  100.0  |   95.2
```

Coverage הוא מדד. 80% = טוב לרוב. אין לרדוף אחרי 100% – זה בזבוז זמן.

```bash
# עם threshold
npx c8 --lines 80 --branches 70 node --test
```

---

## שקף 8 – Debugging

**דוגמה:**

```bash
node --inspect --test tests/task.service.test.js
# פתח chrome://inspect
```

**נקודות breakpoint:**

1. בתוך service function
2. לפני throw AppError
3. בתוך validation

---

## שקף 9 – pino Logging

**דוגמה:**

```js
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined
});

// בservice
logger.info({ taskId: task._id, userId }, "Task created");
logger.error({ err, requestId }, "Failed to process task");

// child logger עם context
const reqLogger = logger.child({ requestId: "abc-123" });
reqLogger.info("Processing request"); // → { requestId: 'abc-123', ... }
```

---

## שקף 12 – CI/CD

הצגת GitHub Actions workflow: בכל PR – ESLint + Tests + Coverage check. PR לא ממוזג בלי ירוק.

---

## סיכום

מצגת זו סיקרה:

- Testing Pyramid
- node:test ל-unit tests
- Assertions ו-mocking
- Integration tests
- Coverage עם c8
- Debugging
- pino logging
- CI/CD

**הערות:**

- node:test vs Jest: node:test מובנה = zero dependencies. לפרויקט חדש = node:test
- Mock vs Spy: `t.mock.fn` = פונקציה חדשה; `t.mock.method` = מחליף method קיים

---

## Preview לפרויקט מסכם

אחרי ה-break: פרויקט מסכם. API מלא עם כל המרכיבים שנלמדו:

```
✅ Express 5
✅ MongoDB + Mongoose
✅ Auth Access+Refresh
✅ Rate Limiting
✅ Logging (pino)
✅ Tests (node:test)
✅ WebSocket endpoint
✅ Swagger docs
✅ Clean Architecture
```
