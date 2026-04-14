// ══════════════════════════════════════════════════
//  EXPRESS 01 — Basic Server
//  Run: npm start  →  http://localhost:3000
// ══════════════════════════════════════════════════

import express from 'express';

// 1. Create the app
const app = express();

// 2. Define a route
//    app.METHOD(PATH, HANDLER)
app.get('/', function(req, res) {
  res.send('Hello from Express!');
});

app.get('/about', function(req, res) {
  res.send('About page');
});

// 3. Start listening on a port
app.listen(3000, function() {
  console.log('Server running at http://localhost:3000');
});
