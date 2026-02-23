// utils/asymmetric.js
import { generateKeyPairSync, sign, verify } from "node:crypto";

// Generate RSA Key Pair
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

// Generate ECDSA Key Pair (Elliptic Curve)
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
console.log("Generating RSA key pair...");
const rsaKeys = generateRSAKeyPair();
console.log("RSA Public Key:");
console.log(rsaKeys.publicKey);
console.log("\nRSA Private Key:");
console.log(rsaKeys.privateKey);

console.log("\n" + "=".repeat(80) + "\n");

console.log("Generating ECDSA key pair...");
const ecKeys = generateECDSAKeyPair();
console.log("ECDSA Public Key:");
console.log(ecKeys.publicKey);
console.log("\nECDSA Private Key:");
console.log(ecKeys.privateKey);

// Sign Data
export function signData(data, privateKey, algorithm = "sha256") {
  const signature = sign(algorithm, Buffer.from(data), {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING
  });

  return signature.toString("base64");
}

// Verify Signature
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

// Demo signing
const message = "Important message to sign";
console.log("\n" + "=".repeat(80) + "\n");
console.log("Message:", message);

// Sign with private key
const signature = signData(message, rsaKeys.privateKey);
console.log("\nSignature:", signature);

// Verify with public key
const isValid = verifySignature(message, signature, rsaKeys.publicKey);
console.log("Signature valid:", isValid);

// Try to verify tampered message
const tamperedMessage = "Important message to sign!";
const tamperedValid = verifySignature(
  tamperedMessage,
  signature,
  rsaKeys.publicKey
);
console.log("Tampered message valid:", tamperedValid);

console.log("\nUse Cases:");
console.log(" Digital signatures");
console.log(" JWT RS256/ES256");
console.log(" Microservices authentication");
console.log(" Code signing");
console.log("⚠️  Store private keys securely (never in code!)");
