import http from "http";
import fs from "fs";

http
  .createServer(async function (req, res) {
    let url = req.url;
    let file;
    let status = 200;

    if (url === "/favicon.ico") {
      res.writeHead(204);
      res.end();
      return;
    }

    if (url === "/" || url === "home") {
      file = "../public/index.html";
    } else if (url === "/about") {
      file = "../public/about.html";
    } else {
      file = "../public/404.html";
      status = 404;
    }

    const html = await fs.promises.readFile(file, "utf8");

    console.log("Running server on port 8080");
    res.writeHead(status, {
      "Content-Type": "text/html",
    });
    res.write(html);
    res.end();
  })
  .listen(8081);
