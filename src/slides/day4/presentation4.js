import { quiz_4_4 } from "../../data/quizzes/quiz_4_4.js";

export const slides = [
  {
    id: 1,
    type: "title",
    title: "Testing & Code Quality",
    subtitle: "node:test, Mocking, Integration Tests, c8, Logging, Debugging"
  },
  {
    id: 2,
    title: "Testing Pyramid",
    bullets: [
      "Unit Tests (70%): בדיקת פונקציות ו-services בבידוד",
      "Integration Tests (20%): בדיקת routes + controllers + DB",
      "E2E Tests (10%): בדיקת תרחישים מלאים מ-end to end",
      "כלל: מספר רב של unit tests מהירים, מעט E2E איטיים",
      "Testing = ביטחון בעת refactoring",
      "node:test (Node 18+) = built-in runner, ללא Jest/Mocha"
    ]
  },
  {
    id: 3,
    title: "node:test – מבנה בסיסי",
    code: `import { test, describe, before, after, beforeEach } from 'node:test';
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
});`
  },
  {
    id: 4,
    title: "Assertions עם node:assert",
    code: `import assert from 'node:assert/strict';

assert.equal(actual, expected);          // ===
assert.deepEqual(obj1, obj2);            // deep equality
assert.ok(value);                        // truthy
assert.throws(() => fn(), /Error msg/);  // זורק שגיאה
assert.rejects(asyncFn(), { code: 404 }); // async זורק
assert.match(string, /pattern/);         // regex match
assert.doesNotThrow(() => fn());         // לא זורק`,
    bullets: [
      "assert/strict = === לכל ההשוואות (עדיף על assert רגיל)",
      "assert.rejects = בדיקת async functions שזורקות"
    ]
  },
  {
    id: 5,
    title: "Mocking עם node:test",
    code: `import { mock, test } from 'node:test';
import assert from 'node:assert/strict';

test('sends email on user creation', async (t) => {
  // mock function
  const mockSendEmail = t.mock.fn(async () => ({ sent: true }));

  // mock method on object
  t.mock.method(emailService, 'send', mockSendEmail);

  await userService.createUser({ name: 'Alice' });

  assert.equal(mockSendEmail.mock.calls.length, 1);
  assert.equal(mockSendEmail.mock.calls[0].arguments[0].to, 'alice@test.com');
});`
  },
  {
    id: 6,
    title: "Integration Tests – HTTP",
    code: `// עדיף undici לבדיקות HTTP מהירות
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
});`
  },
  {
    id: 7,
    title: "Code Coverage עם c8",
    code: `npx c8 node --test src/**/*.test.js`,
    bullets: [
      "c8 משתמש בכיסוי מובנה של V8 – מדויק ומהיר",
      "--all → כלול קבצים ללא בדיקות בדוח",
      "--check-coverage --lines 80 → בדיקה כושלת אם מתחת ל-80%",
      "כיסוי קוד = מדד, לא מטרה בפני עצמה"
    ],
    code2: `File          | % Stmts | % Branch | % Funcs | % Lines
src/services  |   95.2  |   88.4   |  100.0  |   95.2
src/routes    |   87.3  |   75.0   |   90.9  |   87.3`
  },
  {
    id: 8,
    title: "Debugging עם node --inspect",
    code: `node --inspect server.js         # מאזין על 9229
node --inspect-brk server.js     # עוצר בשורה ראשונה`,
    bullets: [
      "פתח chrome://inspect בדפדפן Chrome",
      "Breakpoints: הצב ישירות בקוד (debugger;) או ב-DevTools",
      "Watch Expressions: מעקב אחרי משתנים בזמן אמת",
      "Call Stack: ראה את כל שרשרת הקריאות",
      'VS Code: Launch configuration עם "request": "attach"',
      "node --inspect-brk --test לdebugging בדיקות"
    ]
  },
  {
    id: 9,
    title: "Logging עם pino (מועדף ב-2026)",
    code: `import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty' }
    : undefined
});

logger.info({ userId: '123', action: 'login' }, 'User logged in');
logger.error({ err, requestId }, 'Failed to create order');`,
    bullets: [
      "pino = הלוגר המהיר ביותר ל-Node.js",
      "פלט JSON – קל לניתוח אוטומטי ב-ELK/Datadog",
      "pino-pretty לפיתוח, JSON נקי לייצור"
    ]
  },
  {
    id: 10,
    title: "pino עם AsyncLocalStorage",
    code: `// logger עם context אוטומטי:
function createRequestLogger() {
  const ctx = requestContext.getStore() ?? {};
  return logger.child(ctx); // מוסיף requestId לכל הודעה
}

// בכל service/controller:
const log = createRequestLogger();
log.info('Processing order'); // → { requestId: '...', msg: 'Processing order' }`,
    bullets: [
      "Structured logging = כל הודעה עם context מלא",
      "logger.child({ service: 'auth' }) → prefix לכל הודעות השירות",
      "רמות: trace, debug, info, warn, error, fatal"
    ]
  },
  {
    id: 11,
    title: "אסטרטגיות בדיקה מומלצות",
    bullets: [
      "כתוב unit tests לכל service function",
      "כתוב integration tests לנתיבי API מרכזיים",
      "השתמש ב-mocking רק לבידוד אמיתי (external services, email, SMS)",
      "הרץ בדיקות כחלק מ-CI/CD – pull request לא עובר ללא בדיקות ירוקות",
      "TDD (אופציונלי): כתוב בדיקות לפני הקוד",
      "בדיקות = documentation חיה של ה-API"
    ]
  },
  {
    id: 12,
    title: "CI/CD Pipeline בסיסי",
    code: `# .github/workflows/test.yml
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
      - run: npx c8 check-coverage --lines 80`,
    bullets: [
      "npm ci (לא npm install) בـ CI = מהיר + מחויב ל-lock file",
      "בדיקות ירוקות = precondition ל-merge"
    ]
  },
  {
    id: 13,
    title: "סיכום – יום 4 מצגת 16",
    bullets: [
      "node:test + assert/strict = testing מובנה ללא תלויות חיצוניות",
      "before/after/beforeEach לניהול סביבת בדיקה",
      "Mocking מבודד components; Integration tests בודקים שכבות יחד",
      "c8 מודד כיסוי קוד עם V8 built-in",
      "pino = הלוגר המהיר ב-2026; JSON output + child loggers",
      "node --inspect + Chrome DevTools = debugging מקצועי"
    ]
  }
];
