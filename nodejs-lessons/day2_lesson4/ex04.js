// src/middleware/validate.js

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Zod validation failed
      return res.status(422).json({
        type: "/errors/validation",
        title: "Validation Error",
        status: 422,
        errors: result.error.flatten().fieldErrors
        // Example errors format:
        // { title: ['Title is required'], priority: ['Invalid enum value'] }
      });
    }

    // Store validated data on request
    req.validatedData = result.data;
    next();
  };
}

// Validate URL params
export function validateParams(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        type: "/errors/bad-request",
        title: "Invalid Parameters",
        status: 400,
        errors: result.error.flatten().fieldErrors
      });
    }

    next();
  };
}

// Validate query parameters
export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        type: "/errors/bad-request",
        title: "Invalid Query Parameters",
        status: 400,
        errors: result.error.flatten().fieldErrors
      });
    }

    req.query = result.data; // Replace with validated/transformed data
    next();
  };
}