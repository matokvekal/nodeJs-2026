// db/mongoose.js
import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // Connection pool settings
      maxPoolSize: 100, // Max concurrent connections
      minPoolSize: 10,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000
    });

    console.log(" MongoDB connected:", mongoose.connection.host);

    // Event handlers
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

// Graceful shutdown
export async function disconnectDB() {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
}

// Usage in server.js
// import { connectDB, disconnectDB } from './db/mongoose.js';
// await connectDB();
// process.on('SIGTERM', disconnectDB);
