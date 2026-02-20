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