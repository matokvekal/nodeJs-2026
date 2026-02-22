import express from "express";
const app = express();
import routes from "./routes.js";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';




const users = [];

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
