# Broadcast to All Clients

Day 4, Lesson 1 - Example 3

## Install

```bash
npm install
```

## Run

```bash
node index.js
```

## Test

Open multiple browser tabs and run:
```javascript
const ws = new WebSocket('ws://localhost:8080');
ws.onmessage = (e) => console.log('Received:', JSON.parse(e.data));
ws.send(JSON.stringify({ type: 'chat:message', text: 'Hello everyone!' }));
```
