// ══════════════════════════════════════════════════
//  MIDDLEWARE 10 — ERROR HANDLER
//  Catches all errors thrown in any route
//  Express error middleware has 4 args: (err, req, res, next)
//  Run: npm run errors  →  http://localhost:3011
// ══════════════════════════════════════════════════

import express from 'express';

const app = express();

// ── WITHOUT error handler ─────────────────────────
// Any thrown error crashes the request with an ugly HTML page
// The user sees "Cannot GET /..." or a stack trace

// ── WITH error handler ────────────────────────────
// One function catches ALL errors from ALL routes
// You return a clean JSON response every time

// ── Routes that throw errors ──────────────────────
app.get('/crash', function(req, res) {
  throw new Error('Something went wrong in /crash!');
});

app.get('/not-found', function(req, res) {
  const err = new Error('Resource not found');
  err.status = 404;
  throw err;
});

app.get('/forbidden', function(req, res) {
  const err = new Error('You are not allowed here');
  err.status = 403;
  throw err;
});

app.get('/async-crash', async function(req, res, next) {
  try {
    await Promise.reject(new Error('Async route crashed!'));
  } catch (err) {
    next(err); // pass async errors to the error handler
  }
});

app.get('/', function(req, res) {
  res.send(`
    <h2>Error Handler Middleware</h2>
    <p>Try these routes — all errors are caught cleanly:</p>
    <ul>
      <li><a href="/crash">/crash</a>        — throws a plain error</li>
      <li><a href="/not-found">/not-found</a> — 404 error</li>
      <li><a href="/forbidden">/forbidden</a> — 403 error</li>
      <li><a href="/async-crash">/async-crash</a> — async error</li>
    </ul>
  `);
});

// ── Error handler middleware ──────────────────────
// MUST have 4 parameters — Express detects it by the 4th arg
function errorHandler(err, req, res, next) {
  const status  = err.status ?? 500;
  const message = err.message ?? 'Internal Server Error';

  console.log(`[ERROR] ${status} — ${message}`);

  res.status(status).json({
    error:   true,
    status:  status,
    message: message,
  });
}

// ── Must be LAST app.use() ────────────────────────
app.use(errorHandler);

app.listen(3011, function() {
  console.log('Error handler demo at http://localhost:3011');
  console.log('Try /crash  /not-found  /forbidden  /async-crash\n');
});
