import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

// Map of userId → WebSocket
const clients = new Map();

// Authentication on Connection
wss.on("connection", (ws, req) => {
  // Extract token from query params
  const url = new URL(req.url, "ws://localhost");
  const token = url.searchParams.get("token");

  try {
    // Verify JWT token
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret-key");
    const userId = payload.sub;

    // Store connection
    ws.userId = userId;
    clients.set(userId, ws);

    console.log(`User ${userId} connected`);

    // Send confirmation
    ws.send(
      JSON.stringify({
        type: "auth:success",
        userId
      })
    );

    // Handle messages
    ws.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === "private:message") {
        sendToUser(message.to, {
          type: "private:message",
          from: userId,
          text: message.text,
          timestamp: Date.now()
        });
      }
    });

    ws.on("close", () => {
      clients.delete(userId);
      console.log(`User ${userId} disconnected`);
    });
  } catch (error) {
    ws.send(
      JSON.stringify({ type: "error", message: "Authentication failed" })
    );
    ws.close(4001, "Authentication failed");
  }
});

// Send to Specific User
function sendToUser(userId, message) {
  const userWs = clients.get(userId);

  if (userWs && userWs.readyState === WebSocket.OPEN) {
    userWs.send(JSON.stringify(message));
    return true;
  }

  return false; // User not connected
}

// Get Online Users
function getOnlineUsers() {
  return Array.from(clients.keys());
}

// Broadcast online users list to everyone
function broadcastOnlineUsers() {
  const onlineUsers = getOnlineUsers();

  clients.forEach((ws) => {
    ws.send(
      JSON.stringify({
        type: "users:online",
        users: onlineUsers
      })
    );
  });
}

// Update online users every 30 seconds
setInterval(broadcastOnlineUsers, 30000);

console.log(
  "WebSocket server with authentication running on ws://localhost:8080"
);
