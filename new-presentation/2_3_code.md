# Day 2 - Presentation 3: REST API Design - Code Examples

---

## Example 1: RESTful Resource Naming

```javascript
// ✅ GOOD - RESTful resource names (nouns, plural)
GET / api / v1 / users; // Get all users
GET / api / v1 / users / 123; // Get specific user
POST / api / v1 / users; // Create new user
PUT / api / v1 / users / 123; // Update entire user
PATCH / api / v1 / users / 123; // Partial update user
DELETE / api / v1 / users / 123; // Delete user

// Nested resources
GET / api / v1 / users / 123 / posts; // Get user's posts
POST / api / v1 / users / 123 / posts; // Create post for user
DELETE / api / v1 / users / 123 / posts / 456; // Delete specific post

// ❌ BAD - Using verbs in URLs
GET / api / v1 / getUsers;
POST / api / v1 / createUser;
POST / api / v1 / deleteUser / 123;
GET / api / v1 / getUserPosts / 123;

// ✅ GOOD - Actions that don't fit CRUD
POST / api / v1 / users / 123 / activate; // Activate user
POST / api / v1 / orders / 456 / cancel; // Cancel order
POST / api / v1 / auth / login; // Login
POST / api / v1 / auth / logout; // Logout
POST / api / v1 / password / reset; // Password reset
```

---

## Example 2: Proper HTTP Status Codes

```javascript
import express from "express";

const router = express.Router();

// 200 OK - Successful GET, PUT, PATCH
router.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ data: user }); // Can omit, 200 is default
});

// 201 Created - Successful POST (resource created)
router.post("/users", async (req, res) => {
  const user = await User.create(req.body);
  res
    .status(201)
    .location(`/api/v1/users/${user.id}`) // Set Location header
    .json({ data: user });
});

// 204 No Content - Successful DELETE, no response body
router.delete("/users/:id", async (req, res) => {
  await User.delete(req.params.id);
  res.status(204).send(); // No body
});

// 400 Bad Request - Malformed request (invalid JSON, etc.)
router.post("/users", async (req, res) => {
  try {
    JSON.parse(req.body);
  } catch (error) {
    return res.status(400).json({
      error: "Invalid JSON in request body"
    });
  }
});

// 401 Unauthorized - Not authenticated
router.get("/profile", authenticate, (req, res) => {
  // If auth fails:
  // res.status(401).json({ error: 'Authentication required' });
  res.json({ data: req.user });
});

// 403 Forbidden - Authenticated but not authorized
router.delete("/users/:id", authenticate, authorize("admin"), (req, res) => {
  // If not admin:
  // res.status(403).json({ error: 'Insufficient permissions' });
});

// 404 Not Found - Resource doesn't exist
router.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      error: "User not found",
      id: req.params.id
    });
  }

  res.json({ data: user });
});

// 409 Conflict - Resource already exists
router.post("/users", async (req, res) => {
  const existing = await User.findByEmail(req.body.email);

  if (existing) {
    return res.status(409).json({
      error: "User with this email already exists"
    });
  }

  const user = await User.create(req.body);
  res.status(201).json({ data: user });
});

// 422 Unprocessable Entity - Validation failed
router.post("/users", validateBody(userSchema), async (req, res) => {
  // If validation fails:
  // res.status(422).json({
  //   error: 'Validation failed',
  //   details: { email: 'Invalid email format' }
  // });
});

// 429 Too Many Requests - Rate limit exceeded
router.use(rateLimit({ max: 100, windowMs: 15 * 60 * 1000 }));
router.post("/login", (req, res) => {
  // If rate limit exceeded:
  // res.status(429)
  //   .setHeader('Retry-After', 900) // 15 minutes
  //   .json({ error: 'Too many requests' });
});

// 500 Internal Server Error - Unexpected server error
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ data: users });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({
      error: "Internal server error"
      // Don't leak error details in production!
    });
  }
});
```

---

## Example 3: Filtering, Sorting, and Searching

```javascript
// GET /api/v1/products?category=electronics&minPrice=100&maxPrice=500&sort=-price&search=laptop

router.get("/products", async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    inStock,
    sort = "createdAt",
    search,
    page = 1,
    limit = 20
  } = req.query;

  // Build filter object
  const filters = {};

  if (category) {
    filters.category = category;
  }

  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = Number(minPrice);
    if (maxPrice) filters.price.$lte = Number(maxPrice);
  }

  if (inStock !== undefined) {
    filters.inStock = inStock === "true";
  }

  // Search across multiple fields
  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  // Parse sort (- prefix means descending)
  const sortField = sort.startsWith("-") ? sort.substring(1) : sort;
  const sortOrder = sort.startsWith("-") ? -1 : 1;
  const sortObj = { [sortField]: sortOrder };

  // Execute query
  const products = await Product.find(filters)
    .sort(sortObj)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  const total = await Product.countDocuments(filters);

  res.json({
    data: products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    filters: {
      category,
      priceRange: { min: minPrice, max: maxPrice },
      search
    }
  });
});

// Field selection - only return specific fields
// GET /api/v1/users?fields=name,email,createdAt

router.get("/users", async (req, res) => {
  const { fields } = req.query;

  let query = User.find();

  if (fields) {
    // Convert "name,email,createdAt" to "name email createdAt"
    const selectedFields = fields.split(",").join(" ");
    query = query.select(selectedFields);
  }

  const users = await query;
  res.json({ data: users });
});
```

---

## Example 4: Pagination - Offset vs Cursor

```javascript
// ===========================================
// Offset Pagination (page-based)
// ===========================================
// GET /api/v1/posts?page=2&limit=20

router.get("/posts", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find().skip(skip).limit(limit),
    Post.countDocuments()
  ]);

  res.json({
    data: posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  });
});

// Pros: Simple, familiar (page numbers)
// Cons: SLOW for large datasets (skip is expensive), inconsistent with live data

// ===========================================
// Cursor Pagination (recommended for large datasets)
// ===========================================
// GET /api/v1/posts?limit=20
// GET /api/v1/posts?after=eyJpZCI6IjEyMyJ9&limit=20

router.get("/posts", async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const { after } = req.query; // Cursor (base64 encoded ID)

  const query = {};

  if (after) {
    // Decode cursor
    const decoded = JSON.parse(Buffer.from(after, "base64").toString());
    query._id = { $gt: decoded.id }; // Find posts after this ID
  }

  const posts = await Post.find(query)
    .sort({ _id: 1 }) // MUST sort by unique field
    .limit(limit + 1); // Fetch one extra to check if there's more

  const hasMore = posts.length > limit;
  const results = hasMore ? posts.slice(0, limit) : posts;

  // Create cursor for next page
  const nextCursor = hasMore
    ? Buffer.from(
        JSON.stringify({ id: results[results.length - 1]._id })
      ).toString("base64")
    : null;

  res.json({
    data: results,
    pagination: {
      limit,
      hasMore,
      nextCursor
    }
  });
});

// Pros: FAST (no skip), consistent results, scales well
// Cons: Can't jump to specific page, slightly more complex
```

---

## Example 5: API Versioning

```javascript
// ===========================================
// URL Versioning (recommended - most visible)
// ===========================================
import express from "express";

const app = express();

// V1 API
import v1Routes from "./routes/v1/index.js";
app.use("/api/v1", v1Routes);

// V2 API (breaking changes)
import v2Routes from "./routes/v2/index.js";
app.use("/api/v2", v2Routes);

// ===========================================
// Header Versioning (cleaner URLs)
// ===========================================
app.use("/api/users", (req, res, next) => {
  const version = req.headers["api-version"] || "1";

  if (version === "1") {
    // V1 logic
    res.json({ id: 1, name: "John" });
  } else if (version === "2") {
    // V2 logic (different response format)
    res.json({
      id: 1,
      firstName: "John",
      lastName: "Doe"
    });
  } else {
    res.status(400).json({ error: "Unsupported API version" });
  }
});

// ===========================================
// Deprecation Strategy
// ===========================================
// Announce deprecation in old version
app.use("/api/v1", (req, res, next) => {
  res.setHeader("Deprecation", "true");
  res.setHeader("Sunset", "Sat, 31 Dec 2026 23:59:59 GMT");
  res.setHeader("Link", '</api/v2>; rel="successor-version"');
  next();
});

// V1: Simplified response (deprecated)
app.get("/api/v1/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({
    id: user.id,
    name: user.fullName
  });
});

// V2: Full response (current)
app.get("/api/v2/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt
  });
});
```

---

## Example 6: HATEOAS - Hypermedia Links

```javascript
// HATEOAS: Include links to related resources in responses
router.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  res.json({
    data: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    links: {
      self: { href: `/api/v1/users/${user.id}`, method: "GET" },
      update: { href: `/api/v1/users/${user.id}`, method: "PUT" },
      delete: { href: `/api/v1/users/${user.id}`, method: "DELETE" },
      posts: { href: `/api/v1/users/${user.id}/posts`, method: "GET" },
      avatar: { href: `/api/v1/users/${user.id}/avatar`, method: "GET" }
    }
  });
});

// Collection with pagination links
router.get("/users", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 20;

  const users = await User.find()
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await User.countDocuments();
  const totalPages = Math.ceil(total / limit);

  res.json({
    data: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      links: {
        self: { href: `/api/v1/users/${u.id}` }
      }
    })),
    links: {
      self: { href: `/api/v1/users?page=${page}` },
      first: { href: "/api/v1/users?page=1" },
      last: { href: `/api/v1/users?page=${totalPages}` },
      ...(page > 1 && { prev: { href: `/api/v1/users?page=${page - 1}` } }),
      ...(page < totalPages && {
        next: { href: `/api/v1/users?page=${page + 1}` }
      })
    },
    meta: {
      page,
      limit,
      total,
      totalPages
    }
  });
});
```

---

## Example 7: Bulk Operations

```javascript
// Bulk create
router.post("/users/bulk", async (req, res) => {
  const { users } = req.body; // Array of user objects

  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ error: "users array required" });
  }

  const results = await User.insertMany(users, { ordered: false });

  res.status(201).json({
    data: results,
    meta: {
      created: results.length,
      total: users.length
    }
  });
});

// Bulk update
router.patch("/users/bulk", async (req, res) => {
  const { updates } = req.body; // [{ id: '1', data: {...} }, ...]

  const results = await Promise.allSettled(
    updates.map(({ id, data }) =>
      User.findByIdAndUpdate(id, data, { new: true })
    )
  );

  const succeeded = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);
  const failed = results.filter((r) => r.status === "rejected");

  res.json({
    data: succeeded,
    errors: failed.map((r, i) => ({
      id: updates[i].id,
      error: r.reason.message
    })),
    meta: {
      succeeded: succeeded.length,
      failed: failed.length,
      total: updates.length
    }
  });
});

// Bulk delete
router.delete("/users/bulk", async (req, res) => {
  const { ids } = req.body; // Array of IDs

  const result = await User.deleteMany({ _id: { $in: ids } });

  res.json({
    meta: {
      deleted: result.deletedCount,
      requested: ids.length
    }
  });
});
```

---

## Example 8: Consistent Error Responses (RFC 7807)

```javascript
// Implement RFC 7807 Problem Details for HTTP APIs
class ProblemDetails {
  constructor(type, title, status, detail = "", instance = "") {
    this.type = type;
    this.title = title;
    this.status = status;
    if (detail) this.detail = detail;
    if (instance) this.instance = instance;
  }

  toJSON() {
    return {
      type: this.type,
      title: this.title,
      status: this.status,
      ...(this.detail && { detail: this.detail }),
      ...(this.instance && { instance: this.instance })
    };
  }
}

// Usage in error middleware
function errorHandler(err, req, res, next) {
  let problem;

  if (err.name === "ValidationError") {
    problem = new ProblemDetails(
      "/errors/validation",
      "Validation Failed",
      422,
      err.message,
      req.originalUrl
    );
    problem.errors = err.details;
  } else if (err.name === "UnauthorizedError") {
    problem = new ProblemDetails(
      "/errors/unauthorized",
      "Unauthorized",
      401,
      "Authentication required",
      req.originalUrl
    );
  } else if (err.statusCode === 404) {
    problem = new ProblemDetails(
      "/errors/not-found",
      "Not Found",
      404,
      err.message,
      req.originalUrl
    );
  } else {
    problem = new ProblemDetails(
      "/errors/internal",
      "Internal Server Error",
      500,
      process.env.NODE_ENV === "development"
        ? err.message
        : "An error occurred",
      req.originalUrl
    );
  }

  res.status(problem.status).type("application/problem+json").json(problem);
}
```

---

## Comparison Table: HTTP Methods

| Method     | Idempotent | Safe   | Request Body | Response Body | Use Case                |
| ---------- | ---------- | ------ | ------------ | ------------- | ----------------------- |
| **GET**    | ✅ Yes     | ✅ Yes | No           | Yes           | Retrieve resource(s)    |
| **POST**   | ❌ No      | ❌ No  | Yes          | Yes           | Create resource         |
| **PUT**    | ✅ Yes     | ❌ No  | Yes          | Yes           | Replace entire resource |
| **PATCH**  | ❌ No      | ❌ No  | Yes          | Yes           | Partial update          |
| **DELETE** | ✅ Yes     | ❌ No  | No           | Optional      | Delete resource         |

**Idempotent**: Multiple identical requests = same result  
**Safe**: Doesn't modify server state

---

## Comparison Table: Pagination Strategies

| Aspect                 | Offset Pagination            | Cursor Pagination                      |
| ---------------------- | ---------------------------- | -------------------------------------- |
| **Syntax**             | `?page=2&limit=20`           | `?after=abc123&limit=20`               |
| **Performance**        | Slow (skip expensive)        | Fast (no skip)                         |
| **Jump to page**       | ✅ Yes                       | ❌ No                                  |
| **Consistent results** | ❌ No (with live data)       | ✅ Yes                                 |
| **Use case**           | Admin panels, small datasets | Feeds, large datasets, infinite scroll |

---

## Summary

REST API best practices 2026:

1. **Resource naming** - Nouns (plural), not verbs
2. **HTTP methods** - GET, POST, PUT, PATCH, DELETE correctly
3. **Status codes** - Use appropriate codes (200, 201, 404, 422, etc.)
4. **Filtering** - Query params for filtering, sorting, searching
5. **Pagination** - Cursor for large datasets, offset for simple cases
6. **Versioning** - URL versioning (/api/v1) recommended
7. **HATEOAS** - Include links to related resources
8. **Error format** - Consistent (RFC 7807)
9. **Bulk operations** - Support batch create/update/delete

Design APIs that are intuitive, performant, and future-proof!
