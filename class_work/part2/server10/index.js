import express from "express";
import { check, validationResult } from "express-validator";

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Define a route with validation checks
app.post(
  "/register",
  [
    // Username must be an email
    check("username").isEmail().withMessage("Must be a valid email"),

    // Password must be at least 5 chars long
    check("password")
      .isLength({ min: 5 })
      .withMessage("Must be at least 5 chars long"),

    // Age, if provided, must be an integer and in the range 1-130
    check("age")
      .optional()
      .isInt({ min: 1, max: 130 })
      .withMessage("Age must be an integer between 1 and 130"),
  ],
  (req, res) => {
    const errors = validationResult(req);

    // If there are validation errors, send them back as a response
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Otherwise, handle the valid data
    res.json({ message: "Registration successful!", data: req.body });
  }
);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});



app.get("/order", (req, res) => {
 const myorder={
  cola:2,
  burger:1,
 }

 cookie(old orders)
 const neworder= req.query
  res.send("Hello World.");
});


/products 
res.json()