// ══════════════════════════════════════════════════
//  MIDDLEWARE 04 — CORS
//  Cross-Origin Resource Sharing
//  Allows (or blocks) browsers from other domains
//  Run: npm run cors  →  http://localhost:3004
// ══════════════════════════════════════════════════

import express from 'express';

const app = express();

// ── WHAT IS CORS? ─────────────────────────────────
// By default browsers BLOCK requests to a different domain.
// Example: your frontend is on localhost:5500
//          your API is on localhost:3004
// The browser will BLOCK the request unless the server
// adds the right headers to ALLOW it.

// ── WITHOUT cors middleware ───────────────────────
// Browser blocks the response — you get a CORS error
app.get('/without', function(req, res) {
  // No CORS headers added — browser will block this response
  console.log('WITHOUT cors — no Access-Control headers');
  res.json({ message: 'Browser will block this from other origins!' });
});

// ── WITH cors middleware (manual) ─────────────────
function corsMiddleware(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');          // allow all domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  console.log('WITH cors — headers added to response');
  next();
}

app.use('/with', corsMiddleware);

app.get('/with', function(req, res) {
  res.json({ message: 'Any browser from any domain can read this!' });
});

// ── WITH cors — allow specific domain only ────────
app.get('/private', function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://myapp.com'); // only this domain
  res.json({ message: 'Only myapp.com can access this' });
});

app.get('/', function(req, res) {
  res.send(`
    <h2>CORS Middleware</h2>
    <p>Open browser DevTools console and try fetching:</p>
    <pre>
// BLOCKED by browser (no CORS headers):
fetch('http://localhost:3004/without')

// ALLOWED (CORS headers present):
fetch('http://localhost:3004/with')
    </pre>
    <ul>
      <li><a href="/without">/without</a> — no CORS headers</li>
      <li><a href="/with">/with</a>    — CORS headers added</li>
    </ul>
  `);
});

app.listen(3004, function() {
  console.log('CORS demo at http://localhost:3004');
  console.log('/without  →  no CORS headers (browser blocks from other origins)');
  console.log('/with     →  CORS headers added (browser allows)\n');
});
