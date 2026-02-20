# Day 1 - Presentation 3: File System & Streams - Code Examples

---

## Example 1: Reading Files with fs/promises

```javascript
// Modern file reading with fs/promises - always async, Promise-based
import { readFile, writeFile, appendFile } from "node:fs/promises";

// Read entire file as string
async function readEntireFile() {
  try {
    // Read file with UTF-8 encoding
    const content = await readFile("./package.json", "utf8");

    const jsonData = JSON.parse(content);
    console.log("Package name:", jsonData.name);
    console.log("Version:", jsonData.version);
    console.log("File size:", content.length, "characters");
  } catch (error) {
    // Handle different error types
    if (error.code === "ENOENT") {
      console.error("File not found!");
    } else if (error.name === "SyntaxError") {
      console.error("Invalid JSON format");
    } else {
      console.error("Error reading file:", error.message);
    }
  }
}

// Read file as Buffer (binary data)
async function readBinaryFile() {
  try {
    // Without encoding, returns Buffer
    const buffer = await readFile("./package.json");

    console.log("Buffer length:", buffer.length, "bytes");
    console.log("First 50 bytes:", buffer.slice(0, 50).toString("utf8"));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

readEntireFile();
readBinaryFile();

// Important: readFile loads ENTIRE file into memory
// For large files (>100MB), use streams instead!
```

---

## Example 2: Writing and Appending Files

```javascript
// Write (replace) and append to files
import { writeFile, appendFile, unlink } from "node:fs/promises";

// Write file (creates new or replaces existing)
async function writeToFile() {
  try {
    const data = {
      timestamp: new Date().toISOString(),
      message: "File written successfully",
      count: 42
    };

    // Write JSON to file
    await writeFile("output.json", JSON.stringify(data, null, 2), "utf8");
    console.log("✅ File written successfully");
  } catch (error) {
    console.error("❌ Write error:", error.message);
  }
}

// Append to file (adds to end without replacing)
async function appendToFile() {
  try {
    const logEntry = `[${new Date().toISOString()}] User logged in\n`;

    // Append to log file
    await appendFile("app.log", logEntry, "utf8");
    console.log("✅ Log entry appended");
  } catch (error) {
    console.error("❌ Append error:", error.message);
  }
}

// Delete file
async function deleteFile(filepath) {
  try {
    await unlink(filepath);
    console.log("✅ File deleted:", filepath);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("File does not exist (already deleted)");
    } else {
      console.error("❌ Delete error:", error.message);
    }
  }
}

// Run examples
writeToFile();
appendToFile();
// deleteFile('output.json'); // Uncomment to test deletion
```

---

## Example 3: Working with Directories

```javascript
// Directory operations with fs/promises
import { mkdir, readdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";

// Create directory (with parents)
async function createDirectory() {
  try {
    // recursive: true creates parent directories if needed
    await mkdir("data/backups/2026", { recursive: true });
    console.log("✅ Directory created: data/backups/2026");
  } catch (error) {
    console.error("❌ mkdir error:", error.message);
  }
}

// List directory contents
async function listDirectory(dirPath) {
  try {
    // Simple list of filenames
    const files = await readdir(dirPath);
    console.log("\n=== Files in", dirPath, "===");
    files.forEach((file) => console.log("  -", file));
  } catch (error) {
    console.error("❌ readdir error:", error.message);
  }
}

// List with file details
async function listDirectoryDetailed(dirPath) {
  try {
    // withFileTypes: true returns Dirent objects
    const entries = await readdir(dirPath, { withFileTypes: true });

    console.log("\n=== Detailed listing of", dirPath, "===");
    for (const entry of entries) {
      const type = entry.isDirectory() ? "📁 DIR " : "📄 FILE";
      console.log(`${type}: ${entry.name}`);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Get file/directory information
async function getFileInfo(filepath) {
  try {
    const stats = await stat(filepath);

    console.log("\n=== File Stats ===");
    console.log("Path:", filepath);
    console.log("Size:", stats.size, "bytes");
    console.log("Created:", stats.birthtime.toISOString());
    console.log("Modified:", stats.mtime.toISOString());
    console.log("Is file:", stats.isFile());
    console.log("Is directory:", stats.isDirectory());
  } catch (error) {
    console.error("❌ stat error:", error.message);
  }
}

// Delete directory and all contents
async function deleteDirectory(dirPath) {
  try {
    // recursive: true deletes directory and all contents
    // force: true doesn't throw error if directory doesn't exist
    await rm(dirPath, { recursive: true, force: true });
    console.log("✅ Directory deleted:", dirPath);
  } catch (error) {
    console.error("❌ rm error:", error.message);
  }
}

// Run examples
createDirectory();
listDirectory(".");
listDirectoryDetailed(".");
getFileInfo("./package.json");
// deleteDirectory('data'); // Uncomment to test deletion
```

---

## Example 4: Path Module - Safe Path Operations

```javascript
// path module ensures cross-platform file path handling
import { join, resolve, basename, extname, dirname } from "node:path";

console.log("=== Path Module Examples ===\n");

// join - combines path segments with correct separator
const configPath = join("config", "database", "settings.json");
console.log("join:", configPath);
// Windows: config\database\settings.json
// Unix: config/database/settings.json

// resolve - creates absolute path
const absolutePath = resolve("config", "app.json");
console.log("resolve:", absolutePath);
// /full/path/to/current/directory/config/app.json

// basename - gets filename from path
const filename = basename("/users/john/documents/report.pdf");
console.log("basename:", filename); // report.pdf

// extname - gets file extension
const extension = extname("document.pdf");
console.log("extname:", extension); // .pdf

// dirname - gets directory path
const directory = dirname("/users/john/documents/report.pdf");
console.log("dirname:", directory); // /users/john/documents

// Practical example: Build file paths safely
const dataDir = "data";
const userDir = "users";
const userId = "123";
const filename2 = "profile.json";

// DON'T: Concatenate with + or template strings (wrong separators!)
// const badPath = dataDir + '/' + userDir + '/' + userId + '/' + filename;

// DO: Use path.join (handles separators correctly on all OS)
const userFilePath = join(dataDir, userDir, userId, filename2);
console.log("\nUser file path:", userFilePath);
// Windows: data\users\123\profile.json
// Unix: data/users/123/profile.json
```

---

## Example 5: import.meta.url and fileURLToPath (ESM)

```javascript
// In ES modules, __dirname and __filename don't exist
// Use import.meta.url instead
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// import.meta.url is the file:// URL of the current module
console.log("=== ESM Module Path ===");
console.log("import.meta.url:", import.meta.url);
// file:///C:/path/to/script.js

// Convert file:// URL to regular file path
const __filename = fileURLToPath(import.meta.url);
console.log("__filename:", __filename);
// C:\path\to\script.js

// Get directory of current file
const __dirname = dirname(__filename);
console.log("__dirname:", __dirname);
// C:\path\to

// Build paths relative to current file
const configPath = join(__dirname, "config", "settings.json");
console.log("Config path:", configPath);
// C:\path\to\config\settings.json

// Read file relative to current module
import { readFile } from "node:fs/promises";

async function readLocalConfig() {
  try {
    // Build path relative to THIS file's location
    const configUrl = new URL("./package.json", import.meta.url);
    const configPath = fileURLToPath(configUrl);

    const content = await readFile(configPath, "utf8");
    const json = JSON.parse(content);

    console.log("\nPackage name:", json.name);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

readLocalConfig();
```

---

## Example 6: Streams - Reading Large Files in Chunks

```javascript
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
```

---

## Example 7: pipeline - Chaining Streams Safely

```javascript
// pipeline connects streams and handles errors/backpressure automatically
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { createGzip, createGunzip } from "node:zlib";

// Example 1: Compress file with pipeline
async function compressFile(inputFile, outputFile) {
  try {
    console.log(`Compressing ${inputFile}...`);

    // pipeline automatically:
    // - Connects streams
    // - Handles backpressure
    // - Cleans up on error
    // - Returns Promise when done
    await pipeline(
      createReadStream(inputFile), // Read source file
      createGzip(), // Compress
      createWriteStream(outputFile) // Write to destination
    );

    console.log("✅ Compression complete:", outputFile);
  } catch (error) {
    console.error("❌ Compression failed:", error.message);
  }
}

// Example 2: Decompress file
async function decompressFile(inputFile, outputFile) {
  try {
    console.log(`Decompressing ${inputFile}...`);

    await pipeline(
      createReadStream(inputFile),
      createGunzip(),
      createWriteStream(outputFile)
    );

    console.log("✅ Decompression complete:", outputFile);
  } catch (error) {
    console.error("❌ Decompression failed:", error.message);
  }
}

// Example 3: Transform stream - uppercase text
import { Transform } from "node:stream";

function createUppercaseTransform() {
  return new Transform({
    transform(chunk, encoding, callback) {
      // Transform chunk to uppercase
      const uppercased = chunk.toString().toUpperCase();
      callback(null, uppercased);
    }
  });
}

async function convertToUppercase(inputFile, outputFile) {
  try {
    await pipeline(
      createReadStream(inputFile, "utf8"),
      createUppercaseTransform(),
      createWriteStream(outputFile, "utf8")
    );

    console.log("✅ Converted to uppercase:", outputFile);
  } catch (error) {
    console.error("❌ Conversion failed:", error.message);
  }
}

// Run examples (create test.txt first)
// compressFile('test.txt', 'test.txt.gz');
// decompressFile('test.txt.gz', 'test-decompressed.txt');
// convertToUppercase('test.txt', 'test-upper.txt');

// Why pipeline over .pipe()?
// 1. Returns Promise (async/await compatible)
// 2. Automatic error handling
// 3. Automatic cleanup of streams
// 4. Proper backpressure handling
```

---

## Example 8: Transform Streams - Data Processing

```javascript
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
    (log) => log.level === "error" // Only keep errors
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
```

---

## Example 9: Backpressure Handling

```javascript
// Understanding and handling backpressure in streams

import { Writable, Readable } from "node:stream";

// Example: Fast producer, slow consumer
function createFastProducer() {
  let i = 0;

  return new Readable({
    read() {
      // Produce data quickly
      if (i < 1000) {
        this.push(`Data item ${i}\n`);
        i++;
      } else {
        this.push(null); // End stream
      }
    }
  });
}

function createSlowConsumer() {
  let processed = 0;

  return new Writable({
    write(chunk, encoding, callback) {
      processed++;

      // Simulate slow processing (100ms per item)
      setTimeout(() => {
        console.log(`Processed item ${processed}`);
        callback(); // Signal ready for next chunk
      }, 100);
    }
  });
}

// Without pipeline - can cause memory issues
function demonstrateBackpressure() {
  const producer = createFastProducer();
  const consumer = createSlowConsumer();

  // .pipe() handles backpressure automatically
  producer.pipe(consumer);

  // Producer will pause when consumer's buffer is full
  // Resumes when consumer catches up
  console.log("Streaming with backpressure handling...");
}

// With manual handling (educational)
function manualBackpressure() {
  const producer = createFastProducer();
  const consumer = createSlowConsumer();

  producer.on("data", (chunk) => {
    // write() returns false when internal buffer is full
    const canContinue = consumer.write(chunk);

    if (!canContinue) {
      console.log("Buffer full! Pausing producer...");
      producer.pause(); // Stop reading
    }
  });

  // Resume when consumer is ready
  consumer.on("drain", () => {
    console.log("Buffer drained. Resuming producer...");
    producer.resume();
  });

  producer.on("end", () => {
    consumer.end();
  });
}

demonstrateBackpressure();

// Lesson: pipeline() handles all this automatically!
// Always use pipeline() in production code
```

---

## Example 10: Streams vs Buffers - Performance Comparison

```javascript
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

    console.log("=== Buffer Approach ===");
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

    console.log("\n=== Stream Approach ===");
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

  console.log("\n=== Recommendation ===");
  console.log("Small files (<10MB): Buffer approach is fine");
  console.log("Large files (>10MB): Stream approach is better");
  console.log("Upload/Download: Always use streams");
  console.log("Network responses: Use streams for efficiency");
}

compare("./package.json");
```

---

## Comparison Table: readFile vs Streams

| Aspect          | readFile (Buffer)         | Streams                          |
| --------------- | ------------------------- | -------------------------------- |
| **Memory**      | Loads entire file in RAM  | Only 64KB chunks in memory       |
| **Speed**       | Fast for small files      | Consistent for any file size     |
| **Large files** | Can crash (out of memory) | Handles any size safely          |
| **Processing**  | Must wait for full load   | Can start processing immediately |
| **Use case**    | Small configs, JSON files | Large files, uploads, network    |

---

## Comparison Table: fs Methods

| Operation     | Sync            | Callback    | Promise                     | When to Use              |
| ------------- | --------------- | ----------- | --------------------------- | ------------------------ |
| **Read**      | `readFileSync`  | `readFile`  | `import from 'fs/promises'` | ✅ Promise always        |
| **Write**     | `writeFileSync` | `writeFile` | `import from 'fs/promises'` | ✅ Promise always        |
| **Exists**    | `existsSync`    | `access`    | `access`                    | ✅ Promise, or try/catch |
| **Directory** | `readdirSync`   | `readdir`   | `import from 'fs/promises'` | ✅ Promise always        |

---

## Summary

Modern file system operations in Node.js 2026:

1. **Always use fs/promises** - Never use sync methods or callbacks
2. **path module** - Safe cross-platform path handling
3. **import.meta.url** - Module-relative paths in ESM
4. **Streams** - Memory-efficient for large files
5. **pipeline()** - Safe stream chaining with automatic cleanup
6. **Transform streams** - Process data chunk by chunk
7. **Backpressure** - Handled automatically by pipeline
8. **for await...of** - Modern async iteration over streams

Choose wisely:

- **Small files (<10MB)**: readFile/writeFile
- **Large files/uploads**: Streams + pipeline
- **Data transformation**: Transform streams
