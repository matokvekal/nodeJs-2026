// ══════════════════════════════════════════════════
//  MIDDLEWARE 07 — RATE LIMITER
//  Blocks users who send too many requests too fast
//  Run: npm run ratelimit  →  http://localhost:3008
//
//  Refresh the page 6 times fast to get blocked!
// ══════════════════════════════════════════════════

import express from 'express';

const app = express();

// ── WITHOUT rate limiter ──────────────────────────
// A user or bot can send 10,000 requests per second
// and crash your server (DoS attack)

// ── WITH rate limiter (built from scratch) ────────
const requestCounts = {}; // { ip: { count, resetTime } }

const LIMIT        = 5;       // max 5 requests
const WINDOW_MS    = 10000;   // per 10 seconds

function rateLimiter(req, res, next) {
  const ip  = req.ip;
  const now = Date.now();

  // First visit from this IP
  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, resetTime: now + WINDOW_MS };
    console.log(`IP ${ip} — request 1/${LIMIT}`);
    return next();
  }

  // Reset window if time expired
  if (now > requestCounts[ip].resetTime) {
    requestCounts[ip] = { count: 1, resetTime: now + WINDOW_MS };
    console.log(`IP ${ip} — window reset, request 1/${LIMIT}`);
    return next();
  }

  // Within window — increment count
  requestCounts[ip].count++;
  const remaining = LIMIT - requestCounts[ip].count;
  console.log(`IP ${ip} — request ${requestCounts[ip].count}/${LIMIT}`);

  // Over the limit — block!
  if (requestCounts[ip].count > LIMIT) {
    const retryAfter = Math.ceil((requestCounts[ip].resetTime - now) / 1000);
    console.log(`IP ${ip} — BLOCKED (too many requests)`);
    return res.status(429).json({
      error:   'Too many requests',
      message: `Try again in ${retryAfter} seconds`,
    });
  }

  next();
}

app.use(rateLimiter);

app.get('/', function(req, res) {
  res.send(`
    <h2>Rate Limiter</h2>
    <p>Limit: <strong>${LIMIT} requests per 10 seconds</strong></p>
    <p>Refresh this page more than ${LIMIT} times quickly — you will get blocked!</p>
    <p>Watch the terminal to see your request count.</p>
  `);
});

app.listen(3008, function() {
  console.log('Rate limiter demo at http://localhost:3008');
  console.log(`Limit: ${LIMIT} requests per ${WINDOW_MS / 1000} seconds`);
  console.log('Refresh fast to get blocked!\n');
});
