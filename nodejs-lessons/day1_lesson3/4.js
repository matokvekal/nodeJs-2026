// path module ensures cross-platform file path handling
import { join, resolve, basename, extname, dirname } from "node:path";


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