// swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tasks API",
      version: "1.0.0",
      description: "A simple REST API for managing tasks",
      contact: {
        name: "API Support",
        email: "support@example.com"
      }
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server"
      }
    ],
    components: {
      schemas: {
        Task: {
          type: "object",
          required: ["title"],
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string", maxLength: 100 },
            description: { type: "string", maxLength: 500 },
            priority: { type: "string", enum: ["low", "medium", "high"] },
            completed: { type: "boolean" },
            dueDate: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Error: {
          type: "object",
          properties: {
            type: { type: "string" },
            title: { type: "string" },
            status: { type: "number" },
            instance: { type: "string" }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.js"] // Path to route files with JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app) {
  // Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Tasks API Documentation"
    })
  );

  // JSON spec
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log("📚 Swagger docs available at http://localhost:3000/api-docs");
}