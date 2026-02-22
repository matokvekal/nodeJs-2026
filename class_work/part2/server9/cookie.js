import express from 'express';
import bodyParser from 'body-parser';//no need to ude sinc its build in in Express
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;

// Use cookie-parser middleware
app.use(cookieParser());

app.get('/', (req, res) => {
  // Set a cookie with an expiry date and username
  res.cookie('username', 'exampleUser', {
    expires: new Date(Date.now() + 900000), // Expires in 15 minutes
    httpOnly: true, // Makes the cookie inaccessible to client-side scripts, enhancing security
  });
  res.send('Cookie has been set with username and expiry date.');
});

// Add the /cookie route to display cookies
app.get('/cookie', (req, res) => {
    httpOnly: true,
  // Send parsed cookies as JSON
  res.json(req.cookies);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
