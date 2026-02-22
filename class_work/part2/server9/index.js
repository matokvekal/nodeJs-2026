import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import { fileURLToPath } from "url";
import { join } from "path";
import fs from "fs";

let app = express();


//MORGAN
// Define a custom morgan token for IP address
morgan.token("ip", function getIp(req) {
  return req.ip || req.connection.remoteAddress;
});

// Custom format
const morganFormat =
  ":ip - :method :url :status :response-time ms - :res[content-length]";

const file = "./log.json";
const accessLogStream = fs.createWriteStream(file, { flags: "a" });

// Setup the logger to write to our log file
app.use(morgan("combined", { stream: accessLogStream }));

// Use helmet to help set some security headers
app.use(helmet());

// Use compression to compress response bodies
app.use(compression());

// Enable cors
app.use(cors());

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //for html forms

//Custome middleware
//http://localhost:3000/middleware?car=tesla
function checkLength(req, res, next) {
  const queryString = req.originalUrl.split("?")[1]; // Get the query string part from the URL

  res.locals.queryLength = queryString ? queryString.length : 0; // Store the length of the query string

  next();
}

app.use(checkLength);
//GET1
app.get("/", (req, res) => {
  arr.push(req.query.userName)
  res.send("Hello World.");
});

app.get("/middleware", (req, res) => {
  console.log("Middleware");

  res.send(
    `Has ABC: ${res.locals.hasABC}. Query length: ${res.locals.queryLength}`
  );
});

const server = app.listen(3000, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log("listening on port 3000");
});
