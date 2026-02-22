// utils/random.js
import { randomBytes, randomInt, randomUUID } from "node:crypto";

// Random Bytes
// Generate secure random token
export function generateToken(length = 32) {
  return randomBytes(length).toString("hex"); // 64 hex chars
}

// Base64 URL-safe token
export function generateUrlSafeToken(length = 32) {
  return randomBytes(length).toString("base64url"); // No +, /, =
}

// Usage examples
const resetToken = generateToken(32);
console.log("Password reset token:", resetToken);

const apiKey = generateUrlSafeToken(32);
console.log("API key:", apiKey);

// Random UUID
const userId = randomUUID();
console.log("User ID:", userId);
// 6ba7b810-9dad-11d1-80b4-00c04fd430c8

// Random Integer
// Random number between min (inclusive) and max (exclusive)
const randomNum = randomInt(1, 101); // 1-100
console.log("Random number:", randomNum);

// Random OTP (6 digits)
const otp = randomInt(100000, 1000000);
console.log("OTP:", otp);

// Session ID Generator
export function generateSessionId() {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(16).toString("hex");
  return `${timestamp}-${random}`;
}

const sessionId = generateSessionId();
console.log("Session ID:", sessionId);

// Generate multiple tokens
console.log("\nGenerating 5 unique tokens:");
for (let i = 0; i < 5; i++) {
  console.log(`${i + 1}. ${generateToken(16)}`);
}

// Why NOT Math.random()?
console.log("\n⚠️  NEVER use Math.random() for security!");
console.log("- Math.random() is NOT cryptographically secure");
console.log("- It's predictable with enough samples");
console.log("- Not suitable for tokens, passwords, or keys");
console.log(
  "\n✅ Always use randomBytes() for security-critical random values"
);
console.log("- Uses OS-level entropy");
console.log("- Unpredictable");
console.log("- Suitable for passwords, tokens, keys");
