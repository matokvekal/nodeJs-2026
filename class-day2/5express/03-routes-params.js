// ══════════════════════════════════════════════════
//  EXPRESS 03 — Routes, Params, Query Strings
//  Run: npm run routes  →  http://localhost:3002
// ══════════════════════════════════════════════════

import express from 'express';

const app = express();

// ── Route Parameters  :id ─────────────────────────
// Part of the URL path — used to identify a resource

app.get('/users/:id', function(req, res) {
  const id = req.params.id;       // from the URL
  console.log('req.params:', req.params);
  res.json({ message: `Getting user with id: ${id}`, params: req.params });
});

app.get('/users/:id/posts/:postId', function(req, res) {
  console.log('req.params:', req.params);
  res.json({
    userId:  req.params.id,
    postId:  req.params.postId,
    message: `Post ${req.params.postId} of user ${req.params.id}`,
  });
});

// ── Query Strings  ?key=value ─────────────────────
// After the ? in the URL — used for filtering/searching

app.get('/search', function(req, res) {
  const query = req.query;
  console.log('req.query:', query);
  // URL example: /search?name=Alice&age=25&city=TelAviv
  res.json({
    message: 'Search results',
    filters: query,
    example: 'Try: /search?name=Alice&age=25',
  });
});

app.get('/products', function(req, res) {
  const { category, sort, limit = 10 } = req.query;
  console.log('Filtering products:', { category, sort, limit });
  res.json({
    category: category ?? 'all',
    sort:     sort     ?? 'none',
    limit:    Number(limit),
    example:  'Try: /products?category=shoes&sort=price&limit=5',
  });
});

// ── HTTP Methods ──────────────────────────────────
// GET    → read data
// POST   → create new data
// PUT    → update (full replace)
// PATCH  → update (partial)
// DELETE → delete data

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

app.get('/api/users', function(req, res) {
  res.json(users);
});

app.get('/api/users/:id', function(req, res) {
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// ── Home ──────────────────────────────────────────
app.get('/', function(req, res) {
  res.send(`
    <h1>Routes, Params & Query Strings</h1>
    <h3>Route Params</h3>
    <ul>
      <li><a href="/users/42">/users/42</a></li>
      <li><a href="/users/5/posts/99">/users/5/posts/99</a></li>
    </ul>
    <h3>Query Strings</h3>
    <ul>
      <li><a href="/search?name=Alice&age=25">/search?name=Alice&age=25</a></li>
      <li><a href="/products?category=shoes&sort=price&limit=3">/products?category=shoes&sort=price&limit=3</a></li>
    </ul>
    <h3>REST API</h3>
    <ul>
      <li><a href="/api/users">/api/users</a></li>
      <li><a href="/api/users/1">/api/users/1</a></li>
      <li><a href="/api/users/99">/api/users/99</a> — 404</li>
    </ul>
  `);
});

app.listen(3002, function() {
  console.log('Routes demo at http://localhost:3002');
});
