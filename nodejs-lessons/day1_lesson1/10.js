// Create a .env file with:
// PORT=4000
// NODE_ENV=development
// DATABASE_URL=mongodb://localhost:27017/mydb
// API_KEY=secret123

// Then run: node --env-file=.env ex10.js

console.log("Port:", process.env.PORT);
console.log("Environment:", process.env.NODE_ENV);
console.log("Database URL:", process.env.DATABASE_URL);
console.log("API Key:", process.env.API_KEY ? "LOADED (hidden)" : "NOT LOADED");

// No need for dotenv package anymore!
// Node.js loads .env variables natively

// Simulate server starting
const port = process.env.PORT || 3000;
console.log(`\nServer would start on port ${port}`);

// Best practice: Never commit .env to Git
// Create .env.example instead:
/*
PORT=3000
NODE_ENV=development
DATABASE_URL=your_database_url
API_KEY=your_api_key
*/
