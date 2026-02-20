// utils/hmac.js
import { createHmac, timingSafeEqual } from "node:crypto";

// Generate HMAC Signature
export function sign(data, secret, algorithm = "sha256") {
  return createHmac(algorithm, secret).update(data).digest("hex");
}

// Verify HMAC Signature
export function verify(data, signature, secret, algorithm = "sha256") {
  const expected = sign(data, secret, algorithm);

  // Timing-safe comparison (prevent timing attacks)
  return timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expected, "hex")
  );
}

// Example usage
const secret = "my-secret-key";
const data = "Important message";

const signature = sign(data, secret);
console.log("HMAC Signature:", signature);

const isValid = verify(data, signature, secret);
console.log("Signature valid:", isValid);

// Webhook Signature Example
const webhookSecret = "webhook-secret";
const webhookPayload = JSON.stringify({ event: "user.created", userId: 123 });

const webhookSignature = sign(webhookPayload, webhookSecret, "sha256");
console.log("\nWebhook Signature:", webhookSignature);

// Verify webhook
const receivedPayload = webhookPayload;
const receivedSignature = webhookSignature;

const webhookValid = verify(receivedPayload, receivedSignature, webhookSecret);
console.log("Webhook valid:", webhookValid);

// API Request Signing Example
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

const requestHeaders = signRequest(
  "POST",
  "/api/users",
  { name: "John" },
  secret
);
console.log("\nAPI Request Headers:", requestHeaders);

// Why timingSafeEqual?
console.log("\n⚠️  Always use timingSafeEqual for signature comparison!");
console.log("Regular === is vulnerable to timing attacks");
console.log(
  "timingSafeEqual takes constant time regardless of where strings differ"
);
