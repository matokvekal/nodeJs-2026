# Message Protocol (Type-based Routing)

Day 4, Lesson 1 - Example 6

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
const ws = new WebSocket("ws://localhost:8080");
ws.onmessage = (e) => console.log(JSON.parse(e.data));

// Send different message types
ws.send(
  JSON.stringify({
    type: "chat:message",
    payload: { text: "Hello!", room: "general" }
  })
);

ws.send(
  JSON.stringify({
    type: "user:typing",
    payload: { room: "general" }
  })
);

ws.send(
  JSON.stringify({
    type: "ping",
    payload: {}
  })
);
```
