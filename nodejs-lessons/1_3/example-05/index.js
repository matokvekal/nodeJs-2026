// In ES modules, __dirname and __filename don't exist
// Use import.meta.url instead
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// import.meta.url is the file:// URL of the current module
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