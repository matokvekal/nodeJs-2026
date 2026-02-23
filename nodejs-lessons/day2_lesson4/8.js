// src/middleware/error.js
import AppError from "../utils/AppError.js";

// Handle 404 - Route not found
export function notFoundHandler(req, res, next) {
  const error = new AppError(
    `Route ${req.method} ${req.originalUrl} not found`,
    404,
    "route_not_found"
  );

  next(error);
}

// Global error handler
export function errorHandler(err, req, res, next) {
  // Default values
  const statusCode = err.statusCode ?? 500;
  const isOperational = err.isOperational ?? false;
  const code = err.code ?? "internal_error";

  // Log error (in production, use proper logger)
  console.error("  Error:", {
    message: err.message,
    statusCode,
    code,
  });

  // Send error response (RFC 7807 format)
  res.status(statusCode).json({
    type: `/errors/${code}`,
    title: isOperational ? err.message : "Internal Server Error",
    status: statusCode,
    instance: req.originalUrl,
      stack: err.stack,
      details: err
    })
  });
}

// Async handler wrapper (Express 5 handles this automatically!)
// Keep for backward compatibility
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}