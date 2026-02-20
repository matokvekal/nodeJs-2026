// Transform streams modify data as it flows through
import { Transform, pipeline } from "node:stream";
import { createReadStream, createWriteStream } from "node:fs";

// Example 1: Filter JSON lines
class JsonFilterTransform extends Transform {
  constructor(filterFn, options) {
    super(options);
    this.filterFn = filterFn;
    this.buffer = "";
  }

  _transform(chunk, encoding, callback) {
    // Accumulate chunks and split by newlines
    this.buffer += chunk.toString();
    const lines = this.buffer.split("\n");

    // Keep the last incomplete line
    this.buffer = lines.pop();

    // Process complete lines
    for (const line of lines) {
      if (!line.trim()) continue;

      try {
        const json = JSON.parse(line);

        // Apply filter function
        if (this.filterFn(json)) {
          this.push(JSON.stringify(json) + "\n");
        }
      } catch (error) {
        // Skip invalid JSON lines
      }
    }

    callback();
  }

  _flush(callback) {
    // Process remaining buffer
    if (this.buffer.trim()) {
      try {
        const json = JSON.parse(this.buffer);
        if (this.filterFn(json)) {
          this.push(JSON.stringify(json) + "\n");
        }
      } catch (error) {
        // Skip invalid JSON
      }
    }
    callback();
  }
}

// Usage: Filter JSON logs by level
async function filterLogs(inputFile, outputFile) {
  const filter = new JsonFilterTransform(
  );

  await pipeline(
    createReadStream(inputFile, "utf8"),
    filter,
    createWriteStream(outputFile, "utf8")
  );

  console.log("Filtered logs written to:", outputFile);
}

// Example 2: Count lines transform
class LineCounterTransform extends Transform {
  constructor(options) {
    super(options);
    this.lineCount = 0;
    this.buffer = "";
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split("\n");
    this.buffer = lines.pop();

    this.lineCount += lines.length;

    // Pass through unchanged
    callback(null, chunk);
  }

  _flush(callback) {
    if (this.buffer.length > 0) {
      this.lineCount++;
    }

    console.log(`Total lines processed: ${this.lineCount}`);
    callback();
  }
}

// Usage
async function countLines(filepath) {
  const counter = new LineCounterTransform();

  await pipeline(
    createReadStream(filepath, "utf8"),
    counter,
    // Discard output, we just want the count
    new Transform({
      transform(chunk, encoding, callback) {
        callback(); // Don't push anything
      }
    })
  );
}

// filterLogs('logs.jsonl', 'errors.jsonl');
countLines("./package.json");