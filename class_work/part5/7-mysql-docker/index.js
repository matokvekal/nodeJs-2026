import express from "express";
import databaseConfig from "./config.js";
import initDatabase from "./initdatabase.js";
import dataController from "./dataController.js";

const startServer = async () => {
  const app = express();
  const db = await initDatabase(databaseConfig);
  app.set("dbModels", db);

  const DataController = new dataController(app, "names", db.sequelize);

  app.get("/mystack", DataController.getStack);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
};

startServer();
//docker run --name mysql -d -p 3307:3306 -e MYSQL_ROOT_PASSWORD=a1a1a1 --restart unless-stopped mysql:8
//docker exec -it mysql mysql -u root -p
//CREATE DATABASE db;
// USE db;

// CREATE TABLE myStack (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     programming VARCHAR(255) NOT NULL
// );
// USE db;

// INSERT INTO myStack (programming) VALUES ('Python');
// INSERT INTO myStack (programming) VALUES ('JavaScript');
// INSERT INTO myStack (programming) VALUES ('Java');
// INSERT INTO myStack (programming) VALUES ('C++');
// INSERT INTO myStack (programming) VALUES ('C#');
// INSERT INTO myStack (programming) VALUES ('Ruby');
// INSERT INTO myStack (programming) VALUES ('Go');
// INSERT INTO myStack (programming) VALUES ('Rust');
// INSERT INTO myStack (programming) VALUES ('Swift');
// INSERT INTO myStack (programming) VALUES ('Kotlin');
