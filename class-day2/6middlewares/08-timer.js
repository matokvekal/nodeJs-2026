// ══════════════════════════════════════════════════
//  MIDDLEWARE 08 — RESPONSE TIMER
//  Measures how long each request takes to process
//  Adds X-Response-Time header to the response
//  Run: npm run timer  →  http://localhost:3009
// ══════════════════════════════════════════════════

import express from 'express';

const app = express();

// ── WITHOUT timer middleware ──────────────────────
// You have no idea which routes are slow.
// You'd have to manually add Date.now() in every route.

// ── WITH timer middleware ─────────────────────────
function responseTimer(req, res, next) {
  const start = Date.now();

  // Hook into when response is sent
  res.on('finish', function() {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} took ${duration}ms`);
  });

  // Add the header BEFORE the response is sent
  const originalSend = res.send.bind(res);
  res.send = function(body) {
    res.setHeader('X-Response-Time', `${Date.now() - start}ms`);
    return originalSend(body);
  };

  next();
}

app.use(responseTimer);

// Fast route
app.get('/', function(req, res) {
  res.send('<h2>Timer Middleware</h2><p>Check the X-Response-Time header in DevTools → Network → Response Headers</p><ul><li><a href="/fast">Fast route</a></li><li><a href="/slow">Slow route (1.5s)</a></li><li><a href="/very-slow">Very slow (3s)</a></li></ul>');
});

// Fast route
app.get('/fast', function(req, res) {
  res.json({ message: 'Fast!', time: 'check X-Response-Time header' });
});

// Slow route — simulates a database query
app.get('/slow', function(req, res) {
  setTimeout(function() {
    res.json({ message: 'Slow response (1.5s)' });
  }, 1500);
});

// Very slow route
app.get('/very-slow', function(req, res) {
  setTimeout(function() {
    res.json({ message: 'Very slow response (3s)' });
  }, 3000);
});

app.listen(3009, function() {
  console.log('Timer demo at http://localhost:3009');
  console.log('Check X-Response-Time header in browser DevTools → Network\n');
});
