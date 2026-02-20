// tests/assertions.test.js
import { test } from "node:test";
import assert from "node:assert/strict";

  assert.equal(2 + 2, 4);
  assert.equal("hello", "hello");
});

test("assert.notEqual", () => {
  assert.notEqual(5, 10);
  assert.notEqual("foo", "bar");
});

test("assert.deepEqual - deep object comparison", () => {
  assert.deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
  assert.deepEqual([1, 2, 3], [1, 2, 3]);
});

test("assert.ok - truthy value", () => {
  assert.ok(true);
  assert.ok(1);
  assert.ok("string");
  assert.ok([]);
  assert.ok({});
});

test("assert.match - regex matching", () => {
  assert.match("hello world", /world/);
  assert.match("test@example.com", /^[\w.-]+@[\w.-]+\.\w+$/);
});

test("assert.throws - synchronous error", () => {
  function badFunction() {
    throw new Error("Something went wrong");
  }

  assert.throws(() => badFunction(), { message: "Something went wrong" });

  // With regex
  assert.throws(() => badFunction(), /went wrong/);
});

test("assert.rejects - async error", async () => {
  async function asyncBadFunction() {
    throw new Error("Async error");
  }

  await assert.rejects(() => asyncBadFunction(), { message: "Async error" });
});

test("assert.doesNotThrow", () => {
  assert.doesNotThrow(() => {
    const result = 2 + 2;
  });
});

test("assert.ifError - error is falsy", () => {
  assert.ifError(null); // Passes
  assert.ifError(undefined); // Passes
  // assert.ifError(new Error('fail'));  // Throws
});