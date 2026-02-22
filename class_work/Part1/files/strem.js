import fs from "fs";

const readStream = fs.createReadStream("largeFile.txt", "utf8"); // Specify utf8 encoding

let rowCount = 0;

readStream.on("data", (chunk) => {
  // Split the chunk into lines
  const lines = chunk.split("\n");
  for (const line of lines) {
    if (line) {
      // Check if line is not empty
      rowCount++;
      console.log(`${rowCount}) ${line}`);
    }
  }
});

readStream.on("end", () => {
  console.log("Finished reading the file.");
  console.log(`Total rows: ${rowCount}`);
});

readStream.on("error", (error) => {
  console.error("An error occurred:", error);
});
