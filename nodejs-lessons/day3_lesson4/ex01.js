// app.js
import express from "express";
import helmet from "helmet";

const app = express();

// ===================================
// Basic Helmet Usage (Recommended)
// ===================================
// This automatically enables multiple security headers:
// - X-Content-Type-Options: nosniff (prevents MIME type sniffing)
// - X-Frame-Options: SAMEORIGIN (prevents clickjacking)
// - X-XSS-Protection: 0 (disabled, modern browsers use CSP instead)
// - Strict-Transport-Security: enforces HTTPS
// - Content-Security-Policy: prevents XSS attacks
// - Removes X-Powered-By header (hides Express fingerprint)
app.use(helmet());

// ===================================
// Custom Helmet Configuration
// ===================================
app.use(
  helmet({
    // Content Security Policy - Controls which resources can be loaded
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Only load from same origin
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // Allow inline scripts (use sparingly!)
          "https://cdnjs.cloudflare.com"
        ],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://api.example.com"],
        frameSrc: ["'none'"], // Prevent embedding in iframes
        objectSrc: ["'none'"], // Block plugins like Flash
        upgradeInsecureRequests: [] // Upgrade HTTP to HTTPS
      }
    },

    // Strict Transport Security (HSTS) - Forces HTTPS
    strictTransportSecurity: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true // Submit to HSTS preload list
    },

    // X-Frame-Options - Prevents clickjacking
    frameguard: {
      action: "deny" // Options: DENY | SAMEORIGIN | ALLOW-FROM
    },

    // Referrer Policy - Controls referrer information
    referrerPolicy: {
      policy: "no-referrer-when-downgrade"
    },

    // Hide X-Powered-By header
    hidePoweredBy: true,

    // DNS Prefetch Control - Prevents DNS prefetching
    dnsPrefetchControl: {
      allow: false
    }
  })
);

// ===================================
// Individual Headers (Alternative to Helmet)
// ===================================
// If you want more control, you can set headers manually
app.use((req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Force HTTPS
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // Control referrer
  res.setHeader("Referrer-Policy", "no-referrer");

  // Remove server fingerprint
  res.removeHeader("X-Powered-By");

  // Content Security Policy
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'"
  );

  // Permissions Policy (formerly Feature-Policy)
  // Disables browser features like geolocation, microphone, camera
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  next();
});

// Test routes
app.get("/", (req, res) => {
  res.send("Security headers are active! Check browser dev tools.");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", secure: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔒 Secure server running on http://localhost:${PORT}`);
  console.log("✅ Helmet security headers enabled");
  console.log("\nTest security headers:");
  console.log("- Open browser dev tools");
  console.log("- Go to Network tab");
  console.log("- Visit http://localhost:3000");
  console.log("- Check Response Headers");
});
