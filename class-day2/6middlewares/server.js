// ╔══════════════════════════════════════════════╗
//   LESSON 5 — WHAT IS MIDDLEWARE?
//   Run: npm start   →  then open http://localhost:3000
// ╚══════════════════════════════════════════════╝

import express from 'express';

const app = express();

// ══════════════════════════════════════════════════
//  WHAT IS MIDDLEWARE?
//
//  A middleware is just a function with 3 arguments:
//    (req, res, next)
//
//  Request travels through each middleware in order:
//
//  REQUEST
//    ↓
//  middleware 1  (logger)
//    ↓
//  middleware 2  (counter)
//    ↓
//  middleware 3  (checker)
//    ↓
//  route handler  → RESPONSE
// ══════════════════════════════════════════════════

let requestCount = 0;

// ── Middleware 1: Logger ──────────────────────────
function logger(req, res, next) {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}]  ${req.method}  ${req.url}`);
  next(); // pass to next middleware
}

// ── Middleware 2: Counter ─────────────────────────
function counter(req, res, next) {
  requestCount++;
  console.log(`  Total requests so far: ${requestCount}`);
  next(); // pass to next middleware
}

// ── Middleware 3: Protocol Checker ────────────────
function protocolChecker(req, res, next) {
  const protocol = req.protocol;        // http or https
  console.log(`  Protocol: ${protocol}`);

  if (protocol === 'https') {
    console.log('  Secure connection!');
  } else {
    console.log('  Not secure (http)');
  }
  next(); // pass to route handler
}

// ── Register middlewares (order matters!) ─────────
app.use(logger);
app.use(counter);
app.use(protocolChecker);

// ── Routes ────────────────────────────────────────
app.get('/', function(req, res) {
  res.send(`
    <h1>Middleware Demo</h1>
    <p>Requests so far: <strong>${requestCount}</strong></p>
    <p>Check your terminal to see the middleware chain running!</p>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/users">Users</a></li>
    </ul>
  `);
});

app.get('/about', function(req, res) {
  res.send('<h1>About Page</h1><a href="/">Back</a>');
});

app.get('/users', function(req, res) {
  res.json({ users: ['Alice', 'Bob', 'Charlie'] });
});

// ── Start server ──────────────────────────────────
app.listen(3000, function() {
  console.log('\nServer running at http://localhost:3000');
  console.log('Open the URL and refresh a few times');
  console.log('Watch the middleware chain fire for each request\n');
});
