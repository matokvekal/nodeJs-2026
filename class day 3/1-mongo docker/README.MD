docker run -d --name mongodb -p 27017:27017 -v mongo_data:/data/db mongo:6.0


https://www.mongodb.com/try/download/compass

https://downloads.mongodb.com/compass/mongodb-compass-1.46.9-win32-x64.exe



  File: .env
  Action: Created — MONGO_URL + PORT
  ────────────────────────────────────────
  File: index.js
  Action: Rewritten — logger middleware, express.json(), /students + /employees routers, startup via connectDB()
  ────────────────────────────────────────
  File: db/mongo.js
  Action: Rewritten — uses process.env.MONGO_URL from dotenv
  ────────────────────────────────────────
  File: db/models/Student.js
  Action: New clean model (name, zehut, phone, degree, year, document)
  ────────────────────────────────────────
  File: db/models/Employee.js
  Action: New model (name, employeeId, role, department, salary, email)
  ────────────────────────────────────────
  File: controllers/students.js
  Action: Full real MongoDB CRUD + getDocument/addDocument
  ────────────────────────────────────────
  File: controllers/employees.js
  Action: Full real MongoDB CRUD (new file)
  ────────────────────────────────────────
  File: routes/students.js
  Action: CRUD routes + /:id/document sub-routes
  ────────────────────────────────────────
  File: routes/employees.js
  Action: CRUD routes (new file)
  ────────────────────────────────────────
  File: client/src/components/Students.jsx
  Action: Working React client — fetch all, add, delete
  ────────────────────────────────────────
  File: client/src/components/Menu.jsx
  Action: Cleaned up — only Home + Students
  ────────────────────────────────────────
  File: client/vite.config.js
  Action: Added proxy for /students → localhost:5000
  ────────────────────────────────────────
  File: Removed
  Action: controllers/projects.js, controllers/students-work.js, db/models/projects.js, db/models/students.js, routes/projects.js

  To run:
  1. Start MongoDB: docker run -d --name mongodb -p 27017:27017 -v mongo_data:/data/db mongo:6.0
  2. Server: npm run dev (port 5000)
  3. Client: cd client && npm install && npm run dev (port 5173)

  Postman examples for employees:
  - POST /employees body: { "name":"Dan", "employeeId":"E01", "role":"Developer", "department":"IT", "salary":9000 }
  - GET /employees, GET /employees/E01, PUT /employees/E01, DELETE /employees/E01