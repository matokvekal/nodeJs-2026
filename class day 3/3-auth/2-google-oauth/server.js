import express from "express";
import passport from "passport";
import cookieSession from "cookie-session";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

dotenv.config();

const app = express();

// Use cookie session to manage user sessions
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["your_cookie_encryption_key"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // Use profile info to check if user exists in your database.
      // If not, create a new user.
      // This example simply passes the profile data to the callback.
      return done(null, profile);
    }
  )
);

// Routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/fail",
  }),
  (req, res) => {
    res.redirect("/success");
  }
);

app.get("/success", (req, res) => {
  res.send("Login successful");
});

app.get("/fail", (req, res) => {
  res.send("Login failed");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
