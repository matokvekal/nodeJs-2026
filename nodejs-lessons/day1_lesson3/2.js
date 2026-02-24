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
    console.log(" File written successfully");
  } catch (error) {
    console.error("  Write error:", error.message);
  }
}

// Append to file (adds to end without replacing)
async function appendToFile() {
  try {
    const logEntry = `[${new Date().toISOString()}] User logged in\n`;

    // Append to log file
    await appendFile("app.log", logEntry, "utf8");
    console.log(" Log entry appended");
  } catch (error) {
    console.error("  Append error:", error.message);
  }
}

// Delete file
async function deleteFile(filepath) {
  try {
    await unlink(filepath);
    console.log(" File deleted:", filepath);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("File does not exist (already deleted)");
    } else {
      console.error("  Delete error:", error.message);
    }
  }
}

// Run examples
writeToFile();
appendToFile();
// deleteFile('output.json'); // Uncomment to test deletion