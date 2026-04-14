// ══════════════════════════════════════════════════
//  MIDDLEWARE 01 — LOGGER
//  Logs every request: method, url, status, time
//  Run: npm run logger  →  http://localhost:3001
// ══════════════════════════════════════════════════

import express from 'express';

const app = express();

// ── WITHOUT logger middleware ─────────────────────
// You would have NO idea what requests come in.
// No logs, no info. Blind server.

// ── WITH logger middleware ────────────────────────
function logger(req, res, next) {
  const start = Date.now();

  // When the response finishes, log the details
  res.on('finish', function() {
    const duration = Date.now() - start;
    console.log(`${req.method}  ${req.url}  →  ${res.statusCode}  (${duration}ms)`);
  });

  next();
}

app.use(logger);

// Routes
app.get('/', function(req, res) {
  res.send('Home page');
});

app.get('/users', function(req, res) {
  res.json(['Alice', 'Bob', 'Charlie']);
});

app.get('/slow', function(req, res) {
  setTimeout(function() {
    res.send('This was slow!');
  }, 1500);
});

app.listen(3001, function() {
  console.log('Logger demo running at http://localhost:3001');
  console.log('Try: /   /users   /slow\n');
});
