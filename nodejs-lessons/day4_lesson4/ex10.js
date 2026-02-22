// tests/complete.test.js
import { test, describe, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { app } from "../app.js";
import { sequelize } from "../db/sequelize.js";
import { User } from "../models/User.model.js";

let server;
let baseURL;

describe("Complete Application Tests", () => {
  // Setup
  before(async () => {
    await sequelize.sync({ force: true });
    server = app.listen(0);
    const address = server.address();
    baseURL = `http://localhost:${address.port}`;
  });

  // Teardown
  after(async () => {
    await server.close();
    await sequelize.close();
  });

  // Clean before each test
  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true });
  });

  // Tests
  describe("User Registration", () => {
    test("creates user with valid data", async () => {
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "John Doe",
          email: "john@example.com",
          password: "Password123!"
        })
      });

      assert.equal(response.status, 201);
      const data = await response.json();
      assert.ok(data.data.user.id);
    });

    test("rejects invalid email", async () => {
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test",
          email: "invalid-email",
          password: "pass"
        })
      });

      assert.equal(response.status, 422);
    });
  });

  describe("Authentication", () => {
    let authToken;

    beforeEach(async () => {
      // Register user
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Auth Test",
          email: "auth@example.com",
          password: "password123"
        })
      });

      const data = await response.json();
      authToken = data.data.accessToken;
    });

    test("accesses protected route with token", async () => {
      const response = await fetch(`${baseURL}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      assert.equal(response.status, 200);
    });

    test("rejects access without token", async () => {
      const response = await fetch(`${baseURL}/auth/me`);

      assert.equal(response.status, 401);
    });
  });
});