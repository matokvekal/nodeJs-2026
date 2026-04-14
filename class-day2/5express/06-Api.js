// ══════════════════════════════════════════════════════════════
//  EXPRESS 06 — Students REST API
//  Full CRUD with in-memory DB
//  Run: npm run api  →  http://localhost:3005
// ══════════════════════════════════════════════════════════════

import express from 'express';

const app = express();
app.use(express.json());

// ══════════════════════════════════════════════════════════════
//  IN-MEMORY DATABASE  (simulates a real DB)
// ══════════════════════════════════════════════════════════════

let students = [
  { id: 1, name: 'Dana Cohen',   age: 22, grade: 'A' },
  { id: 2, name: 'Yossi Levi',   age: 24, grade: 'B' },
  { id: 3, name: 'Mia Shapiro',  age: 21, grade: 'A' },
];

let nextId = 4;   // auto-increment counter

// ══════════════════════════════════════════════════════════════
//  GET ALL STUDENTS
// ══════════════════════════════════════════════════════════════

// GET http://localhost:3005/students
app.get('/students', function(req, res) {
  res.json(students);
});

// ══════════════════════════════════════════════════════════════
//  GET ONE STUDENT — two ways to pass the ID:
//    1. URL param   →  GET http://localhost:3005/students/1
//    2. Query param →  GET http://localhost:3005/students?id=1
// ══════════════════════════════════════════════════════════════

// GET http://localhost:3005/students/1
app.get('/students/:id', function(req, res) {
  const id      = Number(req.params.id);
  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ error: `Student ${id} not found` });
  }

  res.json(student);
});

// GET http://localhost:3005/students?id=1
app.get('/students', function(req, res) {
  const id = Number(req.query.id);

  if (!id) {
    return res.json(students);   // no ?id= → return all
  }

  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ error: `Student ${id} not found` });
  }

  res.json(student);
});

// ══════════════════════════════════════════════════════════════
//  CREATE STUDENT
// ══════════════════════════════════════════════════════════════

// POST http://localhost:3005/students
// Body: { "name": "Avi Ben", "age": 23, "grade": "B" }
app.post('/students', function(req, res) {
  const { name, age, grade } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  const newStudent = {
    id:    nextId++,
    name,
    age:   age   ?? null,
    grade: grade ?? null,
  };

  students.push(newStudent);

  res.status(201).json(newStudent);
});

// ══════════════════════════════════════════════════════════════
//  UPDATE STUDENT (full replace)
// ══════════════════════════════════════════════════════════════

// PUT http://localhost:3005/students/1
// Body: { "name": "Dana Cohen", "age": 23, "grade": "A+" }
app.put('/students/:id', function(req, res) {
  const id    = Number(req.params.id);
  const index = students.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Student ${id} not found` });
  }

  const { name, age, grade } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  students[index] = { id, name, age: age ?? null, grade: grade ?? null };

  res.json(students[index]);
});

// ══════════════════════════════════════════════════════════════
//  PARTIAL UPDATE (only the fields you send)
// ══════════════════════════════════════════════════════════════

// PATCH http://localhost:3005/students/1
// Body: { "grade": "A+" }
app.patch('/students/:id', function(req, res) {
  const id    = Number(req.params.id);
  const index = students.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Student ${id} not found` });
  }

  students[index] = { ...students[index], ...req.body };

  res.json(students[index]);
});

// ══════════════════════════════════════════════════════════════
//  DELETE STUDENT
// ══════════════════════════════════════════════════════════════

// DELETE http://localhost:3005/students/1
app.delete('/students/:id', function(req, res) {
  const id    = Number(req.params.id);
  const index = students.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Student ${id} not found` });
  }

  const deleted = students.splice(index, 1)[0];

  res.json({ message: `Student ${id} deleted`, student: deleted });
});

// ══════════════════════════════════════════════════════════════
const PORT = process.env.PORT || 3005;

app.listen(PORT, function() {
  console.log(`Students API running at http://localhost:${PORT}`);
});
