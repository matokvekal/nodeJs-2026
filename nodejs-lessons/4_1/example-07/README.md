# Room/Channel System (Group Messaging)

Day 4, Lesson 1 - Example 7

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
ws.onmessage = (e) => console.log(JSON.parse(e.data));

// Join a room
ws.send(JSON.stringify({ 
  type: 'room:join', 
  payload: { roomId: 'general' } 
}));

// Send message to room
ws.send(JSON.stringify({ 
  type: 'room:message', 
  payload: { roomId: 'general', text: 'Hello room!' } 
}));

// Leave room
ws.send(JSON.stringify({ 
  type: 'room:leave', 
  payload: { roomId: 'general' } 
}));
```
