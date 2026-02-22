import express from "express";
import bodyParser from "body-parser";
import projectsRouter from "./routes/projects.js";
import studentsRouter from "./routes/students.js";
import { connectStubentsDb } from "./db/mongo.js";
import cors from "cors";

let app = express();
app.use((req, res, next) => {
  console.log(
    `[From node server ${new Date().toISOString()}] ${req.method} request to ${req.url}`
  );
  next(); // important to call next() to pass control to the next middleware or route handler
});
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/projects", projectsRouter);
app.use("/students", studentsRouter);

app.get("/", (req, res) => {
  const menuHTML = `
    <!DOCTYPE html>
    <html lang="en">
      <head> 
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Menu</title>
      </head>
      <body>
        <h1>Welcome to my app</h1>
        <nav>
          <ul>
            <li><a href="/projects">Projects</a></li>
            <li><a href="/students">Students</a></li>
          </ul>
        </nav>
      </body>
    </html>
  `;

  res.send(menuHTML);
});

connectStubentsDb()
  .then(() => {
    console.log("Connected to database");
    const server = app.listen(5000, () => {
      console.log("listening on port 5000");
    });
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });
