// Quiz for Day 1, Lesson 1 - Modern Node.js Runtime
export const quiz_1_1 = [
  {
    question: "מהו Node.js?",
    answers: [
      "שפת תכנות חדשה",
      "סביבת ריצה לJavaScript מחוץ לדפדפן",
      "מסד נתונים",
      "ספריית JavaScript"
    ],
    correct: 1,
    explanation:
      "Node.js הוא סביבת ריצה (runtime environment) לJavaScript, בנויה על מנוע V8 של Chrome."
  },
  {
    question: "על איזה מנוע JavaScript בנוי Node.js?",
    answers: ["SpiderMonkey", "JavaScriptCore", "V8", "Chakra"],
    correct: 2,
    explanation: "Node.js בנוי על מנוע V8 של Google, אותו מנוע שמריץ את Chrome."
  },
  {
    question: "מה התפקיד של libuv ב-Node.js?",
    answers: [
      "קומפילציה של JavaScript",
      "ניהול Event Loop ו-Thread Pool",
      "ניהול זיכרון",
      "ניהול packages מ-npm"
    ],
    correct: 1,
    explanation:
      "libuv היא ספריית C שמספקת את Event Loop ו-Thread Pool, מנהלת I/O אסינכרוני."
  },
  {
    question: "כמה threads יש ב-Thread Pool של Node.js כברירת מחדל?",
    answers: ["2", "4", "8", "16"],
    correct: 1,
    explanation:
      "Thread Pool של libuv כולל 4 threads כברירת מחדל. ניתן לשנות עם UV_THREADPOOL_SIZE."
  },
  {
    question: "מה זה Event Loop?",
    answers: [
      "מנגנון שמריץ פונקציות בלולאה אינסופית",
      "מנגנון שמנהל callbacks אסינכרוניים",
      "כלי לניהול זיכרון",
      "ספרייה חיצונית"
    ],
    correct: 1,
    explanation:
      "Event Loop מנהל את ביצוע הקוד האסינכרוני - מריץ callbacks כשפעולות I/O מסתיימות."
  },
  {
    question: "איזו פעולה לא משתמשת ב-Thread Pool?",
    answers: ["fs.readFile()", "crypto.pbkdf2()", "TCP socket", "dns.lookup()"],
    correct: 2,
    explanation:
      "פעולות רשת (TCP/UDP) עובדות ישירות עם ה-OS באופן אסינכרוני, לא דרך Thread Pool."
  },
  {
    question: "מה עושה הפונקציה process.memoryUsage()?",
    answers: [
      "מנקה זיכרון",
      "מציגה שימוש בזיכרון",
      "מגדילה את ה-heap",
      "עוצרת את התוכנית"
    ],
    correct: 1,
    explanation:
      "process.memoryUsage() מחזירה אובייקט עם מידע על שימוש בזיכרון (heap, external, וכו')."
  },
  {
    question: "מה זה Garbage Collector ב-V8?",
    answers: [
      "כלי לניקוי קבצים",
      "מנגנון שמשחרר זיכרון שלא נמצא בשימוש",
      "כלי לאיתור bugs",
      "מנהל packages"
    ],
    correct: 1,
    explanation:
      "Garbage Collector משחרר אוטומטית זיכרון של אובייקטים שאינם בשימוש יותר."
  },
  {
    question: "האם Node.js הוא חד-תהליכוני (single-threaded)?",
    answers: [
      "כן, לחלוטין",
      "לא, הוא multi-threaded",
      "כן, אבל עם Thread Pool לפעולות מסוימות",
      "תלוי בגרסה"
    ],
    correct: 2,
    explanation:
      "Event Loop רץ על thread אחד, אבל libuv משתמש ב-Thread Pool לפעולות blocking."
  },
  {
    question: "למה Node.js מתאים במיוחד?",
    answers: [
      "חישובים מתמטיים כבדים",
      "עיבוד תמונות",
      "פעולות I/O אינטנסיביות (API, chat, streaming)",
      "רינדור גרפיקה"
    ],
    correct: 2,
    explanation:
      "Node.js מצוין לפעולות I/O (HTTP requests, database, files) הודות למודל האסינכרוני."
  }
];
