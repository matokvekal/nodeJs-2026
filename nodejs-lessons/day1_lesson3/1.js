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
    } else if (error instanceof SyntaxError) {
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
