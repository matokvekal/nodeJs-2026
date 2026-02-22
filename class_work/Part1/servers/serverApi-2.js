//build node server api,  use /students for get the db file as json,use /students/1 to get the sudent where his id=1 use
///add/name=mosh$_class=fizic&grade=30$id=5  to add new student use /delete/1 to delete student where id=1

import http from "http";
import fs from "fs";
import url from "url";
import { parse } from "url";
const file = "./db/db.json";
let students;
//http://localhost:8080/students?id=1

http
  .createServer(async function (req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathname === "/students") {
      if (query.id) {
        // Fetch student by ID
        try {
          students = JSON.parse(await fs.promises.readFile(file, "utf8"));
          const student = students.find((s) => s.id == query.id); // Use == for loose comparison

          if (student) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(student));
          } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Student not found.");
          }
        } catch (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Server error.");
        }
      } else {
        // Handle other cases, e.g., list all students or handle other query parameters
      }
    } else {
      // Handle other routes or actions
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  })
  .listen(8080);
