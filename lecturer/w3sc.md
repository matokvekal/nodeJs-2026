What Can You Build With Node.js?
Node.js uses an event-driven, non-blocking model.

It can handle many connections at once without waiting for one to finish before starting another.

This makes it great for real-time apps and high-traffic websites.

Here are some examples of what you can build with Node.js:

Web servers and websites
REST APIs
Real-time apps (like chat)
Command-line tools
Working with files and databases
IoT and hardware control
How to Run Node.js Code
Save your code in a file, for example app.js, then run it in your terminal or command prompt with:

node app.js
This will start your Node.js program.

REMOVE ADS

Learning by Examples
Our "Show Node.js" tool makes it easy to learn Node.js, it shows both the code and the result.

ExampleGet your own Node.js Server
let http = require('http');

http.createServer(function (req, res) {
res.writeHead(200, {'Content-Type': 'text/plain'});
res.end('Hello World!');
}).listen(8080);
Click on the "Run example" button to see how it works.

Examples Running in the Command Line Interface
In this tutorial there will be some examples that are better explained by displaying the result in the command line interface.

When this happens, The "Show Node.js" tool will show the result in a black screen on the right:

Example
console.log('This example is different!');
console.log('The result is displayed in the Command Line Interface');
Click on the "Run example" button to see how it works.

Track Your Progress
Create a W3Schools account and get access to more features and learning materials:

CheckmarkView your completed tutorials, exercises, and quizzes
CheckmarkKeep an eye on your progress and daily streaks
CheckmarkJoin the leaderboard and compete with others
CheckmarkGet your own avatar and unlock new skins
CheckmarkCreate your own personal website

Note: This is an optional feature. You can study at W3Schools without creating an account.

Node.js Built-in Modules
Node.js comes with many built-in modules to help you work with files, servers, paths, the operating system, and more.

You can use them by importing them with require().

Example: Using the OS Module
const os = require('os');
console.log(os.platform());
See the full list of built-in modules.

What is npm?
npm is the package manager for Node.js.

It helps you install and manage third-party packages (libraries) to add more features to your apps.

Example: Installing a Package
npm install express
This command installs the popular Express web framework.

You can then use it in your code:

const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(8080);
Download Node.js
Download Node.js from the official Node.js web site: https://nodejs.org

Node.js Exercises

Node.js Introduction
What You'll Learn
In this tutorial, you'll learn:

How to install and run Node.js
Core concepts like modules and the event loop
How to build web servers and APIs
Working with databases and files
Deploying Node.js applications
What is Node.js?
Node.js is a free, open-source JavaScript runtime that runs on Windows, Mac, Linux, and more.

It lets you execute JavaScript code outside of a web browser, enabling server-side development with JavaScript.

Built on Chrome's V8 JavaScript engine, Node.js is designed for building scalable network applications efficiently.

Example: Print a MessageGet your own Node.js Server
console.log('Hello from Node.js!');
Why Node.js?
Node.js excels at handling many simultaneous connections with minimal overhead, making it perfect for:

Real-time applications (chats, gaming, collaboration tools)
APIs and microservices
Data streaming applications
Command-line tools
Server-side web applications
Its non-blocking, event-driven architecture makes it highly efficient for I/O-heavy workloads.

REMOVE ADS

Asynchronous Programming
Node.js uses asynchronous (non-blocking) programming.

This means it can keep working while waiting for tasks like reading files or talking to a database.

With asynchronous code, Node.js can handle many things at once—making it fast and efficient.

Example: Read a File Asynchronously
// Load the filesystem module
const fs = require('fs');

// Read file asynchronously
fs.readFile('myfile.txt', 'utf8', (err, data) => {
if (err) {
console.error('Error reading file: ' + err);
return;
}
console.log('File content: ' + data);
});

console.log('Reading file... (this runs first!)');
In this example:

We load the built-in fs module
We call readFile to read a file
Node.js continues to the next line while reading the file
When the file is read, our callback function runs
This non-blocking behavior lets Node.js handle many requests efficiently.

REMOVE ADS

What Can Node.js Do?
Web Servers: Create fast, scalable network applications
File Operations: Read, write, and manage files on the server
Database Interaction: Work with databases like MongoDB, MySQL, and more
APIs: Build RESTful services and GraphQL APIs
Real-time: Handle WebSockets for live applications
CLI Tools: Create command-line applications
Example: Simple Web Server
const http = require('http');
http.createServer((req, res) => {
res.writeHead(200, {'Content-Type': 'text/plain'});
res.end('Hello World!');
}).listen(8080);
What is a Node.js File?
Node.js files contain code that runs on the server. They usually have the .js extension and can be started with the node command.

Node.js files run tasks when certain events happen (like a web request)
They must be started on the server to have any effect
They use JavaScript syntax
Example: Running a Node.js File
node app.js
Node.js Versions & LTS:
Node.js releases a new major version every six months.

For stability, use an LTS (Long Term Support) version for production projects.

Exercise
?
Drag and drop the correct word to complete the sentence.
Node.js lets you run outside the browser.
Node.js Get Started
Download and Install Node.js
Go to https://nodejs.org
Download the LTS (Long Term Support) version
Run the installer and follow the instructions
Verify Installation
Open your terminal/command prompt and type:

node --version
npm --version
You should see version numbers for both Node.js and npm (Node Package Manager).

Troubleshooting
If the commands don't work:

Restart your terminal/command prompt
Make sure Node.js was added to your system's PATH during installation
On Windows, you might need to restart your computer
Getting Started
Once you have installed Node.js, let's create your first server that says "Hello World!" in a web browser.

Create a file called myfirst.js and add this code:

myfirst.js

let http = require('http');
http.createServer(function (req, res) {
res.writeHead(200, {'Content-Type': 'text/html'});
res.end('Hello World!');
}).listen(8080);
Save the file on your computer, for example: C:\Users\Your Name\myfirst.js

This code creates a simple web server.

When someone visits your computer on port 8080, it will show "Hello World!".

Command Line Interface
Node.js files must be initiated in the "Command Line Interface" program of your computer.

How to open the command line interface on your computer depends on the operating system.

For Windows users, press the start button and look for "Command Prompt", or simply write "cmd" in the search field.

Navigate to the folder that contains the file "myfirst.js", the command line interface window should look something like this:

C:\Users\Your Name>\_

REMOVE ADS

Initiate the Node.js File
The file you have just created must be initiated by Node.js before any action can take place.

Start your command line interface, write node myfirst.js and hit enter:

Initiate "myfirst.js":

C:\Users\Your Name>node myfirst.js
Now, your computer works as a server!

If anyone tries to access your computer on port 8080, they will get a "Hello World!" message in return!

Start your internet browser, and type in the address: http://localhost:8080

Exercise
?
Drag and drop the correct command to run the Node.js file.
filename.js

Node.js JavaScript Requirements
Quick Start
If you're new to JavaScript, don't worry!

Here are the key concepts you need to know before diving into Node.js.

We'll cover the essentials with simple examples.

Try It Yourself
You can run these examples directly in your browser's console or in a .js file using Node.js.

JavaScript Fundamentals
Before starting with Node.js, you should be familiar with these JavaScript concepts:

Variables
Functions
Objects
Arrays
Asynchronous programming (callbacks, promises, async/await)
ES6+ features
This page will give short examples of essential JavaScript concepts needed for Node.js development.

For a greater understanding for JavaScipt, visit our JavaScript Tutorial.

Variables and FunctionsGet your own Node.js Server
// Variables (let, const, var)
let name = 'Node.js';
const version = 20;

// Function declaration
function greet(user) {
return `Hello, ${user}!`; // Template literal (ES6)
}

// Arrow function (ES6+)
const add = (a, b) => a + b;

console.log(greet('Developer')); // Hello, Developer!
console.log(add(5, 3)); // 8
Objects and Arrays
// Object
const user = {
name: 'Alice',
age: 25,
greet() {
console.log(`Hi, I'm ${this.name}`);
}
};

// Array
const colors = ['red', 'green', 'blue'];

// Array methods (ES6+)
colors.forEach(color => console.log(color));
const lengths = colors.map(color => color.length);
Asynchronous JavaScript
// 1. Callbacks (traditional)
function fetchData(callback) {
setTimeout(() => {
callback('Data received!');
}, 1000);
}

// 2. Promises (ES6+)
const fetchDataPromise = () => {
return new Promise((resolve) => {
setTimeout(() => resolve('Promise resolved!'), 1000);
});
};

// 3. Async/Await (ES8+)
async function getData() {
const result = await fetchDataPromise();
console.log(result);
}

getData(); // Call the async function
Destructuring & Template Literals (ES6+)
const { name } = user;
console.log(`Hello, ${name}!`);
Key JavaScript Concepts
Variables: let (mutable), const (immutable), var (legacy)
Functions: Regular, arrow functions, and methods
Objects & Arrays: Data structures for organizing data
Modules: require() (CommonJS) and import/export (ES6)
Error Handling: try/catch blocks

REMOVE ADS

Quick Reference Table
Feature Node.js Support
let / const Yes (since Node 6+)
Arrow Functions Yes (since Node 4+)
Destructuring Yes (since Node 6+)
Template Literals Yes (since Node 4+)
Promises Yes (since Node 0.12+)
Async/Await Yes (since Node 7.6+)
Exercise
?
Complete the async function:
async function fetchData() {
return await .resolve('Hello!');
}

Node.js vs Browser
Key Differences
Node.js and browsers both run JavaScript, but they have different environments and capabilities.

Node.js is designed for server-side development, while browsers are for client-side applications.

APIs: Node.js provides APIs for file system, networking, and OS, which browsers do not.
Browsers provide DOM, fetch, and UI APIs not available in Node.js.
Global Objects: Node.js uses global; browsers use window or self.
Modules: Node.js uses CommonJS (require) and ES modules (import); browsers use ES modules or plain <script> tags.
Security: Browsers run in a sandbox with limited access; Node.js has full access to the file system and network.
Event Loop: Both environments use an event loop, but Node.js has additional APIs for timers, process, etc.
Environment Variables: Node.js can access environment variables (process.env); browsers cannot.
Package Management: Node.js uses npm/yarn; browsers use CDNs or bundlers.
This page explains the key differences, with examples for each environment.

Examples
Global ObjectsGet your own Node.js Server
// Node.js
global.mylet = 42;
console.log(global.mylet); // 42
// Browser
window.mylet = 42;
console.log(window.mylet); // 42
File Access
// Node.js
const fs = require('fs');
fs.readFile('myfile.txt', 'utf8', (err, data) => {
if (err) throw err;
console.log(data);
});
// Browser
// Not allowed for security reasons
HTTP Requests
// Node.js
const https = require('https');
https.get('https://example.com', res => {
let data = '';
res.on('data', chunk => data += chunk);
res.on('end', () => console.log(data));
});
// Browser
fetch('https://example.com')
.then(response => response.text())
.then(console.log);
Modules
// Node.js (CommonJS)
const fs = require('fs');
// Node.js & Browser (ES Modules)
// import fs from 'fs'; // Node.js only, not browser
// import \_ from 'https://cdn.jsdelivr.net/npm/lodash-es/lodash.js'; // Browser

REMOVE ADS

Comparison Table
Feature Node.js Browser
File System Access Yes No
Networking (TCP/UDP) Yes No
DOM Access No Yes
Global Object global window/self
Modules CommonJS/ESM ESM/Scripts
Environment Variables Yes (process.env) No
Security Full OS access Sandboxed
Package Management npm/yarn CDN/Bundler

ode.js Command Line Usage
Node.js provides a powerful command line interface (CLI) that allows you to run JavaScript files, manage packages, debug applications, and more.

This guide covers the essential commands and techniques every Node.js developer should know.

Note: All commands should be run in a terminal or command prompt.

On Windows, you can use Command Prompt, PowerShell, or Windows Terminal.

On macOS/Linux, use Terminal.

Basic Node.js Commands
These are the most common commands you'll use when working with Node.js applications:

Run a JavaScript fileGet your own Node.js Server

# Run a JavaScript file

node app.js

# Run with additional arguments

node app.js arg1 arg2

# Run in watch mode (restarts on file changes)

node --watch app.js
Using the REPL
The Node.js REPL (Read-Eval-Print Loop) is an interactive shell for executing JavaScript code.

The REPL is started by running node in the terminal:

Using the REPL

> const name = 'Node.js';
> console.log(`Hello, ${name}!`);
> .help // Show available commands
> .exit // Exit REPL
> Command Line Arguments
> Access command line arguments using process.argv:

Command Line Arguments
// args.js
console.log('All arguments:', process.argv);
console.log('First argument:', process.argv[2]);
console.log('Second argument:', process.argv[3]);

// Example usage:
// node args.js hello world
// Output:
// All arguments: ['/path/to/node', '/path/to/args.js', 'hello', 'world']
// First argument: hello
// Second argument: world
Environment Variables
Access and set environment variables:

Environment Variables
// env.js
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Custom variable:', process.env.MY_VARIABLE);
console.log('Database URL:', process.env.DATABASE_URL || 'Not set');

// Example usage with environment variables:
// NODE_ENV=production MY_VARIABLE=test node env.js
Set Environment Variables

# Set environment variables when running

NODE_ENV=production MY_VARIABLE=test node env.js

REMOVE ADS

Debugging Node.js Applications
Node.js includes a powerful debugging system that integrates with Chrome DevTools:

Basic Debugging Commands

# Start with inspector (listens on default port 9229)

node --inspect app.js

# Break on first line of application

node --inspect-brk app.js

# Specify a custom port

node --inspect=9222 app.js

# Enable remote debugging (be careful with this in production)

node --inspect=0.0.0.0:9229 app.js
Using Chrome DevTools for Debugging
Start your application with node --inspect app.js
Open Chrome and navigate to chrome://inspect
Click on "Open dedicated DevTools for Node"
Set breakpoints and debug your application
Common CLI Tools
Node.js comes with several useful command-line tools:

Node Version Manager (nvm)

# Install and use different Node.js versions

nvm install 18.16.0 # Install specific version
nvm use 18.16.0 # Switch to version
nvm ls # List installed versions
npm (Node Package Manager)

# Common npm commands

npm init # Initialize a new project
npm install # Install dependencies
npm update # Update packages
npm audit # Check for vulnerabilities
Common Command Line Flags
Node.js provides several command-line flags to control its behavior. Here are some of the most useful ones:

Basic Flags

# Show Node.js version

node --version # or -v

# Show V8 version

node --v8-options

# Show command-line help

node --help
Runtime Behavior

# Check syntax without executing

node --check app.js

# Show stack traces for warnings

node --trace-warnings app.js

# Set max memory (in MB)

node --max-old-space-size=4096 app.js

# Preload a module before execution

node --require dotenv/config app.js
Performance and Optimization

# Enable ES module loader

node --experimental-modules app.mjs

# Enable experimental features

node --experimental-repl-await

# Enable experimental worker threads

node --experimental-worker
Node.js V8 Engine
What is the V8 Engine?
The V8 engine is Google's open-source JavaScript engine, used by Chrome and Node.js.

It compiles JavaScript to native machine code for fast execution.

Origin: Developed by Google for Chrome in 2008
Integration: Node.js uses V8 to provide JavaScript runtime on the server
Features: Just-In-Time compilation, efficient garbage collection, ES6+ support
Why V8 Makes Node.js Fast
Just-In-Time (JIT) Compilation: Converts JavaScript into optimized machine code instead of interpreting it
Hidden Classes: Optimizes property access on JavaScript objects
Efficient Garbage Collection: Manages memory to prevent leaks and optimize performance
Inline Caching: Speeds up property access by remembering where to find object properties
Example: Check V8 Version in Node.jsGet your own Node.js Server
// Show the V8 engine version used by your Node.js installation
console.log(`V8 version: ${process.versions.v8}`);

REMOVE ADS

Understanding V8's Role in Node.js
V8 provides the core JavaScript execution environment that Node.js is built upon.

It allows Node.js to:

Execute JavaScript code outside the browser
Access operating system functionality (file system, networking, etc.)
Use the same JavaScript engine that powers Chrome for consistency
Example: V8 Memory Usage
// Get information about V8's heap memory usage
const v8 = require('v8');
const heapStats = v8.getHeapStatistics();

console.log('Heap size limit:', (heapStats.heap_size_limit / 1024 / 1024).toFixed(2), 'MB');
console.log('Total heap size:', (heapStats.total_heap_size / 1024 / 1024).toFixed(2), 'MB');
console.log('Used heap size:', (heapStats.used_heap_size / 1024 / 1024).toFixed(2), 'MB');
V8's Update Cycle
V8 is constantly being improved with new JavaScript features and performance optimizations.

Node.js regularly updates its V8 engine version
New Node.js versions often include newer versions of V8
This provides access to newer JavaScript features and better performance
V8 implements the ECMAScript and WebAssembly standards.

When a new JavaScript feature becomes part of the ECMAScript standard, V8 will eventually implement it, making it available in both Chrome and Node.js.

Exercise
?
Complete the code to print the V8 version:
console.log(process..v8);

Node.js Architecture
What is Node.js Architecture?
Node.js uses a single-threaded, event-driven architecture that is designed to handle many connections at once, efficiently and without blocking the main thread.

This makes Node.js ideal for building scalable network applications, real-time apps, and APIs.

Key Characteristics: Non-blocking I/O, event-driven, single-threaded with event loop, asynchronous execution

Node.js Architecture Diagram
Here is a simple overview of how Node.js processes requests:

1. Client Request Phase

Clients send requests to the Node.js server
Each request is added to the Event Queue 2. Event Loop Phase

The Event Loop continuously checks the Event Queue
Picks up requests one by one in a loop 3. Request Processing

Simple (non-blocking) tasks are handled immediately by the main thread
Complex/blocking tasks are offloaded to the Thread Pool 4. Response Phase

When blocking tasks complete, their callbacks are placed in the Callback Queue
Event Loop processes callbacks and sends responses
Non-blocking Examples
Example: Non-blocking File ReadGet your own Node.js Server
const fs = require('fs');
console.log('Before file read');
fs.readFile('myfile.txt', 'utf8', (err, data) => {
if (err) throw err;
console.log('File contents:', data);
});
console.log('After file read');
Notice how "After file read" is printed before the file contents, showing that Node.js does not wait for the file operation to finish.

Example: Blocking vs Non-blocking Code
// Blocking code example
console.log('Start of blocking code');
const data = fs.readFileSync('myfile.txt', 'utf8'); // Blocks here
console.log('Blocking operation completed');

// Non-blocking code example
console.log('Start of non-blocking code');
fs.readFile('myfile.txt', 'utf8', (err, data) => {
if (err) throw err;
console.log('Non-blocking operation completed');
});
console.log('This runs before the file is read');
Key Difference: The first example blocks the entire process until the file is read, while the second example allows other operations to continue while the file is being read.

REMOVE ADS

When to Use Node.js
Node.js is particularly well-suited for:

I/O-bound applications - File operations, database queries, network requests
Real-time applications - Chat apps, live notifications, collaboration tools
APIs - RESTful services, GraphQL APIs
Microservices - Small, independent services
Note: Node.js may not be the best choice for CPU-intensive tasks as they can block the event loop. For such cases, consider:

Using worker threads
Creating a microservice in a more suitable language
Using native add-ons
Summary
Node.js is fast and efficient because it uses a non-blocking event loop and delegates heavy work to the system.

This allows it to handle thousands of connections at the same time, with minimal resources.

Key Benefits:
Handles many concurrent connections efficiently
Great for I/O-bound applications
Uses JavaScript on both client and server
Large ecosystem of packages (npm)

Node.js Event Loop
What is the Event Loop?
The event loop is what makes Node.js non-blocking and efficient.

It handles asynchronous operations by delegating tasks to the system and processing their results through callbacks, allowing Node.js to manage thousands of concurrent connections with a single thread.

How the Event Loop Works
Node.js follows these steps to handle operations:

Execute the main script (synchronous code)
Process any microtasks (Promises, process.nextTick)
Execute timers (setTimeout, setInterval)
Run I/O callbacks (file system, network operations)
Process setImmediate callbacks
Handle close events (like socket.on('close'))
Example: Event Loop OrderGet your own Node.js Server
console.log('First');
setTimeout(() => console.log('Third'), 0);
Promise.resolve().then(() => console.log('Second'));
console.log('Fourth');
This demonstrates the execution order:

Sync code runs first ('First', 'Fourth')
Microtasks (Promises) run before the next phase ('Second')
Timers execute last ('Third')

REMOVE ADS

Event Loop Phases
The event loop processes different types of callbacks in this order:

Timers: setTimeout, setInterval
I/O Callbacks: Completed I/O operations
Poll: Retrieve new I/O events
Check: setImmediate callbacks
Close: Cleanup callbacks (like socket.on('close'))
Note: Between each phase, Node.js runs microtasks (Promises) and process.nextTick callbacks.

Example: Event Loop Phases
console.log('1. Start');

// Next tick queue
process.nextTick(() => console.log('2. Next tick'));

// Microtask queue (Promise)
Promise.resolve().then(() => console.log('3. Promise'));

// Timer phase
setTimeout(() => console.log('4. Timeout'), 0);

// Check phase
setImmediate(() => console.log('5. Immediate'));

console.log('6. End');
The output will be:

1. Start
2. End
3. Next tick
4. Promise
5. Timeout
6. Immediate
   This shows the priority order: sync code > nextTick > Promises > Timers > Check phase.

Why is the Event Loop Important?
The event loop enables Node.js to handle thousands of concurrent connections with a single thread, making it perfect for:

Real-time applications
APIs and microservices
Data streaming
Chat applications

REMOVE ADS

Summary
Node.js uses an event loop to handle async operations
Different types of callbacks have different priorities
Microtasks (Promises) run before the next event loop phase
This non-blocking model enables high concurrency

Node.js Asynchronous Programming
What is Asynchronous Programming?
In Node.js, asynchronous operations let your program do other work while waiting for tasks like file I/O or network requests to complete.

This non-blocking approach enables Node.js to handle thousands of concurrent connections efficiently.

Sync vs Async: Key Differences
Synchronous
Blocks execution until complete
Simple to understand
Can cause delays
Uses functions like readFileSync
Asynchronous
Non-blocking execution
Better performance
More complex to handle
Uses callbacks, promises, or async/await
Example: Synchronous File ReadGet your own Node.js Server
const fs = require('fs');

console.log('1. Starting sync read...');
const data = fs.readFileSync('myfile.txt', 'utf8');
console.log('2. File contents:', data);
console.log('3. Done reading file');
Output will be in order: 1 → 2 → 3 (blocks between each step)

Example: Asynchronous File Read
const fs = require('fs');

console.log('1. Starting async read...');
fs.readFile('myfile.txt', 'utf8', (err, data) => {
if (err) throw err;
console.log('2. File contents:', data);
});

console.log('3. Done starting read operation');
Output order: 1 → 3 → 2 (doesn't wait for file read to complete)

REMOVE ADS

Avoiding Callback Hell
Problem: Nested Callbacks (Callback Hell)
getUser(userId, (err, user) => {
if (err) return handleError(err);
getOrders(user.id, (err, orders) => {
if (err) return handleError(err);
processOrders(orders, (err) => {
if (err) return handleError(err);
console.log('All done!');
});
});
});
Solution: Use Promises
getUser(userId)
.then(user => getOrders(user.id))
.then(orders => processOrders(orders))
.then(() => console.log('All done!'))
.catch(handleError);
Even Better: Async/Await
async function processUser(userId) {
try {
const user = await getUser(userId);
const orders = await getOrders(user.id);
await processOrders(orders);
console.log('All done!');
} catch (err) {
handleError(err);
}
}
Modern Async Patterns

Node.js Promises
Introduction to Promises
Promises in Node.js provide a cleaner way to handle asynchronous operations compared to traditional callbacks.

Promises represent the completion (or failure) of an asynchronous operation and its result.

Promise States
Pending: Initial state, operation not completed
Fulfilled: Operation completed successfully
Rejected: Operation failed
Once a promise is settled (either fulfilled or rejected), its state cannot change.

Benefits of Using Promises
With CallbacksGet your own Node.js Server
getUser(id, (err, user) => {
if (err) return handleError(err);
getOrders(user.id, (err, orders) => {
if (err) return handleError(err);
// Process orders...
});
});
With Promises
getUser(id)
.then(user => getOrders(user.id))
.then(orders => processOrders(orders))
.catch(handleError);
Key Advantages:
Flatter code structure (avoids callback hell)
Better error handling with single .catch()
Easier to compose and chain operations
Built-in support for parallel operations
Callback Hell Example (Without Promises)
fs.readFile('file1.txt', (err, data1) => {
if (err) throw err;
fs.readFile('file2.txt', (err, data2) => {
if (err) throw err;
fs.readFile('file3.txt', (err, data3) => {
if (err) throw err;
// Use data1, data2, and data3
});
});
});
Creating and Using Promises
Promises can be created using the Promise constructor, which accepts an executor function with two parameters: resolve and reject.

Basic Promise Creation
// Create a new Promise
const myPromise = new Promise((resolve, reject) => {
// Simulate an async operation (e.g., API call, file read)
setTimeout(() => {
const success = Math.random() > 0.5;

    if (success) {
      resolve('Operation completed successfully');
    } else {
      reject(new Error('Operation failed'));
    }

}, 1000); // Simulate delay
});

// Using the Promise
myPromise
.then(result => console.log('Success:', result))
.catch(error => console.error('Error:', error.message));
Example: Reading a File with Promises
const fs = require('fs').promises;
const promise1 = Promise.resolve('First result');
const promise2 = new Promise((resolve) => setTimeout(() => resolve('Second result'), 1000));
const promise3 = fs.readFile('myfile.txt', 'utf8'); // Read local file instead of fetch

Promise.all([promise1, promise2, promise3])
.then(results => {
console.log('Results:', results);
// results[0] is from promise1
// results[1] is from promise2
// results[2] is the content of myfile.txt
})
.catch(error => {
console.error('Error in one of the promises:', error);
});
Node.js Async/Await
Introduction to Async/Await
Async/await is a modern way to handle asynchronous operations in Node.js, building on top of Promises to create even more readable code.

Introduced in Node.js 7.6 and standardized in ES2017, async/await allows you to write asynchronous code that looks and behaves more like synchronous code.

Async/await is basically Promises with a more readable syntax. This makes your code cleaner and more maintainable.

Async/await makes asynchronous code look and more feel like synchronous code. It does not block the main thread, but is easy to follow and understand.

Syntax and Usage
The syntax consists of two keywords:

async: Used to declare an asynchronous function that returns a Promise
await: Used to pause execution until a Promise is resolved, can only be used inside async functions
Example: Basic Async/AwaitGet your own Node.js Server
async function getData() {
console.log('Starting...');
const result = await someAsyncOperation();
console.log(`Result: ${result}`);
return result;
}

function someAsyncOperation() {
return new Promise(resolve => {
setTimeout(() => resolve('Operation completed'), 1000);
});
}

// Call the async function
getData().then(data => console.log('Final data:', data));
Example: Reading a File with Async/Await
const fs = require('fs').promises;

async function readFile() {
try {
const data = await fs.readFile('myfile.txt', 'utf8');
console.log(data);
} catch (error) {
console.error('Error reading file:', error);
}
}

readFile();

REMOVE ADS

Error Handling with Try/Catch
One of the advantages of async/await is that you can use traditional try/catch blocks for error handling, making your code more readable.

Example: Error Handling with Async/Await
async function fetchUserData() {
try {
const response = await fetch('https://api.example.com/users/1');
if (!response.ok) {
throw new Error(`HTTP error: ${response.status}`);
}
const user = await response.json();
console.log('User data:', user);
return user;
} catch (error) {
console.error('Error fetching user data:', error);
throw error; // Re-throw the error if needed
}
}
You can also mix async/await with Promise .catch() for different scenarios:

// Using catch with an async function
fetchUserData().catch(error => {
console.log('Caught outside of async function:', error.message);
});
Running Promises in Parallel
Although async/await makes code look synchronous, sometimes you need to run operations in parallel for better performance.

Example: Sequential vs Parallel Operations
// Helper function to simulate an API call
function fetchData(id) {
return new Promise(resolve => {
setTimeout(() => resolve(`Data for ID ${id}`), 1000);
});
}

// Sequential operation - takes ~3 seconds
async function fetchSequential() {
console.time('sequential');
const data1 = await fetchData(1);
const data2 = await fetchData(2);
const data3 = await fetchData(3);
console.timeEnd('sequential');
return [data1, data2, data3];
}

// Parallel operation - takes ~1 second
async function fetchParallel() {
console.time('parallel');
const results = await Promise.all([
fetchData(1),
fetchData(2),
fetchData(3)
]);
console.timeEnd('parallel');
return results;
}

// Demo
async function runDemo() {
console.log('Running sequentially...');
const seqResults = await fetchSequential();
console.log(seqResults);

console.log('\nRunning in parallel...');
const parResults = await fetchParallel();
console.log(parResults);
}

runDemo();

REMOVE ADS

Async/Await vs Promises vs Callbacks
Let's see how the same task is handled with different asynchronous patterns:

With Callbacks
function getUser(userId, callback) {
setTimeout(() => {
callback(null, { id: userId, name: 'John' });
}, 1000);
}

function getUserPosts(user, callback) {
setTimeout(() => {
callback(null, ['Post 1', 'Post 2']);
}, 1000);
}

// Using callbacks
getUser(1, (error, user) => {
if (error) {
console.error(error);
return;
}
console.log('User:', user);

getUserPosts(user, (error, posts) => {
if (error) {
console.error(error);
return;
}
console.log('Posts:', posts);
});
});
With Promises
function getUserPromise(userId) {
return new Promise(resolve => {
setTimeout(() => {
resolve({ id: userId, name: 'John' });
}, 1000);
});
}

function getUserPostsPromise(user) {
return new Promise(resolve => {
setTimeout(() => {
resolve(['Post 1', 'Post 2']);
}, 1000);
});
}

// Using promises
getUserPromise(1)
.then(user => {
console.log('User:', user);
return getUserPostsPromise(user);
})
.then(posts => {
console.log('Posts:', posts);
})
.catch(error => {
console.error(error);
});
With Async/Await
// Using async/await
async function getUserAndPosts() {
try {
const user = await getUserPromise(1);
console.log('User:', user);

    const posts = await getUserPostsPromise(user);
    console.log('Posts:', posts);

} catch (error) {
console.error(error);
}
}

getUserAndPosts();
Pattern Pros Cons
Callbacks - Simple to understand

- Widely supported - Callback hell
- Error handling is complex
- Hard to reason about
  Promises - Chaining with .then()
- Better error handling
- Composable - Still requires nesting for complex flows
- Not as readable as async/await
  Async/Await - Clean, synchronous-like code
- Easy error handling with try/catch
- Easier debugging - Requires understanding of Promises
- Easy to accidentally block execution
  Best Practices
  When working with async/await in Node.js, follow these best practices:

Remember that async functions always return Promises
async function myFunction() {
return 'Hello';
}

// This returns a Promise that resolves to 'Hello', not the string 'Hello' directly
const result = myFunction();
console.log(result); // Promise { 'Hello' }

// You need to await it or use .then()
myFunction().then(message => console.log(message)); // Hello
Use Promise.all for concurrent operations
When operations can run in parallel, use Promise.all to improve performance.

Always handle errors
Use try/catch blocks or chain a .catch() to the async function call.

Avoid mixing async/await with callbacks
Convert callback-based functions to Promises using util.promisify or custom wrappers.

const util = require('util');
const fs = require('fs');

// Convert callback-based function to Promise-based
const readFile = util.promisify(fs.readFile);

async function readFileContents() {
const data = await readFile('file.txt', 'utf8');
return data;
}
Create clean async functions
Keep async functions focused on a single responsibility.

Best Practice: Be aware of the "top-level await" feature available in ECMAScript modules (ESM) in Node.js 14.8.0 and above, which allows using await outside of async functions at the module level.

Node.js Error Handling
Why Handle Errors?
Errors are inevitable in any program, but how you handle them makes all the difference. In Node.js, proper error handling is crucial because:

It prevents applications from crashing unexpectedly
It provides meaningful feedback to users
It makes debugging easier with proper error context
It helps maintain application stability in production
It ensures resources are properly cleaned up
Common Error Types in Node.js
Understanding different error types helps in handling them appropriately:

1. Standard JavaScript ErrorsGet your own Node.js Server
   // SyntaxError
   JSON.parse('{invalid json}');

// TypeError
null.someProperty;

// ReferenceError
unknownVariable; 2. System Errors
// ENOENT: No such file or directory
const fs = require('fs');
fs.readFile('nonexistent.txt', (err) => {
console.error(err.code); // 'ENOENT'
});

// ECONNREFUSED: Connection refused
const http = require('http');
const req = http.get('http://nonexistent-site.com', (res) => {});
req.on('error', (err) => {
console.error(err.code); // 'ECONNREFUSED' or 'ENOTFOUND'
});
Basic Error Handling
Node.js follows several patterns for error handling:

Error-First Callbacks
The most common pattern in Node.js core modules where the first argument to a callback is an error object (if any occurred).

Example: Error-First Callback
const fs = require('fs');

function readConfigFile(filename, callback) {
fs.readFile(filename, 'utf8', (err, data) => {
if (err) {
// Handle specific error types
if (err.code === 'ENOENT') {
return callback(new Error(`Config file ${filename} not found`));
} else if (err.code === 'EACCES') {
return callback(new Error(`No permission to read ${filename}`));
}
// For all other errors
return callback(err);
}

    // Process data if no error
    try {
      const config = JSON.parse(data);
      callback(null, config);
    } catch (parseError) {
      callback(new Error(`Invalid JSON in ${filename}`));
    }

});
}

// Usage
readConfigFile('config.json', (err, config) => {
if (err) {
console.error('Failed to read config:', err.message);
// Handle the error (e.g., use default config)
return;
}
console.log('Config loaded successfully:', config);
});
Modern Error Handling
Using try...catch with Async/Await
With async/await, you can use try/catch blocks for both synchronous and asynchronous code:

Example: try/catch with Async/Await
const fs = require('fs').promises;

async function loadUserData(userId) {
try {
const data = await fs.readFile(`users/${userId}.json`, 'utf8');
const user = JSON.parse(data);

    if (!user.email) {
      throw new Error('Invalid user data: missing email');
    }

    return user;

} catch (error) {
// Handle different error types
if (error.code === 'ENOENT') {
throw new Error(`User ${userId} not found`);
} else if (error instanceof SyntaxError) {
throw new Error('Invalid user data format');
}
// Re-throw other errors
throw error;
} finally {
// Cleanup code that runs whether successful or not
console.log(`Finished processing user ${userId}`);
}
}

// Usage
(async () => {
try {
const user = await loadUserData(123);
console.log('User loaded:', user);
} catch (error) {
console.error('Failed to load user:', error.message);
// Handle error (e.g., show to user, retry, etc.)
}
})();

REMOVE ADS

Global Error Handling
Uncaught Exceptions
For unexpected errors, you can listen for uncaughtException to perform cleanup before exiting:

Example: Global Error Handlers
// Handle uncaught exceptions (synchronous errors)
process.on('uncaughtException', (error) => {
console.error('UNCAUGHT EXCEPTION! Shutting down...');
console.error(error.name, error.message);

// Perform cleanup (close database connections, etc.)
server.close(() => {
console.log('Process terminated due to uncaught exception');
process.exit(1); // Exit with failure
});
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
console.error('UNHANDLED REJECTION! Shutting down...');
console.error('Unhandled Rejection at:', promise, 'Reason:', reason);

// Close server and exit
server.close(() => {
process.exit(1);
});
});

// Example of an unhandled promise rejection
Promise.reject(new Error('Something went wrong'));

// Example of an uncaught exception
setTimeout(() => {
throw new Error('Uncaught exception after timeout');
}, 1000);
Error Handling Best Practices
Dos and Don'ts
Do
Handle errors at the appropriate level
Log errors with sufficient context
Use custom error types for different scenarios
Clean up resources in finally blocks
Validate input to catch errors early
Don't
Ignore errors (empty catch blocks)
Expose sensitive error details to clients
Use try/catch for flow control
Swallow errors without logging them
Continue execution after unrecoverable errors
Custom Error Types
class ValidationError extends Error {
constructor(message, field) {
super(message);
this.name = 'ValidationError';
this.field = field;
this.statusCode = 400;
}
}

class NotFoundError extends Error {
constructor(resource) {
super(`${resource} not found`);
this.name = 'NotFoundError';
this.statusCode = 404;
}
}

// Usage
function getUser(id) {
if (!id) {
throw new ValidationError('User ID is required', 'id');
}
// ...
}
Summary
Effective error handling is a critical aspect of building robust Node.js applications.

By understanding different error types, using appropriate patterns, and following best practices, you can create applications that are more stable, maintainable, and user-friendly.

Remember that good error handling is not just about preventing crashes—it's about providing meaningful feedback, maintaining data integrity, and ensuring a good user experience even when things go wrong.

Node.js Modules
What is a Module in Node.js?
Modules are the building blocks of Node.js applications, allowing you to organize code into logical, reusable components. They help in:

Organizing code into manageable files
Encapsulating functionality
Preventing global namespace pollution
Improving code maintainability and reusability
Node.js supports two module systems: CommonJS (traditional) and ES Modules (ECMAScript modules).

This page covers CommonJS, while ES Modules are covered separately.

Core Built-in Modules
Node.js provides several built-in modules that are compiled into the binary.

Here are some of the most commonly used ones:

fs - File system operations
http - HTTP server and client
path - File path utilities
os - Operating system utilities
events - Event handling
util - Utility functions
stream - Stream handling
crypto - Cryptographic functions
url - URL parsing
querystring - URL query string handling
To use any built-in module, use the require() function:

Example: Using Multiple Built-in ModulesGet your own Node.js Server
const http = require('http');
Now you can use the module's features, like creating a server:

Example: Simple HTTP Server
http.createServer((req, res) => {
res.writeHead(200, {'Content-Type': 'text/html'});
res.end('Hello World!');
}).listen(8080);

REMOVE ADS

Creating and Exporting Modules
In Node.js, any file with a .js extension is a module. You can export functionality from a module in several ways:

1. Exporting Multiple Items
   Add properties to the exports object for multiple exports:

Example: utils.js
// Exporting multiple functions
const getCurrentDate = () => new Date().toISOString();

const formatCurrency = (amount, currency = 'USD') => {
return new Intl.NumberFormat('en-US', {
style: 'currency',
currency: currency
}).format(amount);
};

// Method 1: Exporting multiple items
exports.getCurrentDate = getCurrentDate;
exports.formatCurrency = formatCurrency;

// Method 2: Exporting an object with multiple properties
// module.exports = { getCurrentDate, formatCurrency }; 2. Exporting a Single Item
To export a single item (function, object, etc.), assign it to module.exports:

Example: logger.js
class Logger {
constructor(name) {
this.name = name;
}

log(message) {
console.log(`[${this.name}] ${message}`);
}

error(error) {
console.error(`[${this.name}] ERROR:`, error.message);
}
}

// Exporting a single class
module.exports = Logger; 3. Using Your Modules
Import and use your custom modules using require() with a relative or absolute path:

Example: app.js
const http = require('http');
const path = require('path');

// Importing custom modules
const { getCurrentDate, formatCurrency } = require('./utils');
const Logger = require('./logger');

// Create a logger instance
const logger = new Logger('App');

// Create server
const server = http.createServer((req, res) => {
try {
logger.log(`Request received for ${req.url}`);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<h1>Welcome to our app!</h1>`);
    res.write(`<p>Current date: ${getCurrentDate()}</p>`);
    res.write(`<p>Formatted amount: ${formatCurrency(99.99)}</p>`);
    res.end();

} catch (error) {
logger.error(error);
res.writeHead(500, { 'Content-Type': 'text/plain' });
res.end('Internal Server Error');
}
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
logger.log(`Server running at http://localhost:${PORT}`);
});
Module Loading and Caching
Node.js caches modules after the first time they are loaded. This means that subsequent require() calls return the cached version.

Module Resolution
When you require a module, Node.js looks for it in this order:

Core Node.js modules (like fs, http)
Node modules in node_modules folders
Local files (using ./ or ../ prefix)
Run the example in your terminal:

C:\Users\<Your Name>> node demo_module.js
Visit http://localhost:8080 to see the result in your browser.

REMOVE ADS

Best Practices
Module Organization
Keep modules focused on a single responsibility
Use meaningful file and directory names
Group related functionality together
Use index.js for module entry points
Export Patterns
Prefer named exports for utilities
Use default exports for single-class modules
Document your module's API
Handle module initialization if needed
Summary
Modules are a key concept in Node.js. They enable you to organize code into reusable, maintainable units.

By understanding how to create, export, and use modules effectively, you can build scalable and well-structured applications.

Key takeaways:

Node.js uses CommonJS modules by default
Use require() to import and module.exports to export
Modules are cached after first load
Follow best practices for module organization and structure
Node.js ES Modules
Introduction to ES Modules
ES Modules (ESM) is the official standard format for packaging JavaScript code for reuse.

It was introduced in ES6 (ES2015) and is now supported in Node.js.

Prior to ES Modules, Node.js exclusively used the CommonJS module format (require/exports).

Now developers can choose between CommonJS and ES Modules based on their project needs.

ES Modules provides a more structured and statically analyzable way to work with modules compared to CommonJS, with benefits like tree-shaking for smaller builds.

CommonJS vs ES Modules
Here's how CommonJS and ES Modules differ:

Feature CommonJS ES Modules
File Extension .js (default) .mjs (or .js with proper config)
Import Syntax require() import
Export Syntax module.exports / exports export / export default
Import Timing Dynamic (runtime) Static (parsed before execution)
Top-level Await Not supported Supported
File URL in Imports Not required Required for local files
Example: CommonJS ModuleGet your own Node.js Server
// math.js (CommonJS)
function add(a, b) {
return a + b;
}

function subtract(a, b) {
return a - b;
}

module.exports = {
add,
subtract
};

// app.js (CommonJS)
const math = require('./math');
console.log(math.add(5, 3)); // 8
Example: ES Module
// math.mjs (ES Module)
export function add(a, b) {
return a + b;
}

export function subtract(a, b) {
return a - b;
}

// app.mjs (ES Module)
import { add, subtract } from './math.mjs';
console.log(add(5, 3)); // 8
Enabling ES Modules
There are several ways to enable ES Modules in Node.js:

1. Using the .mjs File Extension
   The simplest way is to use the .mjs extension for your files.

Node.js will automatically treat these files as ES Modules.

2. Setting "type": "module" in package.json
   To use ES Modules with regular .js files, add the following to your package.json:

{
"name": "my-package",
"version": "1.0.0",
"type": "module"
}
With this setting, all .js files in your project will be treated as ES Modules.

3. Using the --input-type=module Flag
   For scripts run directly with the node command, you can specify the module system:

node --input-type=module script.js
Note: If you're working with a codebase that primarily uses CommonJS but you want to use ES Modules in one file, using the .mjs extension is the most explicit and least error-prone approach.

REMOVE ADS

Import and Export Syntax
ES Modules provide more flexible ways to import and export code compared to CommonJS.

Export Syntax
Named Exports
// Multiple named exports
export function sayHello() {
console.log('Hello');
}

export function sayGoodbye() {
console.log('Goodbye');
}

// Alternative: export list at the end
function add(a, b) {
return a + b;
}

function subtract(a, b) {
return a - b;
}

export { add, subtract };
Default Export
// Only one default export per module
export default function() {
console.log('I am the default export');
}

// Or with a named function/class/object
function mainFunction() {
return 'Main functionality';
}

export default mainFunction;
Mixed Exports
// Combining default and named exports
export const VERSION = '1.0.0';

function main() {
console.log('Main function');
}

export { main as default }; // Alternative way to set default
Import Syntax
Importing Named Exports
// Import specific named exports
import { sayHello, sayGoodbye } from './greetings.mjs';
sayHello(); // Hello

// Rename imports to avoid naming conflicts
import { add as sum, subtract as minus } from './math.mjs';
console.log(sum(5, 3)); // 8

// Import all named exports as an object
import \* as math from './math.mjs';
console.log(math.add(7, 4)); // 11
Importing Default Exports
// Import the default export
import mainFunction from './main.mjs';
mainFunction();

// You can name the default import anything you want
import anyNameYouWant from './main.mjs';
anyNameYouWant();
Importing Both Default and Named Exports
// Import both default and named exports
import main, { VERSION } from './main.mjs';
console.log(VERSION); // 1.0.0
main(); // Main function

REMOVE ADS

Dynamic Imports
ES Modules support dynamic imports, allowing you to load modules conditionally or on-demand.

Example: Dynamic Imports
// app.mjs
async function loadModule(moduleName) {
try {
// Dynamic import returns a promise
const module = await import(`./${moduleName}.mjs`);
return module;
} catch (error) {
console.error(`Failed to load ${moduleName}:`, error);
}
}

// Load a module based on a condition
const moduleName = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

loadModule(moduleName).then(module => {
module.default(); // Call the default export
});

// Or with simpler await syntax
(async () => {
const mathModule = await import('./math.mjs');
console.log(mathModule.add(10, 5)); // 15
})();
Use Case: Dynamic imports are great for code-splitting, lazy-loading modules, or conditionally loading modules based on runtime conditions.

Top-level Await
Unlike CommonJS, ES Modules support top-level await, allowing you to use await outside of async functions at the module level.

Example: Top-level Await
// data-loader.mjs
// This would cause an error in CommonJS or in a script
// But works at the top level in an ES Module

console.log('Loading data...');

// Top-level await - the module's execution pauses here
const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
const data = await response.json();

console.log('Data loaded!');

export { data };

// When another module imports this one, it will only get the exports
// after all the top-level await operations have completed
Top-level await is especially useful for:

Loading configuration from files or remote sources
Connecting to databases before exporting functionality
Conditional imports or module initialization
Best Practices
When working with ES Modules in Node.js, follow these best practices:

1. Be Clear About File Extensions
   Always include file extensions in your import statements for local files:

// Good
import { someFunction } from './utils.mjs';

// Bad - might not work depending on configuration
import { someFunction } from './utils'; 2. Use Directory Indexes Properly
For directory imports, create index.mjs files:

// utils/index.mjs
export _ from './string-utils.mjs';
export _ from './number-utils.mjs';

// app.mjs
import { formatString, add } from './utils/index.mjs'; 3. Choose the Right Export Style
Use named exports for multiple functions/values, and default exports for main functionality:

// For libraries with many utilities, use named exports
export function validate() { /_ ... _/ }
export function format() { /_ ... _/ }

// For components or classes that are the primary export
export default class UserService { /_ ... _/ } 4. Handle the Transition from CommonJS
When working with a codebase that mixes CommonJS and ES Modules:

ES Modules can import from CommonJS modules using default import
CommonJS can require() ES Modules only with dynamic import()
Use the compatibility helpers in the Node.js 'module' package for interoperability
// Importing CommonJS module from ESM
import fs from 'fs'; // The default import is module.exports

// Importing ESM from CommonJS (Node.js 12+)
// In a CommonJS module:
(async () => {
const { default: myEsmModule } = await import('./my-esm-module.mjs');
})(); 5. Dual Package Hazard
For npm packages that support both module systems, use the "exports" field in package.json to specify different entry points:

{
"name": "my-package",
"exports": {
".": {
"import": "./index.mjs",
"require": "./index.cjs"
}
}
}
Node.js Support: ES Modules are fully supported in Node.js since v12, with better support in v14+.

For older versions, you may need a transpiler like Babel.

Node.js NPM
What is NPM?
NPM is a package manager for Node.js packages, or modules if you like.

www.npmjs.com hosts thousands of free packages to download and use.

The NPM program is installed on your computer when you install Node.js

If you installed Node.js, NPM is already ready to run on your computer!

What is a Package?
A package in Node.js contains all the files you need for a module.

Modules are JavaScript libraries you can include in your project.

Download a Package
Downloading a package is very easy.

Open the command line interface and tell NPM to download the package you want.

I want to download a package called "upper-case":

Download "upper-case":

C:\Users\Your Name>npm install upper-case
Now you have downloaded and installed your first package!

NPM creates a folder named "node_modules", where the package will be placed.

All packages you install in the future will be placed in this folder.

My project now has a folder structure like this:

C:\Users\My Name\node_modules\upper-case

REMOVE ADS

Using a Package
Once the package is installed, it is ready to use.

Include the "upper-case" package the same way you include any other module:

let uc = require('upper-case');
Create a Node.js file that will convert the output "Hello World!" into upper-case letters:

ExampleGet your own Node.js Server
let http = require('http');
let uc = require('upper-case');
http.createServer(function (req, res) {
res.writeHead(200, {'Content-Type': 'text/html'});
res.write(uc.upperCase("Hello World!"));
res.end();
}).listen(8080);
Save the code above in a file called "demo_uppercase.js", and initiate the file:

Initiate demo_uppercase:

C:\Users\Your Name>node demo_uppercase.js
If you have followed the same steps on your computer, you will see the same result as the example: http://localhost:8080

REMOVE ADS

Global Packages
Packages can be installed globally, making them available as command-line tools anywhere on your system.

Global packages are typically used for CLI tools and utilities.

Install a package globally:
npm install -g package-name
Example: Install the http-server package globally
npm install -g http-server
After installation, you can run the package from any directory:

http-server
Note: On some systems, you might need administrator/root privileges to install packages globally.

On Unix-like systems, use sudo before the command.

Updating Packages
To keep your packages up to date, you can update them using the following commands:

Update a specific package:
npm update package-name
Update all packages in your project:
npm update
Check for outdated packages:
npm outdated
Tip: To update npm itself, run: npm install -g npm@latest

Uninstalling a Package
To remove a package that you no longer need, you can use the uninstall command:

Remove a package:
npm uninstall package-name
Remove a global package:
npm uninstall -g package-name
Remove a package and its dependencies:
npm uninstall --save package-name

Node.js package.json
What is package.json?
package.json is a special file that describes your Node.js project.

It contains information about your app, such as its name, version, dependencies, scripts, and more.

This file is essential for managing and sharing Node.js projects, especially when using npm (Node Package Manager).

Creating package.json
You can create a package.json file by running the following command in your project folder:

npm init
This command will ask you a series of questions about your project and generate a package.json file.

For a quick setup with default values, use:

npm init -y

REMOVE ADS

Example package.json
Here is a simple example of a package.json file:

{
"name": "my-node-app",
"version": "1.0.0",
"description": "A simple Node.js app",
"main": "index.js",
"scripts": {
"start": "node index.js"
},
"author": "Your Name",
"license": "ISC"
}
This file describes the app, sets the main file to index.js, and defines a start script.

Adding Dependencies
When you install a package with npm, it is added to the dependencies section of package.json:

npm install express
This command adds Express to your project and updates package.json automatically.

"dependencies": {
"express": "^5.1.0"
}

REMOVE ADS

Common package.json Fields
Basic Metadata
{
"name": "my-package",
"version": "1.0.0",
"description": "A brief description of your package",
"main": "index.js",
"type": "module", // or "commonjs"
"keywords": ["example", "package", "node"],
"author": "Your Name ",
"license": "MIT",
"homepage": "https://example.com/my-package"
} com>
Scripts
Define custom scripts that can be run with npm run <script-name>:

"scripts": {
"start": "node index.js",
"dev": "nodemon index.js",
"test": "jest",
"build": "webpack --mode production",
"lint": "eslint .",
"prepare": "husky install"
}
Dependencies
Specify project dependencies with version ranges:

"dependencies": {
"express": "^4.18.2",
"mongoose": "~7.0.0",
"lodash": "4.17.21"
},
Dev Dependencies
Development-only dependencies (not installed in production):

"devDependencies": {
"nodemon": "^2.0.22",
"jest": "^29.5.0",
"eslint": "^8.38.0"
}
Version Ranges
^4.17.21 - Compatible with 4.x.x (up to but not including 5.0.0)
~4.17.21 - Patch updates only (4.17.x)
4.17.21 - Exact version
latest - Latest stable version
git+https://... - Git repository
Engines
Specify Node.js and npm version requirements:

"engines": {
"node": ">=14.0.0 <17.0.0",
"npm": ">=6.0.0"
}
Repository and Bugs
"repository": {
"type": "git",
"url": "https://github.com/username/repo.git"
},
"bugs": {
"url": "https://github.com/username/repo/issues"
}
Working with package.json
Adding Dependencies

# Install and save to dependencies

npm install package-name

# Install and save to devDependencies

npm install --save-dev package-name

# Install exact version

npm install package-name@1.2.3
Updating Dependencies

# Update a specific package

npm update package-name

# Update all packages

npm update

# Check for outdated packages

npm outdated
Running Scripts

# Run a script

npm run script-name

# Run start script (can be called with just 'npm start')

npm start

# Run test script (can be called with just 'npm test')

npm test
Best Practices
Always specify exact versions in dependencies for production apps
Use npm ci in CI/CD pipelines for reproducible builds
Keep your package-lock.json file in version control
Use .npmignore to exclude unnecessary files from published packages
Regularly update dependencies to get security patches
Summary
package.json is the heart of any Node.js project, containing metadata, scripts, and dependency information.

Understanding its structure and fields is essential for effective Node.js development.

Node.js NPM Scripts
What are NPM Scripts?
NPM scripts are commands you define in your package.json file to automate tasks like:

Running your app
Testing
Building
Cleaning up files
They make it easy to manage common tasks with simple commands.

Defining Scripts in package.json
Inside package.json, the scripts section lets you name and define commands:

{
"scripts": {
"start": "node index.js",
"test": "echo \"Running tests...\" && exit 0",
"dev": "nodemon index.js"
}
}
Each script can be run from the command line using npm run <script-name>.

REMOVE ADS

Running NPM Scripts
To run a script, use:

npm run dev
For the special start script, you can just use:

npm start
And for test:

npm test
Common Uses for NPM Scripts
Start your app
Run tests
Use tools like nodemon or webpack
Build or bundle your code
Lint or format your code

REMOVE ADS

Summary
NPM scripts help automate and simplify project tasks.

Define them in package.json and run them easily with npm.

Exercise
?
Drag and drop the correct command to run an NPM script.
npm

Node.js Managing Dependencies
What is Dependency Management?
Dependency management is the process of tracking, installing, updating, and removing the external packages your application depends on.

It helps ensure your applications remains stable, secure, and maintainable over time.

npm (Node Package Manager) is the default package manager for Node.js, but alternatives like Yarn and pnpm are also popular.

The key components of Node.js dependency management include:

The package.json file for declaring dependencies
Lock files (package-lock.json or yarn.lock) for dependency versioning
Package manager commands to install, update, and remove packages
Security tools to identify and fix vulnerabilities
Understanding Semantic Versioning
Node.js packages follow semantic versioning (SemVer), using a three-part version number: MAJOR.MINOR.PATCH

MAJOR: Incremented for incompatible API changes
MINOR: Incremented for backward-compatible new features
PATCH: Incremented for backward-compatible bug fixes
In package.json, version requirements can be specified using special characters:

Symbol Example Meaning
^ ^2.8.1 Any with 2.x.x, only MAJOR version must match (2.8.1 or higher)
~ ~2.8.1 Any with 2.8.x, only MAJOR.MINOR must match (2.8.1 or higher)

- - Any version (not recommended for production)
    > = >=2.8.1 Version 2.8.1 or higher
    > none 2.8.1 Exact version only
    > Example: Different Version SpecificationsGet your own Node.js Server
    > {
    > "dependencies": {
        "express": "^2.8.1", // Any 2.x.x version (2.8.1 or higher)
        "lodash": "~2.8.1", // Any 2.8.x version (2.8.1 or higher)
        "moment": "2.8.1", // Exactly version 2.8.1
        "axios": ">=2.8.1", // Version 2.8.1 or any higher version
        "debug": "2.x" // Any version starting with 2
    }
    }

REMOVE ADS

Installing Dependencies
There are several ways to install dependencies in a Node.js project:

Installing All Dependencies
npm install
This command reads the package.json file and installs all dependencies listed there.

Installing a Specific Package
npm install express
This installs the latest version of the package and adds it to your dependencies in package.json.

Installing a Specific Version
npm install express@4.17.1
Installing Without Saving to package.json
npm install express --no-save
Installing Globally
npm install -g nodemon
Global packages are installed system-wide rather than in the project's node_modules directory.

Types of Dependencies
Node.js projects can have several types of dependencies, each serving a different purpose:

Regular Dependencies
npm install express --save # or simply npm install express
These are packages required for your application to run in production.

Development Dependencies
npm install jest --save-dev # or npm install jest -D
These are packages needed only for local development and testing, like testing frameworks or build tools.

Peer Dependencies
Specified in package.json to indicate compatibility with other packages without actually including them:

{
"name": "my-plugin",
"version": "1.0.0",
"peerDependencies": {
"react": "^17.0.0"
}
}
This tells users that your package expects React 17.x to be installed in their project.

Optional Dependencies
npm install fancy-feature --save-optional

# or

npm install fancy-feature -O
These packages enhance functionality but aren't required for the core application to work.

Tip: Use dependencies for packages needed in production, and devDependencies for packages only needed during development or testing.

REMOVE ADS

Package Lock Files
Lock files ensure consistent installations across different environments by recording the exact version of each package and its dependencies.

package-lock.json (npm)
This file is automatically generated when npm modifies the node_modules tree or package.json.

{
"name": "my-app",
"version": "1.0.0",
"lockfileVersion": 3,
"requires": true,
"packages": {
"node_modules/express": {
"version": "4.18.2",
"resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",
"dependencies": {
"accepts": "~1.3.8",
"array-flatten": "1.1.1"
}
}
}
}
yarn.lock (Yarn)
Yarn's lock file serves a similar purpose but has a different format.

Important: Always commit your lock files to version control to ensure consistent installations across your team and deployment environments.

Updating Dependencies
Check for Outdated Packages
npm outdated
Update a Specific Package
npm update express
Update All Packages
npm update
Update npm Itself
npm install -g npm@latest
Using npm-check-updates
For more control over updates, you can use the npm-check-updates package:

# Install npm-check-updates globally

npm install -g npm-check-updates

# Check for updates

ncu

# Update package.json

ncu -u

# Install updated packages

npm install
Security and Auditing
Audit Your Dependencies
npm audit
Fix Security Vulnerabilities
npm audit fix
Force Fix All Issues (Use with Caution)
npm audit fix --force
Check for Known Vulnerabilities
npm audit

# Or using npx with the 'audit' package

npx audit
Best Practices
Use exact versions in production: Pin your dependencies to exact versions to prevent unexpected updates.
Regularly update dependencies: Keep your dependencies up to date to benefit from security patches and new features.
Audit your dependencies: Regularly check for known vulnerabilities in your dependencies.
Use a lock file: Always commit your lock file to version control.
Minimize dependencies: Only include packages that you actually need.
Use scoped packages: For internal packages, use scopes to avoid naming conflicts.
Document your dependencies: Include information about why each dependency is needed in your project's documentation.
Troubleshooting Common Issues
Clearing the npm Cache
npm cache clean --force
Deleting node_modules and Reinstalling
rm -rf node_modules
rm package-lock.json
npm install
Checking for Peer Dependency Issues
npm ls
Fixing Broken Dependencies
npm rebuild
Summary
Effective dependency management is crucial for maintaining a healthy Node.js project.

By understanding how to properly install, update, and manage your dependencies, you can ensure that your application remains stable, secure, and maintainable over time.

Remember to regularly audit your dependencies for security vulnerabilities and keep them up to date to benefit from the latest features and security patches.

Node.js Publish a Package
What Does it Mean to Publish a Package?
Publishing a package means making your Node.js module or project available for others to install and use via the npm registry.

This is how open-source libraries and tools are shared with the Node.js community.

When you publish a package, it becomes available for anyone to install using npm install your-package-name.

Note: Make sure your package provides value, and that it is not a duplicate of an existing package on NPM.

Preparing Your Package

1. Initialize Package
   Create a new directory and initialize your package:

mkdir my-package
cd my-package
npm init -y 2. Essential Files
A package should include these key files:

package.json - Metadata about your package
README.md - Documentation (supports Markdown)
index.js - Main entry point (or specify in package.json)
LICENSE - Terms of use (MIT, ISC, etc.)
.gitignore - To exclude node_modules, logs, etc.
.npmignore - Optional, to exclude files from the published package 3. Package.json Essentials
Ensure your package.json has these minimum fields:

{
"name": "your-package-name",
"version": "1.0.0",
"description": "A brief description of your package",
"main": "index.js",
"scripts": {
"test": "echo \"Error: no test specified\" && exit 1"
},
"keywords": ["keyword1", "keyword2"],
"author": "Your Name <your.email@example.com>",
"license": "MIT"
}
Creating an npm Account

1. Sign Up
   Create an account at npmjs.com/signup if you don't have one.

2. Verify Your Email
   Check your email and verify your account before publishing.

3. Login via CLI
   Open your terminal and run:

npm login
You'll be prompted for:

Username
Password
Email (must match your npm account)
One-time password (if you have 2FA enabled) 4. Check Login Status
npm whoami
Publishing Your Package

1. Check Name Availability
   npm view <package-name>
   If the package with that name does not already exist, you can use that name.

If it does, you'll need to choose a different name in your package.json.

2. Test Package Locally
   Before publishing, test your package locally:

# In your package directory

npm link

# In another project directory

npm link <package-name> 3. Publish to npm Registry

# First, make sure you're in the right directory

cd path/to/your/package

# Publish to the public npm registry

npm publish 4. Publish with a Specific Tag
npm publish --tag beta 5. Publish a Public Package (if using npm paid account)
npm publish --access public

REMOVE ADS

Updating Your Package

1. Update the Version Number
   Use semantic versioning (SemVer) to update your package version:

# For a patch release (bug fixes)

npm version patch

# For a minor release (backward-compatible features)

npm version minor

# For a major release (breaking changes)

npm version major 2. Update Changelog
Update your CHANGELOG.md to document the changes in this version.

3. Publish the Update
   npm publish
4. Tag the Release (Optional)
   If you're using Git, create a tag for the release:

git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0
Managing Published Packages
Unpublishing a Package
To remove a package from the npm registry:

# Unpublish a specific version

npm unpublish <package-name>@<version>

# Unpublish the entire package (only works within 72 hours of publishing)

npm unpublish <package-name> --force
Important: Unpublishing is strongly discouraged as it can break other projects that depend on your package. Instead, consider using npm deprecate.

Deprecating a Package
If you want to prevent users from installing a version but keep it available for existing users:

# Deprecate a specific version

npm deprecate <package-name>@<version> "message"

# Example

npx deprecate my-package@1.0.0 "This version is no longer maintained. Please upgrade to v2.0.0"
Transferring Ownership
To transfer a package to another user or organization:

npm owner add <username> <package-name>
Best Practices
Follow Semantic Versioning - Use MAJOR.MINOR.PATCH version numbers appropriately
Write Good Documentation - Include clear usage examples in your README
Add Tests - Include unit tests and document how to run them
Use .npmignore - Only publish necessary files
Add Keywords - Help others discover your package
Choose the Right License - Make your terms clear to users
Maintain a Changelog - Document changes between versions
Use Continuous Integration - Automate testing and publishing
Summary
Publishing packages to npm is a great way to share your code with the Node.js community.

If you follow best practices and maintain your packages well, you can contribute valuable tools that others can build upon.

Remember: With great power comes great responsibility. When you publish a package, you're making a commitment to

Node.js HTTP Module
The Built-in HTTP Module
Node.js includes a powerful built-in HTTP module that enables you to create HTTP servers and make HTTP requests.

This module is essential for building web applications and APIs in Node.js.

Key Features
Create HTTP servers to handle requests and send responses
Make HTTP requests to other servers
Handle different HTTP methods (GET, POST, PUT, DELETE, etc.)
Work with request and response headers
Handle streaming data for large payloads
Including the HTTP Module
To use the HTTP module, include it in your application using the require() method:

// Using CommonJS require (Node.js default)
const http = require('http');

// Or using ES modules (Node.js 14+ with "type": "module" in package.json)
// import http from 'http';
Creating an HTTP Server
The HTTP module's createServer() method creates an HTTP server that listens for requests on a specified port and executes a callback function for each request.

Basic HTTP Server Example
// Import the HTTP module
const http = require('http');

// Create a server object
const server = http.createServer((req, res) => {
// Set the response HTTP header with HTTP status and Content type
res.writeHead(200, { 'Content-Type': 'text/plain' });

// Send the response body as 'Hello, World!'
res.end('Hello, World!\n');
});

// Define the port to listen on const PORT = 3000;

// Start the server and listen on the specified port
server.listen(PORT, 'localhost', () => {
console.log(`Server running at http://localhost:${PORT}/`);
});
Understanding the Code
http.createServer() - Creates a new HTTP server instance
The callback function is executed for each request with two parameters:
req - The request object (http.IncomingMessage)
res - The response object (http.ServerResponse)
res.writeHead() - Sets the response status code and headers
res.end() - Sends the response and ends the connection
server.listen() - Starts the server on the specified port
Running the Server
Save the code in a file named server.js
Run the server using Node.js:
node server.js
Visit http://localhost:3000 in your browser to see the response.

REMOVE ADS

Working with HTTP Headers
HTTP headers let you send additional information with your response.

The res.writeHead() method is used to set the status code and response headers.

Setting Response Headers
Example: Setting Multiple Headers
const http = require('http');

const server = http.createServer((req, res) => {
// Set status code and multiple headers
res.writeHead(200, {
'Content-Type': 'text/html',
'X-Powered-By': 'Node.js',
'Cache-Control': 'no-cache, no-store, must-revalidate',
'Set-Cookie': 'sessionid=abc123; HttpOnly'
});

res.end('<h1>Hello, World!</h1>');
});

server.listen(3000, () => {
console.log('Server running at http://localhost:3000/');
});
Common HTTP Status Codes
Code Message Description
200 OK Standard response for successful HTTP requests
201 Created Request has been fulfilled and new resource created
301 Moved Permanently Resource has been moved to a new URL
400 Bad Request Server cannot process the request due to client error
401 Unauthorized Authentication is required
403 Forbidden Server refuses to authorize the request
404 Not Found Requested resource could not be found
500 Internal Server Error Unexpected condition was encountered
Common Response Headers
Content-Type: Specifies the media type of the content (e.g., text/html, application/json)
Content-Length: The length of the response body in bytes
Location: Used in redirects (with 3xx status codes)
Set-Cookie: Sets HTTP cookies on the client
Cache-Control: Directives for caching mechanisms
Access-Control-Allow-Origin: For CORS support
Reading Request Headers
You can access request headers using the req.headers object:

const http = require('http');

const server = http.createServer((req, res) => {
// Log all request headers
console.log('Request Headers:', req.headers);

// Get specific headers (case-insensitive)
const userAgent = req.headers['user-agent'];
const acceptLanguage = req.headers['accept-language'];

res.writeHead(200, { 'Content-Type': 'text/plain' });
res.end(`User-Agent: ${userAgent}\nAccept-Language: ${acceptLanguage}`);
});

server.listen(3000);
Working with URLs and Query Strings
Node.js provides built-in modules to work with URLs and query strings, making it easy to handle different parts of a URL and parse query parameters.

Accessing the Request URL
The req.url property contains the URL string that was requested, including any query parameters.

This is part of the http.IncomingMessage object.

Example: Basic URL Handling
const http = require('http');

const server = http.createServer((req, res) => {
// Get the URL and HTTP method
const { url, method } = req;

res.writeHead(200, { 'Content-Type': 'text/plain' });
res.end(`You made a ${method} request to ${url}`);
});

server.listen(3000, () => {
console.log('Server running at http://localhost:3000/');
});
Parsing URLs with the URL Module
The url module provides utilities for URL resolution and parsing.

It can parse a URL string into a URL object with properties for each part of the URL.

Example: Parsing URLs
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
// Parse the URL
const parsedUrl = url.parse(req.url, true);

// Get different parts of the URL
const pathname = parsedUrl.pathname; // The path without query string
const query = parsedUrl.query; // The query string as an object

res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({
pathname,
query,
fullUrl: req.url
}, null, 2));
});

server.listen(3000);
Example Requests and Responses
For the following request:

GET /products?category=electronics&sort=price&page=2 HTTP/1.1
The server would respond with:

{
"pathname": "/products",
"query": {
"category": "electronics",
"sort": "price",
"page": "2"
},
"fullUrl": "/products?category=electronics&sort=price&page=2"
}
Working with Query Strings
For more advanced query string handling, you can use the querystring module:

Example: Using querystring Module
const http = require('http');
const { URL } = require('url');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
// Using the newer URL API (Node.js 10+)
const baseURL = 'http://' + req.headers.host + '/'; const parsedUrl = new URL(req.url, baseURL);

// Get query parameters
const params = Object.fromEntries(parsedUrl.searchParams);

// Example of building a query string
const queryObj = {
name: 'John Doe',
age: 30,
interests: ['programming', 'music']
};
const queryStr = querystring.stringify(queryObj);

res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({
path: parsedUrl.pathname,
params,
exampleQueryString: queryStr
}, null, 2));
});

server.listen(3000);
Common URL Parsing Methods
url.parse(urlString, [parseQueryString], [slashesDenoteHost]): Parse a URL string into an object
url.format(urlObject): Format a URL object into a URL string
url.resolve(from, to): Resolve a target URL relative to a base URL
new URL(input, [base]): The WHATWG URL API (recommended for new code)
querystring.parse(str, [sep], [eq], [options]): Parse a query string into an object
querystring.stringify(obj, [sep], [eq], [options]): Stringify an object into a query string

Node.js HTTPS Module
Introduction to the HTTPS Module
The HTTPS module is a core Node.js module that provides an implementation of the HTTPS protocol, which is essentially HTTP over TLS/SSL.

It's a secure version of the HTTP module, providing encrypted communication between clients and servers.

Why Use HTTPS?
HTTPS is crucial for modern web applications because it:

Encrypts Data: Protects sensitive information like passwords, credit card numbers, and personal data from eavesdropping
Authenticates Servers: Verifies that clients are communicating with the intended server
Ensures Data Integrity: Prevents data from being modified or corrupted during transfer
Builds Trust: Visual indicators (like the padlock icon) increase user confidence
Improves SEO: Search engines prioritize HTTPS websites in search results
Enables Modern Features: Many web APIs (like Geolocation, Service Workers) require HTTPS
How HTTPS Works
Client initiates a secure connection to the server
Server presents its SSL/TLS certificate to the client
Client verifies the certificate with a trusted Certificate Authority (CA)
Encrypted session is established using asymmetric encryption
Symmetric encryption is used for the actual data transfer
Note: Modern HTTPS uses TLS (Transport Layer Security), which is the successor to SSL (Secure Sockets Layer). The terms are often used interchangeably, but SSL is now considered deprecated.

Important: As of 2023, all major browsers require HTTPS for new web features and APIs. Many browsers also mark non-HTTPS sites as "Not Secure."

Getting Started with HTTPS
Importing the Module
To use the HTTPS module in your Node.js application, you can import it using CommonJS or ES modules syntax:

CommonJS (Node.js default)
// Using require()
const https = require('https');
ES Modules (Node.js 14+)
// Using import (requires "type": "module" in package.json)
import https from 'https';
HTTPS vs HTTP API
The HTTPS module has the same interface as the HTTP module, with the main difference being that it creates connections using TLS/SSL.

This means all the methods and events available in the HTTP module are also available in the HTTPS module.

Note: The main difference in usage is that HTTPS requires SSL/TLS certificates, while HTTP does not.

SSL/TLS Certificates
HTTPS requires SSL/TLS certificates to establish secure connections. There are several types of certificates:

Types of Certificates
Self-Signed Certificates: For development and testing (not trusted by browsers)
Domain Validated (DV): Basic validation, just verifies domain ownership
Organization Validated (OV): Validates organization details
Extended Validation (EV): Highest level of validation, shows company name in browser
Wildcard Certificates: Secures all subdomains of a domain
Multi-Domain (SAN) Certificates: Secures multiple domains with one certificate
Generating Self-Signed Certificates
For development, you can create self-signed certificates using OpenSSL:

Basic Self-Signed Certificate

# Generate a private key (RSA 2048-bit)

openssl genrsa -out key.pem 2048

# Generate a self-signed certificate (valid for 365 days)

openssl req -new -x509 -key key.pem -out cert.pem -days 365 -nodes
Note: If there is no key.pem file present, you need to use the "-newkey" option instead of "-key" in the command above.

With Subject Alternative Names (SAN)

# Create a config file (san.cnf)

cat > san.cnf << EOF
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no
[req_distinguished_name]
C = US
ST = State
L = City
O = Organization
OU = Organizational Unit
CN = localhost
[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
EOF

# Generate key and certificate with SAN

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
-keyout key.pem -out cert.pem -config san.cnf -extensions 'v3_req'
Security Note: Self-signed certificates will trigger security warnings in browsers because they're not signed by a trusted Certificate Authority.

Only use them for development and testing purposes.

Obtaining Trusted Certificates
For production, obtain certificates from trusted Certificate Authorities (CAs):

Paid CAs: DigiCert, GlobalSign, Comodo, etc.
Free CAs: Let's Encrypt, ZeroSSL, Cloudflare
Let's Encrypt is a popular free, automated, and open Certificate Authority that provides trusted certificates.

Creating an HTTPS Server
Once you have your SSL/TLS certificates ready, you can create an HTTPS server in Node.js.

The HTTPS server API is very similar to the HTTP server API, with the main difference being the SSL/TLS configuration.

Basic HTTPS Server Example
Here's how to create a basic HTTPS server:

Basic Secure Server
const https = require('https');
const fs = require('fs');
const path = require('path');

// Path to your SSL/TLS certificate and key
const sslOptions = {
key: fs.readFileSync(path.join(**dirname, 'key.pem')),
cert: fs.readFileSync(path.join(**dirname, 'cert.pem')),
// Enable all security features
minVersion: 'TLSv1.2',
// Recommended security settings
secureOptions: require('constants').SSL_OP_NO_SSLv3 |
require('constants').SSL_OP_NO_TLSv1 |
require('constants').SSL_OP_NO_TLSv1_1
};

// Create the HTTPS server
const server = https.createServer(sslOptions, (req, res) => {
// Security headers
res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
res.setHeader('X-Content-Type-Options', 'nosniff');
res.setHeader('X-Frame-Options', 'SAMEORIGIN');
res.setHeader('X-XSS-Protection', '1; mode=block');
res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

// Handle different routes
if (req.url === '/') {
res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
res.end('<h1>Welcome to the Secure Server</h1><p>Your connection is encrypted!</p>');
} else if (req.url === '/api/status') {
res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
} else {
res.writeHead(404, { 'Content-Type': 'text/plain' });
res.end('404 Not Found');
}
});

// Handle server errors
server.on('error', (error) => {
console.error('Server error:', error);
});

// Start the server on port 3000 (HTTPS default is 443 but requires root)
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
console.log(`Server running at https://localhost:${PORT}`);
console.log('Press Ctrl+C to stop the server');
});
Note: On Unix-like systems, ports below 1024 require root privileges. For production, it's common to run Node.js on a high port (like 3000, 8080) and use a reverse proxy like Nginx or Apache to handle SSL termination.

Advanced Server Configuration
For production environments, you might need more advanced SSL/TLS configuration:

Advanced HTTPS Server with OCSP Stapling and Session Resumption
const https = require('https');
const fs = require('fs');
const path = require('path');
const tls = require('tls');

// Path to your SSL/TLS files
const sslOptions = {
// Certificate and key
key: fs.readFileSync(path.join(**dirname, 'privkey.pem')),
cert: fs.readFileSync(path.join(**dirname, 'cert.pem')),
ca: [
fs.readFileSync(path.join(__dirname, 'chain.pem'))
],

// Recommended security settings
minVersion: 'TLSv1.2',
maxVersion: 'TLSv1.3',
ciphers: [
'TLS_AES_256_GCM_SHA384',
'TLS_CHACHA20_POLY1305_SHA256',
'TLS_AES_128_GCM_SHA256',
'ECDHE-ECDSA-AES256-GCM-SHA384',
'ECDHE-RSA-AES256-GCM-SHA384',
'ECDHE-ECDSA-CHACHA20-POLY1305',
'ECDHE-RSA-CHACHA20-POLY1305',
'ECDHE-ECDSA-AES128-GCM-SHA256',
'ECDHE-RSA-AES128-GCM-SHA256' ].join(':'),
honorCipherOrder: true,

// Enable OCSP Stapling
requestCert: true,
rejectUnauthorized: true,

// Enable session resumption
sessionTimeout: 300, // 5 minutes
sessionIdContext: 'my-secure-app',

// Enable HSTS preload
hsts: {
maxAge: 63072000, // 2 years in seconds
includeSubDomains: true,
preload: true
},

// Enable secure renegotiation
secureOptions: require('constants').SSL_OP_LEGACY_SERVER_CONNECT |
require('constants').SSL_OP_NO_SSLv3 |
require('constants').SSL_OP_NO_TLSv1 |
require('constants').SSL_OP_NO_TLSv1_1 |
require('constants').SSL_OP_CIPHER_SERVER_PREFERENCE
};

// Create the HTTPS server
const server = https.createServer(sslOptions, (req, res) => {
// Security headers
const securityHeaders = {
'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
'X-Content-Type-Options': 'nosniff',
'X-Frame-Options': 'DENY',
'X-XSS-Protection': '1; mode=block',
'Content-Security-Policy': "default-src 'self'",
'Referrer-Policy': 'strict-origin-when-cross-origin',
'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

Object.entries(securityHeaders).forEach(([key, value]) => {
res.setHeader(key, value);
});

// Handle requests
if (req.url === '/') {
res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
res.end('<h1>Secure Node.js Server</h1><p>Your connection is secure!</p>');
} else {
res.writeHead(404, { 'Content-Type': 'text/plain' });
res.end('404 Not Found');
}
});

// Handle server errors
server.on('error', (error) => {
console.error('Server error:', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
console.error('Uncaught exception:', error);
// Perform graceful shutdown
server.close(() => process.exit(1));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle graceful shutdown
const gracefulShutdown = () => {
console.log('Shutting down gracefully...');
server.close(() => {
console.log('Server closed');
process.exit(0);
});

// Force close server after 10 seconds
setTimeout(() => {
console.error('Forcing shutdown...');
process.exit(1);
}, 10000);
};

// Listen for shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start the server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
const { address, port } = server.address();
console.log(`Server running at https://${address}:${port}`);

// Output server information
console.log('Node.js version:', process.version);
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('PID:', process.pid);
});
Security Best Practices:

Always use the latest stable version of Node.js for security updates
Keep your dependencies up to date using `npm audit` and `npm update`
Use environment variables for sensitive configuration (never commit secrets to version control)
Implement rate limiting to prevent abuse
Regularly rotate your SSL/TLS certificates
Monitor your server for security vulnerabilities
Use a reverse proxy like Nginx or Apache in production for additional security features
Testing Your HTTPS Server
To test your HTTPS server, you can use curl or a web browser:

Using curl

# Skip certificate verification (for self-signed certs)

curl -k https://localhost:3000

# With certificate verification (for trusted certs)

curl --cacert /path/to/ca.pem https://yourdomain.com
Using a Web Browser
Open your web browser and navigate to https://localhost:3000
If using a self-signed certificate, you'll need to accept the security warning
For development, you can add your self-signed certificate to your trusted root certificates
Node.js File System Module
Introduction to Node.js File System
The Node.js File System module (fs) provides a comprehensive set of methods for working with the file system on your computer.

It allows you to perform file I/O operations in both synchronous and asynchronous ways.

Note: The File System module is a core Node.js module, so no installation is required.

Importing the File System Module
You can import the File System module using CommonJS require() or ES modules import syntax:

CommonJS (Default in Node.js)
const fs = require('fs');
ES Modules (Node.js 14+ with "type": "module" in package.json)
import fs from 'fs';
// Or for specific methods:
// import { readFile, writeFile } from 'fs/promises';
Promise-based API
Node.js provides promise-based versions of the File System API in the fs/promises namespace, which is recommended for modern applications:

// Using promises (Node.js 10.0.0+)
const fs = require('fs').promises;

// Or with destructuring
const { readFile, writeFile } = require('fs').promises;

// Or with ES modules
// import { readFile, writeFile } from 'fs/promises';
Common Use Cases
File Operations
Read and write files
Create and delete files
Append to files
Rename and move files
Change file permissions
Directory Operations
Create and remove directories
List directory contents
Watch for file changes
Get file/directory stats
Check file existence
Advanced Features
File streams
File descriptors
Symbolic links
File watching
Working with file permissions
Performance Tip: For large files, consider using streams (fs.createReadStream and fs.createWriteStream) to avoid high memory usage.

Reading Files
Node.js provides several methods to read files, including both callback-based and promise-based approaches.

The most common method is fs.readFile().

Note: Always handle errors when working with file operations to prevent your application from crashing.

Reading Files with Callbacks
Here's how to read a file using the traditional callback pattern:

myfile.txt

This is the content of myfile.txt
Create a Node.js file that reads the text file, and return the content:

Example: Reading a file with callbacks
const fs = require('fs');

// Read file asynchronously with callback
fs.readFile('myfile.txt', 'utf8', (err, data) => {
if (err) {
console.error('Error reading file:', err);
return;
}
console.log('File content:', data);
});

// For binary data (like images), omit the encoding
fs.readFile('image.png', (err, data) => {
if (err) throw err;
// data is a Buffer containing the file content
console.log('Image size:', data.length, 'bytes');
});
Reading Files with Promises (Modern Approach)
Using fs.promises or util.promisify for cleaner async/await syntax:

Example: Reading a file with async/await
// Using fs.promises (Node.js 10.0.0+)
const fs = require('fs').promises;

async function readFileExample() {
try {
const data = await fs.readFile('myfile.txt', 'utf8');
console.log('File content:', data);
} catch (err) {
console.error('Error reading file:', err);
}
}

readFileExample();

// Or with util.promisify (Node.js 8.0.0+)
const { promisify } = require('util');
const readFileAsync = promisify(require('fs').readFile);

async function readWithPromisify() {
try {
const data = await readFileAsync('myfile.txt', 'utf8');
console.log(data);
} catch (err) {
console.error(err);
}
}

readWithPromisify();
Reading Files Synchronously
For simple scripts, you can use synchronous methods, but avoid them in production servers as they block the event loop:

Example: Reading a file synchronously
const fs = require('fs');

try {
// Read file synchronously
const data = fs.readFileSync('myfile.txt', 'utf8');
console.log('File content:', data);
} catch (err) {
console.error('Error reading file:', err);
}
Best Practice: Always specify the character encoding (like 'utf8') when reading text files to get a string instead of a Buffer.

REMOVE ADS

Creating and Writing Files
Node.js provides several methods for creating and writing to files.

Here are the most common approaches:

1. Using fs.writeFile()
   Creates a new file or overwrites an existing file with the specified content:

Example: Writing to a file
const fs = require('fs').promises;

async function writeFileExample() {
try {
// Write text to a file
await fs.writeFile('myfile.txt', 'Hello, World!', 'utf8');

    // Write JSON data
    const data = { name: 'John', age: 30, city: 'New York' };
    await fs.writeFile('data.json', JSON.stringify(data, null, 2), 'utf8');

    console.log('Files created successfully');

} catch (err) {
console.error('Error writing files:', err);
}
}

writeFileExample(); 2. Using fs.appendFile()
Appends content to a file, creating the file if it doesn't exist:

Example: Appending to a file
const fs = require('fs').promises;

async function appendToFile() {
try {
// Append a timestamped log entry
const logEntry = `${new Date().toISOString()}: Application started\n`;
await fs.appendFile('app.log', logEntry, 'utf8');

    console.log('Log entry added');

} catch (err) {
console.error('Error appending to file:', err);
}
}

appendToFile(); 3. Using File Handles
For more control over file operations, you can use file handles:

Example: Using file handles
const fs = require('fs').promises;

async function writeWithFileHandle() {
let fileHandle;

try {
// Open a file for writing (creates if doesn't exist)
fileHandle = await fs.open('output.txt', 'w');

    // Write content to the file
    await fileHandle.write('First line\n');
    await fileHandle.write('Second line\n');
    await fileHandle.write('Third line\n');

    console.log('Content written successfully');

} catch (err) {
console.error('Error writing to file:', err);
} finally {
// Always close the file handle
if (fileHandle) {
await fileHandle.close();
}
}
}

writeWithFileHandle(); 4. Using Streams for Large Files
For writing large amounts of data, use streams to avoid high memory usage:

Example: Writing large files with streams
const fs = require('fs');
const { pipeline } = require('stream/promises');
const { Readable } = require('stream');

async function writeLargeFile() {
// Create a readable stream (could be from HTTP request, etc.)
const data = Array(1000).fill().map((\_, i) => `Line ${i + 1}: ${'x'.repeat(100)}\n`);
const readable = Readable.from(data);

// Create a writable stream to a file
const writable = fs.createWriteStream('large-file.txt');

try {
// Pipe the data from readable to writable
await pipeline(readable, writable);
console.log('Large file written successfully');
} catch (err) {
console.error('Error writing file:', err);
}
}

writeLargeFile();
File Flags: When opening files, you can specify different modes:

'w' - Open for writing (file is created or truncated)
'wx' - Like 'w' but fails if the path exists
'w+' - Open for reading and writing (file is created or truncated)
'a' - Open for appending (file is created if it doesn't exist)
'ax' - Like 'a' but fails if the path exists
'r+' - Open for reading and writing (file must exist)
Deleting Files and Directories
Node.js provides several methods to delete files and directories.

Here's how to handle different deletion scenarios:

1. Deleting a Single File
   Use fs.unlink() to delete a file:

Example: Deleting a file
const fs = require('fs').promises;

async function deleteFile() {
const filePath = 'file-to-delete.txt';

try {
// Check if file exists before deleting
await fs.access(filePath);

    // Delete the file
    await fs.unlink(filePath);
    console.log('File deleted successfully');

} catch (err) {
if (err.code === 'ENOENT') {
console.log('File does not exist');
} else {
console.error('Error deleting file:', err);
}
}
}

deleteFile(); 2. Deleting Multiple Files
To delete multiple files, you can use Promise.all() with fs.unlink():

Example: Deleting multiple files
const fs = require('fs').promises;
const path = require('path');

async function deleteFiles() {
const filesToDelete = [
'temp1.txt',
'temp2.txt',
'temp3.txt'
];

try {
// Delete all files in parallel
await Promise.all(
filesToDelete.map(file =>
fs.unlink(file).catch(err => {
if (err.code !== 'ENOENT') {
console.error(`Error deleting ${file}:`, err);
}
})
)
);

    console.log('Files deleted successfully');

} catch (err) {
console.error('Error during file deletion:', err);
}
}

deleteFiles(); 3. Deleting Directories
To delete directories, you have several options depending on your needs:

Example: Deleting directories
const fs = require('fs').promises;
const path = require('path');

async function deleteDirectory(dirPath) {
try {
// Check if the directory exists
const stats = await fs.stat(dirPath);

    if (!stats.isDirectory()) {
      console.log('Path is not a directory');
      return;
    }

    // For Node.js 14.14.0+ (recommended)
    await fs.rm(dirPath, { recursive: true, force: true });

    // For older Node.js versions (deprecated but still works)
    // await fs.rmdir(dirPath, { recursive: true });

    console.log('Directory deleted successfully');

} catch (err) {
if (err.code === 'ENOENT') {
console.log('Directory does not exist');
} else {
console.error('Error deleting directory:', err);
}
}
}

// Usage
deleteDirectory('directory-to-delete'); 4. Emptying a Directory Without Deleting It
To remove all files and subdirectories within a directory but keep the directory itself:

Example: Emptying a directory
const fs = require('fs').promises;
const path = require('path');

async function emptyDirectory(dirPath) {
try {
// Read the directory
const files = await fs.readdir(dirPath, { withFileTypes: true });

    // Delete all files and directories in parallel
    await Promise.all(
      files.map(file => {
        const fullPath = path.join(dirPath, file.name);
        return file.isDirectory()
          ? fs.rm(fullPath, { recursive: true, force: true })
          : fs.unlink(fullPath);
      })
    );

    console.log('Directory emptied successfully');

} catch (err) {
console.error('Error emptying directory:', err);
}
}

// Usage
emptyDirectory('directory-to-empty');
Security Note: Be extremely careful with file deletion, especially when using recursive options or wildcards. Always validate and sanitize file paths to prevent directory traversal attacks.

REMOVE ADS

Renaming and Moving Files
The fs.rename() method can be used for both renaming and moving files.

It's a versatile method for file system operations that involve changing file paths.

1. Basic File Renaming
   To rename a file in the same directory:

Example: Renaming a file
const fs = require('fs').promises;

async function renameFile() {
const oldPath = 'old-name.txt';
const newPath = 'new-name.txt';

try {
// Check if source file exists
await fs.access(oldPath);

    // Check if destination file already exists
    try {
      await fs.access(newPath);
      console.log('Destination file already exists');
      return;
    } catch (err) {
      // Destination doesn't exist, safe to proceed
    }

    // Perform the rename
    await fs.rename(oldPath, newPath);
    console.log('File renamed successfully');

} catch (err) {
if (err.code === 'ENOENT') {
console.log('Source file does not exist');
} else {
console.error('Error renaming file:', err);
}
}
}
Node.js Path Module
What is the Path Module?
The Path module is a built-in Node.js module that provides tools for handling and transforming file paths across different operating systems.

Since Windows uses backslashes (\) and POSIX systems (Linux, macOS) use forward slashes (/), the Path module helps write cross-platform code that works correctly on any system.

Key Benefits:

Cross-platform path handling
Path manipulation and normalization
Easy file extension extraction
Path resolution and joining
Working with relative and absolute paths
Using the Path Module
The Path module is a core module in Node.js, so no installation is needed.

You can import it using either CommonJS or ES modules syntax:

CommonJS (Node.js default)
const path = require('path');

// Destructure specific methods if needed
const { join, resolve, basename } = require('path');
ES Modules (Node.js 14+ with "type": "module" in package.json)
import path from 'path';

// Or import specific methods
import { join, resolve, basename } from 'path';
Best Practice: For better tree-shaking and smaller bundle sizes, import only the methods you need when using ES modules.

Path Module Methods
path.basename()
Returns the last portion of a path, similar to the Unix basename command.

const path = require('path');

// Get filename from a path
const filename = path.basename('/users/docs/file.txt');
console.log(filename);

// Get filename without extension
const filenameWithoutExt = path.basename('/users/docs/file.txt', '.txt');
console.log(filenameWithoutExt);

REMOVE ADS

**dirname and **filename
In Node.js, **dirname and **filename are special variables available in CommonJS modules that provide the directory name and file name of the current module.

Example: Using **dirname and **filename in CommonJS
// CommonJS module (e.g., app.js)
const path = require('path');

// Get the directory name of the current module
console.log('Directory name:', \_\_dirname);

// Get the file name of the current module
console.log('File name:', \_\_filename);

// Building paths relative to the current module
const configPath = path.join(\_\_dirname, 'config', 'app-config.json');
console.log('Config file path:', configPath);

// Getting the directory name using path.dirname()
console.log('Directory using path.dirname():', path.dirname(**filename));
Example: Getting **dirname and \_\_filename in ES Modules
// ES Module (e.g., app.mjs or "type": "module" in package.json)
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current module's URL
const **filename = fileURLToPath(import.meta.url);
const **dirname = dirname(\_\_filename);

console.log('ES Module file path:', **filename);
console.log('ES Module directory:', **dirname);

// Example with dynamic imports
async function loadConfig() {
const configPath = new URL('../config/app-config.json', import.meta.url);
const config = await import(configPath, { with: { type: 'json' } });
return config;
}
Best Practices:

Use path.join() or path.resolve() with **dirname to build file paths in CommonJS modules.
For ES modules, use import.meta.url with fileURLToPath and dirname to get the equivalent functionality.
When using **dirname with path.join(), you can safely use forward slashes as they'll be normalized to the correct platform separator.
path.extname()
Returns the extension of a path, from the last occurrence of the . character to the end of the string.

const path = require('path');

const extension = path.extname('file.txt');
console.log(extension);

console.log(path.extname('index.html'));
console.log(path.extname('index.coffee.md'));
console.log(path.extname('index.'));
console.log(path.extname('index'));
console.log(path.extname('.index'));
path.join()
Joins all given path segments together using the platform-specific separator as a delimiter, then normalizes the resulting path.

Example: Basic path joining
const path = require('path');

// Join path segments
const fullPath = path.join('/users', 'docs', 'file.txt');
console.log(fullPath); // Output depends on OS

// Handle relative paths and navigation
console.log(path.join('/users', '../system', './logs', 'file.txt'));

// Handle multiple slashes
console.log(path.join('users', '//docs', 'file.txt')); // Normalizes slashes
Note: path.join() is preferred over string concatenation with + as it handles different path separators across operating systems.

path.resolve()
Resolves a sequence of paths or path segments into an absolute path, processing from right to left until an absolute path is constructed.

Example: Resolving paths
const path = require('path');

// 1. Resolve relative to current working directory
console.log(path.resolve('file.txt'));

// 2. Resolve with multiple segments
console.log(path.resolve('/users', 'docs', 'file.txt'));

// 3. Right-to-left processing
console.log(path.resolve('/first', '/second', 'third')); // '/second/third'

// 4. Using **dirname for module-relative paths
console.log(path.resolve(**dirname, 'config', 'app.json'));
Tip: path.resolve() is commonly used with \_\_dirname to create absolute paths relative to the current module's location.

path.parse()
Returns an object whose properties represent significant elements of the path.

Example: Parsing a file path
const path = require('path');

// Parse a file path
const pathInfo = path.parse('/users/docs/file.txt');
console.log(pathInfo);
/_ Output on Unix/macOS:
{
root: '/',
dir: '/users/docs',
base: 'file.txt',
ext: '.txt',
name: 'file'
}
_/

// Accessing parsed components
console.log('Directory:', pathInfo.dir); // /users/docs
console.log('Filename:', pathInfo.base); // file.txt
console.log('Name only:', pathInfo.name); // file
console.log('Extension:', pathInfo.ext); // .txt
Note: The output of path.parse() can be passed to path.format() to reconstruct the path.

path.format()
Returns a path string from an object, which is the opposite of path.parse().

Example: Formatting path objects
const path = require('path');

// Method 1: Using dir and base
const pathString1 = path.format({
dir: '/users/docs',
base: 'file.txt'
});
console.log(pathString1); // '/users/docs/file.txt'

// Method 2: Using root, dir, name, and ext
const pathString2 = path.format({
root: '/',
dir: '/users/docs',
name: 'file',
ext: '.txt'
});
console.log(pathString2); // '/users/docs/file.txt'

// Practical example: Modify and reconstruct a path
const parsedPath = path.parse('/users/docs/old-file.txt');
parsedPath.base = 'new-file.md';
const newPath = path.format(parsedPath);
console.log(newPath); // '/users/docs/new-file.md'
Note: When using path.format(), if the dir and root properties are provided, root is ignored.

path.normalize()
Normalizes the given path, resolving .. and . segments and removing redundant separators.

Example: Normalizing paths
const path = require('path');

// Resolve relative navigation
console.log(path.normalize('/users/./docs/../data/file.txt')); // '/users/data/file.txt'

// Handle multiple consecutive slashes
console.log(path.normalize('/users//docs////file.txt')); // '/users/docs/file.txt'

// Windows-style paths (automatically handled)
console.log(path.normalize('C:\\users\\docs\\..\\file.txt')); // 'C:\\users\\file.txt'

// Edge cases console.log(path.normalize('')); // '.'
console.log(path.normalize('.')); // '.'
console.log(path.normalize('..')); // '..'
console.log(path.normalize('/..')); // '/'
Security Note: While path.normalize() resolves .. sequences, it doesn't protect against directory traversal attacks. Always validate and sanitize user input when working with file paths.

path.relative()
Returns the relative path from the first path to the second path, or an empty string if the paths are the same.

Example: Finding relative paths
const path = require('path');

// Basic relative path
console.log(path.relative('/users/docs/file.txt', '/users/images/photo.jpg'));
// Output: '../../images/photo.jpg'

// Same directory
console.log(path.relative('/users/docs/file1.txt', '/users/docs/file2.txt'));
// Output: 'file2.txt'

// Same file
console.log(path.relative('/users/docs/file.txt', '/users/docs/file.txt'));
// Output: ''

// Different roots (Windows)
console.log(path.relative('C:\\user\\test\\aaa', 'C:\\user\\impl\\bbb'));
// Output: '..\\..\\impl\\bbb'

// Practical example: Creating a relative path for web
const absolutePath = '/var/www/static/images/logo.png';
const webRoot = '/var/www/';
const webPath = path.relative(webRoot, absolutePath).replace(/\\/g, '/');
console.log(webPath); // 'static/images/logo.png'
Tip: path.relative() is particularly useful when you need to generate relative URLs or create portable paths between different locations in your project.

path.isAbsolute()
Determines if the given path is an absolute path. An absolute path will always resolve to the same location, regardless of the working directory.

Example: Checking for absolute paths
const path = require('path');

// POSIX (Unix/Linux/macOS)
console.log(path.isAbsolute('/users/docs')); // true
console.log(path.isAbsolute('users/docs')); // false

// Windows
console.log(path.isAbsolute('C:\\temp')); // true
console.log(path.isAbsolute('temp')); // false

// UNC paths (Windows network paths)
console.log(path.isAbsolute('\\\\server\\share')); // true

// Practical example: Ensure absolute path for config files
function ensureAbsolute(configPath) {
return path.isAbsolute(configPath)
? configPath
: path.resolve(process.cwd(), configPath);
}

console.log(ensureAbsolute('config.json')); // Resolves to absolute path
console.log(ensureAbsolute('/etc/app/config.json')); // Already absolute
Node.js OS Module
What is the OS Module?
The OS module in Node.js provides a powerful set of utilities for interacting with the underlying operating system.

It offers a cross-platform way to access system-related information and perform common operating system tasks.
Key Features:

Retrieve system information (CPU, memory, platform, etc.)
Access user and network information
Work with file paths and directories in a cross-platform way
Monitor system resources and performance
Handle operating system signals and errors
Getting Started with the OS Module
Importing the Module
The OS module is a core Node.js module, so no installation is needed.

You can import it using CommonJS or ES modules syntax:

CommonJS (default in Node.js)
const os = require('os');
ES Modules (Node.js 14+ or with "type": "module" in package.json)
import os from 'os';
// or
import { arch, platform, cpus } from 'os';
Basic Usage Example
Here's a quick example showing some common OS module methods:

const os = require('os');

// Basic system information
console.log(`OS Platform: ${os.platform()}`);
console.log(`OS Type: ${os.type()}`);
console.log(`OS Release: ${os.release()}`);
console.log(`CPU Architecture: ${os.arch()}`);
console.log(`Hostname: ${os.hostname()}`);

// Memory information
const totalMemGB = (os.totalmem() / (1024 _ 1024 _ 1024)).toFixed(2);
const freeMemGB = (os.freemem() / (1024 _ 1024 _ 1024)).toFixed(2);
console.log(`Memory: ${freeMemGB}GB free of ${totalMemGB}GB`);

// User information
const userInfo = os.userInfo();
console.log(`Current User: ${userInfo.username}`);
console.log(`Home Directory: ${os.homedir()}`);

REMOVE ADS

OS Module Reference
Note: All OS module methods are synchronous and return results immediately.

For performance-critical applications, consider caching the results of methods that might be called frequently, such as os.cpus() or os.networkInterfaces().

System Information
os.arch()
Returns the operating system CPU architecture for which the Node.js binary was compiled.

const os = require('os');

// Get CPU architecture
console.log(`CPU Architecture: ${os.arch()}`);

// Common values:
// - 'x64' for 64-bit systems
// - 'arm' for ARM processors
// - 'arm64' for 64-bit ARM
// - 'ia32' for 32-bit x86
// - 'mips' for MIPS processors
os.platform()
Returns a string identifying the operating system platform.

const os = require('os');

// Get platform information
const platform = os.platform();
console.log(`Platform: ${platform}`);

// Common values:
// - 'darwin' for macOS
// - 'win32' for Windows (both 32-bit and 64-bit)
// - 'linux' for Linux
// - 'freebsd' for FreeBSD
// - 'openbsd' for OpenBSD
os.type()
Returns the operating system name as returned by uname on POSIX systems, or from the ver command on Windows.

const os = require('os');

// Get OS type
console.log(`OS Type: ${os.type()}`);

// Examples:
// - 'Linux' on Linux
// - 'Darwin' on macOS
// - 'Windows_NT' on Windows
os.release()
Returns the operating system release number.

const os = require('os');

// Get OS release information
console.log(`OS Release: ${os.release()}`);

// Examples:
// - '10.0.19044' on Windows 10
// - '21.6.0' on macOS Monterey
// - '5.15.0-46-generic' on Ubuntu
os.version()
Returns a string identifying the kernel version. On Windows, this includes build information.

const os = require('os');

// Get kernel version
console.log(`Kernel Version: ${os.version()}`);

// Example output:
// - Windows: 'Windows 10 Enterprise 10.0.19044'
// - Linux: '#49-Ubuntu SMP Tue Aug 2 08:49:28 UTC 2022'
// - macOS: 'Darwin Kernel Version 21.6.0: ...'
Node.js URL Module
The Built-in URL Module
The URL module provides utilities for URL resolution and parsing.

It can be used to split up a web address into readable parts, construct URLs, and handle different URL components.

Getting Started
To include the URL module, use the require() method.

In modern Node.js (v10.0.0+), you can use either the legacy API or the newer URL class (WHATWG URL API):

ExampleGet your own Node.js Server
// Using the legacy API
const url = require('url');

// Using the modern URL class (WHATWG API)
const { URL } = require('url');
let url = require('url');
Parse an address with the url.parse() method, and it will return a URL object with each part of the address as properties:

Example
Split a web address into readable parts:

let url = require('url');
let adr = 'http://localhost:8080/default.htm?year=2017&month=february';
let q = url.parse(adr, true);

console.log(q.host);
console.log(q.pathname);
console.log(q.search);

let qdata = q.query;
console.log(qdata.month);
URL Parsing and Formatting
URL Object Properties
When you parse a URL, you get a URL object with the following properties:

href: The full URL that was parsed
protocol: The protocol scheme (e.g., 'http:')
host: The full host portion (e.g., 'example.com:8080')
hostname: The hostname portion (e.g., 'example.com')
port: The port number if specified
pathname: The path section of the URL
search: The query string including the leading ?
query: Either the query string without the ?, or a parsed query object
hash: The fragment identifier including the #
Legacy API vs WHATWG URL API
Example
const { URL } = require('url');

// Using the WHATWG URL API (recommended for new code)
const myURL = new URL('https://example.org:8080/p/a/t/h?query=string#hash');
console.log(myURL.hostname); // 'example.org'
console.log(myURL.pathname); // '/p/a/t/h'
console.log(myURL.searchParams.get('query')); // 'string'

// Using the legacy API
const parsedUrl = require('url').parse('https://example.org:8080/p/a/t/h?query=string#hash');
console.log(parsedUrl.host); // 'example.org:8080'
console.log(parsedUrl.query); // 'query=string'
URLSearchParams API
The URLSearchParams API provides utility methods to work with the query string of a URL:

Example
const { URL, URLSearchParams } = require('url');

const myURL = new URL('https://example.com/?name=Kai&age=30');
const params = new URLSearchParams(myURL.search);

// Get a parameter
console.log(params.get('name'));

// Add a parameter
params.append('city', 'Stavanger');
// Delete a parameter
params.delete('age');
// Convert to string
console.log(params.toString());
Node.js File Server
Now we know how to parse the query string, and in a previous chapter we learned how to make Node.js behave as a file server.

Let us combine the two, and serve the file requested by the client.

Create two html files and save them in the same folder as your node.js files.

summer.html

<!DOCTYPE html>
<html>
<body>
<h1>Summer</h1>
<p>I love the sun!</p>
</body>
</html>
winter.html

<!DOCTYPE html>
<html>
<body>
<h1>Winter</h1>
<p>I love the snow!</p>
</body>
</html>

REMOVE ADS

Create a Node.js file that opens the requested file and returns the content to the client. If anything goes wrong, throw a 404 error:

demo_fileserver.js:

let http = require('http');
let url = require('url');
let fs = require('fs');

http.createServer(function (req, res) {
let q = url.parse(req.url, true);
let filename = "." + q.pathname;
fs.readFile(filename, function(err, data) {
if (err) {
res.writeHead(404, {'Content-Type': 'text/html'});
return res.end("404 Not Found");
}

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();

});
}).listen(8080);
Remember to initiate the file:

Initiate demo_fileserver.js:

C:\Users\Your Name>node demo_fileserver.js
If you have followed the same steps on your computer, you should see two different results when opening these two addresses:

http://localhost:8080/summer.html

Will produce this result:

<h1>Summer</h1>
<p>I love the sun!</p>
http://localhost:8080/winter.html

Will produce this result:

<h1>Winter</h1>
<p>I love the snow!</p>
Best Practices
1. Always Validate and Sanitize URLs
Example
function isValidHttpUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

console.log(isValidHttpUrl('https://example.com')); // true
console.log(isValidHttpUrl('ftp://example.com')); // false 2. Constructing URLs Safely
Example
const { URL } = require('url');

// Safe way to construct URLs
function createProfileUrl(domain, username) {
return new URL(`/users/${encodeURIComponent(username)}`, domain).href;
}

console.log(createProfileUrl('https://example.com', 'johndoe'));
// 'https://example.com/users/johndoe' 3. Handling Query Parameters
Example
const { URL } = require('url');

// Parse URL with query parameters
const url = new URL('https://example.com/search?q=node.js&lang=en');

// Get all parameters
console.log(url.searchParams.toString()); // 'q=node.js&lang=en'

// Get specific parameter
console.log(url.searchParams.get('q')); // 'node.js'

// Check if parameter exists
console.log(url.searchParams.has('lang')); // true

// Add new parameter
url.searchParams.append('page', '2');
console.log(url.href);
// 'https://example.com/search?q=node.js&lang=en&page=2'
Node.js Events
Core Concepts of Events in Node.js
Every action on a computer is an event, like when a connection is made or a file is opened.

Objects in Node.js can fire events, like the readStream object fires events when opening and closing a file:

ExampleGet your own Node.js Server
let fs = require('fs');
let rs = fs.createReadStream('./demofile.txt');
rs.on('open', function () {
console.log('The file is open');
});
Getting Started with Events in Node.js
Node.js uses an event-driven architecture where objects called "emitters" emit named events that cause function objects ("listeners") to be called.

Basic Example
// Import the events module
const EventEmitter = require('events');

// Create an event emitter instance
const myEmitter = new EventEmitter();

// Register an event listener
myEmitter.on('greet', () => {
console.log('Hello there!');
});

// Emit the event
myEmitter.emit('greet'); // Outputs: Hello there!
EventEmitter Class
The EventEmitter class is fundamental to Node.js's event-driven architecture.

It provides the ability to create and handle custom events.

Creating an Event Emitter
To use the EventEmitter, you need to create an instance of it:

let events = require('events');
let eventEmitter = new events.EventEmitter();

REMOVE ADS

The EventEmitter Object
You can assign event handlers to your own events with the EventEmitter object.

In the example below we have created a function that will be executed when a "scream" event is fired.

To fire an event, use the emit() method.

Example
let events = require('events');
let eventEmitter = new events.EventEmitter();

//Create an event handler:
let myEventHandler = function () {
console.log('I hear a scream!');
}

//Assign the event handler to an event:
eventEmitter.on('scream', myEventHandler);

//Fire the 'scream' event:
eventEmitter.emit('scream');

REMOVE ADS

Common EventEmitter Patterns

1. Passing Arguments to Event Handlers
   Example
   const EventEmitter = require('events');
   const emitter = new EventEmitter();

// Emit event with arguments
emitter.on('userJoined', (username, userId) => {
console.log(`${username} (${userId}) has joined the chat`);
});

emitter.emit('userJoined', 'JohnDoe', 42);
// Outputs: JohnDoe (42) has joined the chat 2. Handling Events Only Once
Example
const EventEmitter = require('events');
const emitter = new EventEmitter();

// This listener will be called only once
emitter.once('connection', () => {
console.log('First connection established');
});

emitter.emit('connection'); // This will trigger the listener
emitter.emit('connection'); // This won't trigger the listener again 3. Error Handling
Example
const EventEmitter = require('events');
const emitter = new EventEmitter();

// Always handle 'error' events
emitter.on('error', (err) => {
console.error('An error occurred:', err.message);
});

// This will trigger the error handler
emitter.emit('error', new Error('Something went wrong'));
Best Practices

1. Always Handle Errors
   // Good practice: Always listen for 'error' events
   myEmitter.on('error', (err) => {
   console.error('Error in event emitter:', err);
   });
2. Use Named Functions for Better Stack Traces
   // Instead of anonymous functions
   function handleData(data) {
   console.log('Received data:', data);
   }

myEmitter.on('data', handleData); 3. Clean Up Listeners
// Add a listener
const listener = () => console.log('Event occurred');
myEmitter.on('event', listener);

// Later, remove the listener when no longer needed
myEmitter.off('event', listener);
Exercise
?
Drag and drop the correct architecture model.
Node.js uses an architecture for handling many operations.

Node.js Streams
What are Streams?
In Node.js, streams are collections of data, which might not be available in full at once and don't have to fit in memory.

Think of them as conveyor belts that move data from one place to another, allowing you to work with each piece as it arrives rather than waiting for the whole dataset.

Streams are one of Node.js's most powerful features and are used extensively in:

File system operations (reading/writing files)
HTTP requests and responses
Data compression and decompression
Database operations
Real-time data processing
Getting Started with Streams
Streams are one of the fundamental concepts in Node.js for handling data efficiently.

They allow you to process data in chunks as it becomes available, rather than loading everything into memory at once.

Basic Stream ExampleGet your own Node.js Server
const fs = require('fs');

// Create a readable stream from a file
const readableStream = fs.createReadStream('input.txt', 'utf8');
// Create a writable stream to a file
const writableStream = fs.createWriteStream('output.txt');

// Pipe the data from readable to writable stream
readableStream.pipe(writableStream);

// Handle completion and errors
writableStream.on('finish', () => {
console.log('File copy completed!');
});

readableStream.on('error', (err) => {
console.error('Error reading file:', err);
});

writableStream.on('error', (err) => {
console.error('Error writing file:', err);
});
Why Use Streams?
There are several advantages to using streams:

Memory Efficiency: Process large files without loading them entirely into memory
Time Efficiency: Start processing data as soon as you have it, instead of waiting for all the data
Composability: Build powerful data pipelines by connecting streams
Better User Experience: Deliver data to users as it becomes available (e.g., video streaming)
Imagine reading a 1GB file on a server with 512MB of RAM:

Without streams: You'd crash the process attempting to load the entire file into memory
With streams: You process the file in small chunks (e.g., 64KB at a time)
Core Stream Types
Node.js provides four fundamental types of streams, each serving a specific purpose in data handling:

Stream Type Description Common Examples
Readable Streams from which data can be read (data source) fs.createReadStream(), HTTP responses, process.stdin
Writable Streams to which data can be written (data destination) fs.createWriteStream(), HTTP requests, process.stdout
Duplex Streams that are both Readable and Writable TCP sockets, Zlib streams
Transform Duplex streams that can modify or transform data as it's written and read Zlib streams, crypto streams
Note: All streams in Node.js are instances of EventEmitter, which means they emit events that can be listened to and handled.

REMOVE ADS

Readable Streams
Readable streams let you read data from a source. Examples include:

Reading from a file
HTTP responses on the client
HTTP requests on the server
process.stdin
Creating a Readable Stream
const fs = require('fs');

// Create a readable stream from a file
const readableStream = fs.createReadStream('myfile.txt', {
encoding: 'utf8',
highWaterMark: 64 \* 1024 // 64KB chunks
});

// Events for readable streams
readableStream.on('data', (chunk) => {
console.log(`Received ${chunk.length} bytes of data.`);
console.log(chunk);
});

readableStream.on('end', () => {
console.log('No more data to read.');
});

readableStream.on('error', (err) => {
console.error('Error reading from stream:', err);
});
Reading Modes
Readable streams operate in one of two modes:

Flowing Mode: Data is read from the source and provided to your application as quickly as possible using events
Paused Mode: You must explicitly call stream.read() to get chunks of data from the stream
const fs = require('fs');

// Paused mode example
const readableStream = fs.createReadStream('myfile.txt', {
encoding: 'utf8',
highWaterMark: 64 \* 1024 // 64KB chunks
});

// Manually consume the stream using read()
readableStream.on('readable', () => {
let chunk;
while (null !== (chunk = readableStream.read())) {
console.log(`Read ${chunk.length} bytes of data.`);
console.log(chunk);
} });

readableStream.on('end', () => {
console.log('No more data to read.');
});
Writable Streams
Writable streams let you write data to a destination. Examples include:

Writing to a file
HTTP requests on the client
HTTP responses on the server
process.stdout
Creating a Writable Stream
const fs = require('fs');

// Create a writable stream to a file
const writableStream = fs.createWriteStream('output.txt');

// Write data to the stream
writableStream.write('Hello, ');
writableStream.write('World!');
writableStream.write('\nWriting to a stream is easy!');

// End the stream
writableStream.end();

// Events for writable streams
writableStream.on('finish', () => {
console.log('All data has been written to the file.');
});

writableStream.on('error', (err) => {
console.error('Error writing to stream:', err);
});
Handling Backpressure
When writing to a stream, if the data is being written faster than it can be processed, backpressure occurs.

The write() method returns a boolean indicating if it's safe to continue writing.

const fs = require('fs');

const writableStream = fs.createWriteStream('output.txt');

function writeData() {
let i = 100;
function write() {
let ok = true;
do {
i--;
if (i === 0) {
// Last time, close the stream
writableStream.write('Last chunk!\n');
writableStream.end();
} else {
// Continue writing data
const data = `Data chunk ${i}\n`;
// Write and check if we should continue
ok = writableStream.write(data);
}
}
while (i > 0 && ok);

    if (i > 0) {
      // We need to wait for the drain event before writing more
      writableStream.once('drain', write);
    }

}
write();
}

writeData();
writableStream.on('finish', () => {
console.log('All data written successfully.');
});
Pipe
The pipe() method connects a readable stream to a writable stream, automatically managing the flow of data and handling backpressure.

It's the easiest way to consume streams.

const fs = require('fs');

// Create readable and writable streams
const readableStream = fs.createReadStream('source.txt');
const writableStream = fs.createWriteStream('destination.txt');

// Pipe the readable stream to the writable stream
readableStream.pipe(writableStream);

// Handle completion and errors
readableStream.on('error', (err) => {
console.error('Read error:', err);
});

writableStream.on('error', (err) => {
console.error('Write error:', err);
});

writableStream.on('finish', () => {
console.log('File copy completed!');
});
Chaining Pipes
You can chain multiple streams together using pipe().

This is especially useful when working with transform streams.

const fs = require('fs');
const zlib = require('zlib');

// Create a pipeline to read a file, compress it, and write to a new file
fs.createReadStream('source.txt')
.pipe(zlib.createGzip()) // Compress the data
.pipe(fs.createWriteStream('destination.txt.gz'))
.on('finish', () => {
console.log('File compressed successfully!');
});
Note: The pipe() method returns the destination stream, which enables chaining.

Duplex and Transform Streams
Duplex Streams
Duplex streams are both readable and writable, like a two-way pipe.

A TCP socket is a good example of a duplex stream.

const net = require('net');

// Create a TCP server
const server = net.createServer((socket) => {
// 'socket' is a duplex stream

// Handle incoming data (readable side)
socket.on('data', (data) => {
console.log('Received:', data.toString());

    // Echo back (writable side)
    socket.write(`Echo: ${data}`);

});

socket.on('end', () => {
console.log('Client disconnected');
});
});

server.listen(8080, () => {
console.log('Server listening on port 8080');
});

// To test, you can use a tool like netcat or telnet:
// $ nc localhost 8080
// or create a client:
/\*
const client = net.connect({ port: 8080 }, () => {
console.log('Connected to server');
client.write('Hello from client!');
});

client.on('data', (data) => {
console.log('Server says:', data.toString());
client.end(); // Close the connection
});
\*/
Transform Streams
Transform streams are duplex streams that can modify data as it passes through.

They're ideal for processing data in pipelines.

const { Transform } = require('stream');
const fs = require('fs');

// Create a transform stream that converts text to uppercase
class UppercaseTransform extends Transform {
\_transform(chunk, encoding, callback) {
// Transform the chunk to uppercase
const upperChunk = chunk.toString().toUpperCase();
// Push the transformed data
this.push(upperChunk);
// Signal that we're done with this chunk
callback();
}
}

// Create an instance of our transform stream
const uppercaseTransform = new UppercaseTransform();

// Create a readable stream from a file
const readableStream = fs.createReadStream('input.txt');

// Create a writable stream to a file
const writableStream = fs.createWriteStream('output-uppercase.txt');

// Pipe the data through our transform stream
readableStream
.pipe(uppercaseTransform)
.pipe(writableStream)
.on('finish', () => {
console.log('Transformation completed!');
});
Stream Events
All streams are instances of EventEmitter and emit several events:

Readable Stream Events
data: Emitted when the stream has data available to read
end: Emitted when there's no more data to be consumed
error: Emitted if an error occurs while reading
close: Emitted when the stream's underlying resource has been closed
readable: Emitted when data is available to be read
Writable Stream Events
drain: Emitted when the stream is ready to accept more data after a write() method has returned false
finish: Emitted when all data has been flushed to the underlying system
error: Emitted if an error occurs while writing
close: Emitted when the stream's underlying resource has been closed
pipe: Emitted when the pipe() method is called on a readable stream
unpipe: Emitted when the unpipe() method is called on a readable stream
The stream.pipeline() Method
The pipeline() function (available since Node.js v10.0.0) is a more robust way to pipe streams together, especially for error handling.

const { pipeline } = require('stream');
const fs = require('fs');
const zlib = require('zlib');

// Create a pipeline that handles errors properly
pipeline(
fs.createReadStream('source.txt'),
zlib.createGzip(),
fs.createWriteStream('destination.txt.gz'),
(err) => {
if (err) {
console.error('Pipeline failed:', err);
} else {
console.log('Pipeline succeeded!');
}
}
);
Note: pipeline() will properly clean up all the streams if an error occurs in any of them, preventing potential memory leaks.

Object Mode Streams
By default, streams work with strings and Buffer objects.

However, streams can be set to 'object mode' to work with JavaScript objects.

const { Readable, Writable, Transform } = require('stream');

// Create a readable stream in object mode
const objectReadable = new Readable({
objectMode: true,
read() {} // Implementation required but can be no-op
});

// Create a transform stream in object mode
const objectTransform = new Transform({
objectMode: true,
transform(chunk, encoding, callback) {
// Add a property to the object
chunk.transformed = true;
chunk.timestamp = new Date();
this.push(chunk);
callback();
} });

// Create a writable stream in object mode
const objectWritable = new Writable({
objectMode: true,
write(chunk, encoding, callback) {
console.log('Received object:', chunk);
callback();
} });

// Connect the streams
objectReadable
.pipe(objectTransform)
.pipe(objectWritable);

// Push some objects to the stream
objectReadable.push({ name: 'Object 1', value: 10 });
objectReadable.push({ name: 'Object 2', value: 20 });
objectReadable.push({ name: 'Object 3', value: 30 });
objectReadable.push(null); // Signal the end of data
Advanced Stream Patterns

1. Error Handling with pipeline()
   The pipeline() method is the recommended way to handle errors in stream chains:

Example
const { pipeline } = require('stream');
const fs = require('fs');
const zlib = require('zlib');

pipeline(
fs.createReadStream('input.txt'),
zlib.createGzip(),
fs.createWriteStream('output.txt.gz'),
(err) => {
if (err) {
console.error('Pipeline failed:', err);
} else {
console.log('Pipeline succeeded');
}
}
); 2. Object Mode Streams
Streams can work with JavaScript objects instead of just strings and buffers:

Example
const { Readable } = require('stream');

// Create a readable stream in object mode
const objectStream = new Readable({
objectMode: true,
read() {}
});
// Push objects to the stream
objectStream.push({ id: 1, name: 'Alice' });
objectStream.push({ id: 2, name: 'Bob' });
objectStream.push(null); // Signal end of stream
// Consume the stream
objectStream.on('data', (obj) => {
console.log('Received:', obj);
});
Practical Examples
HTTP Streaming
Streams are used extensively in HTTP requests and responses.

const http = require('http');
const fs = require('fs');

// Create an HTTP server
const server = http.createServer((req, res) => {
// Handle different routes
if (req.url === '/') {
// Send a simple response
res.writeHead(200, { 'Content-Type': 'text/html' });
res.end('<h1>Stream Demo</h1><p>Try <a href="/file">streaming a file</a> or <a href="/video">streaming a video</a>.</p>');
}
else if (req.url === '/file') {
// Stream a large text file
res.writeHead(200, { 'Content-Type': 'text/plain' });
const fileStream = fs.createReadStream('largefile.txt', 'utf8');

    // Pipe the file to the response (handles backpressure automatically)
    fileStream.pipe(res);

    // Handle errors
    fileStream.on('error', (err) => {
      console.error('File stream error:', err);
      res.statusCode = 500;
      res.end('Server Error');
    });

}
else if (req.url === '/video') {
// Stream a video file with proper headers
const videoPath = 'video.mp4';
const stat = fs.statSync(videoPath);
const fileSize = stat.size;
const range = req.headers.range;

    if (range) {
      // Handle range requests for video seeking
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;

      const videoStream = fs.createReadStream(videoPath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4'
      });

      videoStream.pipe(res);
      } else {
        // No range header, send entire video
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4'
        });

        fs.createReadStream(videoPath).pipe(res);
      }

}&br> else {
// 404 Not Found
res.writeHead(404, { 'Content-Type': 'text/plain' });
res.end('Not Found');
}
});

// Start the server
server.listen(8080, () => {
console.log('Server running at http://localhost:8080/');
});
Processing Large CSV Files
const fs = require('fs');
const { Transform } = require('stream');
const csv = require('csv-parser'); // npm install csv-parser

// Create a transform stream to filter and transform CSV data
const filterTransform = new Transform({
objectMode: true,
transform(row, encoding, callback) {
// Only pass through rows that meet our criteria
if (parseInt(row.age) > 18) {
// Modify the row
row.isAdult = 'Yes';
// Push the transformed row
this.push(row);
}
}
callback();
}
});

// Create a writable stream for the results
const results = [];
const writeToArray = new Transform({
objectMode: true,
transform(row, encoding, callback) {
results.push(row);
callback();
}
});

// Create the processing pipeline
fs.createReadStream('people.csv')
.pipe(csv())
.pipe(filterTransform)
.pipe(writeToArray)
.on('finish', () => {
console.log(`Processed ${results.length} records:`);
console.log(results);
}
})
.on('error', (err) => {
console.error('Error processing CSV:', err);
}
});
Best Practices
Error Handling: Always handle error events on streams to prevent application crashes.
Use pipeline(): Prefer stream.pipeline() over .pipe() for better error handling and cleanup.
Handle Backpressure: Respect the return value of write() to avoid memory issues.
End Streams: Always call end() on writable streams when you're done.
Avoid Synchronous Operations: Don't block the event loop with synchronous operations inside stream handlers.
Buffer Size: Be mindful of highWaterMark (buffer size) settings.
Warning: Mishandling streams can lead to memory leaks and performance issues.

Always handle errors and end streams properly.

Summary
Streams are a fundamental concept in Node.js that allow for efficient data handling. They:

Process data piece by piece without loading everything into memory
Provide better memory efficiency for large datasets
Allow processing to start before all data is available
Enable powerful data processing pipelines
Are used extensively in core Node.js APIs
Node.js Buffer Module
What is the Buffer Module?
The Buffer module in Node.js is used to handle binary data.

Buffers are similar to arrays of integers but are fixed-length and correspond to raw memory allocations outside the V8 JavaScript engine.

Node.js provides the Buffer class as a global object, so you don't need to require or import it explicitly.

Note: Since Node.js v6.0.0, the Buffer constructor is deprecated in favor of the new Buffer methods.

Using the constructor could lead to security vulnerabilities due to uninitialized memory.

Getting Started with Buffers
Buffers in Node.js are used to handle binary data directly.

They are similar to arrays of integers but are fixed in size and represent raw memory allocations outside the V8 heap.

Basic Buffer ExampleGet your own Node.js Server
// Create a buffer from a string
const buf = Buffer.from('Hello, Node.js!');

// Buffers can be converted to strings
console.log(buf.toString()); // 'Hello, Node.js!'

// Access individual bytes
console.log(buf[0]); // 72 (ASCII for 'H')

// Buffers have a fixed length
console.log(buf.length); // 15
Creating Buffers
There are several ways to create buffers in Node.js, each with different performance and safety characteristics:

There are several ways to create buffers in Node.js:

1. Buffer.alloc()
   Creates a new Buffer of the specified size, initialized with zeros.

This is the safest way to create a new buffer as it ensures no old data is present.

// Create a buffer of 10 bytes filled with zeros
const buffer1 = Buffer.alloc(10);
console.log(buffer1); 2. Buffer.allocUnsafe()
Creates a new Buffer of the specified size, but doesn't initialize the memory.

This is faster than Buffer.alloc() but may contain old or sensitive data.

Always fill the buffer before use if security is a concern.

// Create an uninitialized buffer of 10 bytes
const buffer2 = Buffer.allocUnsafe(10);
console.log(buffer2);

// Fill the buffer with zeros for security
buffer2.fill(0);
console.log(buffer2);
Warning: Buffer.allocUnsafe() is faster than Buffer.alloc() but can expose sensitive data.

Only use it when you understand the security implications and plan to immediately fill the entire buffer.

3. Buffer.from()
   Creates a new Buffer from various sources like strings, arrays, or ArrayBuffer. This is the most flexible way to create buffers from existing data.

// Create a buffer from a string
const buffer3 = Buffer.from('Hello, World!');
console.log(buffer3);

console.log(buffer3.toString());

// Create a buffer from an array of integers
const buffer4 = Buffer.from([65, 66, 67, 68, 69]);
console.log(buffer4);

console.log(buffer4.toString());

// Create a buffer from another buffer
const buffer5 = Buffer.from(buffer4);
console.log(buffer5);

REMOVE ADS

Using Buffers
Writing to Buffers
You can write data to a buffer using various methods:

// Create an empty buffer
const buffer = Buffer.alloc(10);

// Write a string to the buffer
buffer.write('Hello');
console.log(buffer);

console.log(buffer.toString());

// Write bytes at specific positions
buffer[5] = 44; // ASCII for ','
buffer[6] = 32; // ASCII for space
buffer.write('Node', 7);
console.log(buffer.toString());
Reading from Buffers
You can read data from a buffer using various methods:

// Create a buffer from a string
const buffer = Buffer.from('Hello, Node.js!');

// Read the entire buffer as a string
console.log(buffer.toString());

// Read a portion of the buffer (start at position 7, end before position 11)
console.log(buffer.toString('utf8', 7, 11));

// Read a single byte
console.log(buffer[0]);

// Convert the ASCII code to a character
console.log(String.fromCharCode(buffer[0]));
Iterating Through Buffers
Buffers can be iterated like arrays:

// Create a buffer from a string
const buffer = Buffer.from('Hello');

// Iterate using for...of loop
for (const byte of buffer) {
console.log(byte);
}

// Iterate using forEach
buffer.forEach((byte, index) => {
console.log(`Byte at position ${index}: ${byte}`);
});
Buffer Methods
Buffer.compare()
Compares two buffers and returns a number indicating whether the first one comes before, after, or is the same as the second one in sort order:

const buffer1 = Buffer.from('ABC');
const buffer2 = Buffer.from('BCD');
const buffer3 = Buffer.from('ABC');

console.log(Buffer.compare(buffer1, buffer2));
console.log(Buffer.compare(buffer2, buffer1));
console.log(Buffer.compare(buffer1, buffer3));
buffer.copy()
Copies data from one buffer to another:

// Create source and target buffers
const source = Buffer.from('Hello, World!');
const target = Buffer.alloc(source.length);

// Copy from source to target
source.copy(target);

console.log(target.toString());

// Create a target buffer for partial copy
const partialTarget = Buffer.alloc(5);

// Copy only part of the source (starting at index 7)
source.copy(partialTarget, 0, 7);

console.log(partialTarget.toString());
buffer.slice()
Creates a new buffer that references the same memory as the original, but with offset and cropped to the given end:

const buffer = Buffer.from('Hello, World!');

// Create a slice from position 7 to the end
const slice = buffer.slice(7);
console.log(slice.toString());

// Create a slice from position 0 to 5
const slice2 = buffer.slice(0, 5);
console.log(slice2.toString());

// Important: slices share memory with original buffer
slice[0] = 119; // ASCII for 'w' (lowercase)
console.log(slice.toString());
console.log(buffer.toString());
Note: Since buffer.slice() creates a view of the same memory, modifying either the original buffer or the slice will affect the other.

buffer.toString()
Decodes a buffer to a string using a specified encoding:

const buffer = Buffer.from('Hello, World!');

// Default encoding is UTF-8
console.log(buffer.toString());

// Specify encoding
console.log(buffer.toString('utf8'));

// Decode only a portion of the buffer
console.log(buffer.toString('utf8', 0, 5));

// Using different encodings
const hexBuffer = Buffer.from('48656c6c6f', 'hex');
console.log(hexBuffer.toString());

const base64Buffer = Buffer.from('SGVsbG8=', 'base64');
console.log(base64Buffer.toString());
buffer.equals()
Compares two buffers for content equality:

const buffer1 = Buffer.from('Hello');
const buffer2 = Buffer.from('Hello');
const buffer3 = Buffer.from('World');

console.log(buffer1.equals(buffer2));

console.log(buffer1.equals(buffer3));

console.log(buffer1 === buffer2);
Working with Encodings
Buffers work with various encodings when converting between strings and binary data:

// Create a string
const str = 'Hello, World!';

// Convert to different encodings
const utf8Buffer = Buffer.from(str, 'utf8');
console.log('UTF-8:', utf8Buffer);

const base64Str = utf8Buffer.toString('base64');
console.log('Base64 string:', base64Str);

const hexStr = utf8Buffer.toString('hex');
console.log('Hex string:', hexStr);

// Convert back to original
const fromBase64 = Buffer.from(base64Str, 'base64').toString('utf8');
console.log('From Base64:', fromBase64);

const fromHex = Buffer.from(hexStr, 'hex').toString('utf8');
console.log('From Hex:', fromHex);
Supported encodings in Node.js include:

utf8: Multi-byte encoded Unicode characters (default)
ascii: ASCII characters only (7-bit)
latin1: Latin-1 encoding (ISO 8859-1)
base64: Base64 encoding
hex: Hexadecimal encoding
binary: Binary encoding (deprecated)
ucs2/utf16le: 2 or 4 bytes, little-endian encoded Unicode characters
Advanced Buffer Operations
Concatenating Buffers
You can combine multiple buffers into one using Buffer.concat():

Example
const buf1 = Buffer.from('Hello, ');
const buf2 = Buffer.from('Node.js!');

// Concatenate buffers
const combined = Buffer.concat([buf1, buf2]);
console.log(combined.toString()); // 'Hello, Node.js!'

// With a maximum length parameter
const partial = Buffer.concat([buf1, buf2], 5);
console.log(partial.toString()); // 'Hello'
Searching in Buffers
Buffers provide methods to search for values or sequences:

Example
const buf = Buffer.from('Hello, Node.js is awesome!');

// Find the first occurrence of a value
console.log(buf.indexOf('Node')); // 7

// Check if buffer contains a value
console.log(buf.includes('awesome')); // true

// Find the last occurrence of a value
console.log(buf.lastIndexOf('e')); // 24
Buffer and Streams
Buffers are commonly used with streams for efficient data processing:

Example
const fs = require('fs');
const { Transform } = require('stream');

// Create a transform stream that processes data in chunks
const transformStream = new Transform({
transform(chunk, encoding, callback) {
// Process each chunk (which is a Buffer)
const processed = chunk.toString().toUpperCase();
this.push(Buffer.from(processed));
callback();
}
});
// Create a read stream from a file
const readStream = fs.createReadStream('input.txt');
// Create a write stream to a file
const writeStream = fs.createWriteStream('output.txt');
// Process the file in chunks
readStream.pipe(transformStream).pipe(writeStream);
Buffer and File System
Buffers are commonly used for file system operations:

const fs = require('fs');

// Write buffer to file
const writeBuffer = Buffer.from('Hello, Node.js!');
fs.writeFile('buffer.txt', writeBuffer, (err) => {
if (err) throw err;
console.log('File written successfully');

// Read file into buffer
fs.readFile('buffer.txt', (err, data) => {
if (err) throw err;

    // 'data' is a buffer
    console.log('Read buffer:', data);
    console.log('Buffer content:', data.toString());

    // Read only part of the file into a buffer
    const smallBuffer = Buffer.alloc(5);
    fs.open('buffer.txt', 'r', (err, fd) => {
      if (err) throw err;

      // Read 5 bytes starting at position 7
      fs.read(fd, smallBuffer, 0, 5, 7, (err, bytesRead, buffer) => {
        if (err) throw err;

        console.log('Partial read:', buffer.toString());
        // Output: Node.

        fs.close(fd, (err) => {
          if (err) throw err;
        });
      });
    });

});
});
Buffer Performance Considerations
Memory Usage: Buffers consume memory outside the JavaScript heap, which can be both an advantage (less garbage collection pressure) and a disadvantage (must be carefully managed)
Allocation: Buffer.allocUnsafe() is faster than Buffer.alloc() but comes with security considerations
String Conversion: Converting large buffers to strings or vice versa can be expensive
Pooling: For applications that frequently create small buffers, consider implementing a buffer pool to reduce allocation overhead
// Simple buffer pool implementation
class BufferPool {
constructor(bufferSize = 1024, poolSize = 10) {
this.bufferSize = bufferSize;
this.pool = Array(poolSize).fill().map(() => Buffer.alloc(bufferSize));

    this.used = Array(poolSize).fill(false);

}

// Get a buffer from the pool
get() {
const index = this.used.indexOf(false);
if (index === -1) {
// Pool is full, create a new buffer
console.log('Pool full, allocating new buffer');
return Buffer.alloc(this.bufferSize);
}
this.used[index] = true;
return this.pool[index];
}

// Return a buffer to the pool
release(buffer) {
const index = this.pool.indexOf(buffer);
if (index !== -1) {
// Zero the buffer for security
buffer.fill(0);
this.used[index] = false;
}
}
}

// Usage example
const pool = new BufferPool(10, 3); // 3 buffers of 10 bytes each

const buf1 = pool.get();
const buf2 = pool.get();
const buf3 = pool.get();
const buf4 = pool.get(); // This will allocate a new buffer

buf1.write('Hello');
console.log(buf1.toString()); // Hello

// Return buf1 to the pool
pool.release(buf1);

// Get another buffer (should reuse buf1)
const buf5 = pool.get();
console.log(buf5.toString()); // Should be empty (zeros)
Buffer Security Considerations
Security Warning: Buffers can contain sensitive data from memory.

Always be cautious when handling buffers, especially when they might be exposed to users or logged.

Best Practices:
Avoid using Buffer.allocUnsafe() unless performance is critical and you immediately fill the buffer
Zero-fill buffers after use when they contained sensitive information
Be careful when sharing buffer instances or slices, as changes are reflected across all references
Validate buffer inputs when receiving binary data from external sources
// Example: Safely handling sensitive data
function processPassword(password) {
// Create a buffer to hold the password
const passwordBuffer = Buffer.from(password);

// Process the password (e.g., hashing)
const hashedPassword = hashPassword(passwordBuffer);

// Zero out the original password buffer for security
passwordBuffer.fill(0);

return hashedPassword;
}

// Simple hashing function for demonstration
function hashPassword(buffer) {
// In a real application, you would use a cryptographic hash function
// This is a simplified example
let hash = 0;
for (let i = 0; i < buffer.length; i++) {
hash = ((hash < 5) - hash) + buffer[i];
hash |= 0; // Convert to 32-bit integer
}
return hash.toString(16);
}

// Usage
const password = 'secret123';
const hashedPassword = processPassword(password);
console.log('Hashed password:', hashedPassword);
Summary
The Node.js Buffer class is an essential tool for working with binary data. Key points to remember:

Buffers provide a way to handle binary data in JavaScript
Use Buffer.alloc(), Buffer.from(), and Buffer.allocUnsafe() to create buffers
Buffers can be manipulated with methods like write(), toString(), slice(), and copy()
Buffers support various encodings including UTF-8, Base64, and Hex
Buffers are commonly used in file I/O, network operations, and binary data processing
Consider performance and security implications when working with buffers
Exercise
?
Which of the following methods is used to create a Buffer from a string?

Buffer.alloc()
Buffer.from()
Buffer.create()
new Buffer()

Node.js Crypto Module
What is the Crypto Module?
The Crypto module is a built-in Node.js module that provides cryptographic functionality including:

Hash functions (SHA-256, SHA-512, etc.)
HMAC (Hash-based Message Authentication Code)
Symmetric encryption (AES, DES, etc.)
Asymmetric encryption (RSA, ECDSA, etc.)
Digital signatures and verification
Secure random number generation
The Crypto module is essential for applications that need to handle sensitive information securely.

The Crypto module wraps the OpenSSL library, providing access to well-established and tested cryptographic algorithms.

This module is often used to handle sensitive data, such as:

User authentication and password storage
Secure data transmission
File encryption and decryption
Secure communication channels
Getting Started with Crypto
Here's a quick example of using the Crypto module to hash a string:

Basic Hashing ExampleGet your own Node.js Server
const crypto = require('crypto');

// Create a SHA-256 hash of a string
const hash = crypto.createHash('sha256')
.update('Hello, Node.js!')
.digest('hex');
console.log('SHA-256 Hash:', hash);
Installing the Crypto Module
The Crypto module is included in Node.js by default.

You can use it by requiring it in your script:

const crypto = require('crypto');
Hash Functions
Hashing is a one-way transformation of data into a fixed-length string of characters.

Hash functions have several important properties:

Deterministic: Same input always produces the same output
Fixed Length: Output is always the same size regardless of input size
One-Way: Extremely difficult to reverse the process
Avalanche Effect: Small changes in input produce significant changes in output
Common use cases include:

Password storage
Data integrity verification
Digital signatures
Content addressing (e.g., Git, IPFS)
Creating a Hash
const crypto = require('crypto');

// Create a hash object
const hash = crypto.createHash('sha256');

// Update the hash with data
hash.update('Hello, World!');

// Get the digest in hexadecimal format
const digest = hash.digest('hex');
console.log(digest);
In this example:

createHash() creates a hash object with the specified algorithm
update() updates the hash content with the given data
digest() calculates the digest and outputs it in the specified format

REMOVE ADS

Common Hash Algorithms
const crypto = require('crypto');
const data = 'Hello, World!';

// MD5 (not recommended for security-critical applications)
const md5 = crypto.createHash('md5').update(data).digest('hex');
console.log('MD5:', md5);

// SHA-1 (not recommended for security-critical applications)
const sha1 = crypto.createHash('sha1').update(data).digest('hex');
console.log('SHA-1:', sha1);

// SHA-256
const sha256 = crypto.createHash('sha256').update(data).digest('hex');
console.log('SHA-256:', sha256);

// SHA-512
const sha512 = crypto.createHash('sha512').update(data).digest('hex');
console.log('SHA-512:', sha512);
Warning: MD5 and SHA-1 are considered cryptographically weak and should not be used for security-critical applications.

Use SHA-256, SHA-384, or SHA-512 instead.

Password Security
When handling passwords, it's crucial to use specialized password hashing functions that are designed to be computationally expensive to prevent brute-force attacks.

Here's why simple hashes are insufficient:

Never store passwords in plain text or with simple hashes like MD5 or SHA-1.

These can be easily cracked using rainbow tables or brute-force attacks.

Key Concepts for Password Security
Salting: Add a unique random value to each password before hashing
Key Stretching: Make the hashing process intentionally slow to prevent brute-force attacks
Work Factor: Control how computationally intensive the hashing process is
Here's how to properly hash passwords in Node.js:

What is a salt?
A salt is a random string that is unique to each user.

It's combined with the password before hashing to ensure that even if two users have the same password, their hashes will be different.

This prevents attackers from using precomputed tables (like rainbow tables) to crack multiple passwords at once.

const crypto = require('crypto');

// Function to hash a password
function hashPassword(password) {
// Generate a random salt (16 bytes)
const salt = crypto.randomBytes(16).toString('hex');

// Use scrypt for password hashing (recommended)
const hash = crypto.scryptSync(password, salt, 64).toString('hex');

// Return both salt and hash for storage
return { salt, hash };
}

// Function to verify a password
function verifyPassword(password, salt, hash) {
const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');
return hashedPassword === hash;
}

// Example usage
const password = 'mySecurePassword';

// Hash the password for storage
const { salt, hash } = hashPassword(password);
console.log('Salt:', salt);
console.log('Hash:', hash);

// Verify a login attempt
const isValid = verifyPassword(password, salt, hash);
console.log('Password valid:', isValid); // true

const isInvalid = verifyPassword('wrongPassword', salt, hash);
console.log('Wrong password valid:', isInvalid); // false
Note: For password hashing in a production environment, consider using a dedicated library like bcrypt or argon2 that is specifically designed for secure password handling.

HMAC (Hash-based Message Authentication Code)
HMAC is a specific type of message authentication code (MAC) involving a cryptographic hash function and a secret cryptographic key.

It provides both data integrity and authentication.

When to Use HMAC
API request verification
Secure cookies and sessions
Data integrity checks
Webhook verification
HMAC Security Properties
Message Integrity: Any change to the message will produce a different HMAC
Authenticity: Only parties with the secret key can generate valid HMACs
No Encryption: HMAC doesn't encrypt the message, only verifies its integrity
const crypto = require('crypto');

// Secret key
const secretKey = 'mySecretKey';

// Create an HMAC
const hmac = crypto.createHmac('sha256', secretKey);

// Update with data
hmac.update('Hello, World!');

// Get the digest
const hmacDigest = hmac.digest('hex');
console.log('HMAC:', hmacDigest);
HMAC for Message Verification
const crypto = require('crypto');

// Function to create an HMAC for a message
function createSignature(message, key) {
const hmac = crypto.createHmac('sha256', key);
hmac.update(message);
return hmac.digest('hex');
}

// Function to verify a message's signature
function verifySignature(message, signature, key) {
const expectedSignature = createSignature(message, key);
return crypto.timingSafeEqual(
Buffer.from(signature, 'hex'),
Buffer.from(expectedSignature, 'hex')
);
}

// Example usage
const secretKey = 'verySecretKey';
const message = 'Important message to verify';

// Sender creates a signature
const signature = createSignature(message, secretKey);
console.log('Message:', message);
console.log('Signature:', signature);

// Receiver verifies the signature
try {
const isValid = verifySignature(message, signature, secretKey);
console.log('Signature valid:', isValid); // true

// Try with a tampered message
const isInvalid = verifySignature('Tampered message', signature, secretKey);
console.log('Tampered message valid:', isInvalid); // false
} catch (error) {
console.error('Verification error:', error.message);
}
Note: Always use timingSafeEqual() for cryptographic comparisons to prevent timing attacks.

Symmetric Encryption
Symmetric encryption uses the same key for both encryption and decryption.

It's generally faster than asymmetric encryption and is ideal for:

Bulk data encryption
Database encryption
Filesystem encryption
Secure messaging (combined with key exchange)
Common Symmetric Algorithms
Algorithm Key Size Block Size Notes
AES-256 256 bits 128 bits Current standard, widely used
ChaCha20 256 bits 512 bits Faster in software, used in TLS 1.3
3DES 168 bits 64 bits Legacy, not recommended for new systems
Blowfish 32-448 bits 64 bits Legacy, use Twofish or AES instead
Note: Always use authenticated encryption modes like AES-GCM or AES-CCM when possible, as they provide both confidentiality and authenticity.

AES (Advanced Encryption Standard)
const crypto = require('crypto');

// Function to encrypt data
function encrypt(text, key) {
// Generate a random initialization vector
const iv = crypto.randomBytes(16);

// Create cipher with AES-256-CBC
const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

// Encrypt the data
let encrypted = cipher.update(text, 'utf8', 'hex');
encrypted += cipher.final('hex');

// Return both the encrypted data and the IV
return {
iv: iv.toString('hex'),
encryptedData: encrypted
};
}

// Function to decrypt data
function decrypt(encryptedData, iv, key) {
// Create decipher
const decipher = crypto.createDecipheriv(
'aes-256-cbc',
key,
Buffer.from(iv, 'hex')
);

// Decrypt the data
let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
decrypted += decipher.final('utf8');

return decrypted;
}

// Example usage
// Note: In a real application, use a properly generated and securely stored key
const key = crypto.scryptSync('secretPassword', 'salt', 32); // 32 bytes = 256 bits
const message = 'This is a secret message';

// Encrypt
const { iv, encryptedData } = encrypt(message, key);
console.log('Original:', message);
console.log('Encrypted:', encryptedData);
console.log('IV:', iv);

// Decrypt
const decrypted = decrypt(encryptedData, iv, key);
console.log('Decrypted:', decrypted);
Warning: Never reuse the same initialization vector (IV) with the same key.

Always generate a new random IV for each encryption operation.

Other Symmetric Algorithms
The Crypto module supports various symmetric encryption algorithms.

You can see the available ciphers with:

const crypto = require('crypto');

// List available cipher algorithms
console.log(crypto.getCiphers());
Asymmetric Encryption
Asymmetric encryption (public-key cryptography) uses a pair of mathematically related keys:

Public Key: Can be shared publicly, used for encryption
Private Key: Must be kept secret, used for decryption
Common Use Cases
Secure key exchange (e.g., TLS/SSL handshake)
Digital signatures
Email encryption (PGP/GPG)
Blockchain and cryptocurrencies
Common Asymmetric Algorithms
Algorithm Key Size Security Level Notes
RSA 2048+ bits High Widely used, good compatibility
ECDSA 256-521 bits High Used in TLS 1.3, Bitcoin
Ed25519 256 bits Very High Modern, efficient, used in SSH
Performance Note: Asymmetric encryption is much slower than symmetric encryption.

For encrypting large amounts of data, use a hybrid approach:

Generate a random symmetric key
Encrypt your data with the symmetric key
Encrypt the symmetric key with the recipient's public key
Send both the encrypted data and encrypted key
RSA (Rivest-Shamir-Adleman)
const crypto = require('crypto');

// Generate RSA key pair
function generateKeyPair() {
return crypto.generateKeyPairSync('rsa', {
modulusLength: 2048, // Key size in bits
publicKeyEncoding: {
type: 'spki',
format: 'pem'
},
privateKeyEncoding: {
type: 'pkcs8',
format: 'pem'
}
});
}

// Encrypt with public key
function encryptWithPublicKey(text, publicKey) {
const buffer = Buffer.from(text, 'utf8');
const encrypted = crypto.publicEncrypt(
{
key: publicKey,
padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
},
buffer
);
return encrypted.toString('base64');
}

// Decrypt with private key
function decryptWithPrivateKey(encryptedText, privateKey) {
const buffer = Buffer.from(encryptedText, 'base64');
const decrypted = crypto.privateDecrypt(
{
key: privateKey,
padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
},
buffer
);
return decrypted.toString('utf8');
}

// Generate keys
const { publicKey, privateKey } = generateKeyPair();
console.log('Public Key:', publicKey.substring(0, 50) + '...');
console.log('Private Key:', privateKey.substring(0, 50) + '...');

// Example usage
const message = 'This message is encrypted with RSA';
const encrypted = encryptWithPublicKey(message, publicKey);
console.log('Encrypted:', encrypted.substring(0, 50) + '...');

const decrypted = decryptWithPrivateKey(encrypted, privateKey);
console.log('Decrypted:', decrypted);
Note: RSA is typically used for encrypting small amounts of data (like encryption keys) due to performance constraints.

For larger data, use a hybrid approach: encrypt the data with a symmetric algorithm (like AES) and encrypt the symmetric key with RSA.

Digital Signatures
Digital signatures provide a way to verify the authenticity and integrity of messages, software, or digital documents.

const crypto = require('crypto');

// Generate RSA key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
modulusLength: 2048,
publicKeyEncoding: {
type: 'spki',
format: 'pem'
},
privateKeyEncoding: {
type: 'pkcs8',
format: 'pem'
}
});

// Function to sign a message
function signMessage(message, privateKey) {
const signer = crypto.createSign('sha256');
signer.update(message);
return signer.sign(privateKey, 'base64');
}

// Function to verify a signature
function verifySignature(message, signature, publicKey) {
const verifier = crypto.createVerify('sha256');
verifier.update(message);
return verifier.verify(publicKey, signature, 'base64');
}

// Example usage
const message = 'This message needs to be signed';
const signature = signMessage(message, privateKey);
console.log('Message:', message);
console.log('Signature:', signature.substring(0, 50) + '...');

// Verify the signature
const isValid = verifySignature(message, signature, publicKey);
console.log('Signature valid:', isValid); // true

// Verify with a modified message
const isInvalid = verifySignature('Modified message', signature, publicKey);
console.log('Modified message valid:', isInvalid); // false
Random Data Generation
Generating secure random data is important for many cryptographic operations, such as creating keys, salts, and initialization vectors.

const crypto = require('crypto');

// Generate random bytes
const randomBytes = crypto.randomBytes(16);
console.log('Random bytes:', randomBytes.toString('hex'));

// Generate a random string (Base64)
const randomString = crypto.randomBytes(32).toString('base64');
console.log('Random string:', randomString);

// Generate a random number between 1 and 100
function secureRandomNumber(min, max) {
// Ensure we have enough randomness
const range = max - min + 1;
const bytesNeeded = Math.ceil(Math.log2(range) / 8);
const maxValue = 256 \*\* bytesNeeded;

// Generate random bytes and convert to a number
const randomBytes = crypto.randomBytes(bytesNeeded);
const randomValue = randomBytes.reduce((acc, byte, i) => {
return acc + byte \* (256 \*\* i);
}, 0);

// Scale to our range and shift by min
return min + Math.floor((randomValue \* range) / maxValue);
}

// Example: Generate 5 random numbers
for (let i = 0; i < 5; i++) {
console.log(`Random number ${i+1}:`, secureRandomNumber(1, 100));
}
Security Best Practices
When using the Crypto module, keep these best practices in mind:

Use modern algorithms: Avoid MD5, SHA-1, and other outdated algorithms
Secure key management: Store keys securely, rotate them regularly, and never hardcode them
Use random IVs: Generate a new random IV for each encryption operation
Add authentication: Use authenticated encryption modes like GCM when possible
Constant-time comparisons: Always use crypto.timingSafeEqual() for comparing security-critical values
Key derivation: Use appropriate key derivation functions like scrypt, bcrypt, or PBKDF2 for password-based keys
Stay updated: Keep Node.js updated to get security fixes and support for newer algorithms
Follow standards: Adhere to established cryptographic standards and protocols
Warning: Cryptography is complex, and mistakes can lead to serious security vulnerabilities.

When implementing critical security features, consider consulting a security specialist or using well-established libraries designed for specific cryptographic tasks.

Summary
The Node.js Crypto module provides a wide range of cryptographic functionality:

Hash functions for data integrity and fingerprinting
HMAC for authentication and integrity checks
Symmetric encryption for securing data with shared keys
Asymmetric encryption for secure communication and digital signatures
Random data generation for cryptographic operations
Digital signatures for authenticity verification
By understanding and properly implementing these cryptographic concepts, you can build secure applications that protect sensitive data and communications.

Exercise
?
Drag and drop the name of the module that provides cryptographic functionality for Node.js.
The module.

Node.js Timers Module
What is the Timers Module?
The Timers module provides functions that help schedule code execution at specific times or intervals.

Unlike browser JavaScript, Node.js timing functions are provided as part of the Timers module, though they are available globally without requiring an explicit import.

Key features include:

Delayed execution with setTimeout()
Repeated execution with setInterval()
Immediate execution in the next event loop with setImmediate()
Promise-based APIs for modern async/await patterns
These capabilities are essential for building responsive applications, implementing polling, handling delayed operations, and more.

Getting Started with Timers
Here's a quick example of using the Timers module to schedule code execution:

Basic Timer ExampleGet your own Node.js Server
const { setTimeout, setInterval, setImmediate } = require('timers');

console.log('Starting timers...');

// Execute once after delay
setTimeout(() => {
console.log('This runs after 1 second');
}, 1000);

// Execute repeatedly at interval
let counter = 0;
const interval = setInterval(() => {
counter++;
console.log(`Interval tick ${counter}`);
if (counter >= 3) clearInterval(interval);
}, 1000);

// Execute in the next event loop iteration
setImmediate(() => {
console.log('This runs in the next iteration of the event loop');
});

console.log('Timers scheduled');
Using the Timers Module
The Timers module's functions are available globally, so you don't need to require them explicitly.

However, if you want to access advanced features or for clarity, you can import the module:

const timers = require('timers');

// Or, for the promises API (Node.js 15.0.0+)
const timersPromises = require('timers/promises');
setTimeout() and clearTimeout()
The setTimeout() function schedules execution of a callback after a specified amount of time (in milliseconds).

It returns a Timeout object that can be used to cancel the timeout.

Common Use Cases
Delaying execution of non-critical tasks
Implementing timeouts for operations
Breaking up CPU-intensive tasks
Implementing retry logic
// Basic usage
setTimeout(() => {
console.log('This message is displayed after 2 seconds');
}, 2000);

// With arguments
setTimeout((name) => {
console.log(`Hello, ${name}!`);
}, 1000, 'World');

// Storing and clearing a timeout
const timeoutId = setTimeout(() => {
console.log('This will never be displayed');
}, 5000);

// Cancel the timeout before it executes
clearTimeout(timeoutId);
console.log('Timeout has been cancelled');
Promise-Based setTimeout
Node.js 15.0.0 and later provide a promises-based API for timers:

const { setTimeout } = require('timers/promises');

async function delayedGreeting() {
console.log('Starting...');

// Wait for 2 seconds
await setTimeout(2000);

console.log('After 2 seconds');

// Wait for 1 second with a value
const result = await setTimeout(1000, 'Hello, World!');

console.log('After 1 more second:', result);
}

delayedGreeting().catch(console.error);

REMOVE ADS

setInterval() and clearInterval()
The setInterval() function calls a function repeatedly at specified intervals (in milliseconds).

It returns an Interval object that can be used to stop the interval.

Common Use Cases
Polling for updates
Running periodic maintenance tasks
Implementing heartbeat mechanisms
Updating UI elements at regular intervals
Note: The actual interval between executions may be longer than specified if the event loop is blocked by other operations.

// Basic interval
let counter = 0;
const intervalId = setInterval(() => {
counter++;
console.log(`Interval executed ${counter} times`);

// Stop after 5 executions
if (counter >= 5) {
clearInterval(intervalId);
console.log('Interval stopped');
}
}, 1000);

// Interval with arguments
const nameInterval = setInterval((name) => {
console.log(`Hello, ${name}!`);
}, 2000, 'Node.js');

// Stop the name interval after 6 seconds
setTimeout(() => {
clearInterval(nameInterval);
console.log('Name interval stopped');
}, 6000);
Promise-Based setInterval
Using the promises API for intervals:

const { setInterval } = require('timers/promises');

async function repeatedGreeting() {
console.log('Starting interval...');

// Create an async iterator from setInterval
const interval = setInterval(1000, 'tick');

// Limit to 5 iterations
let counter = 0;

for await (const tick of interval) {
console.log(counter + 1, tick);
counter++;

    if (counter >= 5) {
      break; // Exit the loop, stopping the interval
    }

}

console.log('Interval finished');
}

repeatedGreeting().catch(console.error);
setImmediate() and clearImmediate()
The setImmediate() function schedules a callback to run in the next iteration of the event loop, after I/O events but before timers.

It's similar to using setTimeout(callback, 0) but more efficient.

When to Use setImmediate()
When you want to execute code after the current operation completes
To break up long-running operations into smaller chunks
To ensure callbacks run after I/O operations complete
In recursive functions to prevent stack overflows
console.log('Start');

setTimeout(() => {
console.log('setTimeout callback');
}, 0);

setImmediate(() => {
console.log('setImmediate callback');
});

process.nextTick(() => {
console.log('nextTick callback');
});

console.log('End');
The execution order will typically be:

Start
End
nextTick callback
setTimeout callback or setImmediate callback (order can vary)
Note: The order of execution between setTimeout(0) and setImmediate() can be unpredictable when called from the main module.

However, inside an I/O callback, setImmediate() will always execute before any timers.

Canceling an Immediate
const immediateId = setImmediate(() => {
console.log('This will not be displayed');
});

clearImmediate(immediateId);
console.log('Immediate has been cancelled');
process.nextTick()
Although not part of the Timers module, process.nextTick() is a related function that defers a callback until the next iteration of the event loop, but executes it before any I/O events or timers.

Key Characteristics
Runs before any I/O events or timers
Higher priority than setImmediate()
Processes all queued callbacks before the event loop continues
Can lead to I/O starvation if overused
When to Use process.nextTick()
To ensure a callback runs after the current operation but before any I/O
To break up long-running operations
To allow event handlers to be set up after an object is created
To ensure consistent API behavior (e.g., making constructors work with or without `new`)
console.log('Start');

// Schedule three different types of callbacks
setTimeout(() => {
console.log('setTimeout executed');
}, 0);

setImmediate(() => {
console.log('setImmediate executed');
});

process.nextTick(() => {
console.log('nextTick executed');
});

console.log('End');
Note: process.nextTick() fires immediately on the same phase of the event loop, while setImmediate() fires on the following iteration or 'tick' of the event loop.

Advanced Timer Patterns
Debouncing
Prevent a function from being called too frequently by delaying its execution:

function debounce(func, delay) {
let timeoutId;
return function(...args) {
clearTimeout(timeoutId);
timeoutId = setTimeout(() => func.apply(this, args), delay);
};
}
// Example usage
const handleResize = debounce(() => {
console.log('Window resized');
}, 300);
// Call handleResize() on window resize
Throttling
Limit how often a function can be called over time:

function throttle(func, limit) {
let inThrottle = false;
return function(...args) {
if (!inThrottle) {
func.apply(this, args);
inThrottle = true;
setTimeout(() => inThrottle = false, limit);
}
};
}
// Example usage
const handleScroll = throttle(() => {
console.log('Handling scroll');
}, 200);
// Call handleScroll() on window scroll
Sequential Timeouts
Execute a series of operations with delays between them:

function sequentialTimeouts(callbacks, delay = 1000) {
let index = 0;
function next() {
if (index < callbacks.length) {
callbacks[index]();
index++;
setTimeout(next, delay);
}
}
next();
}
// Example usage
sequentialTimeouts([
() => console.log('Step 1'),
() => console.log('Step 2'),
() => console.log('Step 3')
], 1000);
Timer Behavior and Best Practices
Timer Precision and Performance
Node.js timers are not precise to the millisecond. The actual delay might be slightly longer due to:

System load and CPU usage
Event loop blocking operations
Other timers and I/O operations
System timer resolution (typically 1-15ms)
Measuring Timer Accuracy
const desiredDelay = 100; // 100ms
const start = Date.now();

setTimeout(() => {
const actualDelay = Date.now() - start;
console.log(`Desired delay: ${desiredDelay}ms`);
console.log(`Actual delay: ${actualDelay}ms`);
console.log(`Difference: ${actualDelay - desiredDelay}ms`);
}, desiredDelay);
Memory and Resource Management
Proper management of timers is crucial to prevent memory leaks and excessive resource usage:

Common Memory Leak Patterns
// Leak: Interval keeps running even if not needed
function startService() {
setInterval(() => {
fetchData();
}, 1000);
}
// Leak: Timeout with closure over large object
function processData(data) {
setTimeout(() => {
console.log('Processing complete');
// 'data' is kept in memory until the timeout fires
}, 10000, data);
}
Best Practices
Always clear intervals and timeouts when they're no longer needed
Store timer IDs in a way that allows for cleanup
Be cautious with closures in timer callbacks
Use clearTimeout() and clearInterval() in cleanup functions
Remember to clear timers when they're no longer needed, especially in long-running applications, to prevent memory leaks:

// Bad practice in a server context
function startServer() {
setInterval(() => {
// This interval will run forever and prevent proper cleanup
console.log('Server is running...');
}, 60000);
}

// Better practice
function startServer() {
const intervalId = setInterval(() => {
console.log('Server is running...');
}, 60000);

// Store the interval ID for later cleanup
return {
stop: () => {
clearInterval(intervalId);
console.log('Server stopped');
}
};
}

// Example usage
const server = startServer();

// Stop the server after 3 minutes
setTimeout(() => {
server.stop();
}, 180000);
Zero-Delay Timeouts
When using setTimeout(callback, 0), the callback doesn't execute immediately.

It executes after the current event loop cycle completes, which can be used to "break up" CPU-intensive tasks:

function processArray(array, processFunction) {
const chunkSize = 1000;
let index = 0;

function processChunk() {
const chunk = array.slice(index, index + chunkSize);
chunk.forEach(processFunction);

    index += chunkSize;

    if (index < array.length) {
      setTimeout(processChunk, 0); // Yield to the event loop
    } else {
      console.log('Processing complete');
    }

}

processChunk();
}

// Example usage
const bigArray = Array(10000).fill().map((\_, i) => i);

console.log('Starting processing...');
processArray(bigArray, (item) => {
// Simple processing
if (item % 5000 === 0) {
console.log(`Processed item ${item}`);
}
});
console.log('This will log before processing completes');
Node.js Readline Module
Introduction to the Readline Module
The Readline module is a core Node.js module that provides an interface for reading data from a Readable stream (like process.stdin) one line at a time.

It's particularly useful for:

Common Use Cases
Interactive command-line applications
Configuration wizards and setup tools
Command-line games
REPL (Read-Eval-Print Loop) environments
Processing large text files line by line
Building custom shells and CLIs
Key Features
Line-by-line input processing
Customizable prompts and formatting
Tab completion support
History management
Event-driven interface
Promise-based API support
Note: The Readline module is built into Node.js, so no additional installation is required.

It's perfect for any application that needs to interact with users through the command line or process text input in a line-oriented way.

Getting Started with Readline
Here's a quick example of using the Readline module to create a simple interactive command-line application:

Basic Interactive PromptGet your own Node.js Server
const readline = require('readline');

// Create interface for input/output
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

// Ask a question and handle the response
rl.question('What is your name? ', (name) => {
console.log(`Hello, ${name}!`);

// Ask follow-up question
rl.question('How old are you? ', (age) => {
console.log(`In 5 years, you'll be ${parseInt(age) + 5} years old.`);

    // Close the interface when done
    rl.close();

});
});

// Handle application exit
rl.on('close', () => {
console.log('Goodbye!');
process.exit(0);
});
REMOVE ADS

Importing and Setup
The Readline module can be imported in several ways depending on your module system and needs:

CommonJS (Node.js default)
// Basic require
const readline = require('readline');

// Import specific methods using destructuring
const { createInterface } = require('readline');

// Create interface with default settings
const rl = createInterface({
input: process.stdin,
output: process.stdout
});
ES Modules (Node.js 12+)
// Using default import
import readline from 'readline';

// Using named imports
import { createInterface } from 'readline';

// Dynamic import (Node.js 14+)
const { createInterface } = await import('readline');

// Create interface
const rl = createInterface({
input: process.stdin,
output: process.stdout
});
Best Practice: Always close the readline interface using rl.close() when you're done with it to free up system resources and allow your program to exit cleanly.

Creating a Readline Interface
The createInterface method is the main way to create a readline interface. It takes an options object with several configuration properties:

Basic Interface Creation
const readline = require('readline');

// Create a basic interface
const rl = readline.createInterface({
input: process.stdin, // Readable stream to listen to
output: process.stdout, // Writable stream to write to
prompt: '> ', // Prompt to display (default: '> ')
});
Common Options:

input: The Readable stream to listen to (default: process.stdin)
output: The Writable stream to write to (default: process.stdout)
prompt: The prompt string to use (default: '> ')
terminal: If true, treats the output as a TTY (default: output.isTTY)
historySize: Maximum number of history entries (default: 30)
removeHistoryDuplicates: If true, removes duplicate history entries (default: false)
completer: Optional function for tab auto-completion
crlfDelay: Delay between CR and LF (default: 100ms)
escapeCodeTimeout: Time to wait for character escape sequences (default: 500ms)
Advanced Interface Example
const readline = require('readline');
const fs = require('fs');

// Create an interface with advanced options
const rl = readline.createInterface({
input: fs.createReadStream('input.txt'), // Read from file
output: process.stdout, // Write to console
terminal: false, // Input is not a terminal
historySize: 100, // Larger history
removeHistoryDuplicates: true, // Don't store duplicate commands
prompt: 'CLI> ', // Custom prompt
crlfDelay: Infinity, // Handle all CR/LF as single line break
escapeCodeTimeout: 200 // Faster escape code detection
});

// Handle each line from the file
rl.on('line', (line) => {
console.log(`Processing: ${line}`);
});

// Handle end of file
rl.on('close', () => {
console.log('Finished processing file');
});
Note: When creating interfaces for file processing, set terminal: false to disable TTY-specific features and improve performance.

REMOVE ADS

Basic Readline Methods
The Readline module provides several methods for interacting with the user. Here are the most commonly used ones:

1. rl.question(query, callback)
   Displays a query to the user and invokes the callback with the user's response. This is one of the most commonly used methods for simple user interactions.

Basic Example
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

rl.question('What is your name? ', (name) => {
console.log(`Hello, ${name}!`);
rl.close();
});
Nested Questions Example
function askQuestion(query) {
return new Promise(resolve => {
rl.question(query, resolve);
});
}

async function userSurvey() {
try {
const name = await askQuestion('What is your name? ');
const age = await askQuestion('How old are you? ');
const email = await askQuestion('What is your email? ');

    console.log('\n=== User Information ===');
    console.log(`Name: ${name}`);
    console.log(`Age: ${age}`);
    console.log(`Email: ${email}`);

} catch (error) {
console.error('An error occurred:', error);
} finally {
rl.close();
}
}

userSurvey();
Best Practices for rl.question():

Always handle errors in the callback function
Consider using promises or async/await for better flow control with multiple questions
Validate user input before processing
Always close the interface when done to free up resources 2. rl.prompt([preserveCursor])
Writes the current prompt to output and waits for user input. The optional preserveCursor parameter (boolean) determines if the cursor position should be preserved.

Basic Prompt Example
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
prompt: 'CLI> '
});
// Display initial prompt
rl.prompt();

// Handle each line of input
rl.on('line', (line) => {
const input = line.trim();

switch (input) {
case 'hello':
console.log('Hello there!');
break;
case 'time':
console.log(`Current time: ${new Date().toLocaleTimeString()}`);
break;
case 'exit':
rl.close();
return;
default:
console.log(`You entered: ${input}`);
}

// Show the prompt again
rl.prompt();
});

// Handle application exit
rl.on('close', () => {
console.log('Goodbye!');
process.exit(0);
});
Tips for Using Prompts:

Use rl.setPrompt() to change the prompt string dynamically
For multi-line prompts, include line breaks in the prompt string
Consider using a library like chalk to add colors to your prompts
Remember to call rl.prompt() after handling each input to show the prompt again 3. rl.write(data[, key])
Writes data to the output stream. The optional key parameter can be used to simulate key presses.

Write Example
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

// Display a welcome message
rl.write('Welcome to the CLI Application!\n');
rl.write('='.repeat(30) + '\n\n');

// Pre-fill a default value
rl.question('Enter your username: ', (username) => {
console.log(`Hello, ${username}!`);

// Simulate typing a default value
rl.write('default@example.com');

// Move cursor to the beginning of the line
rl.write(null, { ctrl: true, name: 'a' });

rl.question('Enter your email: ', (email) => {
console.log(`Your email is: ${email}`);
rl.close();
});
});
Common Use Cases for rl.write():

Displaying headers or section titles
Providing default values in prompts
Simulating user input for testing
Creating custom input formatting 4. rl.close()
Closes the readline interface and releases control of the input and output streams. This is important to free up system resources and allow your program to exit cleanly.

Proper Cleanup Example
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

// Handle application exit
function exitApp() {
console.log('\nCleaning up resources...');

// Perform any necessary cleanup
// (e.g., close database connections, write logs, etc.)

// Close the readline interface
rl.close();
}

// Handle Ctrl+C
rl.on('SIGINT', () => {
console.log('\nReceived SIGINT. Exiting...');
exitApp();
});

// Handle normal exit
rl.on('close', () => {
console.log('Goodbye!');
process.exit(0);
});

// Start the application
console.log('Application started. Press Ctrl+C to exit.');
rl.prompt(); 5. rl.pause() and rl.resume()
These methods allow you to temporarily pause and resume the input stream, which can be useful for controlling the flow of user input.

Pause/Resume Example
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

let isPaused = false;

console.log('Type "pause" to pause input, "resume" to continue, or "exit" to quit');

rl.on('line', (input) => {
const command = input.trim().toLowerCase();

switch (command) {
case 'pause':
if (!isPaused) {
console.log('Input paused. Type "resume" to continue...');
rl.pause();
isPaused = true;
}
break;

    case 'resume':
      if (isPaused) {
        console.log('Resuming input...');
        rl.resume();
        rl.prompt();
        isPaused = false;
      }
      break;

    case 'exit':
      console.log('Goodbye!');
      rl.close();
      return;

    default:
      if (!isPaused) {
        console.log(`You entered: ${input}`);
        rl.prompt();
      }

}
});

rl.prompt();
When to Use Pause/Resume:

When performing long-running operations that shouldn't be interrupted by user input
When temporarily disabling user input during certain operations
When implementing a paging mechanism for long outputs
When you need to throttle input processing
Method Description
rl.question(query, callback) Displays the query and waits for user input, then invokes the callback with the user's answer
rl.prompt([preserveCursor]) Displays the configured prompt for user input
rl.write(data[, key]) Writes data to the output stream, can also simulate keypress events
rl.close() Closes the readline interface and relinquishes control of the input and output streams
rl.pause() Pauses the readline input stream
rl.resume() Resumes the readline input stream
Using Promises with Readline
The Readline module's callback-based API can be wrapped in promises for more modern, async/await friendly code:

const readline = require('readline');

// Create interface
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

// Promise-based question function
function askQuestion(query) {
return new Promise(resolve => {
rl.question(query, resolve);
});
}

// Using async/await with readline
async function main() {
try {
const name = await askQuestion('What is your name? ');
console.log(`Hello, ${name}!`);

    const age = await askQuestion('How old are you? ');
    console.log(`In 5 years, you'll be ${parseInt(age) + 5} years old.`);

    const location = await askQuestion('Where do you live? ');
    console.log(`${location} is a great place!`);

    console.log('Thank you for your answers!');

} catch (error) {
console.error('Error:', error);
} finally {
rl.close();
}
}

// Run the main function
main();
Creating an Interactive CLI Menu
You can use the Readline module to create interactive menus for command-line applications:

const readline = require('readline');

// Create interface
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

// Menu options
const menu = {
1: 'Show current time',
2: 'Show system info',
3: 'Show memory usage',
4: 'Exit'
};

// Function to display menu
function displayMenu() {
console.log('\n===== MAIN MENU =====');
for (const [key, value] of Object.entries(menu)) {
console.log(`${key}: ${value}`);
}
console.log('====================\n');
}

// Function to handle menu selection
async function handleMenu() {
let running = true;

while (running) {
displayMenu();

    const answer = await askQuestion('Select an option: ');

    switch (answer) {
      case '1':
        console.log(`Current time: ${new Date().toLocaleTimeString()}`);
        break;

      case '2':
        console.log('System info:');
        console.log(`Platform: ${process.platform}`);
        console.log(`Node.js version: ${process.version}`);
        console.log(`Process ID: ${process.pid}`);
        break;

      case '3':
        const memory = process.memoryUsage();
        console.log('Memory usage:');
        for (const [key, value] of Object.entries(memory)) {
          console.log(`${key}: ${Math.round(value / 1024 / 1024 * 100) / 100} MB`);
        }
        break;

      case '4':
        console.log('Exiting program. Goodbye!');
        running = false;
        break;

      default:
        console.log('Invalid option. Please try again.');
      }

      if (running) {
        await askQuestion('\nPress Enter to continue...');
        console.clear(); // Clear console for better UX
      }

}
}

// Promise-based question function
function askQuestion(query) {
return new Promise(resolve => {
rl.question(query, resolve);
});
}

// Start the interactive menu
handleMenu()
.finally(() => {
rl.close();
});
Reading a File Line by Line
Besides interactive input, the Readline module can also read files line by line, which is useful for processing large text files efficiently:

const fs = require('fs');
const readline = require('readline');

// Create a readable stream for the file
const fileStream = fs.createReadStream('example.txt');

// Create the readline interface
const rl = readline.createInterface({
input: fileStream,
crlfDelay: Infinity // Recognize all instances of CR LF as a single line break
});

// Counter for line numbers
let lineNumber = 0;

// Process file line by line
rl.on('line', (line) => {
lineNumber++;
console.log(`Line ${lineNumber}: ${line}`);
});

// Handle end of file
rl.on('close', () => {
console.log(`Finished reading file with ${lineNumber} lines.`);
});
Note: This approach is memory-efficient for large files as it processes one line at a time rather than loading the entire file into memory.

Tab Completion
Tab completion enhances the user experience by providing command and file path suggestions. The Readline module allows you to implement custom completion logic:

How Tab Completion Works:

User presses the Tab key
Readline calls your completer function with the current line and cursor position
Your function returns completion suggestions
Readline displays the completions or auto-completes if there's only one match
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Available commands for autocompletion
const commands = ['help', 'exit', 'list', 'clear', 'info', 'version', 'history'];

// Create the readline interface with a completer function
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
prompt: 'myapp> ',
completer: function(line) {
// Command completion
if (!line.includes(' ')) {
const hits = commands.filter(c => c.startsWith(line));

      // Show all completions if none matches
      return [hits.length ? hits : commands, line];
    }

    // File path completion (for commands like "list ")
    if (line.startsWith('list ')) {
      const dir = line.split(' ')[1] || '.';
      try {
        let completions = fs.readdirSync(dir);

        // Add trailing slash to directories
        completions = completions.map(file => {
          const fullPath = path.join(dir, file);
          return fs.statSync(fullPath).isDirectory() ? file + '/' : file;
        });

        const hits = completions.filter(c => c.startsWith(line.split(' ')[1] || ''));
        return [hits.length ? hits : completions, line.split(' ')[1] || ''];
      } catch (err) {
        return [[], line];
      }
    }

    return [[], line];

}
});

// Set the prompt
rl.prompt();

// Handle commands
rl.on('line', (line) => {
line = line.trim();

switch (true) {
case line === 'help':
console.log('Available commands:');
commands.forEach(cmd => console.log(` ${cmd}`));
break;

    case line === 'exit':
      console.log('Goodbye!');
      rl.close();
      return;

    case line.startsWith('list'):
      const dir = line.split(' ')[1] || '.';
      try {
        const files = fs.readdirSync(dir);
        console.log(`Contents of ${dir}:`);
        files.forEach(file => {
          const stats = fs.statSync(path.join(dir, file));
          console.log(` ${file}${stats.isDirectory() ? '/' : ''}`);
        });
      } catch (err) {
        console.error(`Error listing directory: ${err.message}`);
      }
      break;

    case line === 'clear':
      console.clear();
      break;

    case line === 'info':
      console.log('Node.js CLI Example');
      console.log(`Version: 1.0.0`);
      break;

    case line === 'version':
      console.log(`Node.js version: ${process.version}`);
      break;

    case line === 'history':
      // Note: This requires storing history manually
      console.log('History feature not fully implemented.');
      break;

    case line === '':
      // Do nothing for empty lines
      break;

    default:
      console.log(`Unknown command: ${line}`);
      console.log('Type "help" for available commands');
    }

    rl.prompt();

}).on('close', () => {
console.log('CLI terminated.');
process.exit(0);
});

// Handle Ctrl+C
rl.on('SIGINT', () => {
rl.question('Are you sure you want to exit? (y/n) ', (answer) => {
if (answer.toLowerCase() === 'y') {
rl.close();
} else {
rl.prompt();
}
});
});
Multi-Line Input
The Readline module excels at handling multi-line input, making it perfect for text editors, code editors, or any application that needs to collect multiple lines of text from users. Here's how to implement it effectively:

Multi-Line Input Strategies:

End Marker: Use a special sequence (like .end) to signal the end of input
Bracket Matching: Automatically detect when all opened brackets/parentheses are closed
Dedicated Command: Provide a specific command to submit multi-line input
Timeout-Based: Use a timer to detect when the user is done typing
const readline = require('readline');

// Create interface
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
prompt: '> '
});

console.log('Enter your multi-line input. Type ".end" on a new line to finish:');
rl.prompt();

// Store lines
const lines = [];

// Handle input
rl.on('line', (line) => {
// Check for end command
if (line.trim() === '.end') {
console.log('\nYour complete input:');
console.log('-'.repeat(30));
console.log(lines.join('\n'));
console.log('-'.repeat(30));

     // Process the input (example: count words)
     const text = lines.join(' ');
     const wordCount = text.split(/\s+/).filter(Boolean).length;
     const charCount = text.length;

     console.log(`\nStatistics:`);
     console.log(`Lines: ${lines.length}`);
     console.log(`Words: ${wordCount}`);
     console.log(`Characters: ${charCount}`);

     rl.close();
     return;

}

// Add line to collection
lines.push(line);
rl.prompt();
});
Building a Simple REPL
A Read-Eval-Print Loop (REPL) is an interactive programming environment that reads user input, evaluates it, and prints the result.

The Readline module is perfect for building custom REPLs. Here's a comprehensive guide to creating your own:

Key Components of a REPL:

Read: Accept user input line by line
Eval: Parse and evaluate the input
Print: Display the result or any output
Loop: Return to the input prompt for the next command
Special Commands: Handle commands like .help, .exit
Error Handling: Gracefully handle syntax errors and exceptions
const readline = require('readline');
const vm = require('vm');

// Create interface
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
prompt: 'js> '
});

// Create context for evaluating code
const context = vm.createContext({
console,
Number,
String,
Array,
Object,
// Add any other global variables you want to make available
// You can also add your own functions
add: (a, b) => a + b,
multiply: (a, b) => a \* b
});

console.log('Simple JavaScript REPL (Press Ctrl+C to exit)');
console.log('Type JavaScript code and press Enter to evaluate');

// Show the prompt
rl.prompt();

// Track multi-line input
let buffer = '';

// Handle input
rl.on('line', (line) => {
// Add the line to our buffer
buffer += line;

try {
// Try to evaluate the code
const result = vm.runInContext(buffer, context);

    // Display the result
    console.log('\x1b[33m%s\x1b[0m', '=> ' + result);

    // Reset the buffer after successful evaluation
    buffer = '';

} catch (error) {
// If it's a syntax error and might be due to incomplete input,
// continue collecting input
if (error instanceof SyntaxError &&
error.message.includes('Unexpected end of input')) {
// Continue in multi-line mode
rl.setPrompt('... ');
} else {
// It's a real error, show it and reset buffer
console.error('\x1b[31m%s\x1b[0m', 'Error: ' + error.message);
buffer = '';
rl.setPrompt('js> ');
}
}

rl.prompt();
});

// Handle Ctrl+C
rl.on('SIGINT', () => {
if (buffer.length > 0) {
// If there's pending input, clear it
console.log('\nInput cleared');
buffer = '';
rl.setPrompt('js> ');
rl.prompt();
} else {
// Otherwise exit
rl.question('\nAre you sure you want to exit? (y/n) ', (answer) => {
if (answer.toLowerCase() === 'y') {
console.log('Goodbye!');
rl.close();
} else {
rl.prompt();
}
});
}
});

rl.on('close', () => {
console.log('REPL closed');
process.exit(0);
});
Best Practices
Always close the interface: Call rl.close() when you're done to clean up resources.
Handle errors: Implement error handling for all readline operations.
Use promises: Wrap callback-based methods in promises for cleaner async code.
Consider UX: Provide clear prompts and feedback to users.
Use event handlers: Leverage the event-based nature of readline for complex interactions.
Memory management: Be careful with large files; process them line by line.
Add keyboard shortcuts: Implement handlers for common keyboard shortcuts (Ctrl+C, Ctrl+D).
Readline vs. Other Input Methods
Node.js ES6+ Features
What is ES6+?
ES6 (ECMAScript 2015) and later versions add powerful new features to JavaScript that make your code more expressive, concise, and safer.

Node.js has excellent support for modern JavaScript features.

Node.js Compatibility: All modern versions of Node.js (10+) have excellent support for ES6+ features.

Newer versions support even more recent JavaScript additions from ES2020 and beyond.

These modern JavaScript features help you:

Write cleaner, more readable code
Avoid common JavaScript pitfalls
Create more maintainable applications
Reduce the need for external libraries
let and const
The let and const keywords replaced var as the preferred way to declare variables:

let allows you to declare variables that can be reassigned
const declares variables that cannot be reassigned (but object properties can still be modified)
Both are block-scoped, unlike var which is function-scoped
Example: let and constGet your own Node.js Server
// Using let (can be changed)
let score = 10;
score = 20;
// Using const (cannot be reassigned)
const MAX_USERS = 100;

// Block scope with let
if (true) {
let message = 'Hello';
console.log(message); // Works here
}
Arrow Functions
Arrow functions provide a concise syntax for writing functions and automatically bind this to the surrounding context.

Key benefits of arrow functions:

Shorter syntax for simple functions
Implicit return for one-line expressions
Lexical this binding (arrow functions don't create their own this context)
Example: Arrow Functions
// Traditional function
function add(a, b) {
return a + b;
}

// Arrow function (same as above)
const addArrow = (a, b) => a + b;

// Single parameter (no parentheses needed)
const double = num => num \* 2;

// No parameters (parentheses needed)
const sayHello = () => 'Hello!';

// Using with array methods
const numbers = [1, 2, 3];
const doubled = numbers.map(num => num \* 2);
console.log(doubled);
When NOT to use arrow functions:

Object methods (where you need `this` to reference the object)
Constructor functions (arrow functions can't be used with `new`)
Event handlers where `this` should refer to the element
REMOVE ADS

Template Literals
Template literals (template strings) provide an elegant way to create strings with embedded expressions using backticks (`).

Key features of template literals:

String interpolation with ${expression} syntax
Multi-line strings without escape characters
Tagged templates for advanced string processing
Example: Template Literals
// Basic string interpolation
const name = 'Alice';
console.log(`Hello, ${name}!`);

// Multi-line string
const message = `  This is a multi-line
  string in JavaScript.`;
console.log(message);

// Simple expression
const price = 10;
const tax = 0.2;
console.log(`Total: $${price * (1 + tax)}`);
REMOVE ADS

Destructuring
Destructuring allows you to extract values from arrays or properties from objects into distinct variables with a concise syntax.

Key features of destructuring:

Extract multiple values in a single statement
Assign default values to extracted properties
Rename properties during extraction
Skip elements in arrays
Extract deeply nested properties
Example: Object Destructuring
// Basic object destructuring
const user = { name: 'Alice', age: 30, location: 'New York' };
const { name, age } = user;
console.log(name, age);
Example: Array Destructuring
// Basic array destructuring
const colors = ['red', 'green', 'blue'];
const [first, second, third] = colors;
console.log(first, second, third);

// Skipping elements
const [primary, , tertiary] = colors;
console.log(primary, tertiary);
Spread and Rest Operators
The spread and rest operators (both written as ...) allow you to work with multiple elements more efficiently.

Spread operator: Expands iterables (arrays, objects, strings) into individual elements
Rest operator: Collects multiple elements into a single array or object
Example: Spread Operator
// Array spread - combining arrays
const numbers = [1, 2, 3];
const moreNumbers = [4, 5, 6];
const combined = [...numbers, ...moreNumbers];
console.log(combined);

// Array spread - converting string to array of characters
const chars = [...'hello'];
console.log(chars);
Example: Rest Operator
// Rest parameter in functions
function sum(...numbers) {
return numbers.reduce((total, num) => total + num, 0);
}
console.log(sum(1, 2, 3, 4, 5));
Default Parameters
ES6+ allows you to specify default values for function parameters, eliminating the need for manual parameter checking in many cases.

Key benefits of default parameters:

Cleaner function definitions without manual checking
More explicit function signatures
Default values are only used when parameters are undefined or not provided
Default values can be expressions, not just simple values
Example: Default Parameters
// Basic default parameter
function greet(name = 'Guest') {
return `Hello, ${name}!`;
}

console.log(greet());
console.log(greet('Kai'));
Classes
ES6 introduced class syntax to JavaScript, providing a clearer and more concise way to create objects and implement inheritance.

Under the hood, JavaScript classes are still based on prototypes.

Key features of JavaScript classes:

Cleaner syntax for creating constructor functions and methods
Built-in support for inheritance using extends
Static methods attached to the class, not instances
Getter and setter methods for more controlled property access
Private fields for better encapsulation (ES2022+)
Example: Class Basics
// Simple class with constructor and method
class Person {
constructor(name, age) {
this.name = name;
this.age = age;
}

greet() {
return `Hello, I'm ${this.name}!`;
}
}

// Create an instance
const person = new Person('Alice', 25);
console.log(person.greet()); // Hello, I'm Alice!
Example: Class Inheritance
// Parent class
class Animal {
constructor(name) {
this.name = name;
}

speak() {
return `${this.name} makes a sound.`;
}
}

// Child class
class Dog extends Animal {
speak() {
return `${this.name} barks!`;
}
}

const dog = new Dog('Rex');
console.log(dog.speak());
Example: Private Class Fields (ES2022+)
// Class with private field (# prefix)
class Counter {
#count = 0; // Private field

increment() {
this.#count++;
}

getCount() {
return this.#count;
}
}

const counter = new Counter();
counter.increment();
console.log(counter.getCount());
// console.log(counter.#count); // Error: Private field
Promises and Async/Await
Modern JavaScript provides powerful tools for handling asynchronous operations, making it much easier to work with code that involves delays, API calls, or I/O operations.

Promises
Promises represent values that may not be available yet.

They provide a more elegant way to handle asynchronous operations compared to callbacks.

A Promise is in one of these states:

Pending: Initial state, neither fulfilled nor rejected
Fulfilled: Operation completed successfully
Rejected: Operation failed
Example: Basic Promises
// Creating a promise
const fetchData = () => {
return new Promise((resolve, reject) => {
// Simulating an API call
setTimeout(() => {
const data = { id: 1, name: 'Product' };
const success = true;

       if (success) {
         resolve(data); // Fulfilled with data
       } else {
         reject(new Error('Failed to fetch data')); // Rejected with error
       }
     }, 1000);

});
};

// Using a promise
console.log('Fetching data...');

fetchData()
.then(data => {
console.log('Data received:', data);
return data.id; // Return value is passed to the next .then()
})
.then(id => {
console.log('Processing ID:', id);
})
.catch(error => {
console.error('Error:', error.message);
})
.finally(() => {
console.log('Operation completed (success or failure)');
});

console.log('Continuing execution while fetch happens in background');
Async/Await
Async/await (introduced in ES2017) provides a cleaner syntax for working with promises, making asynchronous code look and behave more like synchronous code.

Example: Async/Await
// Function that returns a promise
const fetchUser = (id) => {
return new Promise((resolve, reject) => {
setTimeout(() => {
if (id > 0) {
resolve({ id, name: `User ${id}` });
} else {
reject(new Error('Invalid user ID'));
}
}, 1000);
});
};

// Using async/await
async function getUserData(id) {
try {
console.log('Fetching user...');
const user = await fetchUser(id); // Waits for the promise to resolve
console.log('User data:', user);

    // You can use the result directly
    return `${user.name}'s profile`;

} catch (error) {
// Handle errors with try/catch
console.error('Error fetching user:', error.message);
return 'Guest profile';
}
}

// Async functions always return promises
console.log('Starting...');
getUserData(1)
.then(result => console.log('Result:', result))
.catch(error => console.error('Unexpected error:', error));
console.log('This runs before getUserData completes');
Common Async/Await Mistakes:

Forgetting that async functions always return promises
Not handling errors with try/catch
Running operations sequentially when they could run in parallel
Using await outside of an async function
Awaiting non-promise values (unnecessary but harmless)
ES Modules
ES Modules (ESM) provide a standardized way to organize and share code. They were introduced in ES2015 and are now supported natively in Node.js.

Key benefits of ES Modules:

Static module structure (imports are analyzed at compile time)
Default and named exports/imports
Better dependency management
Tree-shaking (eliminating unused code)
Example: ES Modules
File: math.js

// Named exports
export const PI = 3.14159;

export function add(a, b) {
return a + b;
}

export function multiply(a, b) {
return a \* b;
}

// Default export
export default class Calculator {
add(a, b) {
return a + b;
}

subtract(a, b) {
return a - b;
}
}
File: app.js

// Import default export
import Calculator from './math.js';

// Import named exports
import { PI, add, multiply } from './math.js';

// Import with alias
import { add as mathAdd } from './math.js';

// Import all exports as a namespace
import \* as MathUtils from './math.js';

const calc = new Calculator();
console.log(calc.subtract(10, 5)); // 5

console.log(add(2, 3)); // 5
console.log(mathAdd(4, 5)); // 9
console.log(MathUtils.PI); // 3.14159
console.log(MathUtils.multiply(2, 3)); // 6
To use ES Modules in Node.js, you can either:

Use the .mjs extension for module files
Add "type": "module" to your package.json
Use the --experimental-modules flag (older Node.js versions)
The CommonJS module system (require() and module.exports) is still widely used in Node.js. ES Modules and CommonJS can coexist in the same project, but they have different semantics.

Enhanced Object Literals
ES6+ introduced several improvements to object literals that make object creation more concise and expressive.

Example: Enhanced Object Literals
// Property shorthand
const name = 'Alice';
const age = 30;

// Instead of {name: name, age: age}
const person = { name, age };
console.log(person);

// Method shorthand
const calculator = {
// Instead of add: function(a, b) { ... }
add(a, b) {
return a + b;
},
subtract(a, b) {
return a - b;
}
};
console.log(calculator.add(5, 3));
Optional Chaining and Nullish Coalescing
Modern JavaScript introduces syntax to safely access nested properties and provide fallback values.

Optional Chaining (?.)
Optional chaining lets you access deeply nested object properties without worrying about null or undefined values in the chain.

Example: Optional Chaining
function getUserCity(user) {
return user?.address?.city;
}

const user1 = {
name: 'Alice',
address: { city: 'New York', country: 'USA' }
};

const user2 = {
name: 'Bob'
};

const user3 = null;

console.log(getUserCity(user1)); // 'New York'
console.log(getUserCity(user2)); // undefined
console.log(getUserCity(user3)); // undefined
Nullish Coalescing (??)
The nullish coalescing operator (??) provides a default value when a value is null or undefined (but not for other falsy values like 0 or "").

Example: Nullish Coalescing
function calculatePrice(price, tax) {
// Only uses default if tax is null or undefined
return price + (tax ?? 0.1) \* price;
}

console.log(calculatePrice(100, 0)); // 100 (correct! tax of 0 was used)
console.log(calculatePrice(100, null)); // 110 (using default)
Modern Asynchronous Patterns
Modern JavaScript provides powerful patterns for handling asynchronous operations. Understanding when to use sequential vs parallel execution can significantly improve your application's performance.

Sequential vs Parallel Execution:

Sequential: Operations run one after another, each waiting for the previous to complete
Parallel: Operations run simultaneously, which is more efficient when operations are independent
Example: Sequential Execution
// Helper function to simulate an API call
function fetchData(id) {
return new Promise(resolve => {
setTimeout(() => resolve(`Data for ID ${id}`), 1000);
});
}

// Sequential execution (~3 seconds total)
async function fetchSequential() {
console.time('sequential');
const data1 = await fetchData(1);
const data2 = await fetchData(2);
const data3 = await fetchData(3);
console.timeEnd('sequential');
return [data1, data2, data3];
}

// Run the sequential example
fetchSequential().then(results => {
console.log('Sequential results:', results);
});
Example: Parallel Execution
// Parallel execution (~1 second total)
async function fetchParallel() {
console.time('parallel');
const results = await Promise.all([
fetchData(1),
fetchData(2),
fetchData(3)
]);
console.timeEnd('parallel');
return results;
}

// Run the parallel example
fetchParallel().then(results => {
console.log('Parallel results:', results);
});
When to Use Each Pattern:

Use sequential when operations depend on previous results
Use parallel when operations are independent and can run simultaneously
Be mindful of rate limits when making parallel API calls
Consider using libraries like p-queue for controlled concurrency
Summary
ES6+ introduced numerous features that have transformed JavaScript programming, making code more readable, maintainable, and robust:

let/const: Block-scoped variables with clearer semantics
Arrow functions: Concise syntax and lexical this binding
Template literals: String interpolation and multi-line strings
Destructuring: Extract values from objects and arrays easily
Spread/rest operators: Work with collections more efficiently
Default parameters: Simpler function definitions
Classes: Cleaner syntax for object-oriented programming
Promises and async/await: Better asynchronous code management
ES Modules: Standardized code organization
Enhanced object literals: More concise object syntax
Optional chaining & nullish coalescing: Safer property access and defaults
These modern features are fully supported in current Node.js versions, allowing you to write cleaner, more expressive code while avoiding common JavaScript pitfalls.

Exercise
?
Drag and drop the correct ES6 keyword.
The keyword creates variables that cannot be reassigned.

Node.js Process Management
What is Process Management?
Process management in Node.js is about controlling your application's lifecycle.

It includes:

Starting and stopping applications
Restarting after crashes
Monitoring performance
Handling system signals
Managing environment variables
Accessing Process Information
The process object gives you details about and control over the current Node.js process.

Here are some useful properties:

// Process identification
console.log('Process ID (PID):', process.pid);

// Platform information
console.log('Platform:', process.platform);
console.log('Node.js version:', process.version);

// Memory usage (in bytes)
console.log('Memory usage:', process.memoryUsage());

// Command line arguments
console.log('Arguments:', process.argv);
Exiting a Process
You can control when your Node.js program stops using these methods:

1. Normal Exit
   // Exit with success (status code 0)
   process.exit();

// Or explicitly
process.exit(0); 2. Exit with Error
// Exit with error (status code 1)
process.exit(1); 3. Before Exit Event
// Run cleanup before exiting
process.on('beforeExit', (code) => {
console.log('About to exit with code:', code);
});

REMOVE ADS

Handling Process Events
Node.js processes can respond to system signals and events.

Here are the most common ones:

1. Handling Ctrl+C (SIGINT)
   // Handle Ctrl+C
   process.on('SIGINT', () => {
   console.log('\nGot SIGINT. Press Control-D to exit.');
   // Perform cleanup if needed
   process.exit(0);
2. Handling Process Termination (SIGTERM)
   process.on('SIGTERM', () => {
   console.log('Received SIGTERM. Cleaning up...');
   // Perform cleanup if needed
   process.exit(0);
   });
3. Handling Process Termination (SIGTERM)
   process.on('SIGTERM', () => {
   console.log('Received SIGTERM. Cleaning up...');
   server.close(() => {
   console.log('Server closed');
   process.exit(0);
   });
   });
4. Uncaught Exceptions
   process.on('uncaughtException', (err) => {
   console.error('Uncaught Exception:', err);
   // Perform cleanup if needed
   process.exit(1); // Exit with error
   });

REMOVE ADS

Process Managers
For production environments, use a process manager to keep your application running smoothly.

PM2 is the most popular choice:

1. Install PM2 Globally
   npm install -g pm2
2. Basic PM2 Commands

# Start an application

pm2 start app.js

# List all running applications

pm2 list

# Monitor resources

pm2 monit

# View application logs

pm2 logs

# Stop an application

pm2 stop app_name

# Restart an application

pm2 restart app_name

# Delete an application from PM2

pm2 delete app_name 3. PM2 Configuration
Create an ecosystem file for advanced configuration:

// ecosystem.config.js
module.exports = {
apps: [{
name: 'my-app',
script: 'app.js',
instances: 'max',
autorestart: true,
watch: false,
max_memory_restart: '1G',
env: {
NODE_ENV: 'development',
},
env_production: {
NODE_ENV: 'production',
}
}]
};
PM2 provides many other features like load balancing, monitoring, and log management.

Environment Variables
Environment variables are key-value pairs that configure your application's behavior in different environments.

Accessing Environment Variables
// Get a specific environment variable
const apiKey = process.env.API_KEY;

// Set a default value if not defined
const port = process.env.PORT || 3000;

// Check if running in production
const isProduction = process.env.NODE_ENV === 'production';

// List all environment variables
console.log('Environment variables:', process.env);
Loading Environment Variables from .env File

# Install dotenv package

npm install dotenv

// Load environment variables from .env file
require('dotenv').config();

// Now you can access variables from .env
console.log('Database URL:', process.env.DATABASE_URL);
Best Practices for Environment Variables:

Never commit sensitive data to version control
Use .env for local development
Set environment variables in production through your hosting platform
Document all required environment variables in your README
Child Processes
Node.js can run system commands and other scripts using the child_process module.

1. Execute a Simple Command
   const { exec } = require('child_process');

exec('ls -la', (error, stdout, stderr) => {
if (error) {
console.error(`Error: ${error.message}`);
return;
}
if (stderr) {
console.error(`stderr: ${stderr}`);
return;
}
console.log(`Output: ${stdout}`);
}); 2. Using spawn for Large Output
const { spawn } = require('child_process');

// Better for large data output
const child = spawn('find', ['/', '-type', 'f']);
child.stdout.on('data', (data) => {
console.log(`Found file: ${data}`);
});
child.stderr.on('data', (data) => {
console.error(`Error: ${data}`);
});
child.on('close', (code) => {
console.log(`Child process exited with code ${code}`);
});
Process Monitoring and Performance

1. Memory Usage
   // Get memory usage in MB
   function getMemoryUsage() {
   const used = process.memoryUsage();
   return {
   rss: `${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`,
   heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,
   heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`,
   external: `${Math.round(used.external / 1024 / 1024 * 100) / 100} MB`
   };
   }

// Monitor memory usage every 5 seconds
setInterval(() => {
console.log('Memory usage:', getMemoryUsage());
}, 5000); 2. CPU Usage
const startUsage = process.cpuUsage();

// Do some CPU-intensive work
for (let i = 0; i < 1000000000; i++) {}

const endUsage = process.cpuUsage(startUsage);
console.log('CPU usage (user):', endUsage.user / 1000, 'ms');
console.log('CPU usage (system):', endUsage.system / 1000, 'ms');
Key Takeaways
Process Object: Access system and process information
Process Control: Start, stop, and manage application lifecycle
Environment Variables: Configure app behavior across different environments
Child Processes: Run system commands and other scripts
Error Handling: Handle uncaught exceptions and rejections
Signals: Respond to system signals like SIGINT and SIGTERM
PM2: Essential for production process management
Performance Monitoring: Track memory and CPU usage
Effective process management is crucial for building reliable and maintainable Node.js applications, especially in production environments.

Exercise
?
Drag and drop the correct code to stop Node.js with a success message.
process.();

Node.js Process Management
What is Process Management?
Process management in Node.js is about controlling your application's lifecycle.

It includes:

Starting and stopping applications
Restarting after crashes
Monitoring performance
Handling system signals
Managing environment variables
Accessing Process Information
The process object gives you details about and control over the current Node.js process.

Here are some useful properties:

// Process identification
console.log('Process ID (PID):', process.pid);

// Platform information
console.log('Platform:', process.platform);
console.log('Node.js version:', process.version);

// Memory usage (in bytes)
console.log('Memory usage:', process.memoryUsage());

// Command line arguments
console.log('Arguments:', process.argv);
Exiting a Process
You can control when your Node.js program stops using these methods:

1. Normal Exit
   // Exit with success (status code 0)
   process.exit();

// Or explicitly
process.exit(0); 2. Exit with Error
// Exit with error (status code 1)
process.exit(1); 3. Before Exit Event
// Run cleanup before exiting
process.on('beforeExit', (code) => {
console.log('About to exit with code:', code);
});
REMOVE ADS

Handling Process Events
Node.js processes can respond to system signals and events.

Here are the most common ones:

1. Handling Ctrl+C (SIGINT)
   // Handle Ctrl+C
   process.on('SIGINT', () => {
   console.log('\nGot SIGINT. Press Control-D to exit.');
   // Perform cleanup if needed
   process.exit(0);
2. Handling Process Termination (SIGTERM)
   process.on('SIGTERM', () => {
   console.log('Received SIGTERM. Cleaning up...');
   // Perform cleanup if needed
   process.exit(0);
   });
3. Handling Process Termination (SIGTERM)
   process.on('SIGTERM', () => {
   console.log('Received SIGTERM. Cleaning up...');
   server.close(() => {
   console.log('Server closed');
   process.exit(0);
   });
   });
4. Uncaught Exceptions
   process.on('uncaughtException', (err) => {
   console.error('Uncaught Exception:', err);
   // Perform cleanup if needed
   process.exit(1); // Exit with error
   });
   REMOVE ADS

Process Managers
For production environments, use a process manager to keep your application running smoothly.

PM2 is the most popular choice:

1. Install PM2 Globally
   npm install -g pm2
2. Basic PM2 Commands

# Start an application

pm2 start app.js

# List all running applications

pm2 list

# Monitor resources

pm2 monit

# View application logs

pm2 logs

# Stop an application

pm2 stop app_name

# Restart an application

pm2 restart app_name

# Delete an application from PM2

pm2 delete app_name 3. PM2 Configuration
Create an ecosystem file for advanced configuration:

// ecosystem.config.js
module.exports = {
apps: [{
name: 'my-app',
script: 'app.js',
instances: 'max',
autorestart: true,
watch: false,
max_memory_restart: '1G',
env: {
NODE_ENV: 'development',
},
env_production: {
NODE_ENV: 'production',
}
}]
};
PM2 provides many other features like load balancing, monitoring, and log management.

Environment Variables
Environment variables are key-value pairs that configure your application's behavior in different environments.

Accessing Environment Variables
// Get a specific environment variable
const apiKey = process.env.API_KEY;

// Set a default value if not defined
const port = process.env.PORT || 3000;

// Check if running in production
const isProduction = process.env.NODE_ENV === 'production';

// List all environment variables
console.log('Environment variables:', process.env);
Loading Environment Variables from .env File

# Install dotenv package

npm install dotenv

// Load environment variables from .env file
require('dotenv').config();

// Now you can access variables from .env
console.log('Database URL:', process.env.DATABASE_URL);
Best Practices for Environment Variables:

Never commit sensitive data to version control
Use .env for local development
Set environment variables in production through your hosting platform
Document all required environment variables in your README
Child Processes
Node.js can run system commands and other scripts using the child_process module.

1. Execute a Simple Command
   const { exec } = require('child_process');

exec('ls -la', (error, stdout, stderr) => {
if (error) {
console.error(`Error: ${error.message}`);
return;
}
if (stderr) {
console.error(`stderr: ${stderr}`);
return;
}
console.log(`Output: ${stdout}`);
}); 2. Using spawn for Large Output
const { spawn } = require('child_process');

// Better for large data output
const child = spawn('find', ['/', '-type', 'f']);
child.stdout.on('data', (data) => {
console.log(`Found file: ${data}`);
});
child.stderr.on('data', (data) => {
console.error(`Error: ${data}`);
});
child.on('close', (code) => {
console.log(`Child process exited with code ${code}`);
});
Process Monitoring and Performance

1. Memory Usage
   // Get memory usage in MB
   function getMemoryUsage() {
   const used = process.memoryUsage();
   return {
   rss: `${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`,
   heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,
   heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`,
   external: `${Math.round(used.external / 1024 / 1024 * 100) / 100} MB`
   };
   }

// Monitor memory usage every 5 seconds
setInterval(() => {
console.log('Memory usage:', getMemoryUsage());
}, 5000); 2. CPU Usage
const startUsage = process.cpuUsage();

// Do some CPU-intensive work
for (let i = 0; i < 1000000000; i++) {}

const endUsage = process.cpuUsage(startUsage);
console.log('CPU usage (user):', endUsage.user / 1000, 'ms');
console.log('CPU usage (system):', endUsage.system / 1000, 'ms');
Key Takeaways
Process Object: Access system and process information
Process Control: Start, stop, and manage application lifecycle
Environment Variables: Configure app behavior across different environments
Child Processes: Run system commands and other scripts
Error Handling: Handle uncaught exceptions and rejections
Signals: Respond to system signals like SIGINT and SIGTERM
PM2: Essential for production process management
Performance Monitoring: Track memory and CPU usage
Effective process management is crucial for building reliable and maintainable Node.js applications, especially in production environments.

Exercise
?
Drag and drop the correct code to stop Node.js with a success message.
process.();

ode.js TypeScript
What is TypeScript?
TypeScript is a superset of JavaScript that adds optional static typing.

It helps you catch errors early and write safer, more maintainable code.

Take a look at our TypeScript tutorial for more details.

Using TypeScript with Node.js
To use TypeScript in Node.js projects, you need to install TypeScript and a type definition manager:

npm install -g typescript
npm install --save-dev @types/node
Write your code in .ts files and compile them to JavaScript with:

tsc yourfile.ts
Setting Up a TypeScript Project

1. Initialize a new Node.js project
   npm init -y
2. Install TypeScript and type definitions
   npm install --save-dev typescript @types/node
3. Initialize TypeScript configuration
   npx tsc --init
   TypeScript Basics
4. Basic Types
   // Primitive types
   let isDone: boolean = false;
   let count: number = 10;
   let name: string = 'TypeScript';

// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['Alice', 'Bob'];

// Tuples
let user: [string, number] = ['Alice', 25];

// Enums
enum Color {Red, Green, Blue}
let color: Color = Color.Green; 2. Interfaces and Types
// Interface interface User {
id: number;
name: string;
email?: string; // Optional property
}

// Type alias
type Point = {
x: number;
y: number;
};

// Using the interface
function printUser(user: User) {
console.log(`User: ${user.name}`);
}

REMOVE ADS

TypeScript with Node.js

1. Creating a Simple HTTP Server
   // server.ts
   import http from 'http';

const server = http.createServer((req, res) => {
res.statusCode = 200;
res.setHeader('Content-Type', 'text/plain');
res.end('Hello, TypeScript!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
}); 2. Using TypeScript with Express

# Install required packages

npm install express
npm install --save-dev @types/express

// app.ts
import express, { Request, Response } from 'express';
interface User {
id: number;
name: string;
}
const app = express();
app.use(express.json());
// In-memory database
let users: User[] = [];
// Get all users
app.get('/users', (req: Request, res: Response) => {
res.json(users);
});
// Add new user
app.post('/users', (req: Request, res: Response) => {
const user: User = req.body;
users.push(user);
res.status(201).json(user);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
TypeScript Configuration
tsconfig.json
{
"compilerOptions": {
"target": "es2018",
"module": "commonjs",
"outDir": "./dist",
"rootDir": "./src",
"strict": true,
"esModuleInterop": true,
"skipLibCheck": true,
"forceConsistentCasingInFileNames": true
},
"include": ["src/**/*"],
"exclude": ["node_modules"]
}
Key Compiler Options:

target: Specify ECMAScript target version
module: Specify module code generation
strict: Enable all strict type checking options
outDir: Redirect output structure to the directory
rootDir: Specify the root directory of input files
Why Use TypeScript with Node.js?
Benefits of TypeScript:

Type Safety: Catch errors at compile time rather than runtime
Better IDE Support: Superior autocompletion and code navigation
Self-Documenting Code: Types serve as documentation
Easier Refactoring: Safely rename variables and update code
Gradual Adoption: Add types incrementally to existing JavaScript code
When to Use TypeScript:

Large codebases with multiple developers
APIs where type safety is critical
Projects that will be maintained long-term
When working with complex data structures
Node.js Linting & Formatting
Code Quality
Consistent code quality and style is important for Node.js projects, especially in team environments.

It helps with:

Readability and maintainability of code
Early bug detection and prevention
Consistent coding style across the team
Automated code reviews
Better developer experience
Note: This guide covers both JavaScript and TypeScript tooling, as they share similar linting and formatting ecosystems.

ESLint: JavaScript/TypeScript Linting
ESLint is the most popular JavaScript/TypeScript linting tool that helps identify and report on patterns found in your code. It's highly configurable and supports:

Custom rules and configurations
TypeScript support through @typescript-eslint/parser
Plugin ecosystem for framework-specific rules
Automatic fixing of common issues
Installation
npm install --save-dev eslint
Comprehensive ESLint Configuration
Here's a more complete .eslintrc.json configuration for a Node.js project with TypeScript support:

{
"env": {
"node": true,
"es2021": true,
"browser": true
},
"extends": [
"eslint:recommended",
"plugin:@typescript-eslint/recommended"
],
"parser": "@typescript-eslint/parser",
"parserOptions": {
"ecmaVersion": 12,
"sourceType": "module"
},
"plugins": ["@typescript-eslint"],
"rules": {
"semi": ["error", "always"],
"quotes": ["error", "single"],
"indent": ["error", 2],
"no-console": "warn",
"no-unused-vars": "warn"
}
}
Advanced ESLint Usage
Beyond basic linting, ESLint offers powerful features for maintaining code quality:

Common Commands

# Lint all JavaScript/TypeScript files

npx eslint .

# Fix auto-fixable issues

npx eslint --fix .

# Lint specific file

npx eslint src/index.js

REMOVE ADS

Prettier: Code Formatter
Prettier is an opinionated code formatter that enforces a consistent style by parsing your code and re-printing it with its own rules. It supports:

JavaScript, TypeScript, JSX, CSS, SCSS, JSON, and more
Opinionated defaults with minimal configuration
Integration with ESLint and other tools
Support for editor integration
Tip: Use Prettier for formatting and ESLint for catching potential errors and enforcing code patterns.

Installation
npm install --save-dev --save-exact prettier
Comprehensive Prettier Configuration
Here's a well-documented .prettierrc configuration with common options:

{
"semi": true,
"singleQuote": true,
"tabWidth": 2,
"trailingComma": "es5",
"printWidth": 100,
"bracketSpacing": true,
"arrowParens": "avoid"
}
Advanced Prettier Usage
Prettier can be customized and integrated into your workflow in various ways:

Common Commands

# Format all files

npx prettier --write .

# Check formatting without making changes

npx prettier --check .

# Format specific file

npx prettier --write src/index.js
Seamless ESLint + Prettier Integration
To avoid conflicts between ESLint and Prettier, set up proper integration:

Important: Always install and configure these packages to prevent rule conflicts:

npm install --save-dev eslint-config-prettier eslint-plugin-prettier
Then update your ESLint config:

{
"extends": [
"eslint:recommended",
"plugin:@typescript-eslint/recommended",
"plugin:prettier/recommended"
]
}
Advanced Editor Integration
Pro Tip: Set up your editor to automatically fix and format code on save for maximum productivity.

VS Code: Ultimate Setup
For the best development experience in VS Code, follow these steps:

Install the following extensions:
ESLint
Prettier - Code formatter
EditorConfig for VS Code
Error Lens (for inline error highlighting)
Configure your VS Code settings.json:
Install the ESLint and Prettier extensions
Add these settings to your VS Code settings.json:
{
"editor.formatOnSave": true,
"editor.codeActionsOnSave": {
"source.fixAll.eslint": true
},
"eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
"prettier.requireConfig": true,
"editor.defaultFormatter": "esbenp.prettier-vscode"
}
