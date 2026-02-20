// Quiz for Day 1, Lesson 4 - HTTP & Webhooks
export const quiz_1_4 = [
  {
    question: "מהו HTTP?",
    answers: [
      "שפת תכנות",
      "פרוטוקול להעברת מידע ברשת",
      "מסד נתונים",
      "ספריית JavaScript"
    ],
    correct: 1,
    explanation:
      "HTTP (HyperText Transfer Protocol) הוא פרוטוקול לתקשורת בין client ל-server."
  },
  {
    question: "מה המשמעות של status code 200?",
    answers: ["שגיאה", "הבקשה הצליחה", "העמוד לא נמצא", "שרת לא זמין"],
    correct: 1,
    explanation: "200 OK משמעו שהבקשה הצליחה והשרת מחזיר את התוצאה."
  },
  {
    question: "מה המשמעות של status code 404?",
    answers: ["הצלחה", "הפניה מחדש", "המשאב לא נמצא", "שגיאת שרת"],
    correct: 2,
    explanation: "404 Not Found משמעו שהמשאב המבוקש לא נמצא בשרת."
  },
  {
    question: "איזה ספרייה מובנית ב-Node.js יוצרת HTTP server?",
    answers: ["express", "node:http", "axios", "node:server"],
    correct: 1,
    explanation: "המודול המובנה node:http מאפשר ליצור HTTP server ו-client."
  },
  {
    question: "מהו webhook?",
    answers: [
      "סוג של database",
      "פונקציה שנקראת כש-event מתרחש",
      "כלי לבדיקת קוד",
      "ספריית npm"
    ],
    correct: 1,
    explanation:
      "Webhook הוא HTTP callback - שרת שולח POST request כשאירוע מתרחש."
  },
  {
    question: "איך בודקים את ה-HTTP method של request?",
    answers: ["req.method", "req.type", "req.httpMethod", "req.verb"],
    correct: 0,
    explanation:
      "req.method מכיל את שם ה-HTTP method (GET, POST, PUT, DELETE וכו')."
  },
  {
    question: "מה ההבדל בין GET ל-POST?",
    answers: [
      "אין הבדל",
      "GET לקבלת נתונים, POST לשליחת נתונים",
      "POST מהיר יותר",
      "GET יכול לשלוח נתונים גדולים"
    ],
    correct: 1,
    explanation:
      "GET משמש לקבלת נתונים (בלי body), POST לשליחת נתונים (עם body)."
  },
  {
    question: "איך קוראים את ה-body של POST request?",
    answers: [
      "req.body (אוטומטית)",
      "צריך לקרוא chunks מה-stream",
      "req.getData()",
      "req.content"
    ],
    correct: 1,
    explanation:
      "request הוא stream, צריך להאזין ל-'data' ו-'end' events. ב-Express יש middleware לזה."
  },
  {
    question: "מהו Content-Type header?",
    answers: [
      "גודל התוכן",
      "סוג התוכן שנשלח (JSON, HTML, etc)",
      "מקור התוכן",
      "תאריך התוכן"
    ],
    correct: 1,
    explanation:
      "Content-Type מציין את סוג הנתונים (application/json, text/html, וכו')."
  },
  {
    question: "איך יוצרים HTTP server בסיסי?",
    answers: [
      "new Server()",
      "http.createServer()",
      "server.create()",
      "http.newServer()"
    ],
    correct: 1,
    explanation:
      "http.createServer(callback) יוצר HTTP server. הcallback מקבל (req, res)."
  }
];
