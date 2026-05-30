import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const app = express();
app.use(express.json());
app.use(cookieParser());

// ─── Config ──────────────────────────────────────────────────────────────────

const ACCESS_SECRET = "access_secret_change_in_production";
const REFRESH_SECRET = "refresh_secret_change_in_production";
const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";
const REFRESH_MS = 7 * 24 * 60 * 60 * 1000;

// ─── In-memory stores ────────────────────────────────────────────────────────

const users = [];

// Set of valid refresh tokens (rotation: old one is deleted on use)
const refreshTokens = new Set();

// Map of jti → expiry timestamp for blacklisted access tokens
const blacklist = new Map();

// ─── Token helpers ───────────────────────────────────────────────────────────

function generateAccessToken(user) {
  const jti = crypto.randomUUID(); // unique token ID, used for blacklisting
  return jwt.sign({ id: user.id, email: user.email, jti }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  });
}

function generateRefreshToken(user) {
  const token = jwt.sign({ id: user.id, email: user.email }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  });
  refreshTokens.add(token);
  return token;
}

function setRefreshCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,    // JS in the browser cannot read this
    sameSite: "strict",
    maxAge: REFRESH_MS,
  });
}

function blacklistAccessToken(token) {
  try {
    const payload = jwt.decode(token);
    if (!payload?.jti || !payload?.exp) return;
    const ttl = payload.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      blacklist.set(payload.jti, Date.now() + ttl * 1000);
    }
  } catch {
    // ignore malformed tokens
  }
}

function isBlacklisted(jti) {
  if (!blacklist.has(jti)) return false;
  if (Date.now() > blacklist.get(jti)) {
    blacklist.delete(jti); // expired — clean up
    return false;
  }
  return true;
}

// ─── Auth middleware ──────────────────────────────────────────────────────────

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, ACCESS_SECRET);

    if (isBlacklisted(payload.jti)) {
      return res.status(401).json({ message: "Token has been revoked" });
    }

    req.user = payload;
    req.token = token; // needed so logout can blacklist it
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired access token" });
  }
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// POST /auth/register
app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email and password are required" });
  }

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
app.post("/auth/login", async (req, res) => {
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

// POST /auth/refresh  — uses httpOnly cookie, no body needed
app.post("/auth/refresh", (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token || !refreshTokens.has(token)) {
    return res.status(401).json({ message: "Invalid or missing refresh token" });
  }

  try {
    const payload = jwt.verify(token, REFRESH_SECRET);

    // Token rotation: revoke old, issue new pair
    refreshTokens.delete(token);
    const user = { id: payload.id, email: payload.email };
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    setRefreshCookie(res, newRefreshToken);

    res.json({ accessToken: newAccessToken });
  } catch {
    refreshTokens.delete(token);
    res.clearCookie("refreshToken");
    res.status(401).json({ message: "Refresh token expired — please log in again" });
  }
});

// POST /auth/logout  — protected
app.post("/auth/logout", authenticate, (req, res) => {
  // Blacklist the current access token so it can't be reused
  blacklistAccessToken(req.token);

  // Revoke the refresh token
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

// GET /auth/me  — protected
app.get("/auth/me", authenticate, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

// POST /auth/change-password  — protected
app.post("/auth/change-password", authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "currentPassword and newPassword are required" });
  }

  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);

  // Blacklist current access token — user must log in again with the new password
  blacklistAccessToken(req.token);
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) refreshTokens.delete(refreshToken);
  res.clearCookie("refreshToken");

  res.json({ message: "Password changed. Please log in again." });
});

// ─── Start ───────────────────────────────────────────────────────────────────

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`JWT Advanced server running on http://localhost:${PORT}`);
  console.log("");
  console.log("  POST /auth/register        — create account");
  console.log("  POST /auth/login           — get access + refresh tokens");
  console.log("  POST /auth/refresh         — rotate tokens using cookie");
  console.log("  POST /auth/logout          — blacklist token + revoke cookie");
  console.log("  GET  /auth/me              — get current user  [protected]");
  console.log("  POST /auth/change-password — change password   [protected]");
});
