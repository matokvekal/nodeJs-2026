import express from "express";
import mysql from "mysql";

const app = express();
const PORT = 5000;

// Database connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "a1a1a1",
  database: "northwind",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the MySQL server.");
});

app.get("/", (req, res) => {
  connection.query("SELECT * FROM orders", (err, results) => {
    if (err) throw err;

    let html = '<table border="1"><tr><th>OrderID</th><th>OrderDate</th></tr>';
    for (let order of results) {
      html += `<tr><td>${order.id}</td><td>${order.order_date}</td></tr>`;
    }
    html += "</table>";

    res.send(html);
  });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
