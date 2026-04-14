// ============================================================
//  Node.js Event Listening Demo — Simple Ball Game
//  No classes, only functions + EventEmitter
//
//  Event flow:
//    keyboard key
//       ↓  process.stdin emits 'data'
//    onKeyPress() reads the key
//       ↓  gameEvents.emit('move' / 'jump' / 'quit')
//    listener functions run  (moveBall / jumpBall / quitGame)
// ============================================================

import { EventEmitter } from 'events';

// ---------- Board settings ----------
const WIDTH  = 30;
const HEIGHT = 12;
const JUMP_STEPS = 3;

// ---------- Ball position (starts in the middle) ----------
let ballX = Math.floor(WIDTH  / 2);
let ballY = Math.floor(HEIGHT / 2);

// ---------- Create ONE plain EventEmitter (no class needed) ----------
const gameEvents = new EventEmitter();

// ============================================================
//  DRAW
// ============================================================
function drawBoard() {
  console.clear();

  let board = '+' + '-'.repeat(WIDTH) + '+\n';

  for (let row = 0; row < HEIGHT; row++) {
    let line = '|';
    for (let col = 0; col < WIDTH; col++) {
      line += (col === ballX && row === ballY) ? 'O' : ' ';
    }
    line += '|\n';
    board += line;
  }

  board += '+' + '-'.repeat(WIDTH) + '+\n';
  board += '\n';
  board += '  Arrow keys : move the ball\n';
  board += '  Space      : jump up\n';
  board += '  Escape     : quit\n';

  process.stdout.write(board);
}

// ============================================================
//  EVENT HANDLERS  (plain functions — no class)
// ============================================================

function moveBall(direction) {
  if (direction === 'up'    && ballY > 0)           ballY--;
  if (direction === 'down'  && ballY < HEIGHT - 1)  ballY++;
  if (direction === 'left'  && ballX > 0)           ballX--;
  if (direction === 'right' && ballX < WIDTH  - 1)  ballX++;
  drawBoard();
}

function jumpBall() {
  ballY = Math.max(0, ballY - JUMP_STEPS);   // jump several rows up
  drawBoard();
}

function quitGame() {
  console.clear();
  console.log('Game over! See you next time.');
  process.exit(0);
}

// ============================================================
//  REGISTER LISTENERS  — this is the key teaching point
// ============================================================
gameEvents.on('move', moveBall);   // when 'move' fires  → moveBall
gameEvents.on('jump', jumpBall);   // when 'jump' fires  → jumpBall
gameEvents.on('quit', quitGame);   // when 'quit' fires  → quitGame

// ============================================================
//  KEYBOARD INPUT  — translate raw keys → game events
// ============================================================

function onKeyPress(data) {
  const key = data.toString();

  if      (key === '\u001b[A') gameEvents.emit('move', 'up');    // Arrow Up
  else if (key === '\u001b[B') gameEvents.emit('move', 'down');  // Arrow Down
  else if (key === '\u001b[C') gameEvents.emit('move', 'right'); // Arrow Right
  else if (key === '\u001b[D') gameEvents.emit('move', 'left');  // Arrow Left
  else if (key === ' ')        gameEvents.emit('jump');           // Space
  else if (key === '\u001b')   gameEvents.emit('quit');           // Escape
}

// Node.js process.stdin also emits events!
process.stdin.setRawMode(true);   // get keys one by one (no Enter needed)
process.stdin.resume();
process.stdin.on('data', onKeyPress);  // ← listen to stdin's 'data' event

// ---------- Start ----------
drawBoard();
