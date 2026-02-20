# יום 4 – מצגת 13: WebSocket (ws)

---

## שקף 1
**כותרת ראשית:** WebSocket עם ספריית ws
**כותרת משנה:** Protocol, Lifecycle, Broadcast, Private Messaging, Scaling

---

## שקף 2
**כותרת ראשית:** WebSocket – פרוטוקול ולמה?
- HTTP = בקשה-תגובה; **WebSocket** = תקשורת **דו-כיוונית מתמשכת**
- לקוח ושרת יכולים לשלוח הודעות **בכל רגע** בלי לחכות לבקשה
- חסכון תקורה: אין headers בכל הודעה, אין TCP handshake חוזר
- **HTTP Polling** = שואל שוב ושוב; **WebSocket** = השרת שולח כשיש חדשות
- שימושים: צ'אט, התראות real-time, live dashboards, gaming, trading
- כתובת: `ws://` (לא מאובטח) / `wss://` (TLS, ייצור בלבד)

---

## שקף 3
**כותרת ראשית:** Handshake – משדרג מ-HTTP
- חיבור מתחיל בבקשת HTTP רגילה:
  ```
  GET /ws HTTP/1.1
  Upgrade: websocket
  Connection: Upgrade
  Sec-WebSocket-Key: <base64>
  Sec-WebSocket-Version: 13
  ```
- שרת מחזיר `101 Switching Protocols` + `Sec-WebSocket-Accept`
- אחרי Handshake: אותו TCP socket, פרוטוקול WebSocket
- עובר דרך proxies ו-firewalls קיימים (כי מתחיל כ-HTTP)
- **Authentication** בשלב ה-Handshake: `token` ב-query param או header

---

## שקף 4
**כותרת ראשית:** ספריית ws – התחלה
```js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws, req) => {
  console.log('Client connected');

  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    ws.send(JSON.stringify({ type: 'ack', id: msg.id }));
  });

  ws.on('close', (code, reason) => console.log('Disconnected', code));
  ws.on('error', (err) => console.error(err));
});
```

---

## שקף 5
**כותרת ראשית:** Connection Lifecycle
- **connection** → לקוח חדש התחבר; `ws` = אובייקט החיבור
- **message** → הודעה התקבלה מלקוח; `data` = Buffer
- **close** → חיבור נסגר; `code` (1000 = תקין, 1001 = going away)
- **error** → שגיאת תקשורת; **חובה** להאזין כדי לא לקרוס!
- `ws.readyState`: `CONNECTING=0`, `OPEN=1`, `CLOSING=2`, `CLOSED=3`
- תמיד לבדוק `ws.readyState === WebSocket.OPEN` לפני שליחה

---

## שקף 6
**כותרת ראשית:** Broadcast – שליחה לכולם
```js
function broadcast(wss, message, excludeWs = null) {
  const data = JSON.stringify(message);
  for (const client of wss.clients) {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

// שימוש בעת קבלת הודעה:
ws.on('message', (data) => {
  const msg = JSON.parse(data);
  broadcast(wss, { type: 'chat', ...msg }, ws); // מוציאים את השולח
});
```

---

## שקף 7
**כותרת ראשית:** Private Messaging
```js
// Map של userId → WebSocket
const clients = new Map();

wss.on('connection', (ws, req) => {
  const userId = authenticate(req); // אימות מה-token
  clients.set(userId, ws);

  ws.on('close', () => clients.delete(userId));
});

function sendToUser(userId, message) {
  const userWs = clients.get(userId);
  if (userWs?.readyState === WebSocket.OPEN) {
    userWs.send(JSON.stringify(message));
  }
}
```

---

## שקף 8
**כותרת ראשית:** Ping/Pong – שמירת חיבור
```js
function setupHeartbeat(wss) {
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30_000);
}

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
});
```
- Ping שנשלח כל 30 שניות; אם אין Pong → ניתוק
- מונע **Zombie connections** שתופסות זיכרון

---

## שקף 9
**כותרת ראשית:** מבנה הודעות – Application Protocol
- WebSocket שולח **טקסט** או **בינארי** – אין פורמט מובנה
- מומלץ להגדיר **JSON protocol** עם `type` + `payload`:
  ```json
  { "type": "chat:message", "payload": { "text": "Hello!", "room": "general" } }
  { "type": "user:join", "payload": { "userId": "123" } }
  { "type": "error", "payload": { "code": "UNAUTHORIZED" } }
  ```
- Message router בצד שרת:
  ```js
  const handlers = { 'chat:message': handleChat, 'user:join': handleJoin };
  ws.on('message', (data) => handlers[msg.type]?.(ws, msg.payload));
  ```

---

## שקף 10
**כותרת ראשית:** חדרים (Rooms)
```js
const rooms = new Map(); // roomId → Set<WebSocket>

function joinRoom(ws, roomId) {
  if (!rooms.has(roomId)) rooms.set(roomId, new Set());
  rooms.get(roomId).add(ws);
  ws.rooms = ws.rooms ?? new Set();
  ws.rooms.add(roomId);
}

function broadcastToRoom(roomId, message, excludeWs = null) {
  rooms.get(roomId)?.forEach(client => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN)
      client.send(JSON.stringify(message));
  });
}
```

---

## שקף 11
**כותרת ראשית:** טיפול בשגיאות ב-WebSocket
- **תמיד** להאזין לאירוע `error` – שגיאה ללא listener = crash!
- `ws.terminate()` – ניתוק כפוי; `ws.close()` – ניתוק מסודר
- לוודא `readyState === OPEN` לפני כל `send`
- עטוף `ws.send()` ב-try/catch:
  ```js
  try { ws.send(data); } catch (err) { logger.error('Send failed', err); }
  ```
- מימוש **Reconnect** בצד לקוח עם exponential backoff
- לוגים מפורטים = אבחון בעיות בייצור

---

## שקף 12
**כותרת ראשית:** Scaling Concerns
- Node.js יחיד = עשרות אלפי חיבורים **באותו שרת**
- במערכת מבוזרת (multiple servers) – לקוח על שרת A, לא מקבל broadcast משרת B
- **פתרון**: **Redis Pub/Sub** בין שרתים
  ```js
  // Server A publish:
  redis.publish('chat', JSON.stringify({ type: 'message', text }));
  // Server B subscribe:
  redis.subscribe('chat', (msg) => broadcastLocally(JSON.parse(msg)));
  ```
- `socket.io` מספק adapter מובנה לـ Redis Pub/Sub

---

## שקף 13
**כותרת ראשית:** סיכום – יום 4 מצגת 13
- WebSocket = תקשורת דו-כיוונית מתמשכת; Handshake מתחיל כ-HTTP
- ספריית `ws` פשוטה ומהירה; lifecycle: connection→message→close→error
- Broadcast לכולם, Private לפי Map, Rooms לקבוצות
- Ping/Pong = heartbeat למניעת Zombie connections
- Protocol JSON עם `type`+`payload` לארגון הודעות
- Scaling: Redis Pub/Sub לתיאום בין שרתים מרובים
