import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// Map of roomId → Set<WebSocket>
const rooms = new Map();

// Room Management
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

function generateUserId() {
  return `user_${Math.random().toString(36).substr(2, 9)}`;
}

// Connection Handler
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

// Get Room Info
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

console.log(
  "WebSocket server with rooms/channels running on ws://localhost:8080"
);
