// ══════════════════════════════════════════════════
//  MIDDLEWARE 03 — JSON PARSER
//  Parses the request body from raw text → JS object
//  Run: npm run json  →  http://localhost:3003
//
//  Test with curl or Postman:
//  curl -X POST http://localhost:3003/with    -H "Content-Type: application/json"    -d '{"name":"Alice","age":25}'
//
//  curl -X POST http://localhost:3003/without    -H "Content-Type: application/json"    -d '{"name":"Alice","age":25}'
// ══════════════════════════════════════════════════

import express from 'express';

const app = express();

// ── WITHOUT json parser ───────────────────────────
// req.body is undefined — you cannot read what the client sent
app.post('/without', function(req, res) {
  console.log('WITHOUT parser — req.body:', req.body); // undefined!
  res.json({
    message: 'No parser used',
    body: req.body,        // undefined
    received: false,
  });
});

// ── WITH json parser ──────────────────────────────
// express.json() reads the raw body and puts it on req.body as a JS object
app.use(express.json());

app.post('/with', function(req, res) {
  console.log('WITH parser — req.body:', req.body); // { name: 'Alice', age: 25 }
  res.json({
    message: 'Body parsed successfully!',
    body: req.body,
    received: true,
  });
});

app.get('/', function(req, res) {
  res.send(`
    <h2>JSON Parser Middleware</h2>
    <p>Use curl or Postman to POST JSON to:</p>
    <ul>
      <li><code>POST /without</code> — req.body is <strong>undefined</strong></li>
      <li><code>POST /with</code>    — req.body is a <strong>JS object</strong></li>
    </ul>
    <pre>curl -X POST http://localhost:3003/with \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Alice","age":25}'</pre>
  `);
});

app.listen(3003, function() {
  console.log('JSON Parser demo at http://localhost:3003');
  console.log('POST to /without  →  body is undefined');
  console.log('POST to /with     →  body is parsed object\n');
});
