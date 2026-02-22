import http from "http";
import fs from "fs";

http
  .createServer(async function (req, res) {
    const file = "../public/index.html";
    const fileData = await fs.promises.readFile(file, "utf8");

    console.log("Running server on port 8080");
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    res.write(fileData);
    res.end();
  })
  .listen(8080);



