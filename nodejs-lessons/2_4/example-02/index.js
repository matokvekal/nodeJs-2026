// src/utils/AppError.js
export default class AppError extends Error {
  constructor(message, statusCode = 500, code = "internal_error") {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Expected errors

    Error.captureStackTrace(this, this.constructor);
  }

  // Factory methods for common errors
  static notFound(resource = "Resource") {
    return new AppError(`${resource} not found`, 404, "not_found");
  }

  static badRequest(message) {
    return new AppError(message, 400, "bad_request");
  }

  static unauthorized(message = "Authentication required") {
    return new AppError(message, 401, "unauthorized");
  }

  static forbidden(message = "Insufficient permissions") {
    return new AppError(message, 403, "forbidden");
  }

  static conflict(message) {
    return new AppError(message, 409, "conflict");
  }
}

// Usage:
// throw AppError.notFound('Task');
// throw AppError.badRequest('Invalid priority value');