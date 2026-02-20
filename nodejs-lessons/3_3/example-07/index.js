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