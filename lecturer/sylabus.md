📅 יום 1 – Modern Node Runtime + Async + HTTP Foundations

פוקוס: להבין איך Node באמת עובד

09:00–10:30
📘 מצגת 1 – Modern Node.js Runtime 2026

עדכון תוכן:

V8 + libuv (עמוק יותר, תרשים Event Loop phases)

Event Loop phases (timers, poll, check, close)

Thread pool (UV_THREADPOOL_SIZE)

I/O Non-blocking

process object (env, argv, exit codes)

built-in fetch (undici based)

AbortController / AbortSignal

node --watch

node --env-file

node:test built-in mention (טעימה)

try / catch / finally לניקוי משאבים

הוספה:

Microtasks queue vs macrotasks

setImmediate vs setTimeout

10:45–12:00
📘 מצגת 2 – Async Patterns & Control Flow (מודרני)

עדכון:

Callback (5 דקות היסטוריה בלבד)

Promise

async/await

Promise.all / allSettled / race

Error propagation patterns

finally מעשי

Async Iterators (for await)

AbortSignal כ-flow control

Cancellation patterns

הורדה:

Generators עמוק (עובר ליום 4)

13:00–14:30
📘 מצגת 3 – File System & Streams (Modern APIs)

עדכון:

fs/promises

stream/promises + pipeline

WHATWG Streams overview

Async iteration על streams

Backpressure

Error handling נכון

File uploads handling concept

הוספה:

Performance implications of streams vs buffer

14:45–16:30
📘 מצגת 4 – HTTP Fundamentals + WebHooks

עדכון:

http.createServer

Headers

Status codes best practice

WHATWG URL

Streaming response

AbortSignal ב-request

WebHook concept (כאן מציגים ראשון)

idempotency

Retry logic concept

📅 יום 2 – Express 5 + REST API Design

פוקוס: בניית API מקצועי

09:00–10:45
📘 מצגת 5 – Modules, NPM & Backend Architecture

עדכון:

ESM only (לא מלמדים CommonJS כברירת מחדל)

exports field

engines

dotenv

env per environment

ESLint + Prettier

Structure:

routes/

controllers/

services/

middleware/

config/

הוספה:

Layered architecture

Clean error boundaries

11:00–12:30
📘 מצגת 6 – Express 5 Deep Dive

עדכון:

Express 5 (promise aware)

Routing patterns

Controllers separation

Middleware chain deep explanation

express.json()

Validation (Zod עדיף על Joi 2026)

Central error handler

problem+json

13:30–14:45
📘 REST API Design Modern

(פיצול ממצגת 6 למצגת עצמאית)

Resource naming

Status codes philosophy

Filtering / Sorting

Cursor Pagination concept

HATEOAS (סקירה)

Versioning

OpenAPI / Swagger

API documentation discipline

15:00–16:30
סדנה מעשית

בניית mini API מלא:

CRUD

Validation

Error handling

Swagger

📅 יום 3 – Data + Authentication + Security

פוקוס: שכבת נתונים + הגנה אמיתית

09:00–10:30
📘 מצגת 7 – MongoDB + Mongoose v7

עדכון:

Schema design strategy

Validation

Index strategy

lean() performance

populate performance caveats

Aggregation intro

Cursor pagination

N+1 problem

10:45–12:00
📘 מצגת 8 – SQL with Sequelize (מקוצר)

שומרים כי ביקשת אבל:

Basic setup

Models

Relations

Transactions

SQL injection prevention

Query replacements

Migration concept

(לא נכנסים לעומק — רק השוואה מול Mongo)

13:00–14:45
📘 מצגת 9 – Authentication & Authorization 2026

עדכון עמוק:

Stateful vs Stateless

JWT anatomy

Access + Refresh

Rotation strategy

Blacklist strategy

Token expiration design

Password hashing (argon2 עדיף)

OAuth2 + OIDC overview

Threat modeling בסיסי

15:00–16:30
📘 Security Deep Dive

helmet

cors

Rate limiting

Sanitization

OWASP API Top 10

Secrets management

dotenv pitfalls

CSRF vs JWT

Security headers analysis

📅 יום 4 – Advanced + Real-Time + Testing + Project
09:00–10:15
📘 מצגת 10 – WebSocket (ws)

עדכון:

Protocol basics

Handshake

Lifecycle

Broadcast

Private messaging

Ping/Pong

Handling disconnects

Scaling concerns

10:30–11:15
📘 Crypto in Node

(נפרד מתוך מצגת 9)

crypto module

Hash

HMAC

randomBytes

Symmetric vs Asymmetric

When NOT to write crypto yourself

11:15–12:00
📘 Advanced Node Topics

מעודכן ורלוונטי:

AsyncLocalStorage (practical example – request ID)

EventEmitter patterns

worker_threads (CPU tasks)

Memory leaks patterns

Performance profiling intro

13:00–14:30
📘 Testing & Code Quality

עדכון:

node:test

before / after

mocking patterns

Integration tests (undici עדיף)

c8 coverage

Logging (pino עדיף על winston)

Debugging:

node --inspect

Chrome DevTools

profiler basics

14:45–16:30
פרויקט מסכם

בניית API מלא:

כולל:

Express

Mongo

Auth Access+Refresh

Rate limit

Logging

Tests

WebSocket endpoint

Swagger

מבנה:

Clean architecture

Proper middleware layering

Production ready mindset

🔥 מה הורדתי / צמצמתי

Generators עמוק

Docker deployment עמוק

Cluster mode

PM2 לעומק

Low level crypto advanced

Advanced performance tuning

(כי 4 ימים זה זמן מוגבל)

🎓 תוצאה פדגוגית

יום 1 – איך Node עובד
יום 2 – איך בונים API מקצועי
יום 3 – איך שומרים עליו
יום 4 – איך עושים אותו Production Grade
