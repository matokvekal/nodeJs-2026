// utils/hash.js
import { createHash } from "node:crypto";

// Basic Hashing
export function hash(data, algorithm = "sha256") {
  return createHash(algorithm).update(data).digest("hex");
}

// Examples
const sha256 = hash("Hello World", "sha256");
console.log("SHA-256:", sha256);
// a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e

const sha512 = hash("Hello World", "sha512");
console.log("SHA-512:", sha512);
// 2c74fd17edafd80e8447b0d46741ee243b7eb74dd2149a0ab1b9246fb30382f27e853d8585719e0e67cbda0daa8f51671064615d645ae27acb15bfb1447f459b

// File Hashing (Checksum)
import { createReadStream } from "node:fs";

export function hashFile(filePath, algorithm = "sha256") {
  return new Promise((resolve, reject) => {
    const hash = createHash(algorithm);
    const stream = createReadStream(filePath);

    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}

// Usage
// const fileHash = await hashFile('./document.pdf');
// console.log('File hash:', fileHash);

// Hash Comparison (Content Verification)
export function verifyFileIntegrity(filePath, expectedHash) {
  const actualHash = hashFile(filePath);
  return actualHash === expectedHash;
}

// Download file verification
// const downloadedHash = await hashFile('./downloaded.zip');
// const expectedHash = 'abc123...';

// if (downloadedHash === expectedHash) {
//   console.log('✅ File integrity verified');
// } else {
//   console.log('❌ File corrupted or tampered');
// }

// Available Algorithms
import { getHashes } from "node:crypto";

console.log("\nAvailable hash algorithms:", getHashes().slice(0, 10));
// Recommended: sha256, sha512, blake2b512
// Avoid: md5, sha1 (broken for security purposes)
