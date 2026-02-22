import Express from 'express';
import { Worker } from 'worker_threads';
import { heavyComputation } from './computation.js';  // Importing the function

const app = Express();
const port = 3000;
let counter = 0;




app.get("/", (req, res) => {
    counter++;
    res.status(200).send(`counter ${counter}`);
});

app.get("/heavy", (req, res) => {
    const result = heavyComputation();
    res.status(200).send(`heavy finish ${result}`);
});

app.get("/worker", (req, res) => {
   console.log("Request received in the server!");
   const worker = new Worker('./worker.js');
   let responseSent = false;

   worker.on("message", (message) => {
       if (!responseSent) {
           counter++;
           res.status(200).send(`worker finish with result: ${message} and counter value: ${counter}`);
           responseSent = true;
       }
   });

   worker.on("error", (error) => {
       if (!responseSent) {
           res.status(500).send(error.message);
           responseSent = true;
       }
   });

   worker.on("exit", (code) => {
       if (code !== 0 && !responseSent) {
           res.status(500).send(`Worker stopped with exit code ${code}`);
           responseSent = true;
       }
   });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
