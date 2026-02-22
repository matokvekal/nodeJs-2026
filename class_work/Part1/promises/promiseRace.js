// function delayAndReturn(interval) {
//    return new Promise((resolve, reject) => {
//        setTimeout(() => {
//            resolve(`Resolved after ${interval}ms`);
//        }, interval);
//    });
// }

// const promises = [
//    delayAndReturn(500),  
//    delayAndReturn(4000), 
//    delayAndReturn(1500), 
//    delayAndReturn(2000) 
// ];

// Promise.race(promises)
//    .then(result => {
//        console.log(result); // It will log the result of the promise that resolves first, which is "Resolved after 500ms"
//    })
//    .catch(error => {
//        console.error("An error occurred:", error); // If any promise rejects before others resolve, this catch will handle that rejection.
//    });

   ////////////and What about error////

   function delayAndReturn(interval, shouldReject = false) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (shouldReject) {
            reject(`Rejected after ${interval}ms`);
          } else {
            resolve(`Resolved after ${interval}ms`);
          }
        }, interval);
      });
    }
    
    const promises = [
       delayAndReturn(500),  
       delayAndReturn(4000), 
       delayAndReturn(1500), 
       delayAndReturn(2000),
       delayAndReturn(300, true), // this promise will reject before any other promise resolves
       //delayAndReturn(3000, true) // this promise will reject before any other promise resolves
    ];
    
    Promise.race(promises)
       .then(result => {
           console.log(result); 
       })
       .catch(error => {
           console.error("An error occurred:", error); // It will log: An error occurred: Rejected after 300ms
       });
    


       ///// new approach to handle all promises
       promise.allSettled(promise)