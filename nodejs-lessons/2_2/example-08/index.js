import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Serve static files from 'public' directory
app.use(express.static("public"));

// Custom static folder with options
app.use(
  "/uploads",
  express.static("uploads", {
    maxAge: "1d", // Cache for 1 day
    index: false, // Don't serve index.html
    dotfiles: "deny" // Don't serve hidden files
  })
);

// Multiple static folders
app.use(express.static(join(__dirname, "../public")));
app.use("/assets", express.static(join(__dirname, "../assets")));

// Now files are accessible:
// public/style.css → http://localhost:3000/style.css
// uploads/photo.jpg → http://localhost:3000/uploads/photo.jpg
// public/index.html → http://localhost:3000/ (if no routes match)