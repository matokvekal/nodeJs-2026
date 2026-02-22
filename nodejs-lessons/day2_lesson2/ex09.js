import express from "express";
import cors from "cors";

const app = express();

// 1. Simple CORS - Allow all origins (development only!)
app.use(cors());

// 2. Specific origin
app.use(
  cors({
    origin: "https://myapp.com"
  })
);

// 3. Multiple origins
app.use(
  cors({
    origin: ["https://app1.com", "https://app2.com"]
  })
);

// 4. Dynamic origin (function)
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["https://app.com", "http://localhost:3000"];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow
      } else {
        callback(new Error("Not allowed by CORS")); // Block
      }
    }
  })
);

// 5. Full configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["X-Request-ID"],
    credentials: true, // Allow cookies
    maxAge: 86400 // Cache preflight for 24 hours
  })
);

// 6. Route-specific CORS
app.get("/public-api", cors(), (req, res) => {
  res.json({ message: "Public endpoint" });
});

app.get("/private-api", cors({ origin: "https://trusted.com" }), (req, res) => {
  res.json({ message: "Private endpoint" });
});