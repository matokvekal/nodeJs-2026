// Understanding the HTTP request object
import http from "node:http";

const server = http.createServer((req, res) => {
  // Request method: GET, POST, PUT, DELETE, PATCH, etc.
  console.log("Method:", req.method);

  // Request URL (path + query string)
  console.log("URL:", req.url);

  // HTTP version
  console.log("HTTP Version:", req.httpVersion);

  // Request headers (always lowercase)
  console.log("Headers:", req.headers);
  console.log("User-Agent:", req.headers["user-agent"]);
  console.log("Content-Type:", req.headers["content-type"]);

  // Remote address
  console.log("Client IP:", req.socket.remoteAddress);

  // Build response
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify(
      {
        method: req.method,
        url: req.url,
        headers: req.headers
      },
      null,
      2
    )
  );
});

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
  console.log("Try: curl http://localhost:3000/api/users?page=1");
});