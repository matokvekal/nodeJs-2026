import "dotenv/config";          // must be first - loads .env
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import studentsRouter from "./routes/students.js";
import employeesRouter from "./routes/employees.js";
import { connectDB } from "./db/mongo.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGS_DIR = path.join(__dirname, "logs");
fs.mkdirSync(LOGS_DIR, { recursive: true });

function writeLog(line) {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const file = path.join(LOGS_DIR, `${date}.log`);
  fs.appendFileSync(file, line + "\n");
}

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────

// Log every incoming request to console and logs/YYYY-MM-DD.log
app.use((req, res, next) => {
  const line = `[${new Date().toISOString()}] ${req.method} ${req.url}`;
  console.log(line);
  writeLog(line);
  next();
});

app.use(cors());                  // allow requests from the React client
app.use(express.json());          // parse JSON bodies  (replaces body-parser)
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve uploaded files

// ── Routes ──────────────────────────────────────────────────────────────────

app.use("/students", studentsRouter);
app.use("/employees", employeesRouter);

// Simple home page listing available endpoints
app.get("/", (req, res) => {
  res.json({
    message: "School API",
    endpoints: {
      students: {
        "GET    /students":              "get all students",
        "GET    /students/:id":          "get one student (by _id or zehut)",
        "POST   /students":              "add student  { name, zehut, phone, degree, year }",
        "PUT    /students/:id":          "update student",
        "DELETE /students/:id":          "delete student",
        "GET    /students/:id/document": "get student document",
        "POST   /students/:id/document": "attach document to student",
      },
      employees: {
        "GET    /employees":      "get all employees",
        "GET    /employees/:id":  "get one employee (by _id or employeeId)",
        "POST   /employees":      "add employee  { name, employeeId, role, department, salary, email }",
        "PUT    /employees/:id":  "update employee",
        "DELETE /employees/:id":  "delete employee",
      },
    },
  });
});

// ── Start ────────────────────────────────────────────────────────────────────

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
