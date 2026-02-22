import express from "express";
import http from "http";
import { Server as socketIO } from "socket.io";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path"; // Add this import statement

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new socketIO(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
  },
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Store connected users
const users = {};

// Socket.IO events
io.on("connection", (socket) => {
  // Handle user joining the chat
  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("userJoined", { username, userId: socket.id });
    console.log(`SERVER: ${username} joined the chat`);
  });

  // Handle user disconnecting
  socket.on("disconnect", () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.emit("userLeft", { username, userId: socket.id });
    console.log(`SERVER: ${username} left the chat`);
  });

  // Handle chat messages
  socket.on("chatMessage", (message) => {
    const username = users[socket.id];
    io.emit(`message`, { username, message });
    console.log(`${username}: ${message}`);
  });

  // Handle private messages
  socket.on("privateMessage", ({ recipientId, message }) => {
    const senderUsername = users[socket.id];
    const recipientSocket = io.sockets.sockets.get(recipientId);
    if (recipientSocket) {
      recipientSocket.emit("privateMessage", { senderUsername, message });
    }
  });

  // Handle request for all users
  socket.on("getAllUsers", () => {
    const userList = Object.values(users);
    socket.emit("allUsers", userList);

    // Send a private message to the user who requested the list
    const message = `List of all users: ${userList.join(", ")}`;
    socket.emit("privateMessage", { senderUsername: "SERVER", message });
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Socket.IO Chat App");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
