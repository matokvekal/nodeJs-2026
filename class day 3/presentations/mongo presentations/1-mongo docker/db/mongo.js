import mongoose from "mongoose";
import "dotenv/config"; // loads .env file automatically

// Connect to MongoDB using the URL from .env
export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to MongoDB:", process.env.MONGO_URL);
};
