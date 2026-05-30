// ============================================================
// SECURITY HEADERS WITH HELMET.JS
// ============================================================
//
// WHY DO WE NEED SECURITY HEADERS?
// ---------------------------------
// When a browser makes a request to your server, it receives
// HTTP "headers" alongside the HTML/JSON response.
// Some of these headers are SECURITY instructions that tell
// the browser how to behave safely:
//   - "Don't let this page be embedded inside another site"
//   - "Only load scripts from our own domain"
//   - "Always use HTTPS, never plain HTTP"
//
// Without these headers, your app is vulnerable to common
// attacks like XSS, Clickjacking, and MIME sniffing.
//
// WHAT IS HELMET?
// ---------------
// Helmet is a popular npm package that sets these security
// headers automatically with one line: app.use(helmet())
// It saves us from setting each header manually every time.
//
// Install: npm install helmet
// Docs:    https://helmetjs.github.io/
// ============================================================

import express from "express";
import helmet from "helmet";

const app = express();

// ===================================
// Basic Helmet Usage (Recommended)
// ===================================
// Calling helmet() with no arguments enables a set of safe
// default headers. This is enough for most applications.
//
// Headers it sets automatically:
//   X-Content-Type-Options: nosniff
//     → Stops the browser from "guessing" the file type.
//       Without this, a browser might execute a text file
//       as JavaScript — a dangerous MIME-sniffing attack.
//
//   X-Frame-Options: SAMEORIGIN
//     → Prevents your page from being embedded in an
//       <iframe> on another site. This blocks "clickjacking"
//       where an attacker overlays your site invisibly.
//
//   X-XSS-Protection: 0
//     → Disables the old browser XSS filter. Modern apps
//       use Content-Security-Policy (CSP) instead, which
//       is much stronger. The old filter could be bypassed.
//
//   Strict-Transport-Security (HSTS)
//     → Tells the browser: "Only ever connect to me via
//       HTTPS — never plain HTTP." If someone tries to
//       visit http://yoursite.com the browser upgrades it
//       to https:// automatically.
//
//   Content-Security-Policy (CSP)
//     → The most powerful header. Controls exactly which
//       external resources (scripts, images, fonts) are
//       allowed to load. Blocks most XSS attacks.
//
//   Removes X-Powered-By
//     → By default Express sends "X-Powered-By: Express".
//       This tells attackers exactly what framework you use.
//       Helmet removes this "fingerprint" header.
//
// STUDENT NOTE: In a real project, start with just helmet()
// and only customize it when you have a specific need.
app.use(helmet());

// ===================================
// Custom Helmet Configuration
// ===================================
// When you need fine-grained control, pass an options object.
// Each key maps to a specific security header.
//
// STUDENT NOTE: You would use EITHER the basic helmet() above
// OR this custom version — not both in a real app.
// They are both shown here for teaching purposes only.
app.use(
  helmet({
    // --------------------------------------------------
    // Content Security Policy (CSP)
    // --------------------------------------------------
    // CSP is a whitelist of places the browser is allowed
    // to load resources from. If a resource is not on the
    // list, the browser blocks it — even if an attacker
    // injected a <script> tag into your HTML.
    //
    // Think of it as a bouncer: "Only these guests allowed."
    contentSecurityPolicy: {
      directives: {
        // defaultSrc: Fallback rule for any resource type
        // not listed below. 'self' = same domain only.
        defaultSrc: ["'self'"],

        // scriptSrc: Where <script> tags can come from.
        // 'unsafe-inline' allows inline <script>...</script>
        // blocks, but use sparingly — it weakens CSP.
        // We allow cdnjs to load libraries like jQuery.
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // Allow inline scripts (use sparingly!)
          "https://cdnjs.cloudflare.com"
        ],

        // styleSrc: Where <link rel="stylesheet"> and
        // <style> tags can come from.
        // We allow Google Fonts stylesheets.
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],

        // imgSrc: Where <img src="..."> can load from.
        // 'data:' allows base64-encoded inline images.
        // 'https:' allows any image from any HTTPS source.
        imgSrc: ["'self'", "data:", "https:"],

        // fontSrc: Where @font-face fonts can load from.
        fontSrc: ["'self'", "https://fonts.gstatic.com"],

        // connectSrc: Which URLs fetch()/XHR/WebSocket
        // requests are allowed to connect to.
        connectSrc: ["'self'", "https://api.example.com"],

        // frameSrc: Which origins can be used in <iframe>.
        // 'none' means no iframes at all — prevents your
        // page from embedding other sites.
        frameSrc: ["'none'"],

        // objectSrc: Controls <object>, <embed>, <applet>.
        // 'none' blocks Flash and other legacy plugins.
        objectSrc: ["'none'"],

        // upgradeInsecureRequests: Automatically upgrades
        // any http:// sub-resource request to https://.
        upgradeInsecureRequests: []
      }
    },

    // --------------------------------------------------
    // Strict Transport Security (HSTS)
    // --------------------------------------------------
    // Once a browser visits your site with this header,
    // it will ALWAYS use HTTPS for the next `maxAge` seconds
    // — even if the user types "http://". No round-trip
    // to the server needed; the browser enforces it locally.
    //
    // maxAge: 31536000 = 1 year in seconds
    // includeSubDomains: applies to sub.yoursite.com too
    // preload: lets you submit your domain to a hardcoded
    //   HSTS list built into Chrome/Firefox/Safari — even
    //   the very first visit will be forced to HTTPS.
    strictTransportSecurity: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true // Submit to HSTS preload list
    },

    // --------------------------------------------------
    // X-Frame-Options (Clickjacking protection)
    // --------------------------------------------------
    // Clickjacking: attacker puts your site in a transparent
    // iframe over their page. User thinks they click their
    // button, but actually clicks yours (e.g., "Transfer $$$").
    //
    // "deny" = never allow this page inside any iframe.
    // "sameorigin" = only iframes from the same domain.
    // "allow-from https://trusted.com" = specific domain only.
    frameguard: {
      action: "deny" // Options: DENY | SAMEORIGIN | ALLOW-FROM
    },

    // --------------------------------------------------
    // Referrer Policy
    // --------------------------------------------------
    // Controls how much URL info is sent in the "Referer"
    // header when the user clicks a link leaving your site.
    //
    // "no-referrer-when-downgrade":
    //   → Send the full URL when going HTTPS → HTTPS.
    //   → Send nothing when going HTTPS → HTTP (protects
    //     private URLs from leaking over plain HTTP).
    referrerPolicy: {
      policy: "no-referrer-when-downgrade"
    },

    // --------------------------------------------------
    // Hide X-Powered-By
    // --------------------------------------------------
    // Express adds "X-Powered-By: Express" by default.
    // Removing it makes it harder for attackers to know
    // which framework (and version) you are running, so
    // they cannot look up known vulnerabilities easily.
    hidePoweredBy: true,

    // --------------------------------------------------
    // DNS Prefetch Control
    // --------------------------------------------------
    // Browsers speculatively resolve hostnames in your HTML
    // before the user clicks a link (to speed up navigation).
    // Setting allow: false disables this. Useful for privacy
    // or in highly sensitive apps where even DNS queries
    // should not be made without explicit user action.
    dnsPrefetchControl: {
      allow: false
    }
  })
);

// ===================================
// Individual Headers (Alternative to Helmet)
// ===================================
// You can also set security headers MANUALLY without Helmet.
// This gives maximum control but requires you to remember
// every header yourself. Helmet is usually the better choice.
//
// This middleware runs on EVERY request (no route specified).
// res.setHeader(name, value) adds a header to the response.
// next() passes control to the next middleware/route handler.
app.use((req, res, next) => {
  // Prevent MIME type sniffing
  // The browser must use the Content-Type we declare,
  // not try to guess the file type from its contents.
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking (same as frameguard: "deny" above)
  res.setHeader("X-Frame-Options", "DENY");

  // Force HTTPS for 1 year on this domain and subdomains.
  // Once a browser sees this, it enforces HTTPS locally.
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // Send no Referer header at all when leaving this site.
  // More private than "no-referrer-when-downgrade".
  res.setHeader("Referrer-Policy", "no-referrer");

  // Remove the "X-Powered-By: Express" fingerprint header.
  res.removeHeader("X-Powered-By");

  // A simple CSP: only load scripts/resources from our
  // own domain. Anything else (CDN, inline script) is blocked.
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'"
  );

  // Permissions Policy (formerly called Feature-Policy)
  // Controls access to browser hardware/APIs.
  // Empty () means the feature is BLOCKED for this page
  // and any iframes it contains.
  // Here we disable:
  //   geolocation → user location
  //   microphone  → audio recording
  //   camera      → video recording
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  // Always call next() so the request continues to the route!
  next();
});

// ===================================
// Test Routes
// ===================================
// These two routes let you verify the headers are working.
// HOW TO TEST:
//   1. Run: node 1.js
//   2. Open Chrome → http://localhost:3000
//   3. Open DevTools (F12) → Network tab
//   4. Click the request → "Response Headers" section
//   You should see all the security headers listed there.

// Home route — just confirms the server is up
app.get("/", (req, res) => {
  res.send("Security headers are active! Check browser dev tools.");
});

// Health check route — useful for monitoring/load balancers.
// Returns JSON so you can also test with: curl localhost:3000/health
app.get("/health", (req, res) => {
  res.json({ status: "ok", secure: true });
});

// ===================================
// Start the Server
// ===================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Secure server running on http://localhost:${PORT}`);
  console.log("Helmet security headers enabled");
  console.log("\nTest security headers:");
  console.log("- Open browser dev tools");
  console.log("- Go to Network tab");
  console.log("- Visit http://localhost:3000");
  console.log("- Check Response Headers");
});
