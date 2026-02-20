# Day 3 - Presentation 4: Security Deep Dive - Code Examples

---

## Example 1: Helmet - Security Headers

```javascript
// app.js
import express from "express";
import helmet from "helmet";

const app = express();

// ===================================
// Basic Helmet Usage (Recommended)
// ===================================
app.use(helmet());

// This automatically enables:
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: SAMEORIGIN
// - X-XSS-Protection: 0 (disabled, modern browsers use CSP instead)
// - Strict-Transport-Security: max-age=15552000; includeSubDomains
// - Content-Security-Policy (restrictive default)
// - Removes X-Powered-By header

// ===================================
// Custom Helmet Configuration
// ===================================
app.use(
  helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Only load from same origin
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com"
        ],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://api.example.com"],
        frameSrc: ["'none'"], // Prevent embedding in iframes
        objectSrc: ["'none'"], // Block plugins like Flash
        upgradeInsecureRequests: [] // Upgrade HTTP to HTTPS
      }
    },

    // Strict Transport Security (HSTS)
    strictTransportSecurity: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true // Submit to HSTS preload list
    },

    // X-Frame-Options
    frameguard: {
      action: "deny" // DENY | SAMEORIGIN | ALLOW-FROM
    },

    // Referrer Policy
    referrerPolicy: {
      policy: "no-referrer-when-downgrade"
    },

    // Hide X-Powered-By
    hidePoweredBy: true,

    // DNS Prefetch Control
    dnsPrefetchControl: {
      allow: false
    }
  })
);

// ===================================
// Individual Headers (if not using helmet)
// ===================================
app.use((req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Force HTTPS
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // Control referrer
  res.setHeader("Referrer-Policy", "no-referrer");

  // Remove server fingerprint
  res.removeHeader("X-Powered-By");

  // CSP
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'"
  );

  // Permissions Policy (formerly Feature-Policy)
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  next();
});
```

```bash
# Install helmet
npm install helmet
```

---

## Example 2: CORS Configuration

```javascript
// middleware/cors.js
import cors from "cors";

// ===================================
// Basic CORS (Development only!)
// ===================================
// ❌ NEVER in production!
app.use(cors()); // Allows ALL origins

// ===================================
// Production CORS Configuration
// ===================================
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "https://myapp.com",
  "https://www.myapp.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },

    // Allowed HTTP methods
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    // Allowed headers
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],

    // Allow credentials (cookies, authorization headers)
    credentials: true,

    // How long browsers can cache preflight response
    maxAge: 86400, // 24 hours

    // Expose custom headers to client
    exposedHeaders: ["X-Total-Count", "X-Page-Number"]
  })
);

// ===================================
// Dynamic Origin Validation
// ===================================
function corsOptions(req, callback) {
  const origin = req.header("Origin");

  // Whitelist check
  const isAllowed = allowedOrigins.some((allowed) => {
    if (allowed === origin) return true;

    // Wildcard subdomain support
    if (allowed.startsWith("*.")) {
      const domain = allowed.substring(2);
      return origin?.endsWith(domain);
    }

    return false;
  });

  callback(null, {
    origin: isAllowed,
    credentials: true
  });
}

app.use(cors(corsOptions));

// ===================================
// Manual CORS Headers (without cors package)
// ===================================
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Max-Age", "86400");
  }

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// ===================================
// CORS Security Best Practices
// ===================================
// ✅ DO: Whitelist specific origins
// ✅ DO: Use credentials: true with specific origins
// ✅ DO: Set maxAge to cache preflight requests
// ❌ DON'T: Use origin: '*' with credentials: true (browsers reject this)
// ❌ DON'T: Use wildcard '*' in production
// ❌ DON'T: Allow all origins without validation
```

```bash
# Install cors
npm install cors

# Environment variable
ALLOWED_ORIGINS=https://myapp.com,https://www.myapp.com,https://admin.myapp.com
```

---

## Example 3: Rate Limiting

```javascript
// middleware/rateLimit.js
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";

// ===================================
// Basic Rate Limiting (Memory Store)
// ===================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers

  // Custom key generator (default is IP)
  keyGenerator: (req) => req.ip,

  // Skip certain requests
  skip: (req) => req.path === "/health",

  // Custom handler
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests",
      retryAfter: req.rateLimit.resetTime
    });
  }
});

app.use("/api/", limiter);

// ===================================
// Redis Store (Production - distributed)
// ===================================
const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

const redisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  store: new RedisStore({
    client: redis,
    prefix: "rl:" // Key prefix in Redis
  })
});

app.use("/api/", redisLimiter);

// ===================================
// Tiered Rate Limits
// ===================================
// Strict for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts per 15 minutes
  skipSuccessfulRequests: true // Don't count successful requests
});

app.post("/auth/login", authLimiter, loginController);

// Moderate for API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use("/api/", apiLimiter);

// Generous for public content
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500
});

app.use("/public/", publicLimiter);

// ===================================
// User-based Rate Limiting (not IP)
// ===================================
const userLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  keyGenerator: (req) => {
    // Rate limit by user ID if authenticated, otherwise IP
    return req.user?.id || req.ip;
  },
  skip: (req) => !req.user // Skip if not authenticated
});

app.use("/api/user/", authenticate, userLimiter);

// ===================================
// Sliding Window Rate Limit (Manual)
// ===================================
export async function slidingWindowRateLimit(req, res, next) {
  const key = `rl:${req.ip}`;
  const now = Date.now();
  const window = 60 * 1000; // 1 minute
  const maxRequests = 30;

  // Add current request timestamp
  await redis.zAdd(key, { score: now, value: `${now}` });

  // Remove old entries outside window
  await redis.zRemRangeByScore(key, 0, now - window);

  // Count requests in window
  const count = await redis.zCard(key);

  // Set expiration
  await redis.expire(key, 60);

  if (count > maxRequests) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  next();
}
```

```bash
# Install rate limiting
npm install express-rate-limit rate-limit-redis redis
```

---

## Example 4: Input Sanitization & Validation

```javascript
// middleware/sanitize.js
import mongoSanitize from "express-mongo-sanitize";
import validator from "validator";

// ===================================
// MongoDB Injection Prevention
// ===================================
app.use(
  mongoSanitize({
    // Remove $ and . from request data
    replaceWith: "_"

    // Alternatively, reject requests with $ or .
    // onSanitize: ({ req, key }) => {
    //   throw new Error(`Invalid key: ${key}`);
    // }
  })
);

// Before sanitization:
// { email: { $gt: "" } } → matches all emails!

// After sanitization:
// { email: { _gt: "" } } → literal string, safe

// ===================================
// XSS Prevention (HTML Sanitization)
// ===================================
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export function sanitizeHTML(dirty) {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br"],
    ALLOWED_ATTR: ["href"],
    ALLOW_DATA_ATTR: false
  });
}

// Usage in controller
app.post("/posts", async (req, res) => {
  const { title, content } = req.body;

  // Sanitize HTML content
  const cleanContent = sanitizeHTML(content);

  const post = await Post.create({
    title,
    content: cleanContent
  });

  res.status(201).json({ data: post });
});

// ===================================
// String Validation with validator.js
// ===================================
import validator from "validator";

function validateUserInput(data) {
  const errors = {};

  // Email
  if (!validator.isEmail(data.email)) {
    errors.email = "Invalid email format";
  }

  // URL
  if (
    data.website &&
    !validator.isURL(data.website, { protocols: ["https"] })
  ) {
    errors.website = "Must be a valid HTTPS URL";
  }

  // UUID
  if (data.id && !validator.isUUID(data.id)) {
    errors.id = "Invalid UUID format";
  }

  // IP Address
  if (data.ip && !validator.isIP(data.ip)) {
    errors.ip = "Invalid IP address";
  }

  // Credit Card
  if (data.cardNumber && !validator.isCreditCard(data.cardNumber)) {
    errors.cardNumber = "Invalid credit card number";
  }

  // Alphanumeric
  if (!validator.isAlphanumeric(data.username)) {
    errors.username = "Username must be alphanumeric";
  }

  // Length
  if (!validator.isLength(data.password, { min: 8, max: 128 })) {
    errors.password = "Password must be 8-128 characters";
  }

  // Matches regex
  if (!validator.matches(data.username, /^[a-z0-9_]+$/i)) {
    errors.username = "Invalid username format";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// ===================================
// Escape Output (prevent XSS in templates)
// ===================================
function escapeHTML(str) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;"
  };

  return str.replace(/[&<>"'/]/g, (char) => map[char]);
}

// Usage:
const userInput = '<script>alert("XSS")</script>';
const safe = escapeHTML(userInput);
// Result: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
```

```bash
# Install sanitization packages
npm install express-mongo-sanitize validator dompurify jsdom
```

---

## Example 5: BOLA Prevention (Broken Object Level Authorization)

```javascript
// ===================================
// OWASP API #1 Security Risk
// ===================================

// ❌ VULNERABLE - No ownership check
router.get("/orders/:id", authenticate, async (req, res) => {
  const order = await Order.findByPk(req.params.id);

  if (!order) {
    throw AppError.notFound("Order");
  }

  // ANY authenticated user can view ANY order!
  res.json({ data: order });
});

// ✅ SECURE - Ownership check
router.get("/orders/:id", authenticate, async (req, res) => {
  const order = await Order.findByPk(req.params.id);

  if (!order) {
    throw AppError.notFound("Order");
  }

  // Check ownership
  if (order.userId !== req.user.id && req.user.role !== "admin") {
    throw AppError.forbidden("You can only access your own orders");
  }

  res.json({ data: order });
});

// ✅ BETTER - Query with ownership filter
router.get("/orders/:id", authenticate, async (req, res) => {
  const where = { id: req.params.id };

  // Non-admins can only see their own orders
  if (req.user.role !== "admin") {
    where.userId = req.user.id;
  }

  const order = await Order.findOne({ where });

  if (!order) {
    throw AppError.notFound("Order");
  }

  res.json({ data: order });
});

// ===================================
// Reusable Ownership Middleware
// ===================================
export function authorizeResource(
  Model,
  paramKey = "id",
  ownerField = "userId"
) {
  return async (req, res, next) => {
    const resource = await Model.findByPk(req.params[paramKey]);

    if (!resource) {
      throw AppError.notFound(Model.name);
    }

    // Admins bypass ownership check
    if (req.user.role === "admin") {
      req.resource = resource;
      return next();
    }

    // Check ownership
    if (resource[ownerField] !== req.user.id) {
      throw AppError.forbidden(
        `You can only access your own ${Model.name.toLowerCase()}s`
      );
    }

    req.resource = resource;
    next();
  };
}

// Usage:
router.put(
  "/posts/:id",
  authenticate,
  authorizeResource(Post, "id", "authorId"),
  async (req, res) => {
    const post = req.resource; // Already verified ownership
    await post.update(req.body);
    res.json({ data: post });
  }
);

// ===================================
// BOLA in Query Parameters
// ===================================
// ❌ VULNERABLE
router.get("/users", authenticate, async (req, res) => {
  const { userId } = req.query;

  // Attacker can query ANY user's data
  const posts = await Post.findAll({ where: { userId } });
  res.json({ data: posts });
});

// ✅ SECURE
router.get("/users/me/posts", authenticate, async (req, res) => {
  // Only current user's posts
  const posts = await Post.findAll({
    where: { userId: req.user.id }
  });

  res.json({ data: posts });
});

// ===================================
// Mass Assignment Prevention
// ===================================
// ❌ VULNERABLE
router.put("/users/:id", authenticate, async (req, res) => {
  // Attacker sends: { role: 'admin', isVerified: true }
  await User.update(req.body, { where: { id: req.params.id } });
  // User just made themselves admin!
});

// ✅ SECURE - Whitelist fields
router.put("/users/:id", authenticate, async (req, res) => {
  const allowedFields = ["name", "bio", "avatar"];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  await User.update(updates, { where: { id: req.params.id } });
});

// ✅ BETTER - Use Zod schema (automatic whitelist)
const updateUserSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional()
  // role NOT included → cannot be updated by user
});

router.put(
  "/users/:id",
  authenticate,
  validate(updateUserSchema),
  async (req, res) => {
    await User.update(req.validatedData, { where: { id: req.params.id } });
  }
);
```

---

## Example 6: Secrets Management

```javascript
// ===================================
// Environment Variables
// ===================================
// .env (NEVER commit to Git!)
/*
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
JWT_SECRET=supersecretkey123...
JWT_REFRESH_SECRET=anothersecretkey456...
REDIS_URL=redis://localhost:6379
ALLOWED_ORIGINS=https://myapp.com
STRIPE_SECRET_KEY=sk_live_...
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
*/

// .env.example (DO commit to Git)
/*
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
REDIS_URL=redis://localhost:6379
ALLOWED_ORIGINS=http://localhost:3000
*/

// .gitignore
/*
.env
.env.local
.env.production
*/

// ===================================
// Validate Required Environment Variables
// ===================================
// config/env.js
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().url(),

  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),

  REDIS_URL: z.string().url().optional(),

  ALLOWED_ORIGINS: z.string().transform((val) => val.split(",")),

  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),

  // AWS credentials
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional()
});

// Validate on startup
try {
  const env = envSchema.parse(process.env);
  console.log("✅ Environment variables validated");
} catch (error) {
  console.error("❌ Invalid environment variables:", error.errors);
  process.exit(1);
}

// ===================================
// Generate Strong Secrets
// ===================================
import { randomBytes } from "node:crypto";

// Generate JWT secret
const jwtSecret = randomBytes(64).toString("hex");
console.log("JWT_SECRET=" + jwtSecret);

// Generate API key
const apiKey = randomBytes(32).toString("base64url");
console.log("API_KEY=" + apiKey);

// ===================================
// AWS Secrets Manager (Production)
// ===================================
import {
  SecretsManagerClient,
  GetSecretValueCommand
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "us-east-1" });

async function getSecret(secretName) {
  try {
    const response = await client.send(
      new GetSecretValueCommand({ SecretId: secretName })
    );

    return JSON.parse(response.SecretString);
  } catch (error) {
    console.error("Error retrieving secret:", error);
    throw error;
  }
}

// Usage:
const dbCreds = await getSecret("prod/myapp/database");
// { username: 'dbuser', password: 'securepass', host: 'db.amazonaws.com' }

// ===================================
// Logging Security
// ===================================
// ❌ DON'T log sensitive data
console.log("User login:", user); // May contain password!
console.log("JWT token:", token); // Exposes authentication

// ✅ DO redact sensitive fields
function sanitizeForLog(obj) {
  const sensitive = ["password", "token", "secret", "apiKey", "creditCard"];
  const sanitized = { ...obj };

  sensitive.forEach((field) => {
    if (sanitized[field]) {
      sanitized[field] = "[REDACTED]";
    }
  });

  return sanitized;
}

console.log("User login:", sanitizeForLog(user));
// { email: 'user@example.com', password: '[REDACTED]' }
```

---

## Example 7: Security Checklist Middleware

```javascript
// middleware/securityChecks.js

// ===================================
// Comprehensive Security Stack
// ===================================
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

const app = express();

// 1. Helmet - Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    }
  })
);

// 2. CORS - Restrict origins
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(","),
    credentials: true
  })
);

// 3. Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use("/api/", limiter);

// 4. Body parsing with size limits
app.use(express.json({ limit: "10kb" })); // Prevent large payloads
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 5. MongoDB injection prevention
app.use(mongoSanitize());

// 6. Remove unnecessary headers
app.disable("x-powered-by");

// 7. Logging (sanitized)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// 8. Request timeout
app.use((req, res, next) => {
  req.setTimeout(30000, () => {
    // 30 seconds
    res.status(408).json({ error: "Request timeout" });
  });
  next();
});

// 9. HTTPS redirect (in production)
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      return res.redirect(`https://${req.header("host")}${req.url}`);
    }
    next();
  });
}

// 10. Security headers middleware
app.use((req, res, next) => {
  // Prevent browser caching of sensitive data
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  next();
});
```

---

## Comparison Table: Security Threats & Mitigations

| Threat              | Description                | Mitigation                            |
| ------------------- | -------------------------- | ------------------------------------- |
| **SQL Injection**   | Malicious SQL in input     | Parameterized queries (Sequelize ORM) |
| **NoSQL Injection** | `$where`, `$gt` operators  | express-mongo-sanitize                |
| **XSS**             | Malicious scripts in HTML  | CSP headers, DOMPurify, escape output |
| **CSRF**            | Forged cross-site requests | SameSite cookies, CSRF tokens         |
| **BOLA**            | Access others' resources   | Ownership checks in every query       |
| **Mass Assignment** | User sets admin=true       | Whitelist fields (Zod schemas)        |
| **Brute Force**     | Password guessing          | Rate limiting on /login (5 req/15min) |
| **DDoS**            | Overwhelming requests      | Rate limiting, load balancer          |
| **Clickjacking**    | Embedding in iframe        | X-Frame-Options: DENY                 |
| **MITM**            | Intercept traffic          | HTTPS only (HSTS header)              |

---

## Summary

Security best practices 2026:

1. **Helmet** - Enable all security headers (one line!)
2. **CORS** - Whitelist origins, never use `*` with credentials
3. **Rate Limiting** - Different limits for auth vs API endpoints
4. **Input Sanitization** - mongo-sanitize, validator.js, DOMPurify
5. **BOLA Prevention** - ALWAYS check resource ownership
6. **Mass Assignment** - Whitelist allowed fields (Zod)
7. **Secrets Management** - Never commit .env, validate on startup
8. **HTTPS** - Force in production, HSTS header
9. **Logging** - Redact sensitive data (passwords, tokens)
10. **Dependencies** - `npm audit`, keep packages updated

Security is not optional - implement these patterns from day one!
