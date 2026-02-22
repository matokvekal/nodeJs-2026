import express from "express";
import {
  getStudents,
  getStudent,
  addStudent,
  deleteStudent,
  updateStudent,
} from "../controllers/reactstudents.js";

const router = express.Router();

router.get("/", getStudents);
router.get("/:id", getStudent);
router.post("/", addStudent);
router.delete("/:id", deleteStudent);
router.put("/:id", updateStudent);

export default router;
