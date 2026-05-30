import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router(); // Correct way to create a new router instance

const users = [];
const SECRET = "your_secret_key@urewt'ort9ryktrh0t0ytpytyup6"; // Choose a strong secret key

// Routes
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = { name: req.body.name, password: hashedPassword };
  users.push(user);
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const user = users.find((u) => u.name === req.body.name);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    const token = jwt.sign({ name: user.name }, SECRET, { expiresIn: "1" });
    res.cookie("token", token).redirect("/");//send the token as a cookie
  } else {
    res.send("Invalid login");
  }
});


function authenticateToken(req, res, next) {
   // Get the token from the cookies
   const token = req.cookies.token;

   // If there's no token, send an unauthorized response
   if (!token) return res.status(401).send("Access Denied");

   try {
       // Verify the token using JWT
       const verified = jwt.verify(token, SECRET);
       req.user = verified; // Save the token payload for other middlewares or routes
       next(); // Proceed to the next middleware/route handler
   } catch (error) {
       res.status(400).send("Invalid Token");
   }
}

router.get('/protectedRoute', authenticateToken, (req, res) => {
   console.log(req.user.name);
   res.send("This is a protected route");
});



export default router;
