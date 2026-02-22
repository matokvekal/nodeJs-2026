// src/routes/tasks.routes.js
import { Router } from "express";
import {
  validate,
  validateParams,
  validateQuery
} from "../middleware/validate.js";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  taskQuerySchema
} from "../schemas/task.schema.js";
import * as controller from "../controllers/tasks.controller.js";

const router = Router();

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks
 *     parameters:
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/", validateQuery(taskQuerySchema), controller.getAll);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               priority: { type: string, enum: [low, medium, high] }
 *     responses:
 *       201:
 *         description: Task created
 */
router.post("/", validate(createTaskSchema), controller.create);

// Special route: Get stats (must be BEFORE /:id route!)
router.get("/stats", controller.stats);

router.get("/:id", validateParams(taskIdSchema), controller.getOne);

router.put(
  "/:id",
  validateParams(taskIdSchema),
  validate(updateTaskSchema),
  controller.update
);

router.delete("/:id", validateParams(taskIdSchema), controller.remove);

router.post("/:id/complete", validateParams(taskIdSchema), controller.complete);

export default router;