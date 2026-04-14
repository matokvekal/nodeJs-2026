import type { Quiz } from "../../types";

// Quiz for Day 1, Lesson 3 - File System & Streams
export const quiz_1_3: Quiz = [
  {
    question: "מה ההבדל בין fs.readFile() ל-fs.createReadStream()?",
    answers: [
      "אין הבדל",
      "readFile קורא הכל לזיכרון, stream קורא בחתיכות",
      "stream מהיר יותר תמיד",
      "readFile עובד רק עם JSON"
    ],
    correct: 1,
    explanation:
      "readFile() קורא את כל הקובץ לזיכרון. createReadStream() קורא בחתיכות (chunks) - יעיל לקבצים גדולים."
  },
  {
    question: "מהו chunk ב-stream?",
    answers: [
      "שם של ספרייה",
      "חתיכת מידע (buffer) שנקראת בכל פעם",
      "שגיאה",
      "סוג קובץ"
    ],
    correct: 1,
    explanation:
      "chunk הוא חתיכת המידע (Buffer או string) שה-stream מעביר בכל event של 'data'."
  },
  {
    question: "מה עושה .pipe() ב-streams?",
    answers: [
      "יוצר קובץ חדש",
      "מחבר readable stream ל-writable stream",
      "סוגר stream",
      "קורא קובץ"
    ],
    correct: 1,
    explanation:
      ".pipe() מחבר את הפלט של readable stream לכניסה של writable stream - מועבר אוטומטית."
  },
  {
    question: "איזה event נשלח כש-stream מסיים לקרוא?",
    answers: ["'finish'", "'close'", "'end'", "'done'"],
    correct: 2,
    explanation:
      "readable stream פולט 'end' כשסיים לקרוא. writable stream פולט 'finish' כשסיים לכתוב."
  },
  {
    question: "למה streams טובים לקבצים גדולים?",
    answers: [
      "הם מהירים יותר",
      "הם חוסכים זיכרון - עובדים בחתיכות",
      "הם קלים לכתיבה",
      "הם תומכים בכל סוג קובץ"
    ],
    correct: 1,
    explanation:
      "streams עובדים בחתיכות קטנות, לא טוענים את כל הקובץ לזיכרון - מצוין לקבצים גדולים."
  },
  {
    question: "מה הפורמט של fs.promises API?",
    answers: ["callbacks", "Promises", "events", "streams"],
    correct: 1,
    explanation:
      "fs.promises מספק API מבוסס Promises במקום callbacks - נוח לשימוש עם async/await."
  },
  {
    question: "איזה method משמש לבדיקה אם קובץ קיים?",
    answers: ["fs.exists()", "fs.check()", "fs.access()", "fs.find()"],
    correct: 2,
    explanation:
      "fs.access() בודק אם קובץ קיים ואם יש הרשאות. fs.exists() deprecated."
  },
  {
    question: "מה זה Transform stream?",
    answers: [
      "stream שרק קורא",
      "stream שרק כותב",
      "stream שקורא, משנה ו כותב",
      "stream שמוחק קבצים"
    ],
    correct: 2,
    explanation:
      "Transform stream הוא readable וגם writable - קורא נתונים, משנה אותם, ומוציא נתונים חדשים."
  },
  {
    question: "איך יוצרים directory עם fs.promises?",
    answers: [
      "fs.promises.createDir()",
      "fs.promises.mkdir()",
      "fs.promises.newFolder()",
      "fs.promises.makeDirectory()"
    ],
    correct: 1,
    explanation:
      "fs.promises.mkdir() יוצר directory. אפשר להוסיף { recursive: true } לתיקיות מקוננות."
  },
  {
    question: "מה הסדר הנכון לטיפול בשגיאות ב-stream?",
    answers: [
      "אין צורך לטפל בשגיאות",
      "להאזין ל-'error' event",
      "try/catch מספיק",
      "streams לא זורקים שגיאות"
    ],
    correct: 1,
    explanation:
      "חשוב תמיד להאזין ל-'error' event ב-streams כדי למנוע קריסת אפליקציה."
  }
];
