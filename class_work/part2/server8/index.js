const express = require("express");

const app = express();
const PORT = 3000;
app.use(express.static("public"));




// Route for res.send()
// This method sends a plain text response to the client.
//  It sets the Content-Type to text/html by default
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/send", (req, res) => {
  res.send("Hello, World!");
});

// Route for res.sendFile()
// Sends a file in response. You need to provide the path to the file,
// and optionally, some settings and a callback.
app.get("/file", (req, res) => {
  res.sendFile(__dirname + "/sample.txt"); // Ensure you have a file named sample.txt in the same directory
});

//node-jsonp example
// Route for res.json()
//Sends a JSON response. It sets the Content-Type to application/json.
app.get("/json", (req, res) => {
  const data = { name: "Alice", age: 25 };
  res.json(data);
});

// Route for res.jsonp()
// Sends a JSON response with JSONP support. This is used to bypass cross-domain policies in web browsers,
//  as JSONP requests are wrapped in a function call.
app.get("/jsonp", (req, res) => {
  const data = { name: "Bob", age: 30 };
  res.jsonp(data);
});



// Set values using app.set
// app.set('appName', 'My Express App');
// app.set('appVersion', '1.0.0');
// app.set('appPort', PORT);
// app.get('/', (req, res) => {
//    const appName = app.get('appName');
//    const appVersion = app.get('appVersion');

//    res.send(`<h1>Welcome to ${appName}</h1><p>Version: ${appVersion}</p>`);
// });


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
