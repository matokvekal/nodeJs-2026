# מדריך למרצה – יום 4 מצגת 13: WebSocket (ws)

**זמן:** 09:00–10:15 (75 דקות)
**מטרה:** התלמידים יבנו שרת WebSocket עם broadcast, private messaging, ו-heartbeat

---

## הכנה מראש
- `npm install ws`
- הכן HTML client פשוט (index.html) לדמו
- הכן שרת WebSocket demo ב-`demo-ws.js`

---

## שקף 2 – WebSocket ולמה? (8 דקות)
**ציור השוואה:**
```
HTTP Polling:
Client → req → Server → res → 200
Client → req → Server → res → nothing new
Client → req → Server → res → data!
(כל 5 שניות, בזבוז!)

WebSocket:
Client ←→ Server (תמיד פתוח)
Server → client (כשיש משהו חדש!)
```

**אנלוגיה:**
> "HTTP = לשלוח SMS כל 5 שניות 'יש לי הודעות?' → WebSocket = שיחת טלפון פתוחה."

---

## שקף 3 – Handshake (8 דקות)
**הצג ב-Chrome DevTools:**
1. פתח tab Network
2. חפש WS connections
3. הצג את ה-101 Switching Protocols
4. הצג את ה-Frames (הודעות)

**מה להגיד:**
> "אחד היתרונות: Handshake זה HTTP – עובר דרך firewall. אחרי החיבור זה פרוטוקול משלו."

---

## שקף 4 – ws בסיסי (15 דקות) ← **Live Demo**
**Live coding – `server.js`:**
```js
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'node:http';
import express from 'express';

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws, req) => {
  console.log('New client connected');
  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected!' }));

  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    console.log('Received:', msg);
    ws.send(JSON.stringify({ type: 'echo', ...msg }));
  });

  ws.on('close', (code) => console.log('Client disconnected, code:', code));
  ws.on('error', (err) => console.error('WebSocket error:', err));
});

httpServer.listen(3000);
```

**HTML Client:**
```html
<!-- index.html -->
<script>
const ws = new WebSocket('ws://localhost:3000');
ws.onopen = () => ws.send(JSON.stringify({ type: 'hello', text: 'Hi!' }));
ws.onmessage = (e) => console.log('Message:', JSON.parse(e.data));
ws.onclose = () => console.log('Disconnected');
</script>
```

---

## שקף 5 – Lifecycle (5 דקות)
**הדגם readyState:**
```js
ws.on('message', () => {
  console.log('readyState:', ws.readyState);
  // 1 = OPEN
});
```

---

## שקף 6 – Broadcast (12 דקות)
**Live coding:**
```js
function broadcast(wss, message, excludeWs = null) {
  const json = JSON.stringify(message);
  wss.clients.forEach(client => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });
}

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.type === 'chat') {
      broadcast(wss, { type: 'chat', text: msg.text, from: 'user' }, ws);
    }
  });
});
```

**פתח 2 browser tabs ו-הדגם שהודעה מgab אחד מגיעה לשני.**

---

## שקף 7 – Private Messages (10 דקות)
**Live coding:**
```js
const clients = new Map(); // userId → ws

wss.on('connection', (ws, req) => {
  const userId = new URL(req.url, 'http://localhost').searchParams.get('userId');
  clients.set(userId, ws);

  ws.on('close', () => clients.delete(userId));

  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.type === 'private') {
      const targetWs = clients.get(msg.to);
      if (targetWs?.readyState === WebSocket.OPEN) {
        targetWs.send(JSON.stringify({ type: 'private', from: userId, text: msg.text }));
      }
    }
  });
});
```

---

## שקף 8 – Ping/Pong (8 דקות)
**Live coding:**
```js
wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
});

const heartbeat = setInterval(() => {
  wss.clients.forEach(ws => {
    if (!ws.isAlive) {
      console.log('Terminating zombie connection');
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30_000);

wss.on('close', () => clearInterval(heartbeat));
```

---

## שקף 12 – Scaling (5 דקות)
**ציור:**
```
Server A ←→ Redis Pub/Sub ←→ Server B
  ↑                              ↑
Client 1                       Client 2

Client 1 שולח → Server A → Redis publish → Server B → Client 2 מקבל
```

---

## הערות מרצה
- **Authentication**: "בconnection handler – קרא token מ-URL param או header"
- **socket.io**: "socket.io בנויה מעל ws עם fallbacks. אם צריך compatibility – socket.io. אם מקצועי – ws ישיר"
