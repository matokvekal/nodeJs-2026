import music from './music.js';

import { shuffle } from './lib/utils.js';

const sentence = 'I can see the mountain';

console.log(shuffle(sentence.split(/\s+/)).join(' '));
