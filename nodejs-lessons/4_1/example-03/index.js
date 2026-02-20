import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// Broadcast Function
function broadcast(message, excludeWs = null) {
  const data = JSON.stringify(message);

  wss.clients.forEach((client) => {
    // Only send to open connections
    if (client.readyState === WebSocket.OPEN && client !== excludeWs) {
      client.send(data);
    }
  });
}

// Chat Server Example
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

// Admin Broadcast (Manual Trigger)
// Send announcement to everyone
function sendAnnouncement(text) {
  broadcast({
    type: "announcement",
    text,
    timestamp: Date.now()
  });
}

console.log("WebSocket chat server running on ws://localhost:8080");

// Usage: call this function from HTTP endpoint
// app.post('/api/admin/announce', (req, res) => {
//   sendAnnouncement(req.body.message);
//   res.json({ success: true });
// });
