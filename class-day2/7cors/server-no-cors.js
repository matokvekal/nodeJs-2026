// ══════════════════════════════════════════════════
//  SERVER WITHOUT CORS
//  Run: npm start  →  http://localhost:4000
//
//  Then open client.html from the browser (file://)
//  The browser will BLOCK the fetch request.
//  Postman will NOT block it — only the browser does!
// ══════════════════════════════════════════════════

import express from 'express';

const app = express();

app.get('/data', function(req, res) {
  res.json({ message: 'Hello from server!', users: ['Alice', 'Bob'] });
});

app.listen(4000, function() {
  console.log('Server WITHOUT cors running at http://localhost:4000/data');
  console.log('');
  console.log('Now open client.html in your browser (double-click the file)');
  console.log('Click "Fetch Data" — the browser will BLOCK it with a CORS error.');
  console.log('');
  console.log('Then try the same URL in Postman — it works fine!');
  console.log('Postman is NOT a browser, so it ignores CORS.\n');
});
