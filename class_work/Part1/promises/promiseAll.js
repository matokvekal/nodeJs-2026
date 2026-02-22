function delayAndReturn(interval) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Resolved after ${interval}ms`);
    }, interval);
  });
}

const promises = [
  delayAndReturn(500),
  delayAndReturn(3000),
  delayAndReturn(1500),
  delayAndReturn(2000),
];

Promise.all(promises)
  .then((results) => {
    for (const result of results) {
      console.log(result);
    }
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });

//////////////what about some Error aquried in the promise.all
// function delayAndReturn(interval, shouldReject = false) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (shouldReject) {
//         reject(`Rejected after ${interval}ms`);
//       } else {
//         resolve(`Resolved after ${interval}ms`);
//       }
//     }, interval);
//   });
// }

// const promises = [
//   delayAndReturn(500),
//   delayAndReturn(3000, true), // this promise will reject
//   delayAndReturn(1500),
//   delayAndReturn(2000),
// ];

// Promise.all(promises)
//   .then((results) => {
//     for (const result of results) {
//       console.log(result);
//     }
//   })
//   .catch((error) => {
//     console.error("An error occurred: ONE DIE YOU KILL THEM ALL", error); // This will log: An error occurred: Rejected after 3000ms
//   });
