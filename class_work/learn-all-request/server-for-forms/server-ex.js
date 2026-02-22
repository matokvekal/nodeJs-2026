import express from 'express';
import { urlencoded, json } from 'express';

const app = express();

// Body parser middleware to handle POST requests
app.use(urlencoded({ extended: true }));
app.use(json());

// Handle GET requests to /submit
app.get('/submit', (req, res) => {
  console.log("Received GET request data:");
  console.log(req.query);
  res.send(
    `<h1>Your GET is ok</h1><p>Data received: ${JSON.stringify(req.query)}</p>`
  );
});

// Handle POST requests to /submit
app.post('/submit', (req, res) => {
  console.log("Received POST request data:");
  console.log(req.body);
  res.send("POST request received");
});

// Handle 404 for other routesconst PORT
app.use((req, res, next) => {
  res.status(404).send("Not found");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
