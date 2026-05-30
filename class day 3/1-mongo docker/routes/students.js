import express from "express";
import {
  getStudents,
  getStudent,
  addStudent,
  updateStudent,
  deleteStudent,
  getDocument,
  addDocument,
} from "../controllers/students.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// CRUD routes
router.get("/", getStudents);
router.get("/:id", getStudent);
router.post("/", addStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

// Document sub-resource — accepts a real file upload (field name: "file")
router.get("/:id/document", getDocument);
router.post("/:id/document", upload.single("file"), addDocument);

export default router;
