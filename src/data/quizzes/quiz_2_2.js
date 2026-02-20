// Quiz for Day 2, Lesson 2 - Express 5 Deep Dive
export const quiz_2_2 = [
  {
    question: "מהו Express?",
    answers: [
      "מנוע JavaScript",
      "Web framework מינימליסטי ל-Node.js",
      "מסד נתונים",
      "כלי build"
    ],
    correct: 1,
    explanation:
      "Express הוא framework קל ופופולרי לבניית web applications ו-APIs ב-Node.js."
  },
  {
    question: "איך יוצרים Express application?",
    answers: [
      "new Express()",
      "express()",
      "Express.create()",
      "createExpress()"
    ],
    correct: 1,
    explanation: "const app = express() יוצר Express application instance."
  },
  {
    question: "מה זה middleware ב-Express?",
    answers: [
      "קובץ קונפיגורציה",
      "פונקציה שמעבדת request לפני/אחרי route handler",
      "סוג של route",
      "database connector"
    ],
    correct: 1,
    explanation:
      "Middleware הן פונקציות שרצות בסדר ומעבדות את ה-request/response (req, res, next)."
  },
  {
    question: "מה התפקיד של next() ב-middleware?",
    answers: [
      "סוגר את ה-response",
      "מעביר שליטה ל-middleware/route handler הבא",
      "מחזיר שגיאה",
      "יוצר route חדש"
    ],
    correct: 1,
    explanation:
      "next() מעביר את השליטה ל-middleware הבא בשרשרת. ללא next() - התהליך נעצר."
  },
  {
    question: "איך מגדירים route ל-GET request?",
    answers: [
      "app.route('/', ...)",
      "app.get('/', ...)",
      "app.request('GET', '/', ...)",
      "app.http.get('/', ...)"
    ],
    correct: 1,
    explanation:
      "app.get('/path', callback) מגדיר route handler ל-GET requests."
  },
  {
    question: "איך ניגשים ל-query parameters (?name=john)?",
    answers: ["req.params", "req.query", "req.body", "req.get"],
    correct: 1,
    explanation:
      "req.query מכיל query parameters. לדוגמה ?name=john יהיה req.query.name."
  },
  {
    question: "איך ניגשים ל-URL parameters (/:id)?",
    answers: ["req.query", "req.params", "req.url", "req.path"],
    correct: 1,
    explanation:
      "req.params מכיל route parameters. בroute /users/:id - req.params.id."
  },
  {
    question: "מהו express.json() middleware?",
    answers: [
      "מחזיר JSON response",
      "מפענח JSON body ב-requests",
      "יוצר JSON file",
      "בודק אם התוכן JSON"
    ],
    correct: 1,
    explanation:
      "express.json() middleware מפענח JSON body ושם אותו ב-req.body."
  },
  {
    question: "איך מטפלים בשגיאות ב-Express?",
    answers: [
      "try/catch בכל route",
      "error handling middleware עם 4 פרמטרים (err, req, res, next)",
      "אין צורך",
      "process.on('error')"
    ],
    correct: 1,
    explanation:
      "Error middleware מקבל 4 פרמטרים: (err, req, res, next) ונמצא אחרי כל ה-routes."
  },
  {
    question: "מה עושה app.use()?",
    answers: [
      "רק מגדיר routes",
      "מרשם middleware לכל הrequests או לpath מסוים",
      "יוצר server",
      "מחזיר response"
    ],
    correct: 1,
    explanation:
      "app.use() מרשם middleware. ללא path - רץ על כל request. עם path - רק על אותו path."
  }
];
