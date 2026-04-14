// ╔══════════════════════════════════════════════╗
//   LESSON 3 — NODE.JS GLOBAL OBJECT
//   Run:  node globals.js   or   npm run globals
// ╚══════════════════════════════════════════════╝

function line() {
  console.log('─'.repeat(50));
}

function title(t) {
  console.log('\n' + '═'.repeat(50));
  console.log('  ' + t);
  console.log('═'.repeat(50));
}

// ══════════════════════════════════════════════════
//  1. What is the global object?
// ══════════════════════════════════════════════════
title('1. The GLOBAL object');

console.log('In the browser  → window');
console.log('In Node.js      → global');
console.log('In both         → globalThis');
line();
console.log('globalThis === global ?', globalThis === global);  // true
console.log('typeof global          :', typeof global);         // object

// ══════════════════════════════════════════════════
//  2. let x = 5  →  NOT on global
// ══════════════════════════════════════════════════
title('2. let x = 5  is NOT on global');

let x = 5;

console.log('x =', x);                          // 5
console.log('global.x =', global.x);            // undefined
console.log('"x" in global:', 'x' in global);   // false
console.log();
console.log('>> let/const stay in their scope — never leak to global');

// ══════════════════════════════════════════════════
//  3. global.y = 55  →  IS on global
// ══════════════════════════════════════════════════
title('3. global.y = 55  IS on global');

global.y = 55;

console.log('global.y =', global.y);            // 55
console.log('"y" in global:', 'y' in global);   // true
console.log('y (no prefix):', y);               // 55 — accessible anywhere!
console.log();
console.log('>> global.y is now available in every file without import');

// ══════════════════════════════════════════════════
//  4. Things already on global (no import needed)
// ══════════════════════════════════════════════════
title('4. Things already on global');

console.log('setTimeout  :', typeof global.setTimeout);    // function
console.log('setInterval :', typeof global.setInterval);   // function
console.log('clearTimeout:', typeof global.clearTimeout);  // function
console.log('console     :', typeof global.console);       // object
console.log('process     :', typeof global.process);       // object
console.log('Buffer      :', typeof global.Buffer);        // function
console.log('URL         :', typeof global.URL);           // function

// ══════════════════════════════════════════════════
//  5. process object
// ══════════════════════════════════════════════════
title('5. process object');

console.log('process.platform :', process.platform);       // win32 / linux / darwin
console.log('process.arch     :', process.arch);           // x64 / arm64
console.log('process.pid      :', process.pid);            // process ID number
console.log('process.cwd()    :', process.cwd());          // current folder
console.log('process.uptime() :', process.uptime().toFixed(2), 'sec');
console.log('process.argv     :', process.argv);           // [ 'node', 'globals.js' ]

// ══════════════════════════════════════════════════
//  6. process.version
// ══════════════════════════════════════════════════
title('6. process.version');

console.log('Node version :', process.version);            // e.g. v20.11.0
console.log('V8 engine    :', process.versions.v8);
console.log('All versions :');
console.log(process.versions);

// ══════════════════════════════════════════════════
//  7. process.env — environment variables
// ══════════════════════════════════════════════════
title('7. process.env');

console.log('NODE_ENV   :', process.env.NODE_ENV ?? '(not set)');
console.log('USERNAME   :', process.env.USERNAME ?? process.env.USER ?? '(not set)');
console.log('PATH (short):', (process.env.PATH ?? '').slice(0, 60) + '...');

// Set your own env variable at runtime
process.env.APP_NAME = 'CarRaceGame';
process.env.DEBUG    = 'true';

console.log();
console.log('We set our own env vars:');
console.log('  process.env.APP_NAME :', process.env.APP_NAME);
console.log('  process.env.DEBUG    :', process.env.DEBUG);

// ══════════════════════════════════════════════════
//  8. Buffer — global binary tool
// ══════════════════════════════════════════════════
title('8. Buffer (global — no import needed)');

const buf = Buffer.from('Hello Students!');
console.log('Buffer.from("Hello Students!") :', buf);
console.log('As string                      :', buf.toString());
console.log('Length in bytes                :', buf.length);

// ══════════════════════════════════════════════════
//  9. process.exit + exit event
// ══════════════════════════════════════════════════
title('9. process.exit — ending the program');

process.on('exit', (code) => {
  // This runs just before Node exits
  console.log('\n[exit event fired] Program ended with code:', code);
  console.log('[exit event] global.y was:', global.y);
});

console.log('process.exit(0)  →  0 = success, anything else = error');
console.log('Calling process.exit(0) now...');
process.exit(0);
