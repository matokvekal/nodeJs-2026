//1.Write a simple JavaScript code that uses the map method to print each element of an array.
const arr = [1, 2, 3, 4, 5];
// 2.Create a function that filters out numbers less than 5 from the following array.
const numbers = [2, 7, 4, 8, 1, 9];
//3. Convert the following object of students into an array of their names.
const students = {
  student1: { name: "John", age: 20 },
  student2: { name: "Jane", age: 22 },
  student3: { name: "Doe", age: 19 },
};
//4. Write a function that replaces all occurrences of "apple" with "orange" in a given string.
const str = "I love apple because apple is sweet.";
//5. Create a function that calculates the sum of all elements in an array.
const arr1 = [10, 20, 30, 40];
//6.Get the name from the command line arguments and print Hello <name>.
//7 print all arguments from 6

// answers;
//1
arr.map((item) => console.log(item));
//2
function filterNumbers(arr) {
  return arr.filter(x => x >= 5);
}
//3
const names = Object.values(students).map((student) => student.name);

//4
function replaceAppleWithOrange(text) {
  return text.replace(/apple/g, "orange");
}

//5
function sumArray(arr1) {
  return arr.reduce((acc, curr) => acc + curr, 0);
}

//6
const Myname = process.argv[2];
console.log(`Hello ${Myname}`);

// node qa1 gilad


//7
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
//  node qa1.js aaa bbbb cccc
