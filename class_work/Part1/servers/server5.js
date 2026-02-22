import http from "http";
import fs from "fs";
import { URL } from "url";
import { parse } from "url";

http
  .createServer(async function (req, res) {
    const baseURL = "http://" + req.headers.host + "/";
    const path = new URL(req.url, baseURL); // Use the 'new' keyword here
    const pathname = path.pathname;
    const query = path.searchParams;
debugger;
    console.log("path: ", path);
    console.log("pathname: ", pathname);
    console.log("query: ", query.toString());
    //run at browser :   http://localhost:8080/about/1?name=tesla&model=3

    console.log("--------------------------");
    const parsedUrl = parse(req.url, true); // The second parameter 'true' will parse the query string as well
    const pathname1 = parsedUrl.pathname;
    const query1 = parsedUrl.query;

    console.log("parsedUrl: ", parsedUrl);
    console.log("pathname1: ", pathname1);
    console.log("query1: ", query1);

    let file;
    let status = 200;

    if (pathname === "/" || pathname === "home") {
      file = "../public/index.html";
    } else if (pathname === "/about") {
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
  .listen(8080);
