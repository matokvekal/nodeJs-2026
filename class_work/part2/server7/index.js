import express from "express";
import bodyParser from "body-parser";
import projectsRouter from "./routes/projects.js";
import studentsRouter from "./routes/students.js";
import reactstudentsRouter from "./routes/reactstudents.js";
import cors from "cors";

let app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/projects", projectsRouter);
app.use("/students", studentsRouter);
app.use("/reactstudents", reactstudentsRouter);

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

const server = app.listen(3000, () => {
  console.log("listening on port 3000");
});
