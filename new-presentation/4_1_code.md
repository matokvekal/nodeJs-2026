# Day 4 - Presentation 1: WebSocket - Code Examples

---

## Example 1: Basic WebSocket Server (ws library)

```javascript
// server.js
import { WebSocketServer, WebSocket } from "ws";

// Create WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });

console.log("WebSocket server running on ws://localhost:8080");

// ===================================
// Connection Event
// ===================================
wss.on("connection", (ws, req) => {
  console.log("New client connected");
  console.log("Client IP:", req.socket.remoteAddress);

  // Send welcome message
  ws.send(JSON.stringify({ type: "welcome", message: "Connected to server!" }));

  // ===================================
  // Message Event
  // ===================================
  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log("Received:", message);

      // Echo back
      ws.send(
        JSON.stringify({
          type: "echo",
          data: message
        })
      );
    } catch (error) {
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
    }
  });

  // ===================================
  // Close Event
  // ===================================
  ws.on("close", (code, reason) => {
    console.log("Client disconnected");
    console.log("Code:", code); // 1000 = normal, 1001 = going away
    console.log("Reason:", reason.toString());
  });

  // ===================================
  // Error Event (MUST handle!)
  // ===================================
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// ===================================
// Client Example (Browser)
// ===================================
/*
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  console.log('Connected!');
  ws.send(JSON.stringify({ type: 'hello', text: 'Hi server!' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = (event) => {
  console.log('Disconnected:', event.code, event.reason);
};
*/
```

```bash
# Install ws library
npm install ws

# Run server
node server.js
```

---

## Example 2: WebSocket with Express Integration

```javascript
// app.js
import express from "express";
import { WebSocketServer } from "ws";
import { createServer } from "node:http";

const app = express();
const server = createServer(app);

// ===================================
// WebSocket Server on Same HTTP Server
// ===================================
const wss = new WebSocketServer({ server });

// HTTP routes
app.get("/", (req, res) => {
  res.send("WebSocket server running");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    clients: wss.clients.size
  });
});

// WebSocket connection
wss.on("connection", (ws, req) => {
  console.log("Client connected");

  ws.on("message", (data) => {
    console.log("Received:", data.toString());
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket available on ws://localhost:${PORT}`);
});

// ===================================
// Upgrade Event (Advanced)
// ===================================
server.on("upgrade", (request, socket, head) => {
  // Custom authentication before upgrade
  const token = new URL(request.url, "ws://localhost").searchParams.get(
    "token"
  );

  if (!token || token !== "valid-token") {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
```

---

## Example 3: Broadcast to All Clients

```javascript
import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// ===================================
// Broadcast Function
// ===================================
function broadcast(message, excludeWs = null) {
  const data = JSON.stringify(message);

  wss.clients.forEach((client) => {
    // Only send to open connections
    if (client.readyState === WebSocket.OPEN && client !== excludeWs) {
      client.send(data);
    }
  });
}

// ===================================
// Chat Server Example
// ===================================
wss.on("connection", (ws) => {
  // Notify all clients about new connection
  broadcast({ type: "user:join", count: wss.clients.size });

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === "chat:message") {
        // Broadcast to all EXCEPT sender
        broadcast(
          {
            type: "chat:message",
            text: message.text,
            timestamp: Date.now()
          },
          ws
        );
      }
    } catch (error) {
      console.error("Invalid message:", error);
    }
  });

  ws.on("close", () => {
    // Notify all about disconnect
    broadcast({ type: "user:leave", count: wss.clients.size });
  });
});

// ===================================
// Admin Broadcast (Manual Trigger)
// ===================================
// Send announcement to everyone
function sendAnnouncement(text) {
  broadcast({
    type: "announcement",
    text,
    timestamp: Date.now()
  });
}

// Usage: call this function from HTTP endpoint
// app.post('/api/admin/announce', (req, res) => {
//   sendAnnouncement(req.body.message);
//   res.json({ success: true });
// });
```

---

## Example 4: Private Messaging (User-to-User)

```javascript
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

// Map of userId → WebSocket
const clients = new Map();

// ===================================
// Authentication on Connection
// ===================================
wss.on("connection", (ws, req) => {
  // Extract token from query params
  const url = new URL(req.url, "ws://localhost");
  const token = url.searchParams.get("token");

  try {
    // Verify JWT token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
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

// ===================================
// Send to Specific User
// ===================================
function sendToUser(userId, message) {
  const userWs = clients.get(userId);

  if (userWs && userWs.readyState === WebSocket.OPEN) {
    userWs.send(JSON.stringify(message));
    return true;
  }

  return false; // User not connected
}

// ===================================
// Get Online Users
// ===================================
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
```

---

## Example 5: Heartbeat (Ping/Pong) to Detect Dead Connections

```javascript
import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// ===================================
// Heartbeat Setup
// ===================================
function setupHeartbeat() {
  setInterval(() => {
    wss.clients.forEach((ws) => {
      // If no pong received since last ping, terminate
      if (ws.isAlive === false) {
        console.log("Terminating inactive connection");
        return ws.terminate();
      }

      // Mark as pending response
      ws.isAlive = false;

      // Send ping
      ws.ping();
    });
  }, 30000); // Every 30 seconds
}

wss.on("connection", (ws) => {
  // Initialize heartbeat flag
  ws.isAlive = true;

  // Respond to pong
  ws.on("pong", () => {
    ws.isAlive = true; // Connection is alive
  });

  ws.on("message", (data) => {
    // Handle messages
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Start heartbeat checker
setupHeartbeat();

// ===================================
// Why Heartbeat?
// ===================================
// - Detects "zombie" connections (client crashed without closing)
// - Frees up server resources
// - Prevents memory leaks
// - Ping/Pong built into WebSocket protocol (not visible to clients)

// ===================================
// Alternative: Client-side Heartbeat
// ===================================
// Client sends periodic messages, server tracks last activity
wss.on("connection", (ws) => {
  ws.lastActivity = Date.now();

  ws.on("message", () => {
    ws.lastActivity = Date.now();
  });
});

setInterval(() => {
  const now = Date.now();
  wss.clients.forEach((ws) => {
    if (now - ws.lastActivity > 60000) {
      // 1 minute inactive
      ws.terminate();
    }
  });
}, 30000);
```

---

## Example 6: Message Protocol (Type-based Routing)

```javascript
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// ===================================
// Message Handlers
// ===================================
const handlers = {
  "chat:message": handleChatMessage,
  "user:typing": handleTyping,
  "user:status": handleStatusChange,
  ping: handlePing
};

function handleChatMessage(ws, payload) {
  broadcast({
    type: "chat:message",
    userId: ws.userId,
    text: payload.text,
    room: payload.room,
    timestamp: Date.now()
  });
}

function handleTyping(ws, payload) {
  broadcast(
    {
      type: "user:typing",
      userId: ws.userId,
      room: payload.room
    },
    ws
  ); // Exclude sender
}

function handleStatusChange(ws, payload) {
  ws.status = payload.status; // 'online', 'away', 'busy'

  broadcast({
    type: "user:status",
    userId: ws.userId,
    status: payload.status
  });
}

function handlePing(ws, payload) {
  ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
}

// ===================================
// Message Router
// ===================================
wss.on("connection", (ws) => {
  ws.userId = generateUserId();

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());

      // Validate message structure
      if (!message.type || !message.payload) {
        return ws.send(
          JSON.stringify({
            type: "error",
            message: "Invalid message format"
          })
        );
      }

      // Route to handler
      const handler = handlers[message.type];

      if (handler) {
        handler(ws, message.payload);
      } else {
        ws.send(
          JSON.stringify({
            type: "error",
            message: `Unknown message type: ${message.type}`
          })
        );
      }
    } catch (error) {
      console.error("Message error:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid JSON"
        })
      );
    }
  });
});

// ===================================
// Message Format
// ===================================
/*
Client sends:
{
  "type": "chat:message",
  "payload": {
    "text": "Hello!",
    "room": "general"
  }
}

Server responds:
{
  "type": "chat:message",
  "userId": "user123",
  "text": "Hello!",
  "room": "general",
  "timestamp": 1640000000000
}
*/
```

---

## Example 7: Room/Channel System (Group Messaging)

```javascript
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// Map of roomId → Set<WebSocket>
const rooms = new Map();

// ===================================
// Room Management
// ===================================
function joinRoom(ws, roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }

  rooms.get(roomId).add(ws);

  // Track rooms on the connection
  if (!ws.rooms) ws.rooms = new Set();
  ws.rooms.add(roomId);

  // Notify room members
  broadcastToRoom(roomId, {
    type: "user:join",
    userId: ws.userId,
    room: roomId,
    count: rooms.get(roomId).size
  });
}

function leaveRoom(ws, roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.delete(ws);
  ws.rooms?.delete(roomId);

  // Remove empty rooms
  if (room.size === 0) {
    rooms.delete(roomId);
  } else {
    // Notify room members
    broadcastToRoom(roomId, {
      type: "user:leave",
      userId: ws.userId,
      room: roomId,
      count: room.size
    });
  }
}

function broadcastToRoom(roomId, message, excludeWs = null) {
  const room = rooms.get(roomId);
  if (!room) return;

  const data = JSON.stringify(message);

  room.forEach((client) => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// ===================================
// Connection Handler
// ===================================
wss.on("connection", (ws) => {
  ws.userId = generateUserId();
  ws.rooms = new Set();

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());

    switch (message.type) {
      case "room:join":
        joinRoom(ws, message.payload.roomId);
        ws.send(
          JSON.stringify({
            type: "room:joined",
            roomId: message.payload.roomId
          })
        );
        break;

      case "room:leave":
        leaveRoom(ws, message.payload.roomId);
        ws.send(
          JSON.stringify({ type: "room:left", roomId: message.payload.roomId })
        );
        break;

      case "room:message":
        broadcastToRoom(
          message.payload.roomId,
          {
            type: "room:message",
            userId: ws.userId,
            room: message.payload.roomId,
            text: message.payload.text,
            timestamp: Date.now()
          },
          ws
        );
        break;
    }
  });

  ws.on("close", () => {
    // Leave all rooms on disconnect
    ws.rooms.forEach((roomId) => leaveRoom(ws, roomId));
  });
});

// ===================================
// Get Room Info
// ===================================
function getRoomInfo(roomId) {
  const room = rooms.get(roomId);

  if (!room) {
    return { exists: false };
  }

  return {
    exists: true,
    memberCount: room.size,
    members: Array.from(room).map((ws) => ws.userId)
  };
}
```

---

## Example 8: WebSocket with Redis (Horizontal Scaling)

```javascript
// For multiple servers, use Redis pub/sub to sync messages

import { WebSocketServer } from "ws";
import { createClient } from "redis";

const wss = new WebSocketServer({ port: 8080 });

// ===================================
// Redis Pub/Sub
// ===================================
const publisher = createClient({ url: process.env.REDIS_URL });
const subscriber = createClient({ url: process.env.REDIS_URL });

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

// ===================================
// Publish Message to All Servers
// ===================================
function broadcastGlobal(message) {
  // Send to Redis, which broadcasts to all server instances
  publisher.publish(CHANNEL, JSON.stringify(message));
}

// ===================================
// WebSocket Handler
// ===================================
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

// This allows horizontal scaling:
// - Run multiple Node.js instances
// - Load balancer distributes WebSocket connections
// - Redis ensures all instances receive messages
```

---

## Comparison Table: HTTP vs WebSocket

| Aspect         | HTTP                                | WebSocket                         |
| -------------- | ----------------------------------- | --------------------------------- |
| **Direction**  | Request-Response (client initiates) | Bidirectional (both can initiate) |
| **Connection** | New connection per request          | Persistent connection             |
| **Overhead**   | Full headers every time             | Small frames after handshake      |
| **Real-time**  | Polling required                    | Native real-time                  |
| **Use Cases**  | REST APIs, web pages                | Chat, notifications, live updates |
| **Protocol**   | http:// or https://                 | ws:// or wss://                   |

---

## Summary

WebSocket key patterns for production:

1. **Basic Setup** - ws library with Express integration
2. **Broadcast** - Send to all clients (chat, notifications)
3. **Private Messaging** - User-to-user with authentication
4. **Heartbeat** - Ping/Pong to detect dead connections
5. **Protocol** - Type-based message routing
6. **Rooms** - Group messaging (channels)
7. **Scaling** - Redis pub/sub for multi-server
8. **Authentication** - JWT token in query params or headers
9. **Error Handling** - Always handle 'error' event!
10. **State Check** - Always check `readyState === OPEN` before sending

WebSocket enables true real-time communication in Node.js!
