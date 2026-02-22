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