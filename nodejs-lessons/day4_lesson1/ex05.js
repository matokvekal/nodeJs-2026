import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// Heartbeat Setup
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
    console.log("Received:", data.toString());
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Start heartbeat checker
setupHeartbeat();

console.log("WebSocket server with heartbeat running on ws://localhost:8080");

// Why Heartbeat?
// - Detects "zombie" connections (client crashed without closing)
// - Frees up server resources
// - Prevents memory leaks
// - Ping/Pong built into WebSocket protocol (not visible to clients)
