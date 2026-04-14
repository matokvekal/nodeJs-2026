// ╔══════════════════════════════════════════════╗
//   LESSON 4 — ERROR HANDLING IN NODE.JS
//   Run:  node errors.js   or   npm run errors
// ╚══════════════════════════════════════════════╝

function title(t) {
  console.log('\n' + '═'.repeat(50));
  console.log('  ' + t);
  console.log('═'.repeat(50));
}

function line() {
  console.log('─'.repeat(50));
}

// ══════════════════════════════════════════════════
//  1. Basic try / catch / finally
// ══════════════════════════════════════════════════
title('1. try / catch / finally');

try {
  console.log('try: doing something risky...');
  const result = 10 / 0;          // not an error in JS — gives Infinity
  console.log('10 / 0 =', result); // Infinity
  JSON.parse('NOT VALID JSON');    // ← this throws!
} catch (err) {
  console.log('catch: error caught!');
  console.log('  err.name    :', err.name);     // SyntaxError
  console.log('  err.message :', err.message);
} finally {
  console.log('finally: always runs — cleanup here');
}

// ══════════════════════════════════════════════════
//  2. throw — manually throwing errors
// ══════════════════════════════════════════════════
title('2. throw your own error');

function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero!');  // manually throw
  }
  return a / b;
}

try {
  console.log('divide(10, 2) =', divide(10, 2));  // 5
  console.log('divide(10, 0) =', divide(10, 0));  // throws!
} catch (err) {
  console.log('Caught:', err.message);
}

// ══════════════════════════════════════════════════
//  3. Function calling function — call stack throw
// ══════════════════════════════════════════════════
title('3. Function calls function — throw travels up the stack');

function validateAge(age) {
  if (age < 0 || age > 120) {
    throw new RangeError(`Invalid age: ${age}. Must be 0–120.`);
  }
  return age;
}

function createUser(name, age) {
  const validAge = validateAge(age);   // may throw
  return { name, age: validAge };
}

function registerUser(data) {
  const user = createUser(data.name, data.age);  // may throw
  console.log('User registered:', user);
}

// Good data
try {
  registerUser({ name: 'Alice', age: 25 });
} catch (err) {
  console.log('Error:', err.message);
}

// Bad data — throw travels up: validateAge → createUser → registerUser → catch
try {
  registerUser({ name: 'Bob', age: -5 });
} catch (err) {
  console.log('Caught from deep inside:', err.name, '→', err.message);
}

// ══════════════════════════════════════════════════
//  4. Custom Error class
// ══════════════════════════════════════════════════
title('4. Custom Error class (extends Error)');

class FuelError extends Error {
  constructor(carName, fuel) {
    super(`${carName} has no fuel! (fuel=${fuel})`);
    this.name    = 'FuelError';
    this.carName = carName;
    this.fuel    = fuel;
  }
}

function startCar(name, fuel) {
  if (fuel <= 0) throw new FuelError(name, fuel);
  console.log(`${name} started!`);
}

try {
  startCar('Lightning', 5);   // ok
  startCar('Thunder', 0);     // throws FuelError
} catch (err) {
  if (err instanceof FuelError) {
    console.log('FuelError caught!');
    console.log('  Car  :', err.carName);
    console.log('  Fuel :', err.fuel);
    console.log('  Msg  :', err.message);
  } else {
    throw err;  // re-throw if not our error
  }
}

// ══════════════════════════════════════════════════
//  5. async / await — try / catch
// ══════════════════════════════════════════════════
title('5. async / await with try / catch');

function fetchData(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 1) {
        resolve({ id: 1, name: 'Alice' });
      } else {
        reject(new Error(`User with id=${id} not found`));
      }
    }, 500);
  });
}

async function loadUser(id) {
  try {
    console.log(`Loading user ${id}...`);
    const user = await fetchData(id);        // waits for promise
    console.log('Got user:', user);
  } catch (err) {
    console.log('async catch:', err.message); // promise rejection caught here
  } finally {
    console.log('async finally: done loading user', id);
  }
}

// ══════════════════════════════════════════════════
//  6. async function calling async function — throw
// ══════════════════════════════════════════════════
title('6. async calls async — throw travels up');

async function getUsername(id) {
  const user = await fetchData(id);  // may reject
  return user.name;
}

async function showGreeting(id) {
  const name = await getUsername(id);  // may throw
  console.log(`Hello, ${name}!`);
}

async function runAll() {
  // Run section 5 first
  await loadUser(1);   // success
  await loadUser(99);  // fails

  line();

  // Section 6 — async throw chain
  try {
    await showGreeting(1);   // success
    await showGreeting(99);  // reject travels up: fetchData → getUsername → showGreeting → catch
  } catch (err) {
    console.log('Caught async chain error:', err.message);
  }

  // ══════════════════════════════════════════════
  //  7. Promise .catch() — alternative to try/catch
  // ══════════════════════════════════════════════
  title('7. Promise .then() / .catch()');

  fetchData(1)
    .then(user  => console.log('Promise success:', user))
    .catch(err  => console.log('Promise error :', err.message));

  fetchData(99)
    .then(user  => console.log('Promise success:', user))
    .catch(err  => console.log('Promise error :', err.message));

  // small delay so the above settle before section 8 prints
  await new Promise(r => setTimeout(r, 600));

  // ══════════════════════════════════════════════
  //  8. Global error safety nets
  // ══════════════════════════════════════════════
  title('8. Global safety nets');

  // Catches synchronous errors that are never caught
  process.on('uncaughtException', (err) => {
    console.log('[uncaughtException] Caught globally:', err.message);
  });

  // Catches rejected promises that are never caught
  process.on('unhandledRejection', (reason) => {
    console.log('[unhandledRejection] Caught globally:', reason.message ?? reason);
  });

  console.log('Throwing an uncaught rejection now...');
  Promise.reject(new Error('I was never caught with .catch or await!'));

  await new Promise(r => setTimeout(r, 200));

  title('DONE — Error Handling Summary');
  console.log('  try/catch/finally     → sync errors');
  console.log('  throw                 → manually raise an error');
  console.log('  Custom Error class    → typed, detailed errors');
  console.log('  async/await try/catch → async errors (same syntax!)');
  console.log('  .then().catch()       → promise chain style');
  console.log('  uncaughtException     → last resort for sync');
  console.log('  unhandledRejection    → last resort for promises');
}

runAll();
