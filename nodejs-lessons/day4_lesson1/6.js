import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// Message Handlers
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

function broadcast(message, excludeWs = null) {
  const data = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

function generateUserId() {
  return `user_${Math.random().toString(36).substr(2, 9)}`;
}

// Message Router
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

console.log(
  "WebSocket server with message protocol running on ws://localhost:8080"
);
