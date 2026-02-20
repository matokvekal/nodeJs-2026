// Implement RFC 7807 Problem Details for HTTP APIs
class ProblemDetails {
  constructor(type, title, status, detail = "", instance = "") {
    this.type = type;
    this.title = title;
    this.status = status;
    if (detail) this.detail = detail;
    if (instance) this.instance = instance;
  }

  toJSON() {
    return {
      type: this.type,
      title: this.title,
      status: this.status,
      ...(this.detail && { detail: this.detail }),
      ...(this.instance && { instance: this.instance })
    };
  }
}

// Usage in error middleware
function errorHandler(err, req, res, next) {
  let problem;

    problem = new ProblemDetails(
      "/errors/validation",
      "Validation Failed",
      422,
      err.message,
      req.originalUrl
    );
    problem.errors = err.details;
    problem = new ProblemDetails(
      "/errors/unauthorized",
      "Unauthorized",
      401,
      "Authentication required",
      req.originalUrl
    );
    problem = new ProblemDetails(
      "/errors/not-found",
      "Not Found",
      404,
      err.message,
      req.originalUrl
    );
  } else {
    problem = new ProblemDetails(
      "/errors/internal",
      "Internal Server Error",
      500,
        ? err.message
        : "An error occurred",
      req.originalUrl
    );
  }

  res.status(problem.status).type("application/problem+json").json(problem);
}