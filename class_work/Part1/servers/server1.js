import http from "http";

http.createServer(function (req, res) {


    console.log("Running server on port 8080");
    var response = "Hello World";
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Content-Length": response.length,
    });
    res.write(response);
    res.end();
  })
  .listen(8080);

// run at cmd

// client side
//======================
//1  browser at localhost:8080

//2  fetch("http://localhost:8080/").then((res) => res.text()).then((data) => console.log(data));

//or
// 3  async function fetchData() {
//    const response = await fetch("http://localhost:8080/");
//    const data = await response.text();
//    console.log(data);
// }

// fetchData();

//4  at cmd  curl http://127.0.0.1:8080

//5   at postman   localhost:8080

//6 run node callServer1.js
