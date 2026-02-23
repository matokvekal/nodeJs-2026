# Day 4 - Presentation 2: Crypto in Node.js - Code Examples

---

## Example 1: Hash Functions (SHA-256, SHA-512)

```javascript
// utils/hash.js
import { createHash } from 'node:crypto';

// ===================================
// Basic Hashing
// ===================================
export function hash(data, algorithm = 'sha256') {
  return createHash(algorithm)
    .update(data)
    .digest('hex');
}

// Examples
const sha256 = hash('Hello World', 'sha256');
console.log('SHA-256:', sha256);
// a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e

const sha512 = hash('Hello World', 'sha512');
console.log('SHA-512:', sha512);
// 2c74fd17edafd80e8447b0d46741ee243b7eb74dd2149a0ab1b9246fb30382f27e853d8585719e0e67cbda0daa8f51671064615d645ae27acb15bfb1447f459b

// ===================================
// File Hashing (Checksum)
// ===================================
import { createReadStream } from 'node:fs';

export function hashFile(filePath, algorithm = 'sha256') {
  return new Promise((resolve, reject) => {
    const hash = createHash(algorithm);
    const stream = createReadStream(filePath);

    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

// Usage
const fileHash = await hashFile('./document.pdf');
console.log('File hash:', fileHash);

// ===================================
// ETag for HTTP Caching
// ===================================
import express from 'express';

const app = express();

app.get('/api/data', (req, res) => {
  const data = { users: [/* ...large dataset... */] };
  const content = JSON.stringify(data);

  // Generate ETag from content hash
  const etag = hash(content, 'sha256').substring(0, 16);

  // Check If-None-Match header
  if (req.headers['if-none-match'] === etag) {
    return res.status(304).send();  // Not Modified
  }

  res.setHeader('ETag', etag);
  res.setHeader('Cache-Control', 'max-age=3600');
  res.json(data);
});

// ===================================
// Hash Comparison (Content Verification)
// ===================================
export function verifyFileIntegrity(filePath, expectedHash) {
  const actualHash = await hashFile(filePath);
  return actualHash === expectedHash;
}

// Download file verification
const downloadedHash = await hashFile('./downloaded.zip');
const expectedHash = 'abc123...';

if (downloadedHash === expectedHash) {
  console.log(' File integrity verified');
} else {
  console.log('  File corrupted or tampered');
}

// ===================================
// Available Algorithms
// ===================================
import { getHashes } from 'node:crypto';

console.log(getHashes());
// ['sha1', 'sha224', 'sha256', 'sha384', 'sha512', 'md5', 'blake2b512', ...]

// Recommended: sha256, sha512, blake2b512
// Avoid: md5, sha1 (broken for security purposes)
```

---

## Example 2: HMAC (Hash-based Message Authentication Code)

```javascript
// utils/hmac.js
import { createHmac, timingSafeEqual } from "node:crypto";

// ===================================
// Generate HMAC Signature
// ===================================
export function sign(data, secret, algorithm = "sha256") {
  return createHmac(algorithm, secret).update(data).digest("hex");
}

// ===================================
// Verify HMAC Signature
// ===================================
export function verify(data, signature, secret, algorithm = "sha256") {
  const expected = sign(data, secret, algorithm);

  // Timing-safe comparison (prevent timing attacks)
  return timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expected, "hex")
  );
}

// ===================================
// Webhook Signature Verification
// ===================================
// Scenario: GitHub, Stripe send webhooks with HMAC signature

import express from "express";

const app = express();

// Webhook handler
app.post(
  "/webhooks/github",
  express.raw({ type: "application/json" }), // Get raw body
  (req, res) => {
    const signature = req.headers["x-hub-signature-256"]; // SHA-256 signature
    const secret = process.env.GITHUB_WEBHOOK_SECRET;

    // signature format: "sha256=<hex>"
    const receivedSig = signature?.split("=")[1];

    if (!receivedSig) {
      return res.status(401).json({ error: "No signature" });
    }

    // Verify signature
    const expectedSig = sign(req.body, secret, "sha256");
    const isValid = timingSafeEqual(
      Buffer.from(receivedSig, "hex"),
      Buffer.from(expectedSig, "hex")
    );

    if (!isValid) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Process webhook
    const payload = JSON.parse(req.body.toString());
    console.log("Webhook verified:", payload);

    res.json({ message: "Webhook received" });
  }
);

// ===================================
// API Request Signing (Client)
// ===================================
// Sign requests to prevent tampering

function signRequest(method, path, body, secret) {
  const timestamp = Date.now();
  const payload = `${method}:${path}:${timestamp}:${JSON.stringify(body)}`;
  const signature = sign(payload, secret);

  return {
    headers: {
      "X-Signature": signature,
      "X-Timestamp": timestamp
    }
  };
}

// Server verification
function verifyRequest(req, secret) {
  const receivedSig = req.headers["x-signature"];
  const timestamp = req.headers["x-timestamp"];

  // Check timestamp (prevent replay attacks)
  const age = Date.now() - parseInt(timestamp);
  if (age > 5 * 60 * 1000) {
    // 5 minutes
    throw new Error("Request expired");
  }

  const payload = `${req.method}:${req.path}:${timestamp}:${JSON.stringify(req.body)}`;
  const expectedSig = sign(payload, secret);

  if (!timingSafeEqual(Buffer.from(receivedSig), Buffer.from(expectedSig))) {
    throw new Error("Invalid signature");
  }
}

// ===================================
// Why timingSafeEqual?
// ===================================
//   BAD - Timing attack vulnerable
if (expected === received) {
}
// Early exit on first mismatch → attacker can measure time differences

//  GOOD - Constant-time comparison
timingSafeEqual(Buffer.from(expected), Buffer.from(received));
// Always takes same time, regardless of where mismatch occurs
```

---

## Example 3: Random Values (Cryptographically Secure)

```javascript
// utils/random.js
import { randomBytes, randomInt, randomUUID } from "node:crypto";

// ===================================
// Random Bytes
// ===================================
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

// ===================================
// Random UUID
// ===================================
const userId = randomUUID();
console.log("User ID:", userId);
// 6ba7b810-9dad-11d1-80b4-00c04fd430c8

// ===================================
// Random Integer
// ===================================
// Random number between min (inclusive) and max (exclusive)
const randomNum = randomInt(1, 101); // 1-100
console.log("Random number:", randomNum);

// Random OTP (6 digits)
const otp = randomInt(100000, 1000000);
console.log("OTP:", otp);
// 437829

// ===================================
// Session ID Generator
// ===================================
export function generateSessionId() {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(16).toString("hex");
  return `${timestamp}-${random}`;
}

const sessionId = generateSessionId();
console.log("Session ID:", sessionId);

// ===================================
// Password Reset Token
// ===================================
import { User } from "../models/User.model.js";

export async function createPasswordResetToken(userId) {
  const token = randomBytes(32).toString("hex");
  const hashedToken = hash(token); // Store hash, not plain token

  await User.update(
    {
      resetToken: hashedToken,
      resetTokenExpires: new Date(Date.now() + 3600000) // 1 hour
    },
    { where: { id: userId } }
  );

  return token; // Send to user via email
}

export async function verifyPasswordResetToken(token) {
  const hashedToken = hash(token);

  const user = await User.findOne({
    where: {
      resetToken: hashedToken,
      resetTokenExpires: { [Op.gt]: new Date() }
    }
  });

  return user;
}

// ===================================
// Why NOT Math.random()?
// ===================================
//   Math.random() is NOT cryptographically secure
// - Predictable with enough samples
// - Not suitable for security tokens

//  randomBytes() uses OS-level entropy
// - Unpredictable
// - Suitable for passwords, tokens, keys
```

---

## Example 4: Symmetric Encryption (AES-256-GCM)

```javascript
// utils/encryption.js
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// ===================================
// Encrypt Data
// ===================================
export function encrypt(text, key) {
  // Key must be 32 bytes for AES-256
  if (key.length !== 32) {
    throw new Error("Key must be 32 bytes");
  }

  const iv = randomBytes(16); // Initialization Vector (16 bytes)
  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final()
  ]);

  const authTag = cipher.getAuthTag(); // Authentication tag (GCM mode)

  // Return all components (need all for decryption)
  return {
    iv: iv.toString("hex"),
    encrypted: encrypted.toString("hex"),
    authTag: authTag.toString("hex")
  };
}

// ===================================
// Decrypt Data
// ===================================
export function decrypt(encryptedData, key) {
  const { iv, encrypted, authTag } = encryptedData;

  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "hex"));

  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted, "hex")),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
}

// ===================================
// Usage Example
// ===================================
// Generate encryption key (store securely!)
const encryptionKey = randomBytes(32); // 256 bits

// Encrypt sensitive data
const plaintext = "Sensitive user data: SSN 123-45-6789";
const encrypted = encrypt(plaintext, encryptionKey);

console.log("Encrypted:", encrypted);
// {
//   iv: 'a1b2c3...',
//   encrypted: 'd4e5f6...',
//   authTag: 'g7h8i9...'
// }

// Decrypt
const decrypted = decrypt(encrypted, encryptionKey);
console.log("Decrypted:", decrypted);
// 'Sensitive user data: SSN 123-45-6789'

// ===================================
// Store Encrypted Data in Database
// ===================================
import { DataTypes } from "sequelize";

const User = sequelize.define("User", {
  email: DataTypes.STRING,
  encryptedSsn: DataTypes.TEXT, // JSON string

  // Virtual field
  ssn: {
    type: DataTypes.VIRTUAL,
    get() {
      const encryptedData = JSON.parse(this.getDataValue("encryptedSsn"));
      return decrypt(encryptedData, ENCRYPTION_KEY);
    },
    set(value) {
      const encrypted = encrypt(value, ENCRYPTION_KEY);
      this.setDataValue("encryptedSsn", JSON.stringify(encrypted));
    }
  }
});

// Usage
const user = await User.create({
  email: "user@example.com",
  ssn: "123-45-6789" // Automatically encrypted
});

console.log(user.ssn); // Automatically decrypted: '123-45-6789'

// ===================================
// Why AES-256-GCM?
// ===================================
// - AES-256: Industry standard, very secure
// - GCM: Galois/Counter Mode - provides authentication (AEAD)
// - Detects tampering (authTag verification)
// - Fast on modern CPUs (hardware acceleration)
```

---

## Example 5: Asymmetric Encryption (RSA, ECDSA)

```javascript
// utils/asymmetric.js
import { generateKeyPairSync, sign, verify } from "node:crypto";

// ===================================
// Generate RSA Key Pair
// ===================================
export function generateRSAKeyPair() {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048, // 2048 or 4096 bits
    publicKeyEncoding: {
      type: "spki",
      format: "pem"
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem"
    }
  });

  return { publicKey, privateKey };
}

// ===================================
// Generate ECDSA Key Pair (Elliptic Curve)
// ===================================
export function generateECDSAKeyPair() {
  const { publicKey, privateKey } = generateKeyPairSync("ec", {
    namedCurve: "P-256", // or 'P-384', 'P-521'
    publicKeyEncoding: {
      type: "spki",
      format: "pem"
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem"
    }
  });

  return { publicKey, privateKey };
}

// Usage
const rsaKeys = generateRSAKeyPair();
console.log("RSA Public Key:", rsaKeys.publicKey);
console.log("RSA Private Key:", rsaKeys.privateKey);

const ecKeys = generateECDSAKeyPair();
console.log("ECDSA Public Key:", ecKeys.publicKey);

// ===================================
// Sign Data
// ===================================
export function signData(data, privateKey, algorithm = "sha256") {
  const signature = sign(algorithm, Buffer.from(data), {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING
  });

  return signature.toString("base64");
}

// ===================================
// Verify Signature
// ===================================
export function verifySignature(
  data,
  signature,
  publicKey,
  algorithm = "sha256"
) {
  return verify(
    algorithm,
    Buffer.from(data),
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING
    },
    Buffer.from(signature, "base64")
  );
}

// ===================================
// JWT with RS256 (RSA Signature)
// ===================================
import jwt from "jsonwebtoken";

const { publicKey, privateKey } = generateRSAKeyPair();

// Sign JWT with private key
const token = jwt.sign({ userId: "123", role: "admin" }, privateKey, {
  algorithm: "RS256",
  expiresIn: "1h"
});

// Verify JWT with public key (can be shared)
const payload = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

console.log("Payload:", payload);

// ===================================
// Use Case: Microservices
// ===================================
// Auth service signs JWTs with private key
// Other services verify with public key (no shared secret!)

// Auth Service:
const authToken = jwt.sign(userData, PRIVATE_KEY, { algorithm: "RS256" });

// API Service (has public key only):
const verified = jwt.verify(authToken, PUBLIC_KEY, { algorithms: ["RS256"] });
// No need to share private key across services!

// ===================================
// Save Keys to Files
// ===================================
import { writeFileSync, readFileSync } from "node:fs";

const keys = generateRSAKeyPair();

writeFileSync("private.pem", keys.privateKey);
writeFileSync("public.pem", keys.publicKey);

// Load keys
const privateKey = readFileSync("private.pem", "utf8");
const publicKey = readFileSync("public.pem", "utf8");

// ⚠️ NEVER commit private keys to Git!
// Store in secure vault (AWS Secrets Manager, HashiCorp Vault)
```

---

## Example 6: Password Derivation (PBKDF2, scrypt)

```javascript
// utils/passwordDerivation.js
import { pbkdf2, scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const pbkdf2Async = promisify(pbkdf2);
const scryptAsync = promisify(scrypt);

// ===================================
// PBKDF2 (Password-Based Key Derivation Function 2)
// ===================================
export async function hashPasswordPBKDF2(password) {
  const salt = randomBytes(16);
  const iterations = 100000; // Higher = slower = more secure
  const keylen = 64;
  const digest = "sha512";

  const hash = await pbkdf2Async(password, salt, iterations, keylen, digest);

  // Store salt + hash together
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPasswordPBKDF2(password, storedHash) {
  const [salt, hash] = storedHash.split(":");

  const derivedHash = await pbkdf2Async(
    password,
    Buffer.from(salt, "hex"),
    100000,
    64,
    "sha512"
  );

  return timingSafeEqual(Buffer.from(hash, "hex"), derivedHash);
}

// ===================================
// scrypt (Modern Alternative)
// ===================================
export async function hashPasswordScrypt(password) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);

  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPasswordScrypt(password, storedHash) {
  const [salt, hash] = storedHash.split(":");

  const derivedHash = await scryptAsync(password, Buffer.from(salt, "hex"), 64);

  return timingSafeEqual(Buffer.from(hash, "hex"), derivedHash);
}

// ===================================
// Derive Encryption Key from Password
// ===================================
export async function deriveKeyFromPassword(password, salt) {
  // Derive 256-bit key for AES-256
  const key = await scryptAsync(password, salt, 32);
  return key;
}

// Usage: Encrypt file with password
const password = "user-password";
const salt = randomBytes(16);
const key = await deriveKeyFromPassword(password, salt);

const encrypted = encrypt(data, key); // Use derived key

// Note: Store salt with encrypted data (not secret)
```

---

## Comparison Table: Symmetric vs Asymmetric

| Aspect               | Symmetric (AES)      | Asymmetric (RSA/ECDSA)           |
| -------------------- | -------------------- | -------------------------------- |
| **Keys**             | One shared key       | Public + Private pair            |
| **Speed**            | Very fast            | Slow                             |
| **Key Size**         | 256 bits             | 2048-4096 bits (RSA)             |
| **Use Cases**        | Bulk data encryption | Digital signatures, key exchange |
| **Key Distribution** | Must share securely  | Public key can be freely shared  |
| **JWT**              | HS256, HS512         | RS256, ES256                     |
| **Example**          | AES-256-GCM          | RSA-2048, ECDSA P-256            |

---

## Comparison Table: Hashing Algorithms

| Algorithm   | Security | Speed     | Output Size  | Use Case               |
| ----------- | -------- | --------- | ------------ | ---------------------- |
| **MD5**     | Broken   | Very fast | 128 bits     | Legacy checksums only  |
| **SHA-1**   | Broken   | Fast      | 160 bits     | Avoid for security     |
| **SHA-256** | Secure   | Fast      | 256 bits     | General hashing, ETags |
| **SHA-512** | Secure   | Fast      | 512 bits     | High security          |
| **BLAKE2b** | Secure   | Fastest   | Configurable | Modern alternative     |

---

## Summary

Node.js crypto best practices:

1. **Hash** - SHA-256/SHA-512 for integrity, NOT passwords
2. **HMAC** - Sign webhooks, API requests with shared secret
3. **timingSafeEqual** - Always use for signature comparison
4. **randomBytes** - Cryptographically secure random (tokens, keys)
5. **AES-256-GCM** - Symmetric encryption for data
6. **RSA/ECDSA** - Asymmetric for signatures, JWT RS256/ES256
7. **Password Hashing** - Use argon2, bcrypt, scrypt, or PBKDF2
8. **Key Management** - NEVER hardcode keys, use secrets manager
9. **IV** - Always use unique IV for each encryption
10. **Auth Tag** - GCM mode provides authentication (detect tampering)

Don't implement crypto from scratch - use proven algorithms!
