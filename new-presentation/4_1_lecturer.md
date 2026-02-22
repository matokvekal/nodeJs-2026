# מדריך למרצה – יום 4 מצגת 13: WebSocket (ws)

**זמן:** 09:00–10:15
**מטרה:** בניית שרת WebSocket עם broadcast, private messaging, ו-heartbeat

---

## שקף 1 – פתיחה

ביום 3 בנינו API בטוח עם Auth ו-Security. עכשיו עוברים לתקשורת בזמן אמת — WebSocket.

**מה נלמד:**
- WebSocket vs HTTP Polling — למה WebSocket עדיף לReal-time
- Handshake — איך מבוסס על HTTP ועובר לפרוטוקול נפרד
- ws library — הספרייה הישירה, ללא overhead
- Broadcast — שליחה לכל ה-clients המחוברים
- Private Messaging — מפת userId → WebSocket
- Ping/Pong Heartbeat — זיהוי clients מנותקים (zombie connections)
- Scaling — Redis Pub/Sub לשרתים מרובים

**WebSocket vs חלופות:**

| טכנולוגיה | כיוון | שימוש מתאים |
|-----------|-------|------------|
| HTTP Polling | Client→Server (כל X שניות) | נתונים שמשתנים לאט |
| Server-Sent Events | Server→Client (חד-כיווני) | feed, notifications |
| WebSocket | דו-כיווני מלא | צ'אט, gaming, collaboration |

**Authentication ב-WebSocket:**
WebSocket Handshake הוא HTTP request — ניתן לשלוח JWT ב-query param או ב-cookie:

```js
const ws = new WebSocket(`ws://localhost:3000?token=${accessToken}`);
// בserver: new URL(req.url).searchParams.get('token')
```

---

## שקף 2 – WebSocket ולמה?

**השוואה:**

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

**מושג:** HTTP כמו לשלוח SMS כל 5 שניות "יש לי הודעות?". WebSocket כמו שיחת טלפון פתוחה.

---

## שקף 3 – Handshake

**הדגמה ב-Chrome DevTools:**

1. פתיחת tab Network
2. חיפוש WS connections
3. הצגת 101 Switching Protocols
4. הצגת Frames (הודעות)

Handshake מתבצע בפרוטוקול HTTP רגיל – לכן עובר דרך firewalls. אחרי החיבור זה פרוטוקול WebSocket נפרד.

---

## שקף 4 – ws בסיסי

**דוגמת `server.js`:**

```js
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "node:http";
import express from "express";

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws, req) => {
  console.log("New client connected");
  ws.send(JSON.stringify({ type: "welcome", message: "Connected!" }));

  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());
    console.log("Received:", msg);
    ws.send(JSON.stringify({ type: "echo", ...msg }));
  });

  ws.on("close", (code) => console.log("Client disconnected, code:", code));
  ws.on("error", (err) => console.error("WebSocket error:", err));
});

httpServer.listen(3000);
```

**HTML Client:**

```html
<!-- index.html -->
<script>
  const ws = new WebSocket("ws://localhost:3000");
  ws.onopen = () => ws.send(JSON.stringify({ type: "hello", text: "Hi!" }));
  ws.onmessage = (e) => console.log("Message:", JSON.parse(e.data));
  ws.onclose = () => console.log("Disconnected");
</script>
```

---

## שקף 5 – Lifecycle

**readyState:**

```js
ws.on("message", () => {
  console.log("readyState:", ws.readyState);
  // 1 = OPEN
});
```

---

## שקף 6 – Broadcast

**דוגמה:**

```js
function broadcast(wss, message, excludeWs = null) {
  const json = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });
}

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.type === "chat") {
      broadcast(wss, { type: "chat", text: msg.text, from: "user" }, ws);
    }
  });
});
```

**בדיקה:** פתיחת 2 browser tabs והדגמת שהודעה מ-tab אחד מגיעה לשני.

---

## שקף 7 – Private Messages

**דוגמה:**

```js
const clients = new Map(); // userId → ws

wss.on("connection", (ws, req) => {
  const userId = new URL(req.url, "http://localhost").searchParams.get(
    "userId"
  );
  clients.set(userId, ws);

  ws.on("close", () => clients.delete(userId));

  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.type === "private") {
      const targetWs = clients.get(msg.to);
      if (targetWs?.readyState === WebSocket.OPEN) {
        targetWs.send(
          JSON.stringify({ type: "private", from: userId, text: msg.text })
        );
      }
    }
  });
});
```

---

## שקף 8 – Ping/Pong

**דוגמת heartbeat:**

```js
wss.on("connection", (ws) => {
  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });
});

const heartbeat = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) {
      console.log("Terminating zombie connection");
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30_000);

wss.on("close", () => clearInterval(heartbeat));
```

---

## שקף 12 – Scaling

**ארכיטקטורה:**

```
Server A ←→ Redis Pub/Sub ←→ Server B
  ↑                              ↑
Client 1                       Client 2

Client 1 שולח → Server A → Redis publish → Server B → Client 2 מקבל
```

---

## סיכום

מצגת זו סיקרה:

- WebSocket vs HTTP polling
- Handshake ו-lifecycle
- שרת WebSocket בסיסי
- Broadcast לכל ה-clients
- Private messaging
- Ping/Pong heartbeat
- Scaling עם Redis Pub/Sub

**הערות:**

- Authentication: ב-connection handler ניתן לקרוא token מ-URL param או header
- socket.io vs ws: socket.io מספק fallbacks. לפרודקשן מודרני ws ישיר מתאים
