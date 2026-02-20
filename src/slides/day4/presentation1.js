export const slides = [
  {
    id: 1,
    type: "title",
    title: "WebSocket עם ספריית ws",
    subtitle: "Protocol, Lifecycle, Broadcast, Private Messaging, Scaling"
  },
  {
    id: 2,
    title: "WebSocket – פרוטוקול ולמה?",
    bullets: [
      "HTTP = בקשה-תגובה; WebSocket = תקשורת דו-כיוונית מתמשכת",
      "לקוח ושרת יכולים לשלוח הודעות בכל רגע בלי לחכות לבקשה",
      "חסכון תקורה: אין headers בכל הודעה, אין TCP handshake חוזר",
      "HTTP Polling = שואל שוב ושוב; WebSocket = השרת שולח כשיש חדשות",
      "שימושים: צ'אט, התראות real-time, live dashboards, gaming, trading",
      "כתובת: ws:// (לא מאובטח) / wss:// (TLS, ייצור בלבד)"
    ]
  },
  {
    id: 3,
    title: "Handshake – משדרג מ-HTTP",
    bullets: [
      "חיבור מתחיל בבקשת HTTP רגילה",
      "שרת מחזיר 101 Switching Protocols + Sec-WebSocket-Accept",
      "אחרי Handshake: אותו TCP socket, פרוטוקול WebSocket",
      "עובר דרך proxies ו-firewalls קיימים (כי מתחיל כ-HTTP)",
      "Authentication בשלב ה-Handshake: token ב-query param או header"
    ],
    code: `GET /ws HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: <base64>
Sec-WebSocket-Version: 13`
  },
  {
    id: 4,
    title: "ספריית ws – התחלה",
    code: `import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws, req) => {
  console.log('Client connected');

  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    ws.send(JSON.stringify({ type: 'ack', id: msg.id }));
  });

  ws.on('close', (code, reason) => console.log('Disconnected', code));
  ws.on('error', (err) => console.error(err));
});`
  },
  {
    id: 5,
    title: "Connection Lifecycle",
    bullets: [
      "connection → לקוח חדש התחבר; ws = אובייקט החיבור",
      "message → הודעה התקבלה מלקוח; data = Buffer",
      "close → חיבור נסגר; code (1000 = תקין, 1001 = going away)",
      "error → שגיאת תקשורת; חובה להאזין כדי לא לקרוס!",
      "ws.readyState: CONNECTING=0, OPEN=1, CLOSING=2, CLOSED=3",
      "תמיד לבדוק ws.readyState === WebSocket.OPEN לפני שליחה"
    ]
  },
  {
    id: 6,
    title: "Broadcast – שליחה לכולם",
    code: `function broadcast(wss, message, excludeWs = null) {
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
});`
  },
  {
    id: 7,
    title: "Private Messaging",
    code: `// Map של userId → WebSocket
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
}`
  },
  {
    id: 8,
    title: "Ping/Pong – שמירת חיבור",
    code: `function setupHeartbeat(wss) {
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
});`,
    bullets: [
      "Ping שנשלח כל 30 שניות; אם אין Pong → ניתוק",
      "מונע Zombie connections שתופסות זיכרון"
    ]
  },
  {
    id: 9,
    title: "מבנה הודעות – Application Protocol",
    bullets: [
      "WebSocket שולח טקסט או בינארי – אין פורמט מובנה",
      "מומלץ להגדיר JSON protocol עם type + payload",
      "Message router בצד שרת:"
    ],
    code: `{ "type": "chat:message", "payload": { "text": "Hello!", "room": "general" } }
{ "type": "user:join", "payload": { "userId": "123" } }
{ "type": "error", "payload": { "code": "UNAUTHORIZED" } }`,
    code2: `const handlers = { 'chat:message': handleChat, 'user:join': handleJoin };
ws.on('message', (data) => handlers[msg.type]?.(ws, msg.payload));`
  },
  {
    id: 10,
    title: "חדרים (Rooms)",
    code: `const rooms = new Map(); // roomId → Set<WebSocket>

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
}`
  },
  {
    id: 11,
    title: "טיפול בשגיאות ב-WebSocket",
    bullets: [
      "תמיד להאזין לאירוע error – שגיאה ללא listener = crash!",
      "ws.terminate() – ניתוק כפוי; ws.close() – ניתוק מסודר",
      "לוודא readyState === OPEN לפני כל send",
      "עטוף ws.send() ב-try/catch",
      "מימוש Reconnect בצד לקוח עם exponential backoff",
      "לוגים מפורטים = אבחון בעיות בייצור"
    ],
    code: `try { ws.send(data); } catch (err) { logger.error('Send failed', err); }`
  },
  {
    id: 12,
    title: "Scaling Concerns",
    bullets: [
      "Node.js יחיד = עשרות אלפי חיבורים באותו שרת",
      "במערכת מבוזרת (multiple servers) – לקוח על שרת A, לא מקבל broadcast משרת B",
      "פתרון: Redis Pub/Sub בין שרתים",
      "socket.io מספק adapter מובנה לـ Redis Pub/Sub"
    ],
    code: `// Server A publish:
redis.publish('chat', JSON.stringify({ type: 'message', text }));
// Server B subscribe:
redis.subscribe('chat', (msg) => broadcastLocally(JSON.parse(msg)));`
  },
  {
    id: 13,
    title: "סיכום – יום 4 מצגת 13",
    bullets: [
      "WebSocket = תקשורת דו-כיוונית מתמשכת; Handshake מתחיל כ-HTTP",
      "ספריית ws פשוטה ומהירה; lifecycle: connection→message→close→error",
      "Broadcast לכולם, Private לפי Map, Rooms לקבוצות",
      "Ping/Pong = heartbeat למניעת Zombie connections",
      "Protocol JSON עם type+payload לארגון הודעות",
      "Scaling: Redis Pub/Sub לתיאום בין שרתים מרובים"
    ]
  }
];
