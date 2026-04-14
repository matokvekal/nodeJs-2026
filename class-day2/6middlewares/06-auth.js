// ══════════════════════════════════════════════════
//  MIDDLEWARE 06 — AUTH (Token Check)
//  Protects routes — checks Authorization header
//  Run: npm run auth  →  http://localhost:3007
//
//  Test:
//  curl http://localhost:3007/private
//  curl http://localhost:3007/private -H "Authorization: Bearer secret123"
// ══════════════════════════════════════════════════

import express from 'express';

const app = express();

const VALID_TOKEN = 'secret123';

// ── WITHOUT auth middleware ───────────────────────
// Anyone can access private data — no protection at all
app.get('/without', function(req, res) {
  console.log('WITHOUT auth — anyone can access this');
  res.json({ secret: 'Top secret data! No protection.' });
});

// ── WITH auth middleware ──────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  // No token provided
  if (!authHeader) {
    console.log('AUTH: No token — rejected');
    return res.status(401).json({ error: 'No token provided' });
  }

  // Token format: "Bearer secret123"
  const token = authHeader.split(' ')[1];

  if (token !== VALID_TOKEN) {
    console.log('AUTH: Wrong token — rejected');
    return res.status(403).json({ error: 'Invalid token' });
  }

  console.log('AUTH: Token valid — allowed');
  next(); // token is valid — continue to route
}

// Apply auth only to protected routes
app.get('/private', authMiddleware, function(req, res) {
  res.json({ secret: 'You are authorized! Here is the private data.' });
});

app.get('/public', function(req, res) {
  res.json({ message: 'Anyone can see this — no auth needed' });
});

app.get('/', function(req, res) {
  res.send(`
    <h2>Auth Middleware</h2>
    <ul>
      <li><a href="/public">/public</a>  — no auth needed</li>
      <li><a href="/without">/without</a> — no protection, everyone gets data</li>
      <li><a href="/private">/private</a> — protected (try it, you'll get 401)</li>
    </ul>
    <p>To access /private send the token:</p>
    <pre>curl http://localhost:3007/private -H "Authorization: Bearer secret123"</pre>
  `);
});

app.listen(3007, function() {
  console.log('Auth demo at http://localhost:3007');
  console.log('Token required: Bearer secret123\n');
});
