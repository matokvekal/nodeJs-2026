// Quiz for Day 1, Lesson 2 - Async Patterns
export const quiz_1_2 = [
  {
    question: "מהי הבעיה העיקרית עם Callback Hell?",
    answers: [
      "הקוד איטי",
      "הקוד קשה לקריאה ותחזוקה",
      "הקוד לא עובד",
      "הקוד תופס יותר זיכרון"
    ],
    correct: 1,
    explanation:
      "Callback Hell יוצר קוד מקונן עמוק שקשה לקרוא, לתחזק ולטפל בשגיאות."
  },
  {
    question: "מה מחזיר Promise כשהוא נוצר?",
    answers: [
      "את התוצאה מיד",
      "אובייקט שמייצג ערך עתידי",
      "true או false",
      "callback function"
    ],
    correct: 1,
    explanation:
      "Promise הוא אובייקט שמייצג השלמה (או כישלון) עתידית של פעולה אסינכרונית."
  },
  {
    question: "מה המצב של Promise שעדיין לא הושלם?",
    answers: ["resolved", "rejected", "pending", "waiting"],
    correct: 2,
    explanation:
      "Promise יכול להיות במצב: pending (ממתין), fulfilled (הושלם), או rejected (נכשל)."
  },
  {
    question: "איך תופסים שגיאות ב-Promise?",
    answers: ["try/catch", ".catch()", "if/else", "error event"],
    correct: 1,
    explanation:
      ".catch() תופס שגיאות מ-Promise. ב-async/await אפשר גם try/catch."
  },
  {
    question: "מה עושה Promise.all()?",
    answers: [
      "מריץ Promises בזה אחר זה",
      "מריץ Promises במקביל וממתין לכולם",
      "מריץ רק את הראשון",
      "מבטל את כל ה-Promises"
    ],
    correct: 1,
    explanation:
      "Promise.all() ממתין לכל ה-Promises במקביל. אם אחד נכשל - הכל נכשל."
  },
  {
    question: "מה ההבדל בין Promise.all() ל-Promise.allSettled()?",
    answers: [
      "אין הבדל",
      "allSettled ממתין גם ל-Promises שנכשלו",
      "all מהיר יותר",
      "allSettled עובד רק ב-Node.js 18+"
    ],
    correct: 1,
    explanation:
      "allSettled() ממתין לכל ה-Promises ללא קשר להצלחה/כישלון, all() נכשל אם אחד נכשל."
  },
  {
    question: "איך הופכים פונקציה של Node.js עם callback ל-Promise?",
    answers: [
      "fs.promises.readFile()",
      "readFile().then()",
      "await readFile()",
      "new Promise(readFile)"
    ],
    correct: 0,
    explanation: "Node.js מספק fs.promises API שמחזיר Promises במקום callbacks."
  },
  {
    question: "מה חייב להיות לפני שימוש ב-await?",
    answers: ["Promise", "async function", "try/catch", "callback"],
    correct: 1,
    explanation: "await יכול לשמש רק בתוך async function."
  },
  {
    question: "מה מחזירה async function תמיד?",
    answers: ["undefined", "Promise", "את הערך ישירות", "callback"],
    correct: 1,
    explanation: "async function תמיד מחזירה Promise, גם אם אתה מחזיר ערך רגיל."
  },
  {
    question: "איך תופסים שגיאות עם async/await?",
    answers: [".catch()", "try/catch", ".error()", "if (error)"],
    correct: 1,
    explanation:
      "עם async/await משתמשים ב-try/catch לטיפול בשגיאות בצורה סינכרונית."
  }
];
