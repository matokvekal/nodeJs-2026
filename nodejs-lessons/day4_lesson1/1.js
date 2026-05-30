// server.js
import { WebSocketServer, WebSocket } from "ws";

// Create WebSocket server on port 8088
const PORT = process.env.PORT || 8088;
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server running on ws://localhost:${PORT}`);

// Connection Event
wss.on("connection", (ws, req) => {
  console.log("New client connected");
  console.log("Client IP:", req.socket.remoteAddress);

  // Send welcome message
  ws.send(JSON.stringify({ type: "welcome", message: "Connected to server!" }));

  // Message Event
  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log("Received:", message);

      // Broadcast to ALL connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "broadcast", data: message }));
        }
      });
    } catch (error) {
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
    }
  });

  // Close Event
  ws.on("close", (code, reason) => {
    console.log("Client disconnected");
    console.log("Code:", code); // 1000 = normal, 1001 = going away
    console.log("Reason:", reason.toString());
  });

  // Error Event (MUST handle!)
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Client Example (Browser)
/*
const ws = new WebSocket('ws://localhost:8088');

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
