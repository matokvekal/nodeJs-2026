import readline from 'readline';
import fs from 'fs';

const rl = readline.createInterface({
  input: fs.createReadStream('/etc/shells'),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  console.log(line);
});
