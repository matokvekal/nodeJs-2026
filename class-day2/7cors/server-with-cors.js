// ══════════════════════════════════════════════════
//  SERVER WITH CORS — all variants explained
//  Run: npm run cors  →  http://localhost:4001
// ══════════════════════════════════════════════════

import express from 'express';
import cors    from 'cors';

const app = express();
app.use(express.json());

// ══════════════════════════════════════════════════
//  VARIANT 1 — Allow ALL origins  (*)
//  Any website on the internet can fetch your API
// ══════════════════════════════════════════════════
app.get('/all-origins', cors(), function(req, res) {
  // cors() with no options = allow everyone
  console.log('[all-origins] Access-Control-Allow-Origin: *');
  res.json({
    route:    '/all-origins',
    header:   'Access-Control-Allow-Origin: *',
    meaning:  'Any website can fetch this endpoint',
  });
});

// ══════════════════════════════════════════════════
//  VARIANT 2 — Allow SPECIFIC origin only
//  Only requests from your-frontend.com are allowed
// ══════════════════════════════════════════════════
const specificCors = cors({
  origin: 'http://localhost:5500',   // only this origin
});

app.get('/specific-origin', specificCors, function(req, res) {
  console.log('[specific-origin] origin: http://localhost:5500 only');
  res.json({
    route:    '/specific-origin',
    header:   'Access-Control-Allow-Origin: http://localhost:5500',
    meaning:  'Only localhost:5500 (Live Server) is allowed',
  });
});

// ══════════════════════════════════════════════════
//  VARIANT 3 — Allow MULTIPLE specific origins
//  Useful when you have staging + production frontends
// ══════════════════════════════════════════════════
const allowedOrigins = ['http://localhost:5500', 'https://myapp.com', 'https://staging.myapp.com'];

const multiOriginCors = cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (Postman, curl) or from allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
});

app.get('/multi-origin', multiOriginCors, function(req, res) {
  console.log('[multi-origin] Allowed list:', allowedOrigins);
  res.json({
    route:        '/multi-origin',
    allowedList:  allowedOrigins,
    meaning:      'Only these specific origins are allowed',
  });
});

// ══════════════════════════════════════════════════
//  VARIANT 4 — With Credentials (cookies / auth)
//  When the browser needs to send cookies or auth headers
//  NOTE: origin cannot be '*' when credentials: true
// ══════════════════════════════════════════════════
const credentialsCors = cors({
  origin:      'http://localhost:5500',
  credentials: true,   // allows cookies and Authorization headers
});

app.get('/with-credentials', credentialsCors, function(req, res) {
  console.log('[with-credentials] credentials: true');
  res.json({
    route:   '/with-credentials',
    headers: {
      'Access-Control-Allow-Origin':      'http://localhost:5500',
      'Access-Control-Allow-Credentials': 'true',
    },
    meaning: 'Allows cookies and Authorization headers to be sent',
  });
});

// ══════════════════════════════════════════════════
//  VARIANT 5 — Custom Methods and Headers
//  Control exactly which HTTP methods are allowed
// ══════════════════════════════════════════════════
const customMethodsCors = cors({
  origin:  '*',
  methods: ['GET', 'POST', 'PUT'],        // DELETE is NOT allowed
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
});

app.get('/custom-methods', customMethodsCors, function(req, res) {
  console.log('[custom-methods] methods: GET, POST, PUT only');
  res.json({
    route:          '/custom-methods',
    allowedMethods: ['GET', 'POST', 'PUT'],
    blockedMethods: ['DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
  });
});

// ══════════════════════════════════════════════════
//  APPLY CORS GLOBALLY (to all routes at once)
//  Put this BEFORE all routes
// ══════════════════════════════════════════════════
// app.use(cors());  ← enables CORS for the whole app

app.get('/', function(req, res) {
  res.json({
    message: 'CORS server running!',
    routes: [
      'GET /all-origins       → allows all (*)',
      'GET /specific-origin   → only localhost:5500',
      'GET /multi-origin      → whitelist of origins',
      'GET /with-credentials  → allows cookies/auth headers',
      'GET /custom-methods    → controls which methods allowed',
    ],
  });
});

app.listen(4001, function() {
  console.log('CORS server running at http://localhost:4001');
  console.log('Open client.html in your browser to test\n');
});
