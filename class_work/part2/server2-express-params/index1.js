import Express from "express";

const express = Express;

const App = express();

App.get("/", (req, res) => {
  console.log("Get");
  res.json({ message: "Hello World" });
});
App.get("/randome", (req, res) => {
  if (Math.random() > 0.5) {
    return res.json({ message: "bigger than 0.5" });
  }
  console.log("After response");
  res.json({ message: "lower than 0.5" });
});

App.listen(3000, () => {
  console.log("Server is running on port 3000 . ");
});
