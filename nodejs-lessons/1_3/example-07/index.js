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