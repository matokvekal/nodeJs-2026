//create standert promise with set time out with resolve reject  and if random >50 resolve else reject

let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    let floor_randome = Math.floor(Math.random() * 100) + 1;
    if (floor_randome > 50) {
      resolve(floor_randome);
    } else {
      reject(floor_randome);
    }
  }, 1000);
});

promise
  .then((result) => {
    console.log("Success:", result);
  })
  .then((result) => {
    console.log("Success:", result);
  })
  .catch((error) => {
    console.log("Error:", error);
  });
////////////////////////////////////
//call the same with async awaite
async function getRandomNumber() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let random = Math.floor(Math.random() * 100);
      if (random > 50) {
        resolve(random);
      } else {
        reject(random);
      }
    }, 1000);
  });
}

async function main() {
  try {
    const result = await getRandomNumber();
    console.log("Success:", result);
  } catch (error) {
    console.log("Error:", error);
  }
}

main();
