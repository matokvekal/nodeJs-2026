import  EventEmitter  from "events";

// Create a new instance of EventEmitter
const myEmitter = new EventEmitter();


myEmitter.on("userSignedUp", (username) => {
  console.log(`Welcome ${username}! Thanks for signing up.`);
});


function userSignUp(username) {
  console.log(`User ${username} is signing up...`);

  myEmitter.emit("userSignedUp", username);
}


userSignUp("Alice");
userSignUp("Bob");
