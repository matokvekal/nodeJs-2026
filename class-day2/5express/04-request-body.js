// ══════════════════════════════════════════════════
//  EXPRESS 04 — Request Object (req)
//  req.body / req.params / req.query / req.headers
//  Run: npm run body  →  http://localhost:3003
// ══════════════════════════════════════════════════

import express from 'express';

const app = express();

// Parse JSON body — must come BEFORE routes that use req.body
app.use(express.json());

// ── req.body ──────────────────────────────────────
// Data sent by client in the request body (POST/PUT)

app.post('/create-user', function(req, res) {
  console.log('req.body :', req.body);

  const { name, email, age } = req.body;
  res.status(201).json({
    message: 'User created!',
    user: { id: Date.now(), name, email, age },
  });
});

// ── req.params ────────────────────────────────────
// Variables in the URL path  /users/:id

app.put('/users/:id', function(req, res) {
  console.log('req.params :', req.params);
  console.log('req.body   :', req.body);

  res.json({
    message:    `Updated user ${req.params.id}`,
    updatedWith: req.body,
  });
});

app.delete('/users/:id', function(req, res) {
  console.log('DELETE user id:', req.params.id);
  res.json({ message: `Deleted user ${req.params.id}` });
});

// ── req.query ─────────────────────────────────────
// ?key=value in the URL

app.get('/filter', function(req, res) {
  console.log('req.query :', req.query);
  res.json({ appliedFilters: req.query });
});

// ── req.headers ───────────────────────────────────
// HTTP headers sent by the client

app.get('/headers', function(req, res) {
  console.log('req.headers :', req.headers);
  res.json({
    userAgent:     req.headers['user-agent'],
    contentType:   req.headers['content-type'] ?? 'none',
    authorization: req.headers['authorization'] ?? 'none',
    host:          req.headers['host'],
  });
});

// ── All at once ───────────────────────────────────
app.post('/everything/:id', function(req, res) {
  res.json({
    params:  req.params,    // from URL path
    query:   req.query,     // from ?key=value
    body:    req.body,      // from request body
    method:  req.method,    // GET / POST / PUT...
    url:     req.url,       // full URL
    ip:      req.ip,        // client IP
  });
});

app.get('/', function(req, res) {
  res.send(`
    <h1>The Request Object</h1>
    <h3>req.body — POST data</h3>
    <pre>curl -X POST http://localhost:3003/create-user \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Alice","email":"alice@test.com","age":25}'</pre>

    <h3>req.params — URL params</h3>
    <ul>
      <li>PUT  /users/42  with body</li>
      <li>DELETE /users/42</li>
    </ul>

    <h3>req.query — query string</h3>
    <a href="/filter?city=TelAviv&age=25">/filter?city=TelAviv&age=25</a>

    <h3>req.headers</h3>
    <a href="/headers">/headers</a>
  `);
});

app.listen(3003, function() {
  console.log('Request object demo at http://localhost:3003');
  console.log('Use curl or Postman to test POST/PUT/DELETE routes\n');
});
