//////////////////chaining promises ///////////
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
    console.log("First Success:", result);
    return result * 2; // Double the number
  })
  .then((doubledResult) => {
    console.log("Doubled Result:", doubledResult);
    return doubledResult - 10; // Subtract 10
  })
  .then((reducedResult) => {
    console.log("Reduced Result (Doubled minus 10):", reducedResult);
  })
  .catch((error) => {
    console.log("Error:", error);
  });
//////////////////////////chain example from fetch  api////////
// Fetch a character from SWAPI
function fetchCharacter(id) {
  return fetch(`https://swapi.dev/api/people/${id}/`).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch character.");
    }
    return response.json();
  });
}

// Fetch a planet from SWAPI
function fetchPlanet(url) {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch planet.");
    }
    return response.json();
  });
}

// Demonstrate promise chaining using SWAPI
fetchCharacter(1) // Fetch Luke Skywalker
  .then((character) => {
    console.log("Character:", character.name);
    return fetchPlanet(character.homeworld); // Fetch Luke's homeworld
  })
  .then((planet) => {
    console.log("Homeworld:", planet.name);
  })
  .catch((error) => {
    console.log("Error:", error.message);
  });
