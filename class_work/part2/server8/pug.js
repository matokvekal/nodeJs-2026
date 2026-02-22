const express = require("express");

const path = require("path");

const app = express();
const PORT = 3000;

// Set the view engine to pug
app.set("view engine", "pug");

// Set where the views are located
app.set("views", path.join(__dirname, "."));

app.get("/greet", (req, res) => {
  const name = req.query.name || "Guest"; // Default to 'Guest' if no name provided
  res.render("template", { name });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
