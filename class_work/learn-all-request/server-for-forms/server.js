const http = require("http");
const url = require("url");
const querystring = require("querystring");

const server = http.createServer((req, res) => {
  // Parse request URL
  const parsedUrl = url.parse(req.url, true);

  if (req.method === "GET" && parsedUrl.pathname === "/submit") {
    const queryParams = parsedUrl.query;
    console.log("Received GET request data:");
    console.log(queryParams);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      `<h1>Your GET is ok</h1><p>Data received: ${JSON.stringify(
        queryParams
      )}</p>`
    );
  }

  if (req.method === "POST" && parsedUrl.pathname === "/submit") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const postData = querystring.parse(body);
      console.log("Received POST request data:");
      console.log(postData);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("POST request received");
    });
  }

  // Handle other routes
  if (req.method === "GET" && parsedUrl.pathname !== "/submit") {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
