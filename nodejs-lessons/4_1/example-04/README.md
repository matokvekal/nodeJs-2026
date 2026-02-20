# Private Messaging (User-to-User)

Day 4, Lesson 1 - Example 4

## Install

```bash
npm install
```

## Run

```bash
JWT_SECRET=secret-key node index.js
```

## Test

```javascript
// Generate token (in Node.js)
const jwt = require('jsonwebtoken');
const token = jwt.sign({ sub: 'user123' }, 'secret-key');

// Connect with token
const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
ws.onmessage = (e) => console.log(JSON.parse(e.data));

// Send private message
ws.send(JSON.stringify({ 
  type: 'private:message', 
  to: 'user456', 
  text: 'Hello!' 
}));
```
