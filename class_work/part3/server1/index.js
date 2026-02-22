import express from "express";
import mongoose from "mongoose";

const dbUrl = "mongodb://127.0.0.1:27017/projectDb";

const app = express();

app.get("/", (req, res) => {
  const Cat = mongoose.model("Cat", { name: String });
  const kitty = new Cat({ name: "CATY" });
  kitty.save().then(() => console.log("meaow"));
  res.send("Hello kitty");
});

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Database is connected");
    app.listen(5000, () => {
      console.log("Server is running");
    });
  })
  .catch((error) => {
    console.log(error);
  });
