// tests/debug.test.js
import { test } from "node:test";
import assert from "node:assert/strict";

test("debugging example", () => {
  const user = {
    id: 1,
    name: "John",
    email: "john@example.com"
  };

  // Add breakpoint here (or use 'debugger;')
  debugger;

  assert.equal(user.name, "John");
});