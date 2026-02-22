// Comparing memory usage: Buffer vs Stream approach
import { readFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Transform } from "node:stream";

// Approach 1: Load entire file into memory (Buffer)
async function processWithBuffer(filepath) {
  const startTime = Date.now();
  const startMem = process.memoryUsage().heapUsed;

  try {
    // Loads ENTIRE file into memory
    const content = await readFile(filepath, "utf8");

    // Process entire content at once
    const lines = content.split("\n").length;

    const endTime = Date.now();
    const endMem = process.memoryUsage().heapUsed;

    console.log("Lines:", lines);
    console.log("Time:", endTime - startTime, "ms");
    console.log(
      "Memory increase:",
      ((endMem - startMem) / 1024 / 1024).toFixed(2),
      "MB"
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Approach 2: Process file in chunks (Stream)
async function processWithStream(filepath) {
  const startTime = Date.now();
  const startMem = process.memoryUsage().heapUsed;

  let lineCount = 0;
  let buffer = "";

  // Transform stream to count lines
  const lineCounter = new Transform({
    transform(chunk, encoding, callback) {
      buffer += chunk.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop(); // Keep incomplete line
      lineCount += lines.length;
      callback();
    },

    flush(callback) {
      if (buffer.length > 0) lineCount++;
      callback();
    }
  });

  try {
    await pipeline(createReadStream(filepath, "utf8"), lineCounter);

    const endTime = Date.now();
    const endMem = process.memoryUsage().heapUsed;

    console.log("Lines:", lineCount);
    console.log("Time:", endTime - startTime, "ms");
    console.log(
      "Memory increase:",
      ((endMem - startMem) / 1024 / 1024).toFixed(2),
      "MB"
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Compare both approaches
async function compare(filepath) {
  await processWithBuffer(filepath);
  await processWithStream(filepath);

  console.log("Small files (<10MB): Buffer approach is fine");
  console.log("Large files (>10MB): Stream approach is better");
  console.log("Upload/Download: Always use streams");
  console.log("Network responses: Use streams for efficiency");
}

compare("./package.json");