# Day 3 - Presentation 3: Authentication & Authorization - Code Examples

---

## Example 1: Password Hashing with argon2

```javascript
// utils/password.js
import argon2 from "argon2";

// ===================================
// Hash Password
// ===================================
export async function hashPassword(password) {
  // argon2id is recommended (hybrid of argon2i and argon2d)
  const hash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB (default)
    timeCost: 3, // Number of iterations
    parallelism: 4 // Number of threads
  });

  return hash;
  // Result: $argon2id$v=19$m=65536,t=3,p=4$...
}

// ===================================
// Verify Password
// ===================================
export async function verifyPassword(hash, password) {
  try {
    const isValid = await argon2.verify(hash, password);
    return isValid;
  } catch (error) {
    return false;
  }
}

// Usage in registration
async function register(req, res) {
  const { email, password, name } = req.body;

  // Hash password before saving
  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  res.status(201).json({ data: user });
}

// Usage in login
async function login(req, res) {
  const { email, password } = req.body;

  // Find user and include password field
  const user = await User.findOne({
    where: { email },
    attributes: { include: ["password"] }
  });

  if (!user) {
    throw AppError.unauthorized("Invalid credentials");
  }

  // Verify password
  const isValid = await verifyPassword(user.password, password);

  if (!isValid) {
    throw AppError.unauthorized("Invalid credentials");
  }

  // Generate tokens...
  const tokens = generateTokens(user);
  res.json({ data: { user, ...tokens } });
}

// ===================================
// Why argon2 over bcrypt?
// ===================================
// - Winner of Password Hashing Competition 2015
// - Resistant to GPU/ASIC attacks (uses memory-hard algorithm)
// - Faster and more secure than bcrypt
// - Three variants: argon2i, argon2d, argon2id (recommended)

// bcrypt alternative (still secure)
import bcrypt from "bcrypt";

export async function bcryptHash(password) {
  const saltRounds = 12; // Higher = more secure but slower
  return await bcrypt.hash(password, saltRounds);
}

export async function bcryptVerify(hash, password) {
  return await bcrypt.compare(password, hash);
}
```

```bash
# Install argon2
npm install argon2

# For bcrypt
npm install bcrypt
```

---

## Example 2: JWT - Access Tokens

```javascript
// utils/jwt.js
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

// ===================================
// Generate Access Token (Short-lived)
// ===================================
export function generateAccessToken(user) {
  const payload = {
    sub: user.id, // Subject (user ID)
    email: user.email,
    role: user.role,
    type: "access",
    jti: randomUUID() // JWT ID (for blacklisting)
  };

  // Sign token
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m", // 15 minutes
    issuer: "my-app",
    audience: "my-app-users"
  });

  return token;
}

// ===================================
// Verify Access Token
// ===================================
export function verifyAccessToken(token) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "my-app",
      audience: "my-app-users"
    });

    return payload;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError("Token expired", 401);
    }
    if (error.name === "JsonWebTokenError") {
      throw new AppError("Invalid token", 401);
    }
    throw error;
  }
}

// ===================================
// Decode without verification (for inspection)
// ===================================
export function decodeToken(token) {
  return jwt.decode(token); // Returns payload without verifying signature
}

// ===================================
// JWT Anatomy
// ===================================
// Token format: header.payload.signature

// Header (Base64URL encoded):
// {
//   "alg": "HS256",
//   "typ": "JWT"
// }

// Payload (Base64URL encoded):
// {
//   "sub": "user123",
//   "role": "admin",
//   "iat": 1640000000,
//   "exp": 1640000900
// }

// Signature:
// HMACSHA256(
//   base64UrlEncode(header) + "." + base64UrlEncode(payload),
//   secret
// )

// ⚠️ WARNING: JWT is NOT encrypted, only signed
// Anyone can decode and read the payload
// NEVER store sensitive data (passwords, credit cards) in JWT
```

```bash
# Install jsonwebtoken
npm install jsonwebtoken

# Generate strong secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Example 3: Refresh Tokens with Rotation

```javascript
// models/RefreshToken.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    token: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      }
    },

    familyId: {
      type: DataTypes.UUID,
      allowNull: false // All tokens in same "session" share familyId
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },

    isRevoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    replacedBy: {
      type: DataTypes.STRING(500),
      allowNull: true // Points to new token after rotation
    }
  },
  {
    tableName: "refresh_tokens",
    timestamps: true,
    indexes: [
      { fields: ["token"] },
      { fields: ["userId"] },
      { fields: ["familyId"] }
    ]
  }
);

// ===================================
// Generate Refresh Token
// ===================================
import { randomUUID } from "node:crypto";

export async function generateRefreshToken(user, familyId = null) {
  const payload = {
    sub: user.id,
    type: "refresh",
    familyId: familyId || randomUUID(), // New family or continue existing
    jti: randomUUID()
  };

  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d" // 7 days
  });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Store in database
  await RefreshToken.create({
    token,
    userId: user.id,
    familyId: payload.familyId,
    expiresAt
  });

  return token;
}

// ===================================
// Rotate Refresh Token
// ===================================
export async function rotateRefreshToken(oldToken) {
  // Verify old token
  const payload = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET);

  // Find token in database
  const tokenRecord = await RefreshToken.findOne({
    where: { token: oldToken }
  });

  if (!tokenRecord) {
    throw new AppError("Token not found", 401);
  }

  if (tokenRecord.isRevoked) {
    // REUSE DETECTION!
    // Old token was used → revoke entire family
    await RefreshToken.update(
      { isRevoked: true },
      { where: { familyId: tokenRecord.familyId } }
    );

    throw new AppError("Token reuse detected - all tokens revoked", 401);
  }

  if (new Date() > tokenRecord.expiresAt) {
    throw new AppError("Token expired", 401);
  }

  // Generate new tokens
  const user = { id: payload.sub };
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = await generateRefreshToken(
    user,
    tokenRecord.familyId
  );

  // Mark old token as replaced
  await tokenRecord.update({
    isRevoked: true,
    replacedBy: newRefreshToken
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
}

// ===================================
// Login with Tokens
// ===================================
export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user || !(await verifyPassword(user.password, password))) {
    throw AppError.unauthorized("Invalid credentials");
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  // Send refresh token as HttpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Not accessible via JavaScript
    secure: true, // HTTPS only
    sameSite: "strict", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({
    data: {
      user: { id: user.id, email: user.email, role: user.role },
      accessToken
      // refreshToken NOT in response body (only in cookie)
    }
  });
}

// ===================================
// Refresh Endpoint
// ===================================
export async function refresh(req, res) {
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken) {
    throw AppError.unauthorized("No refresh token");
  }

  // Rotate token
  const tokens = await rotateRefreshToken(oldRefreshToken);

  // Send new refresh token as cookie
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    data: { accessToken: tokens.accessToken }
  });
}

// ===================================
// Logout
// ===================================
export async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    // Revoke token and its family
    const tokenRecord = await RefreshToken.findOne({
      where: { token: refreshToken }
    });

    if (tokenRecord) {
      await RefreshToken.update(
        { isRevoked: true },
        { where: { familyId: tokenRecord.familyId } }
      );
    }
  }

  // Clear cookie
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out successfully" });
}
```

---

## Example 4: Access Token Blacklisting with Redis

```javascript
// utils/blacklist.js
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});

await redis.connect();

redis.on("error", (err) => console.error("Redis error:", err));

// ===================================
// Add Token to Blacklist
// ===================================
export async function blacklistToken(jti, expiresIn) {
  // Save token ID with TTL (auto-delete when token expires)
  await redis.setEx(`blacklist:${jti}`, expiresIn, "1");
}

// ===================================
// Check if Token is Blacklisted
// ===================================
export async function isBlacklisted(jti) {
  const exists = await redis.exists(`blacklist:${jti}`);
  return exists === 1;
}

// ===================================
// Logout (Add Access Token to Blacklist)
// ===================================
export async function logout(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    const payload = jwt.decode(token);
    const ttl = payload.exp - Math.floor(Date.now() / 1000);

    if (ttl > 0) {
      await blacklistToken(payload.jti, ttl);
    }
  }

  // Also revoke refresh token...

  res.json({ message: "Logged out successfully" });
}

// ===================================
// Cleanup Strategy
// ===================================
// Redis automatically removes keys when TTL expires
// No manual cleanup needed!

// Optional: Track all active sessions for a user
export async function getUserSessions(userId) {
  const sessions = await RefreshToken.findAll({
    where: {
      userId,
      isRevoked: false,
      expiresAt: { [Op.gt]: new Date() }
    }
  });

  return sessions;
}

// Revoke all sessions for a user
export async function revokeAllSessions(userId) {
  await RefreshToken.update({ isRevoked: true }, { where: { userId } });
}
```

```bash
# Install Redis client
npm install redis

# Run Redis with Docker
docker run -d --name redis -p 6379:6379 redis:latest
```

---

## Example 5: Authentication Middleware

```javascript
// middleware/auth.js
import { verifyAccessToken } from "../utils/jwt.js";
import { isBlacklisted } from "../utils/blacklist.js";
import AppError from "../utils/AppError.js";

// ===================================
// Authenticate Middleware
// ===================================
export async function authenticate(req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw AppError.unauthorized("No token provided");
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const payload = verifyAccessToken(token);

    // Check if token is blacklisted
    const blacklisted = await isBlacklisted(payload.jti);

    if (blacklisted) {
      throw AppError.unauthorized("Token has been revoked");
    }

    // Attach user to request
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired",
        code: "token_expired"
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token",
        code: "invalid_token"
      });
    }

    next(error);
  }
}

// ===================================
// Optional Authentication (for public endpoints with optional auth)
// ===================================
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      req.user = null; // No user, but continue
      return next();
    }

    // Same logic as authenticate
    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    const blacklisted = await isBlacklisted(payload.jti);
    if (!blacklisted) {
      req.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    req.user = null; // Invalid token, but continue
    next();
  }
}

// Usage:
// Protected route
router.get("/profile", authenticate, (req, res) => {
  res.json({ data: req.user });
});

// Public route with optional auth
router.get("/posts", optionalAuth, (req, res) => {
  // req.user exists if authenticated, null otherwise
  const posts = req.user ? getPersonalizedPosts(req.user.id) : getPublicPosts();
  res.json({ data: posts });
});
```

---

## Example 6: Authorization (RBAC)

```javascript
// middleware/authorize.js

// ===================================
// Role-Based Access Control (RBAC)
// ===================================
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw AppError.forbidden(`Requires one of: ${allowedRoles.join(", ")}`);
    }

    next();
  };
}

// Usage:
// Only admins can access
router.delete("/users/:id", authenticate, authorize("admin"), deleteUser);

// Admins or moderators
router.post(
  "/posts/:id/hide",
  authenticate,
  authorize("admin", "moderator"),
  hidePost
);

// ===================================
// Resource Ownership Check (BOLA Protection)
// ===================================
export function authorizeOwner(getResourceUserId) {
  return async (req, res, next) => {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }

    // Admins bypass ownership check
    if (req.user.role === "admin") {
      return next();
    }

    // Get resource owner ID
    const resourceUserId = await getResourceUserId(req);

    if (resourceUserId !== req.user.id) {
      throw AppError.forbidden("You can only access your own resources");
    }

    next();
  };
}

// Usage:
router.put(
  "/posts/:id",
  authenticate,
  authorizeOwner(async (req) => {
    const post = await Post.findByPk(req.params.id);
    if (!post) throw AppError.notFound("Post");
    return post.authorId;
  }),
  updatePost
);

// ===================================
// Permission-Based Authorization
// ===================================
const PERMISSIONS = {
  "users:read": ["admin", "moderator", "user"],
  "users:write": ["admin"],
  "users:delete": ["admin"],
  "posts:read": ["admin", "moderator", "user"],
  "posts:write": ["admin", "moderator", "user"],
  "posts:delete": ["admin", "moderator"]
};

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }

    const allowedRoles = PERMISSIONS[permission];

    if (!allowedRoles || !allowedRoles.includes(req.user.role)) {
      throw AppError.forbidden(`Missing permission: ${permission}`);
    }

    next();
  };
}

// Usage:
router.delete(
  "/users/:id",
  authenticate,
  requirePermission("users:delete"),
  deleteUser
);
```

---

## Example 7: Complete Auth Flow

```javascript
// routes/auth.routes.js
import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

const router = Router();

// Public routes
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh); // Uses cookie

// Protected routes
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getCurrentUser);
router.post("/change-password", authenticate, authController.changePassword);

export default router;

// controllers/auth.controller.js
export async function register(req, res) {
  const { name, email, password } = req.validatedData;

  // Check if user exists
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw AppError.conflict("Email already registered");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  // Set cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(201).json({
    data: {
      user: { id: user.id, email: user.email, name: user.name },
      accessToken
    }
  });
}

export async function login(req, res) {
  const { email, password } = req.validatedData;

  const user = await User.scope("withPassword").findOne({ where: { email } });

  if (!user || !(await verifyPassword(user.password, password))) {
    // Rate limit this! (express-rate-limit)
    throw AppError.unauthorized("Invalid credentials");
  }

  if (!user.isActive) {
    throw AppError.forbidden("Account is disabled");
  }

  // Update last login
  await user.update({ lastLoginAt: new Date() });

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    data: {
      user: { id: user.id, email: user.email, role: user.role },
      accessToken
    }
  });
}

export async function logout(req, res) {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;

  // Blacklist access token
  if (accessToken) {
    const payload = jwt.decode(accessToken);
    const ttl = payload.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await blacklistToken(payload.jti, ttl);
    }
  }

  // Revoke refresh token
  if (refreshToken) {
    const tokenRecord = await RefreshToken.findOne({
      where: { token: refreshToken }
    });
    if (tokenRecord) {
      await RefreshToken.update(
        { isRevoked: true },
        { where: { familyId: tokenRecord.familyId } }
      );
    }
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
}

export async function getCurrentUser(req, res) {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["password"] }
  });

  res.json({ data: user });
}
```

---

## Comparison Table: Stateful vs Stateless

| Aspect         | Stateful (Sessions)            | Stateless (JWT)           |
| -------------- | ------------------------------ | ------------------------- |
| **Storage**    | Server (DB/Redis)              | Client (token)            |
| **Scaling**    | Complex (shared session store) | Simple (no server state)  |
| **Revocation** | Easy (delete session)          | Hard (needs blacklist)    |
| **Size**       | Small (session ID)             | Large (entire payload)    |
| **Security**   | Server controls everything     | Token visible to client   |
| **Use Case**   | Monolithic apps                | APIs, microservices, SPAs |

---

## Summary

Modern authentication patterns 2026:

1. **Password Hashing** - argon2 (recommended) or bcrypt
2. **Access Tokens** - Short-lived (15min), contain user info (id, role)
3. **Refresh Tokens** - Long-lived (7 days), stored in database
4. **Token Rotation** - New refresh token on each use, detect reuse
5. **Blacklisting** - Redis with TTL for revoked access tokens
6. **HttpOnly Cookies** - Store refresh tokens securely
7. **Authentication Middleware** - Verify token, check blacklist
8. **Authorization** - RBAC (roles), ownership checks (BOLA)
9. **Security** - HTTPS only, SameSite=strict, rate limiting on login

Never store passwords in plain text, never put sensitive data in JWT payload!
