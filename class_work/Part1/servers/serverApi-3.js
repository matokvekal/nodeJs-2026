import http from "http";
import fs from "fs";
import url from "url";
import { parse } from "url";
const file = "./db/db.json";
let students;

const renderHtml = (student) => {
  return `
     <tr>
       <td>${student.id}</td>
       <td>${student.name}</td>
       <td>${student._class}</td>
       <td>${student.grade}</td>
     </tr>
   `;
};

http
  .createServer(async function (req, res) {
    try {
      const students = JSON.parse(await fs.promises.readFile(file, "utf8"));

      const renderedStudents = students.map(renderHtml).join("");

      const html = `
               <table border="1">
                   <thead>
                       <tr>
                           <th>ID</th>
                           <th>Name</th>
                           <th>Class</th>
                           <th>Grade</th>
                       </tr>
                   </thead>
                   <tbody>
                       ${renderedStudents}
                   </tbody>
               </table>
           `;

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    } catch (err) {
      console.log(err);
    }
  })
  .listen(8080);
