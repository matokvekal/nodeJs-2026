// Quiz for Day 4, Lesson 1 - WebSocket
export const quiz_4_1 = [
  {
    question: "מהו WebSocket?",
    answers: [
      "HTTP header",
      "פרוטוקול לתקשורת דו-כיוונית בזמן אמת",
      "סוג של REST API",
      "database"
    ],
    correct: 1,
    explanation:
      "WebSocket מאפשר תקשורת full-duplex (דו-כיוונית) בין client ל-server בזמן אמת."
  },
  {
    question: "מה ההבדל בין WebSocket ל-HTTP?",
    answers: [
      "אין הבדל",
      "HTTP = request/response, WebSocket = חיבור קבוע דו-כיווני",
      "WebSocket מהיר יותר תמיד",
      "HTTP רק לדפדפנים"
    ],
    correct: 1,
    explanation:
      "HTTP = request-response cycle. WebSocket = persistent connection עם real-time communication."
  },
  {
    question: "מתי כדאי להשתמש ב-WebSocket?",
    answers: [
      "לכל API",
      "Chat, real-time notifications, live updates, gaming",
      "רק לגיימינג",
      "רק למסירת נתונים גדולים"
    ],
    correct: 1,
    explanation:
      "WebSocket מצוין ל-real-time apps: chat, notifications, dashboards, collaborative editing, gaming."
  },
  {
    question: "איזו ספרייה פופולרית ל-WebSocket ב-Node.js?",
    answers: ["socket.io", "ws", "websocket", "כל התשובות נכונות"],
    correct: 3,
    explanation:
      "ws (low-level), socket.io (high-level עם fallbacks), websocket - כולן אפשרויות טובות."
  },
  {
    question: "מהו socket.io?",
    answers: [
      "WebSocket protocol",
      "ספרייה ל-real-time communication עם fallbacks",
      "HTTP server",
      "database driver"
    ],
    correct: 1,
    explanation:
      "socket.io בנוי על WebSocket אבל מוסיף fallbacks (polling), rooms, events, reconnection."
  },
  {
    question: "מהו broadcast ב-WebSocket?",
    answers: [
      "סגירת חיבור",
      "שליחת הודעה לכל ה-clients המחוברים",
      "יצירת room",
      "authentication"
    ],
    correct: 1,
    explanation:
      "Broadcast = שליחת הודעה לכל הclients. שימושי לchat rooms, notifications."
  },
  {
    question: "מהם rooms ב-socket.io?",
    answers: [
      "directories",
      "קבוצות של sockets לשליחת הודעות ממוקדות",
      "databases",
      "authentication groups"
    ],
    correct: 1,
    explanation:
      "Rooms מאפשרים לקבץ sockets וכך לשלוח הודעות רק לקבוצות ספציפיות."
  },
  {
    question: "מהו ping/pong ב-WebSocket?",
    answers: [
      "משחק",
      "heartbeat mechanism לזיהוי חיבורים מתים",
      "סוג של message",
      "authentication"
    ],
    correct: 1,
    explanation:
      "Ping/Pong = heartbeat לבדיקה שהחיבור עדיין חי. אם אין תשובה - disconnect."
  },
  {
    question: "איך מטפלים ב-authentication ב-WebSocket?",
    answers: [
      "לא צריך",
      "JWT token בhandshake או בfirst message",
      "Username/Password בכל הודעה",
      "session cookies בלבד"
    ],
    correct: 1,
    explanation:
      "שולחים JWT ב-connection query/headers או ב-first message ומאמתים לפני join."
  },
  {
    question: "איך scale WebSocket servers עם Redis?",
    answers: [
      "לא אפשרי",
      "Redis Pub/Sub משמש לסנכרון בין servers",
      "Redis שומר את כל ההודעות",
      "Redis מחליף את WebSocket"
    ],
    correct: 1,
    explanation:
      "Redis Pub/Sub מאפשר לכמה servers לשתף הודעות - client יכול להתחבר לכל server."
  }
];
