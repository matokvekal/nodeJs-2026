// utils/encryption.js
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// Encrypt Data
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

// Decrypt Data
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

// Usage Example
// Generate encryption key (store securely!)
const encryptionKey = randomBytes(32); // 256 bits

// Encrypt sensitive data
const plaintext = "Sensitive user data: SSN 123-45-6789";
const encrypted = encrypt(plaintext, encryptionKey);

console.log("Original text:", plaintext);
console.log("\nEncrypted data:");
console.log("  IV:", encrypted.iv);
console.log("  Encrypted:", encrypted.encrypted);
console.log("  Auth Tag:", encrypted.authTag);

// Decrypt
const decrypted = decrypt(encrypted, encryptionKey);
console.log("\nDecrypted text:", decrypted);

// Verify
console.log("\n✅ Encryption/Decryption successful:", plaintext === decrypted);

// Multiple encryptions with same key produce different outputs
console.log("\nSame plaintext encrypted twice:");
const encrypted1 = encrypt(plaintext, encryptionKey);
const encrypted2 = encrypt(plaintext, encryptionKey);
console.log("First IV: ", encrypted1.iv);
console.log("Second IV:", encrypted2.iv);
console.log("Different IVs ensure different ciphertext ✅");

// Why AES-256-GCM?
console.log("\nWhy AES-256-GCM?");
console.log("- AES-256: Industry standard, very secure");
console.log("- GCM: Galois/Counter Mode - provides authentication (AEAD)");
console.log("- Detects tampering (authTag verification)");
console.log("- Fast on modern CPUs (hardware acceleration)");
