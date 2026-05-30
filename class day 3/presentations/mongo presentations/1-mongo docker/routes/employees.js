import express from "express";
import {
  getEmployees,
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employees.js";

const router = express.Router();

router.get("/", getEmployees);           // GET all employees
router.get("/:id", getEmployee);         // GET one employee
router.post("/", addEmployee);           // POST add employee
router.put("/:id", updateEmployee);      // PUT update employee
router.delete("/:id", deleteEmployee);   // DELETE remove employee

export default router;
