const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  // Middleware-like functionality to log requests
  console.log(`Request for ${req.url} received`);

  // Basic routing
  if (req.method === 'GET') {
    switch (req.url) {
      case '/':
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          "name": "Sand Crawler", 
          "model": "Digger Crawler", 
          "manufacturer": "Corellia Mining Corporation", 
          "cost_in_credits": "150000", 
          "length": "36.8 ", 
          "max_atmosphering_speed": "30", 
          "crew": "46", 
          "passengers": "30", 
          "cargo_capacity": "50000", 
          "consumables": "2 months", 
          "vehicle_class": "wheeled", 
          "pilots": [], 
          "films": [
              "https://swapi.dev/api/films/1/", 
              "https://swapi.dev/api/films/5/"
          ], 
          "created": "2014-12-10T15:36:25.724000Z", 
          "edited": "2014-12-20T21:30:21.661000Z", 
          "url": "https://swapi.dev/api/vehicles/4/"
        }));
        break;
      case '/about':
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('About Page');
        break;
      default:
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Page Not Found');
    }
  } else if (req.method === 'POST') {
    if (req.url === '/data') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
      });
      req.on('end', () => {
        console.log(body); // log the POST request body
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Data Received');
      });
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Page Not Found');
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
