// ══════════════════════════════════════════════════
//  MIDDLEWARE 05 — HELMET (Security Headers)
//  Adds HTTP headers that protect against attacks
//  Run: npm run helmet  →  http://localhost:3005
//
//  Open DevTools → Network → click request → Headers
//  to see the difference with/without helmet
// ══════════════════════════════════════════════════

import express from 'express';
import helmet from 'helmet';

const appWithout = express();
const appWith    = express();

// ── WITHOUT helmet ────────────────────────────────
// Response headers are minimal — vulnerable to:
//   • XSS (Cross-Site Scripting)
//   • Clickjacking
//   • MIME sniffing attacks

appWithout.get('/', function(req, res) {
  console.log('\nWITHOUT helmet — minimal headers');
  res.send('<h2>Without Helmet</h2><p>Check response headers in DevTools — very few security headers.</p>');
});

appWithout.listen(3005, function() {
  console.log('WITHOUT helmet: http://localhost:3005');
});

// ── WITH helmet ───────────────────────────────────
// helmet() adds these headers automatically:
//   Content-Security-Policy    → blocks XSS injections
//   X-Frame-Options            → blocks clickjacking (iframes)
//   X-Content-Type-Options     → stops MIME sniffing
//   Strict-Transport-Security  → forces HTTPS
//   Referrer-Policy            → controls referrer info
//   ...and more

appWith.use(helmet());

appWith.get('/', function(req, res) {
  console.log('\nWITH helmet — security headers added');
  res.send('<h2>With Helmet</h2><p>Check response headers in DevTools — many security headers added!</p>');
});

// ── You can also configure each header individually ──
// helmet({
//   contentSecurityPolicy: false,       // disable CSP
//   frameguard: { action: 'deny' },     // block ALL iframes
//   hsts: { maxAge: 31536000 },         // force HTTPS for 1 year
// });

appWith.listen(3006, function() {
  console.log('WITH helmet:    http://localhost:3006');
  console.log('\nOpen both in browser, compare response headers in DevTools → Network\n');
});
