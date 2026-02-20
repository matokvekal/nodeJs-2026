# מדריך למרצה – יום 4 מצגת 16: Testing & Code Quality

**זמן:** 13:00–14:30 (90 דקות)
**מטרה:** התלמידים יכתבו בדיקות unit ואינטגרציה לAPI שלהם

---

## הכנה מראש
- ודא שיש Node.js 18+ (node:test מובנה)
- הכן test files מוכנים להדגמה
- הצג את CI/CD workflow ב-GitHub (אם אפשר)

---

## שקף 2 – Testing Pyramid (5 דקות)
**ציור:**
```
        /\
       /E2E\
      /──────\
     /Integr. \
    /────────────\
   /   Unit Tests  \
  /──────────────────\
```

**מה להגיד:**
> "Unit tests = מהירים, הרבה. E2E = איטיים, מעט. הפירמידה = יחס נכון."

---

## שקף 3 – node:test (12 דקות)
**Live coding – `tests/task.service.test.js`:**
```js
import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { Task } from '../src/models/task.model.js';
import * as taskService from '../src/services/tasks.service.js';

const TEST_USER_ID = new mongoose.Types.ObjectId();

describe('Task Service', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST ?? 'mongodb://localhost:27017/test_db');
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  test('should create a task', async () => {
    const task = await taskService.create({ title: 'Test Task' }, TEST_USER_ID.toString());
    assert.equal(task.title, 'Test Task');
    assert.equal(task.status, 'todo');
    assert.ok(task._id);
  });

  test('should throw 404 for non-existent task', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await assert.rejects(
      () => taskService.findById(fakeId, TEST_USER_ID.toString()),
      { message: 'Task not found' }
    );
  });
});
```

**הרץ:**
```bash
node --test tests/task.service.test.js
```

---

## שקף 4 – Assertions (8 דקות)
**Demo כל assertion:**
```js
assert.equal(1 + 1, 2);
assert.deepEqual({ a: 1 }, { a: 1 });
assert.ok(true);
assert.throws(() => JSON.parse('invalid'), SyntaxError);
assert.match('hello world', /world/);

// Async
await assert.rejects(
  async () => { throw new Error('oops'); },
  { message: 'oops' }
);
```

---

## שקף 5 – Mocking (12 דקות)
**Live demo – mock email service:**
```js
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import * as emailService from '../src/services/email.service.js';
import { UserService } from '../src/services/user.service.js';

test('sends welcome email on user creation', async (t) => {
  // Mock the email service
  const sendEmailMock = t.mock.method(emailService, 'sendWelcome', async () => {
    return { sent: true };
  });

  const userService = new UserService(emailService);
  await userService.register({ name: 'Alice', email: 'alice@test.com' });

  assert.equal(sendEmailMock.mock.calls.length, 1);
  assert.equal(sendEmailMock.mock.calls[0].arguments[0], 'alice@test.com');
});
```

**מה להגיד:**
> "Mocking = בידוד. אנחנו בודקים `userService.register` – לא שלch email server פועל."

---

## שקף 6 – Integration Tests (10 דקות)
**Live demo:**
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetch } from 'undici';

test('POST /api/tasks creates a task', async () => {
  // 1. Login first
  const loginRes = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@test.com', password: 'test123' })
  });
  const { accessToken } = await loginRes.json();

  // 2. Create task
  const res = await fetch('http://localhost:3000/api/v1/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ title: 'My Task', priority: 'high' })
  });

  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.data.title, 'My Task');
});
```

---

## שקף 7 – Coverage עם c8 (8 דקות)
**Live demo:**
```bash
npx c8 node --test tests/**/*.test.js

# Output:
File              | % Stmts | % Branch | % Funcs | % Lines
src/services      |   95.2  |   88.4   |  100.0  |   95.2
```

**מה להגיד:**
> "Coverage = מדד. 80% = טוב לרוב. לא לרדוף אחרי 100% – זה בזבוז זמן."

```bash
# עם threshold
npx c8 --lines 80 --branches 70 node --test
```

---

## שקף 8 – Debugging (8 דקות)
**Live demo:**
```bash
node --inspect --test tests/task.service.test.js
# פתח chrome://inspect
```

**נקודות breakpoint:**
1. בתוך service function
2. לפני throw AppError
3. בתוך validation

---

## שקף 9 – pino Logging (8 דקות)
**Live coding:**
```js
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined
});

// בservice
logger.info({ taskId: task._id, userId }, 'Task created');
logger.error({ err, requestId }, 'Failed to process task');

// child logger עם context
const reqLogger = logger.child({ requestId: 'abc-123' });
reqLogger.info('Processing request'); // → { requestId: 'abc-123', ... }
```

---

## שקף 12 – CI/CD (5 דקות)
**הצג את ה-GitHub Actions workflow מהמצגת:**
> "בכל PR: ESLint + Tests + Coverage check. PR לא ממוזג בלי ירוק."

---

## הערות מרצה
- **node:test vs Jest**: "Jest פופולרי, אבל node:test מובנה – zero dependencies. לפרויקט חדש = node:test"
- **אחרי המצגת**: פרויקט מסכם 14:45–16:30 – הכן template repo
- **Mock vs Spy**: "t.mock.fn = פונקציה חדשה; t.mock.method = מחליף method קיים"

---

## Preview לפרויקט מסכם (5 דקות)
**מה להגיד:**
> "אחרי ה-break: פרויקט מסכם. API מלא עם Express + MongoDB + Auth + Rate Limiting + Logging + Tests + WebSocket endpoint + Swagger."

**הציג את הרשימה מהסילבוס:**
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
