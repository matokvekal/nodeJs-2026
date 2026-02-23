// Using appropriate HTTP status codes
import http from "node:http";

// Mock database
const users = [
  { id: 1, name: "John", email: "john@example.com" },
  { id: 2, name: "Jane", email: "jane@example.com" }
];

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // GET /api/users/:id
  const match = url.match(/^\/api\/users\/(\d+)$/);
    const userId = Number(match[1]);

    if (!user) {
      // 404 Not Found - resource doesn't exist
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    // 200 OK - successful GET
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
    return;
  }

  // POST /api/users
    try {
      const body = await parseBody(req);

      // Validation failed
      if (!body.email || !body.email.includes("@")) {
        // 422 Unprocessable Entity - validation error
        res.writeHead(422, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid email" }));
        return;
      }

      // Check if user already exists
        // 409 Conflict - resource already exists
        res.writeHead(409, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Email already exists" }));
        return;
      }

      // 201 Created - resource successfully created
      const newUser = { id: users.length + 1, ...body };
      users.push(newUser);

      res.writeHead(201, {
        "Content-Type": "application/json",
        Location: `/api/users/${newUser.id}` // URI of created resource
      });
      res.end(JSON.stringify(newUser));
      return;
    } catch (error) {
      // 400 Bad Request - malformed request (invalid JSON)
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid JSON" }));
      return;
    }
  }

  // DELETE /api/users/:id
    const userId = Number(match[1]);

      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    users.splice(index, 1);

    // 204 No Content - successful delete, no response body
    res.writeHead(204);
    res.end();
    return;
  }

  // 405 Method Not Allowed - method not supported for this path
  res.writeHead(405, {
    "Content-Type": "application/json",
    Allow: "GET, POST" // List allowed methods
  });
  res.end(JSON.stringify({ error: "Method not allowed" }));
});

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString());
}

server.listen(3000, () => console.log("Server on http://localhost:3000"));

// Common Status Codes:
// 200 OK - Successful GET, PUT, PATCH
// 201 Created - Successful POST (resource created)
// 204 No Content - Successful DELETE, no body to return
// 400 Bad Request - Malformed request (invalid JSON, etc.)
// 401 Unauthorized - Not authenticated
// 403 Forbidden - Authenticated but not authorized
// 404 Not Found - Resource doesn't exist
// 409 Conflict - Resource already exists
// 422 Unprocessable Entity - Validation failed
// 429 Too Many Requests - Rate limit exceeded
// 500 Internal Server Error - Server error