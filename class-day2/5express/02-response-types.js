// ══════════════════════════════════════════════════
//  EXPRESS 02 — Response Types
//  res.send / res.json / res.status / res.redirect
//  and many more
//  Run: npm run response  →  http://localhost:3001
// ══════════════════════════════════════════════════

import express from 'express';

const app = express();

// ── res.send() ────────────────────────────────────
// Sends any content — string, HTML, Buffer
// Express auto-sets Content-Type based on what you send

app.get('/send-text', function(req, res) {
  res.send('Hello! This is plain text.');
  // Content-Type: text/html (express default for strings)
});

app.get('/send-html', function(req, res) {
  res.send('<h1>Hello</h1><p>This is <strong>HTML</strong></p>');
  // Content-Type: text/html
});

app.get('/send-buffer', function(req, res) {
  res.send(Buffer.from('binary data'));
  // Content-Type: application/octet-stream
});

// ── res.json() ────────────────────────────────────
// Sends a JavaScript object/array as JSON
// Automatically sets Content-Type: application/json

app.get('/json-object', function(req, res) {
  res.json({ name: 'Alice', age: 25, city: 'Tel Aviv' });
});

app.get('/json-array', function(req, res) {
  res.json(['Alice', 'Bob', 'Charlie']);
});

app.get('/json-nested', function(req, res) {
  res.json({
    user: { name: 'Alice', age: 25 },
    posts: [
      { id: 1, title: 'Hello World' },
      { id: 2, title: 'Node.js is great' },
    ],
  });
});

// ── res.status() ──────────────────────────────────
// Sets the HTTP status code
// Chain it with .json() or .send()

app.get('/status-200', function(req, res) {
  res.status(200).json({ message: 'OK — success' });
});

app.get('/status-201', function(req, res) {
  res.status(201).json({ message: 'Created — new resource was made' });
});

app.get('/status-400', function(req, res) {
  res.status(400).json({ error: 'Bad Request — client sent wrong data' });
});

app.get('/status-401', function(req, res) {
  res.status(401).json({ error: 'Unauthorized — login required' });
});

app.get('/status-403', function(req, res) {
  res.status(403).json({ error: 'Forbidden — you do not have permission' });
});

app.get('/status-404', function(req, res) {
  res.status(404).json({ error: 'Not Found — resource does not exist' });
});

app.get('/status-500', function(req, res) {
  res.status(500).json({ error: 'Internal Server Error — something crashed' });
});

// ── res.redirect() ────────────────────────────────
// Sends the browser to a different URL

app.get('/old-page', function(req, res) {
  res.redirect('/send-html');   // 302 by default
});

app.get('/moved', function(req, res) {
  res.redirect(301, '/send-html');  // 301 = permanent redirect
});

// ── res.set() / res.setHeader() ───────────────────
// Set custom response headers

app.get('/custom-header', function(req, res) {
  res.set('X-App-Name', 'MyExpressApp');
  res.set('X-Version',  '1.0.0');
  res.json({ message: 'Check the response headers in DevTools!' });
});

// ── res.download() ────────────────────────────────
// Sends a file as a download (triggers browser Save dialog)
// app.get('/download', function(req, res) {
//   res.download('./somefile.pdf');
// });

// ── Home — shows all routes ────────────────────────
app.get('/', function(req, res) {
  res.send(`
    <h1>Express Response Types</h1>
    <h3>res.send()</h3>
    <ul>
      <li><a href="/send-text">/send-text</a></li>
      <li><a href="/send-html">/send-html</a></li>
      <li><a href="/send-buffer">/send-buffer</a></li>
    </ul>
    <h3>res.json()</h3>
    <ul>
      <li><a href="/json-object">/json-object</a></li>
      <li><a href="/json-array">/json-array</a></li>
      <li><a href="/json-nested">/json-nested</a></li>
    </ul>
    <h3>res.status()</h3>
    <ul>
      <li><a href="/status-200">/status-200</a> — OK</li>
      <li><a href="/status-201">/status-201</a> — Created</li>
      <li><a href="/status-400">/status-400</a> — Bad Request</li>
      <li><a href="/status-401">/status-401</a> — Unauthorized</li>
      <li><a href="/status-403">/status-403</a> — Forbidden</li>
      <li><a href="/status-404">/status-404</a> — Not Found</li>
      <li><a href="/status-500">/status-500</a> — Server Error</li>
    </ul>
    <h3>res.redirect()</h3>
    <ul>
      <li><a href="/old-page">/old-page</a>  — 302 redirect</li>
      <li><a href="/moved">/moved</a>      — 301 redirect</li>
    </ul>
    <h3>res.set() — custom headers</h3>
    <ul>
      <li><a href="/custom-header">/custom-header</a></li>
    </ul>
  `);
});

app.listen(3001, function() {
  console.log('Response types demo at http://localhost:3001');
});
