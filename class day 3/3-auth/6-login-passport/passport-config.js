// Importing the local strategy from passport for email/password-based authentication.
import LocalStrategy from "passport-local";


import bcrypt from "bcrypt";

 function initialize(passport, getUserByEmail,getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email);

    // If the user is not found, return a message indicating so.
    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }

    try {
      // If the user is found, compare the entered password with the stored hashed password.
      if (await bcrypt.compare(password, user.password)) {
        // If the passwords match, return the user object.
        return done(null, user);
      } else {
        // If the passwords don't match, return a message indicating incorrect credentials.
        return done(null, false, { message: "email or password incorrect" });
      }
    } catch (e) {
      // If any errors occur during the password comparison, return the error.
      return done(e);
    }
  };

  // Setting up passport to use the local strategy with the email as the username field.

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

  
  // Serialize user: This determines which data of the user object should be stored in the session.
  // It's typically used to save the user's ID to the session to identify logged-in users.
  passport.serializeUser((user, done) => done(null, user.id));


  // Deserialize user: This function gets the user's ID from the session and uses it to
  // fetch the full user object. It runs on every request when a user is logged in.
  passport.deserializeUser((id, done) => {
      return done(null, getUserById(id));
   }
   );
}

// Exporting the initialize function to be used in the main server file.
export default initialize;
