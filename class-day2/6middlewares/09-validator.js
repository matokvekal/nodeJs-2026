// ══════════════════════════════════════════════════
//  MIDDLEWARE 09 — BODY VALIDATOR
//  Checks that required fields exist in req.body
//  Run: npm run validator  →  http://localhost:3010
//
//  Test:
//  curl -X POST http://localhost:3010/without -H "Content-Type: application/json" -d '{"name":"Alice"}'
//  curl -X POST http://localhost:3010/with    -H "Content-Type: application/json" -d '{"name":"Alice"}'
//  curl -X POST http://localhost:3010/with    -H "Content-Type: application/json" -d '{"name":"Alice","email":"a@b.com","age":25}'
// ══════════════════════════════════════════════════

import express from 'express';

const app = express();
app.use(express.json());

// ── WITHOUT validator ─────────────────────────────
// Bad data goes straight to the database — crashes or corrupts it
app.post('/without', function(req, res) {
  const { name, email, age } = req.body;
  console.log('WITHOUT validator — saving:', { name, email, age });
  // name could be undefined, email missing — saved to DB anyway!
  res.json({ message: 'Saved (even if data is incomplete!)', data: req.body });
});

// ── WITH validator middleware ─────────────────────
function validate(requiredFields) {
  return function(req, res, next) {
    const missing = [];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      console.log('VALIDATOR: Missing fields:', missing);
      return res.status(400).json({
        error:   'Validation failed',
        missing: missing,
      });
    }

    console.log('VALIDATOR: All fields present — passing through');
    next();
  };
}

// Use the validator — pass in which fields are required
app.post('/with', validate(['name', 'email', 'age']), function(req, res) {
  const { name, email, age } = req.body;
  console.log('WITH validator — saving:', { name, email, age });
  res.json({ message: 'Saved successfully!', data: { name, email, age } });
});

app.get('/', function(req, res) {
  res.send(`
    <h2>Validator Middleware</h2>
    <p>POST to:</p>
    <ul>
      <li><code>/without</code> — no validation, saves anything</li>
      <li><code>/with</code> — validates name, email, age are present</li>
    </ul>
    <p>Try missing a field:</p>
    <pre>curl -X POST http://localhost:3010/with \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Alice"}'</pre>
  `);
});

app.listen(3010, function() {
  console.log('Validator demo at http://localhost:3010');
  console.log('POST to /without  →  no validation');
  console.log('POST to /with     →  requires name, email, age\n');
});
