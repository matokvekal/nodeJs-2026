// For multiple servers, use Redis pub/sub to sync messages

import { WebSocketServer } from "ws";
import { createClient } from "redis";

const wss = new WebSocketServer({ port: 8080 });

// Redis Pub/Sub
const publisher = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
const subscriber = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });

await publisher.connect();
await subscriber.connect();

const CHANNEL = "ws_messages";

// Subscribe to messages from other servers
await subscriber.subscribe(CHANNEL, (message) => {
  const data = JSON.parse(message);

  // Broadcast to local clients
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  });
});

// Publish Message to All Servers
function broadcastGlobal(message) {
  // Send to Redis, which broadcasts to all server instances
  publisher.publish(CHANNEL, JSON.stringify(message));
}

// WebSocket Handler
wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());

    // Publish to all servers (including this one)
    broadcastGlobal({
      type: "chat:message",
      text: message.text,
      timestamp: Date.now()
    });
  });
});

console.log("WebSocket server with Redis scaling running on ws://localhost:8080");

// This allows horizontal scaling:
// - Run multiple Node.js instances
// - Load balancer distributes WebSocket connections
// - Redis ensures all instances receive messages
