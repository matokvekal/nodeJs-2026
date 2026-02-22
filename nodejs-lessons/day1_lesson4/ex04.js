// Working with URLs and query strings
import http from "node:http";
import { URL } from "node:url";

const server = http.createServer((req, res) => {
  const baseURL = `http://${req.headers.host}`;
  const url = new URL(req.url, baseURL);

  console.log("Full URL:", url.href);
  console.log("Pathname:", url.pathname); // /api/search
  console.log("Search:", url.search); // ?q=nodejs&page=2
  console.log("Query params:", Object.fromEntries(url.searchParams));

  // Get individual query parameters
  const searchQuery = url.searchParams.get("q");
  const page = url.searchParams.get("page") || "1";
  const sort = url.searchParams.get("sort") || "relevance";

  // Check if parameter exists
  const hasFilter = url.searchParams.has("filter");

  // Get all values for a parameter (for arrays: ?tag=js&tag=node)
  const tags = url.searchParams.getAll("tag");

  // Iterate over all parameters
  console.log("\nAll query parameters:");
  url.searchParams.forEach((value, key) => {
    console.log(`  ${key}: ${value}`);
  });

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify(
      {
        query: searchQuery,
        page: Number(page),
        sort,
        hasFilter,
        tags
      },
      null,
      2
    )
  );
});

server.listen(3000, () => {
  console.log(
    "Test: http://localhost:3000/api/search?q=nodejs&page=2&tag=js&tag=node"
  );
});