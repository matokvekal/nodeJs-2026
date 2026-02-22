// Reading and parsing JSON request body
import http from "node:http";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // Only handle POST to /api/users
    try {
      // Collect body chunks (req is a Readable Stream)
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }

      // Convert chunks to string
      const body = Buffer.concat(chunks).toString();

      // Parse JSON
      const data = JSON.parse(body);

      // Validate required fields
      if (!data.name || !data.email) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "name and email are required"
          })
        );
        return;
      }

      // Success - return created user
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "User created",
          user: {
            id: Date.now(),
            ...data,
            createdAt: new Date().toISOString()
          }
        })
      );
    } catch (error) {
      // Handle parsing errors
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Invalid JSON",
          message: error.message
        })
      );
    }
    return;
  }

  // 404 for other routes
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
  console.log("\nTest with curl:");
  console.log("curl -X POST http://localhost:3000/api/users \\");
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"name":"John","email":"john@example.com"}\'');
});