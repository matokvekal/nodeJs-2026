import readline from "readline";

let inputBuffer = "";
let debounceTimer;

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

console.log("Start typing (press Ctrl+C to exit):");

process.stdin.on("keypress", (str, key) => {
  if (key.ctrl && key.name === "c") {
    process.exit(); // Exit on Ctrl+C
  } else {
    inputBuffer += str; // Buffer the pressed key
  }

  // Clear any existing timer
  clearTimeout(debounceTimer);

  // Set up a new timer
  debounceTimer = setTimeout(() => {
    if (inputBuffer) {
      console.log(`You typed: ${inputBuffer}`);
      inputBuffer = ""; // Clear the buffer
    }
  }, 500);
});
