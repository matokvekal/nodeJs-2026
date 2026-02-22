export function heavyComputation() {
  console.time("heavyComputation"); // Starts the timer

  let total = 0;
  for (let i = 0; i <= 10000; i++) {
    for (let j = 0; j < 1000; j++) {
      /* ... */
    }
    total++;
    console.log(total);
  }
  console.timeEnd("heavyComputation"); // Ends the timer and logs the total time taken

  return total;
}
