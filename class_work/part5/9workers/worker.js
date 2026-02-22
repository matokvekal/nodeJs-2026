import { parentPort } from 'worker_threads';
import { heavyComputation } from './computation.js';  // Importing the function


const total = heavyComputation();
parentPort.postMessage(total);
