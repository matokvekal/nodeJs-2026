//build node server api,  use /students for get the db file as json,use /students/1 to get the sudent where his id=1 use
///add/name=mosh$_class=fizic&grade=30$id=5  to add new student use /delete/1 to delete student where id=1

import http from "http";
import fs from "fs";
import url from "url";
import { parse } from "url";
const file = "./db/db.json";
let students;
let html404;

http
  .createServer(async function (req, res) {
    try {
      let path = new url.parse(req.url, true);
      let pathname = path.pathname;
      let query = path.query;
      let status = 200;
      //we now using GET method
      console.log(req.method);

      if (
        pathname === "/" ||
        pathname === "/students" ||
        pathname === "/favicon.ico"
      ) {
        //   const html = await fs.promises.readFile(file, "utf8");
        students = JSON.parse(await fs.promises.readFile(file, "utf8"));
      } else if (pathname === "/add") {
        // http://localhost:8080/add?name=gilad&id=22&_class=fizik&grade=90
        let name = query.name;
        let _class = query._class;
        let grade = query.grade;
        let id = query.id;
        let student = { name: name, _class: _class, grade: grade, id: id };
        students = JSON.parse(await fs.promises.readFile(file, "utf8"));
        students.push(student);
        students = JSON.stringify(students);
        await fs.promises.writeFile(file, students);
        console.log("student added");
      } else if (pathname.includes("/delete")) {
        let id = pathname.split("/")[2];

        students = JSON.parse(await fs.promises.readFile(file, "utf8"));
        students = students.filter(
          (student) => student.id.toString().trim() !== id
        );

        -(await fs.promises.writeFile(file, JSON.stringify(students)));
      } else {
        const html = "../public/404.html";
        html404 = await fs.promises.readFile(html, "utf8");
        status = 404;
        res.writeHead(status, {
          "Content-Type": "text/html",
        });
      }
      //  const html = await fs.promises.readFile(DB, "utf8");
      status === 200 &&
        res.writeHead(status, {
          "Content-Type": "application/json",
        });
      //  let DB = JSON.parse();
      status === 200 ? res.write(JSON.stringify(students)) : res.write(html404);
      res.end();
    } catch (err) {
      console.log(err);
    }
  })
  .listen(8080);
