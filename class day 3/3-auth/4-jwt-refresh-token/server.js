import express from "express";
import cookieParser from "cookie-parser";
import router from "./routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", router);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Refresh Token app running on http://localhost:${PORT}`);
  console.log("Routes:");
  console.log("  POST /auth/register");
  console.log("  POST /auth/login");
  console.log("  POST /auth/refresh   (uses httpOnly cookie)");
  console.log("  POST /auth/logout");
  console.log("  GET  /auth/me        (requires Bearer token)");
});
