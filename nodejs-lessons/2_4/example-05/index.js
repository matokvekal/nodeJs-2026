// src/services/tasks.service.js
import { randomUUID } from "node:crypto";
import AppError from "../utils/AppError.js";

// In-memory storage (replace with DB later)
const tasks = new Map();

// Get all tasks with optional filtering
export function getAllTasks(filters = {}) {
  let results = [...tasks.values()];

  // Filter by priority
  if (filters.priority) {
  }

  // Sort
  if (filters.sort) {
    const sortField = filters.sort.startsWith("-")
      ? filters.sort.substring(1)
      : filters.sort;
    const sortOrder = filters.sort.startsWith("-") ? -1 : 1;

    results.sort((a, b) => {
      if (a[sortField] < b[sortField]) return -1 * sortOrder;
      if (a[sortField] > b[sortField]) return 1 * sortOrder;
      return 0;
    });
  }

  return results;
}

// Create new task
export function createTask(data) {
  const task = {
    id: randomUUID(),
    ...data,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.set(task.id, task);
  return task;
}

// Get task by ID
export function findById(id) {
  const task = tasks.get(id);

  if (!task) {
    throw AppError.notFound("Task");
  }

  return task;
}

// Update task
export function updateTask(id, data) {
  const task = findById(id); // Throws if not found

  const updated = {
    ...task,
    ...data,
    id: task.id, // Prevent ID change
    createdAt: task.createdAt, // Preserve creation date
    updatedAt: new Date().toISOString()
  };

  tasks.set(id, updated);
  return updated;
}

// Delete task
export function deleteTask(id) {
  const task = findById(id); // Throws if not found
  tasks.delete(id);
  return task;
}

// Mark task as completed
export function completeTask(id) {
  const task = findById(id);

  if (task.completed) {
    throw AppError.badRequest("Task is already completed");
  }

  const updated = {
    ...task,
    completed: true,
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.set(id, updated);
  return updated;
}

// Get statistics
export function getStats() {
  const allTasks = [...tasks.values()];

  return {
    total: allTasks.length,
    completed: allTasks.filter((t) => t.completed).length,
    pending: allTasks.filter((t) => !t.completed).length,
    byPriority: {
    }
  };
}