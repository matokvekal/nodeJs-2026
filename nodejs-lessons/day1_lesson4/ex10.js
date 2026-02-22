// Receiving and processing WebHooks
import http from "node:http";
import crypto from "node:crypto";

// Secret key for webhook signature verification (shared with webhook sender)
const WEBHOOK_SECRET = "your-secret-key-here";

// Store processed webhook IDs to prevent duplicates (idempotency)
const processedWebhooks = new Set();

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // WebHook endpoint
    try {
      // 1. Read the request body
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = Buffer.concat(chunks).toString();

      // 2. Verify webhook signature (security!)
      const signature = req.headers["x-hub-signature-256"];
      if (!verifySignature(body, signature, WEBHOOK_SECRET)) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid signature" }));
        return;
      }

      // 3. Parse the payload
      const payload = JSON.parse(body);
      const webhookId = payload.id || crypto.randomUUID();

      // 4. Check for duplicates (idempotency)
      if (processedWebhooks.has(webhookId)) {
        console.log("Webhook already processed:", webhookId);
        // Return 200 even for duplicates (webhook sender will stop retrying)
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "already processed" }));
        return;
      }

      // 5. Respond IMMEDIATELY (don't make webhook sender wait)
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "received" }));

      // 6. Process webhook ASYNCHRONOUSLY (after responding)
      processWebhookAsync(webhookId, payload);
    } catch (error) {
      console.error("Webhook error:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid webhook" }));
    }
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

// Verify HMAC signature
function verifySignature(body, signature, secret) {
  if (!signature) return false;

  // Compute expected signature
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(body);
  const expected = "sha256=" + hmac.digest("hex");

  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

// Process webhook asynchronously (runs AFTER we responded)
async function processWebhookAsync(webhookId, payload) {
  try {
    console.log(`\nProcessing webhook ${webhookId}...`);
    console.log("Event:", payload.event);
    console.log("Data:", payload.data);

    // Mark as processed
    processedWebhooks.add(webhookId);

    // Simulate long processing (database update, external API call, etc.)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(`Webhook ${webhookId} processed successfully`);

    // Clean up old webhook IDs (prevent memory leak)
    if (processedWebhooks.size > 10000) {
      const oldest = Array.from(processedWebhooks).slice(0, 5000);
      oldest.forEach((id) => processedWebhooks.delete(id));
    }
  } catch (error) {
    console.error(`Error processing webhook ${webhookId}:`, error);
    // In production: retry or send to dead letter queue
  }
}

server.listen(3000, () => {
  console.log("WebHook receiver on http://localhost:3000/webhooks/github");
});

// WebHook best practices:
// 1. Verify signature (HMAC-SHA256)
// 2. Respond IMMEDIATELY (200 OK)
// 3. Process asynchronously
// 4. Handle duplicates (idempotency)
// 5. Log everything for debugging