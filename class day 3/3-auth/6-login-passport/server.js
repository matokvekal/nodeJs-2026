import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";
const app = express();
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import passport from "passport";
import initialize from "./passport-config.js";
import session from "express-session";

const users = []; //array to store users instead of a database

//initialize passport so that it can be used
initialize(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

app.set("view engine", "ejs"); //set view engine to ejs
app.use(express.urlencoded({ extended: true })); //use express to parse urlencoded data like the name from the form
app.use(
  session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("index.ejs", { name: req.user?req.user.name:"Guest" }); //render index.ejs
});
app.get("/login", (req, res) => {
  res.render("login.ejs", { title: "Home Page" });
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/", //redirect to home page
    failureRedirect: "/login", //redirect to login page if authentication fails
  })
);

app.get("/register", (req, res) => {
  res.render("register.ejs", { title: "Home Page" });
});
app.post("/register", async (req, res) => {
  try {
    //check if email already exists
    console.log("at register");

    const hashedPassword = await bcrypt.hash(req.body.password, 10); //hash the password 10 IS THE SALT OR security level
    const user = {
      id: uuidv4(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    };

    users.push(user); //push user to array
    res.redirect("/login"); //redirect to login page
  } catch {
    res.redirect("/register");
  }
  console.log(users);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
