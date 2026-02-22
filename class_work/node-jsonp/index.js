const express = require("express");
const app = express();
const port = 3000;

app.get("/jsonp", (req, res) => {
  const data = { name: "Bob", age: 30 };
  // `callback` query parameter is used to send the JSONP response
  const callback = req.query.callback;
  res.type("text/javascript");
  res.send(`${callback}(${JSON.stringify(data)})`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
