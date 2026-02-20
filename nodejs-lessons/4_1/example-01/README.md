# Basic WebSocket Server (ws library)

Day 4, Lesson 1 - Example 1

## Install

```bash
npm install
```

## Run

```bash
node index.js
```

## Test

Open browser console and run:
```javascript
const ws = new WebSocket('ws://localhost:8080');
ws.onopen = () => ws.send(JSON.stringify({ type: 'hello', text: 'Hi!' }));
ws.onmessage = (e) => console.log('Received:', JSON.parse(e.data));
```
