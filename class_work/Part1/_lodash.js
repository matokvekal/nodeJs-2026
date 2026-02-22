import _ from "lodash";

let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// 1. shuffle
//
let shuffledNumbers = _.shuffle(numbers);
console.log("Shuffled Numbers:", shuffledNumbers);

// 2. chunk
let chunkedArray = _.chunk(numbers, 3);
console.log("Chunked Array:", chunkedArray);
