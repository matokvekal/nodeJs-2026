// Simple routing based on URL and HTTP method
import http from "node:http";
import { URL } from "node:url";

const server = http.createServer((req, res) => {
  // Parse URL with query parameters
  const baseURL = `http://${req.headers.host}`;
  const url = new URL(req.url, baseURL);

  // Extract path and method
  const { pathname } = url;
  const method = req.method;

  // Route: GET /
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome!</h1><p>Try /api/users or /api/posts</p>");
    return;
  }

  // Route: GET /api/users
    // Get query parameters
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "10";

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        users: [
          { id: 1, name: "John" },
          { id: 2, name: "Jane" }
        ],
        pagination: { page: Number(page), limit: Number(limit) }
      })
    );
    return;
  }

  // Route: GET /api/users/:id
  const userMatch = pathname.match(/^\/api\/users\/(\d+)$/);
    const userId = userMatch[1];

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        id: Number(userId),
        name: "John Doe",
        email: "john@example.com"
      })
    );
    return;
  }

  // Route: POST /api/users
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "User created",
        id: 123
      })
    );
    return;
  }

  // 404 - Route not found
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      error: "Not Found",
      path: pathname
    })
  );
});

server.listen(3000, () => {
  console.log("Server with routing: http://localhost:3000");
});