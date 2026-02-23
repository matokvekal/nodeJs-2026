// src/schemas/task.schema.js
import { z } from "zod";

// Schema for creating a task
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),

  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),

  priority: z.enum(["low", "medium", "high"]).default("medium"),

  dueDate: z.string().datetime({ message: "Invalid ISO 8601 date" }).optional()
});

// Schema for updating a task (all fields optional)
export const updateTaskSchema = createTaskSchema.partial();

// Schema for validating URL params
export const taskIdSchema = z.object({
  id: z.string().uuid("Invalid task ID format")
});

// Schema for query params (filtering/sorting)
export const taskQuerySchema = z.object({
  priority: z.enum(["low", "medium", "high"]).optional(),
  sort: z.enum(["createdAt", "-createdAt", "title", "-title"]).optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  page: z.coerce.number().int().positive().default(1)
});

// Advanced: Multiple validation targets
export function validateRequest(schemas) {
  return (req, res, next) => {
    const errors = {};

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.body = result.error.flatten().fieldErrors;
      } else {
        req.validatedData = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.params = result.error.flatten().fieldErrors;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.query = result.error.flatten().fieldErrors;
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        type: "/errors/validation",
        title: "Validation Failed",
        status: 422,
        errors
      });
    }

    next();
  };
}