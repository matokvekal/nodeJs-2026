import fs from "fs";
import readlineModule from "readline";
// Sample array of 500 words
const words = [
  // ... (I'll provide a truncated list for brevity)
  "apple",
  "banana",
  "cherry",
  "date",
  "elderberry",
  "fig",
  "grape",
  "honeydew",
  "kiwi",
  "lemon",
  "mango",
  "nectarine",
  "orange",
  "papaya",
  "quince",
  "raspberry",
  "strawberry",
  "tangerine",
  "watermelon",
  "blueberry",
  // ... (and so on, until you have 500 words)
];

function getRandomWords(count) {
  const shuffled = words.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(" ");
}

function generateFile(numLines) {
  let content = "";

  for (let i = 0; i < numLines; i++) {
    const lineLength = Math.floor(Math.random() * 11) + 10; // Random number between 10 and 20
    content += getRandomWords(lineLength) + "\n";
  }

  fs.writeFileSync("largeFile.txt", content);
}

const readline = readlineModule.createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(
  "Enter the number of lines you want in largeFile.txt: ",
  (numLines) => {
    generateFile(numLines);
    console.log(`largeFile.txt with ${numLines} lines has been generated!`);
    readline.close();
  }
);
