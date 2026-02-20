# יום 4 – מצגת 16: Testing & Code Quality

---

## שקף 1
**כותרת ראשית:** Testing & Code Quality
**כותרת משנה:** node:test, Mocking, Integration Tests, c8, Logging, Debugging

---

## שקף 2
**כותרת ראשית:** Testing Pyramid
- **Unit Tests** (70%): בדיקת פונקציות ו-services בבידוד
- **Integration Tests** (20%): בדיקת routes + controllers + DB
- **E2E Tests** (10%): בדיקת תרחישים מלאים מ-end to end
- **כלל**: מספר רב של unit tests מהירים, מעט E2E איטיים
- Testing = ביטחון בעת refactoring
- **node:test** (Node 18+) = built-in runner, ללא Jest/Mocha

---

## שקף 3
**כותרת ראשית:** node:test – מבנה בסיסי
```js
import { test, describe, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import * as userService from '../src/services/user.service.js';

describe('User Service', () => {
  before(async () => { /* connect DB */ });
  after(async () => { /* disconnect DB */ });
  beforeEach(() => { /* clear test data */ });

  test('should create a user', async () => {
    const user = await userService.createUser({ name: 'Test', email: 'test@test.com' });
    assert.equal(user.name, 'Test');
    assert.ok(user.id);
  });
});
```

---

## שקף 4
**כותרת ראשית:** Assertions עם node:assert
```js
import assert from 'node:assert/strict';

assert.equal(actual, expected);          // ===
assert.deepEqual(obj1, obj2);            // deep equality
assert.ok(value);                        // truthy
assert.throws(() => fn(), /Error msg/);  // זורק שגיאה
assert.rejects(asyncFn(), { code: 404 }); // async זורק
assert.match(string, /pattern/);         // regex match
assert.doesNotThrow(() => fn());         // לא זורק
```
- `assert/strict` = `===` לכל ההשוואות (עדיף על `assert` רגיל)
- `assert.rejects` = בדיקת async functions שזורקות

---

## שקף 5
**כותרת ראשית:** Mocking עם node:test
```js
import { mock, test } from 'node:test';
import assert from 'node:assert/strict';

test('sends email on user creation', async (t) => {
  // mock function
  const mockSendEmail = t.mock.fn(async () => ({ sent: true }));

  // mock method on object
  t.mock.method(emailService, 'send', mockSendEmail);

  await userService.createUser({ name: 'Alice' });

  assert.equal(mockSendEmail.mock.calls.length, 1);
  assert.equal(mockSendEmail.mock.calls[0].arguments[0].to, 'alice@test.com');
});
```

---

## שקף 6
**כותרת ראשית:** Integration Tests – HTTP
```js
// עדיף undici לבדיקות HTTP מהירות
import { fetch } from 'undici';
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('POST /api/users creates user', async () => {
  const res = await fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email: 'test@test.com' })
  });
  assert.equal(res.status, 201);
  const data = await res.json();
  assert.ok(data.data.id);
});
```

---

## שקף 7
**כותרת ראשית:** Code Coverage עם c8
```bash
npx c8 node --test src/**/*.test.js
```
```
File          | % Stmts | % Branch | % Funcs | % Lines
src/services  |   95.2  |   88.4   |  100.0  |   95.2
src/routes    |   87.3  |   75.0   |   90.9  |   87.3
```
- `c8` משתמש בכיסוי מובנה של V8 – מדויק ומהיר
- `--all` → כלול קבצים ללא בדיקות בדוח
- `--check-coverage --lines 80` → בדיקה כושלת אם מתחת ל-80%
- כיסוי קוד = **מדד**, לא מטרה בפני עצמה

---

## שקף 8
**כותרת ראשית:** Debugging עם node --inspect
```bash
node --inspect server.js         # מאזין על 9229
node --inspect-brk server.js     # עוצר בשורה ראשונה
```
- פתח `chrome://inspect` בדפדפן Chrome
- **Breakpoints**: הצב ישירות בקוד (`debugger;`) או ב-DevTools
- **Watch Expressions**: מעקב אחרי משתנים בזמן אמת
- **Call Stack**: ראה את כל שרשרת הקריאות
- **VS Code**: Launch configuration עם `"request": "attach"`
- `node --inspect-brk --test` לdebugging בדיקות

---

## שקף 9
**כותרת ראשית:** Logging עם pino (מועדף ב-2026)
```js
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty' }
    : undefined
});

logger.info({ userId: '123', action: 'login' }, 'User logged in');
logger.error({ err, requestId }, 'Failed to create order');
```
- **pino** = הלוגר המהיר ביותר ל-Node.js
- פלט JSON – קל לניתוח אוטומטי ב-ELK/Datadog
- **pino-pretty** לפיתוח, JSON נקי לייצור

---

## שקף 10
**כותרת ראשית:** pino עם AsyncLocalStorage
```js
// logger עם context אוטומטי:
function createRequestLogger() {
  const ctx = requestContext.getStore() ?? {};
  return logger.child(ctx); // מוסיף requestId לכל הודעה
}

// בכל service/controller:
const log = createRequestLogger();
log.info('Processing order'); // → { requestId: '...', msg: 'Processing order' }
```
- **Structured logging** = כל הודעה עם context מלא
- `logger.child({ service: 'auth' })` → prefix לכל הודעות השירות
- רמות: `trace`, `debug`, `info`, `warn`, `error`, `fatal`

---

## שקף 11
**כותרת ראשית:** אסטרטגיות בדיקה מומלצות
- כתוב **unit tests** לכל service function
- כתוב **integration tests** לנתיבי API מרכזיים
- השתמש ב-**mocking** רק לבידוד אמיתי (external services, email, SMS)
- הרץ בדיקות כחלק מ-**CI/CD** – pull request לא עובר ללא בדיקות ירוקות
- **TDD** (אופציונלי): כתוב בדיקות לפני הקוד
- בדיקות = **documentation** חיה של ה-API

---

## שקף 12
**כותרת ראשית:** CI/CD Pipeline בסיסי
```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run lint
      - run: npx c8 node --test
      - run: npx c8 check-coverage --lines 80
```
- `npm ci` (לא `npm install`) בـ CI = מהיר + מחויב ל-lock file
- בדיקות ירוקות = precondition ל-merge

---

## שקף 13
**כותרת ראשית:** סיכום – יום 4 מצגת 16
- `node:test` + `assert/strict` = testing מובנה ללא תלויות חיצוניות
- `before`/`after`/`beforeEach` לניהול סביבת בדיקה
- Mocking מבודד components; Integration tests בודקים שכבות יחד
- `c8` מודד כיסוי קוד עם V8 built-in
- `pino` = הלוגר המהיר ב-2026; JSON output + child loggers
- `node --inspect` + Chrome DevTools = debugging מקצועי
