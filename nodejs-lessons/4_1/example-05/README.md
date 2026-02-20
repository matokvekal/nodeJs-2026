# Heartbeat (Ping/Pong) to Detect Dead Connections

Day 4, Lesson 1 - Example 5

## Install

```bash
npm install
```

## Run

```bash
node index.js
```

## Test

```javascript
const ws = new WebSocket('ws://localhost:8080');
ws.onopen = () => console.log('Connected');
// Ping/Pong happens automatically
// Close browser/tab to test dead connection detection (after 30 seconds)
```
