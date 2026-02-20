// app.js
import express from "express";
import { WebSocketServer } from "ws";
import { createServer } from "node:http";

const app = express();
const server = createServer(app);

// WebSocket Server on Same HTTP Server
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

// Upgrade Event (Advanced)
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
