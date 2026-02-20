// Streams process data in chunks - memory efficient for large files
import { createReadStream } from "node:fs";

// Example 1: Reading file with streams (memory efficient)
async function readFileStream(filepath) {
  // Create readable stream (default chunk size: 64KB)
  const stream = createReadStream(filepath, {
    encoding: "utf8",
    highWaterMark: 16 * 1024 // 16KB chunks
  });

  let chunkCount = 0;
  let totalSize = 0;

  // Event: 'data' - receives each chunk
  stream.on("data", (chunk) => {
    chunkCount++;
    totalSize += chunk.length;
    console.log(`Chunk ${chunkCount}: ${chunk.length} characters`);

    // Process chunk here (e.g., search for pattern, count lines, etc.)
  });

  // Event: 'end' - all chunks received
  stream.on("end", () => {
    console.log(`\nStream complete!`);
    console.log(`Total chunks: ${chunkCount}`);
    console.log(`Total size: ${totalSize} characters`);
  });

  // Event: 'error' - handle errors
  stream.on("error", (error) => {
    console.error("Stream error:", error.message);
  });
}

// Modern approach: for await...of (cleaner than events)
async function readFileStreamModern(filepath) {
  const stream = createReadStream(filepath, { encoding: "utf8" });

  let lineCount = 0;
  let buffer = "";

  try {
    // Iterate over chunks asynchronously
    for await (const chunk of stream) {
      buffer += chunk;

      // Count lines in this chunk
      const lines = buffer.split("\n");
      buffer = lines.pop(); // Keep incomplete line

      lineCount += lines.length;
    }

    // Don't forget last line
    if (buffer.length > 0) lineCount++;

    console.log(`\nTotal lines: ${lineCount}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

readFileStream("./package.json");
readFileStreamModern("./package.json");

// Benefits of streams:
// 1. Memory efficient - only 64KB in memory at once
// 2. Can process files larger than available RAM
// 3. Start processing before entire file is loaded