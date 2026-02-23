// util.promisify converts callback-style functions to Promise-based
import { readFile } from "node:fs";
import { promisify } from "node:util";

// Convert callback-based readFile to Promise-based
const readFilePromise = promisify(readFile);

// Now we can use async/await instead of callbacks
async function readFileModern() {
  try {
    const data = await readFilePromise("./package.json", "utf8");
    const json = JSON.parse(data);
    console.log("Package name:", json.name);
    console.log("Version:", json.version);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

readFileModern();

// Modern approach: Use fs/promises directly (no need to promisify)
import { readFile as readFileAsync } from "node:fs/promises";

async function readFileBestPractice() {
  try {
    const data = await readFileAsync("./package.json", "utf8");
    console.log("File read successfully!");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

readFileBestPractice();