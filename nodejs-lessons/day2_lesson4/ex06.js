// src/controllers/tasks.controller.js
import * as taskService from "../services/tasks.service.js";

// GET /api/v1/tasks
export async function getAll(req, res) {
  const { priority, sort } = req.query;

  const tasks = taskService.getAllTasks({ priority, sort });

  res.json({
    data: tasks,
    meta: {
      total: tasks.length,
      filters: { priority, sort }
    }
  });
}

// POST /api/v1/tasks
export async function create(req, res) {
  const task = taskService.createTask(req.validatedData);

  res.status(201).location(`/api/v1/tasks/${task.id}`).json({ data: task });
}

// GET /api/v1/tasks/:id
export async function getOne(req, res) {
  const task = taskService.findById(req.params.id);

  res.json({ data: task });
}

// PUT /api/v1/tasks/:id
export async function update(req, res) {
  const task = taskService.updateTask(req.params.id, req.validatedData);

  res.json({ data: task });
}

// DELETE /api/v1/tasks/:id
export async function remove(req, res) {
  taskService.deleteTask(req.params.id);

  res.status(204).send();
}

// POST /api/v1/tasks/:id/complete
export async function complete(req, res) {
  const task = taskService.completeTask(req.params.id);

  res.json({ data: task });
}

// GET /api/v1/tasks/stats
export async function stats(req, res) {
  const statistics = taskService.getStats();

  res.json({ data: statistics });
}