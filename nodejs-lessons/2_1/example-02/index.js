// Reading package.json in ESM
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Get directory of current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json
const packageJson = JSON.parse(
  await readFile(join(__dirname, "package.json"), "utf8")
);

console.log("App name:", packageJson.name);
console.log("Version:", packageJson.version);
console.log("Node version required:", packageJson.engines.node);