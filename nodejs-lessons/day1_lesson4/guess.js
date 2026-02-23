import readline from "readline";
// const readline = require("readline").promises;
//to use this we need to remove type:module from package.json

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const rand = Math.floor(Math.random() * 100) + 1;

function askQuestion() {
  rl.question("Enter number: \n", (answer) => {
    if (answer.trim() === "") {
      console.log("You chose to finish the game. Goodbye!");
      rl.close();
      return;
    }
    if (answer == rand) {
      console.log("  *      *   *****      *   *  ");
      console.log("  *      *     *        **  *  ");
      console.log("  *  **  *     *        * * *  ");
      console.log("  * *   **     *        *  **  ");
      console.log("  *      *   *****      *   *  ");

      rl.close();
    } else {
      console.log("Your number is " + (answer > rand ? "bigger" : "lower"));
      askQuestion(); // Recursively ask the question again
    }
  });
}

askQuestion();
