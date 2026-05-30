import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const router = express.Router();

const ACCESS_SECRET = "access_secret_change_in_production";
const REFRESH_SECRET = "refresh_secret_change_in_production";

// In-memory stores (restart = data gone)
const users = [];
const refreshTokens = new Set(); // valid refresh tokens

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateAccessToken(user) {
  // Short-lived: expires in 15 minutes
  return jwt.sign({ id: user.id, email: user.email }, ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

function generateRefreshToken(user) {
  // Long-lived: expires in 7 days
  const token = jwt.sign({ id: user.id, email: user.email }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
  refreshTokens.add(token); // store it
  return token;
}

function setRefreshCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,   // JS cannot access this cookie
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
}

// ─── Routes ─────────────────────────────────────────────────────────────────

// POST /auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: crypto.randomUUID(), name, email, password: hashedPassword };
  users.push(user);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  setRefreshCookie(res, refreshToken);

  res.status(201).json({
    accessToken,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  setRefreshCookie(res, refreshToken);

  res.json({
    accessToken,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// POST /auth/refresh — use the httpOnly cookie to get a new access token
router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token || !refreshTokens.has(token)) {
    return res.status(401).json({ message: "Invalid or missing refresh token" });
  }

  try {
    const payload = jwt.verify(token, REFRESH_SECRET);

    // Token rotation: revoke old refresh token, issue new one
    refreshTokens.delete(token);
    const user = { id: payload.id, email: payload.email };
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    setRefreshCookie(res, newRefreshToken);

    res.json({ accessToken: newAccessToken });
  } catch {
    // Token expired or tampered — clean up
    refreshTokens.delete(token);
    res.clearCookie("refreshToken");
    res.status(401).json({ message: "Refresh token expired, please login again" });
  }
});

// POST /auth/logout
router.post("/logout", (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    refreshTokens.delete(token); // revoke it
  }
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

// GET /auth/me — protected, requires "Authorization: Bearer <accessToken>"
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, ACCESS_SECRET);
    const user = users.find((u) => u.id === payload.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch {
    res.status(401).json({ message: "Invalid or expired access token" });
  }
});

export default router;
