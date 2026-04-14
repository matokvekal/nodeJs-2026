// ══════════════════════════════════════════════════
//  EXPRESS 05 — Express Router
//  Split routes into separate mini-apps
//  Run: npm run router  →  http://localhost:3004
// ══════════════════════════════════════════════════

import express from 'express';

const app = express();
app.use(express.json());

// ══════════════════════════════════════════════════
//  WITHOUT Router — all routes in one file (messy)
// ══════════════════════════════════════════════════
// app.get('/users', ...)
// app.get('/users/:id', ...)
// app.post('/users', ...)
// app.get('/products', ...)
// app.get('/products/:id', ...)
// ... hundreds of routes mixed together — hard to manage

// ══════════════════════════════════════════════════
//  WITH Router — organized by resource
// ══════════════════════════════════════════════════

// ── Users Router ──────────────────────────────────
const usersRouter = express.Router();

usersRouter.get('/', function(req, res) {
  res.json({ message: 'GET all users', users: ['Alice', 'Bob', 'Charlie'] });
});

usersRouter.get('/:id', function(req, res) {
  res.json({ message: `GET user ${req.params.id}` });
});

usersRouter.post('/', function(req, res) {
  res.status(201).json({ message: 'POST create user', data: req.body });
});

usersRouter.put('/:id', function(req, res) {
  res.json({ message: `PUT update user ${req.params.id}`, data: req.body });
});

usersRouter.delete('/:id', function(req, res) {
  res.json({ message: `DELETE user ${req.params.id}` });
});

// ── Products Router ───────────────────────────────
const productsRouter = express.Router();

productsRouter.get('/', function(req, res) {
  res.json({ message: 'GET all products', products: ['Shoe', 'Hat', 'Bag'] });
});

productsRouter.get('/:id', function(req, res) {
  res.json({ message: `GET product ${req.params.id}` });
});

productsRouter.post('/', function(req, res) {
  res.status(201).json({ message: 'POST create product', data: req.body });
});

// ── Mount routers on paths ────────────────────────
// All usersRouter routes are now under /users
// All productsRouter routes are under /products
app.use('/users',    usersRouter);
app.use('/products', productsRouter);

// ── Home ──────────────────────────────────────────
app.get('/', function(req, res) {
  res.send(`
    <h1>Express Router</h1>
    <h3>Users API  <code>/users</code></h3>
    <ul>
      <li><a href="/users">GET /users</a>        — all users</li>
      <li><a href="/users/1">GET /users/1</a>    — one user</li>
      <li>POST /users                            — create user</li>
      <li>PUT /users/1                           — update user</li>
      <li>DELETE /users/1                        — delete user</li>
    </ul>
    <h3>Products API  <code>/products</code></h3>
    <ul>
      <li><a href="/products">GET /products</a>       — all products</li>
      <li><a href="/products/5">GET /products/5</a>  — one product</li>
      <li>POST /products                              — create product</li>
    </ul>
  `);
});

app.listen(3004, function() {
  console.log('Router demo at http://localhost:3004');
});
