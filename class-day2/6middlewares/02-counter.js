// ══════════════════════════════════════════════════
//  MIDDLEWARE 02 — REQUEST COUNTER
//  Counts total hits to the server using middleware
//  Run: npm run counter  →  http://localhost:3002
// ══════════════════════════════════════════════════

import express from 'express';

const app = express();

// ── WITHOUT counter middleware ────────────────────
// You have no way to know how many requests came in
// unless you manually add a counter in EVERY route.
// That means duplicated code in every handler.

// ── WITH counter middleware ───────────────────────
// Write the counter ONCE — it runs for every request automatically.

let totalRequests = 0;

function requestCounter(req, res, next) {
  totalRequests++;
  console.log(`Request #${totalRequests}  →  ${req.method} ${req.url}`);
  next();
}

app.use(requestCounter);

// Routes
app.get('/', function(req, res) {
  res.send(`
    <h2>Request Counter</h2>
    <p>Total requests to this server: <strong>${totalRequests}</strong></p>
    <p>Refresh the page and watch the count go up!</p>
    <p>Check terminal too.</p>
  `);
});

app.get('/api', function(req, res) {
  res.json({ totalRequests });
});

app.listen(3002, function() {
  console.log('Counter demo running at http://localhost:3002');
  console.log('Refresh the page and watch requests count up\n');
});
