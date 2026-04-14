import type { Quiz } from "../../types";

// Quiz for Day 2, Lesson 4 - Practical Workshop
export const quiz_2_4: Quiz = [
  {
    question: "מהי ארכיטקטורת MVC?",
    answers: [
      "Model-View-Controller - הפרדה בין לוגיקה, תצוגה ונתונים",
      "סוג של database",
      "פרוטוקול רשת",
      "ספריית npm"
    ],
    correct: 0,
    explanation:
      "MVC מפריד: Model (נתונים), View (תצוגה), Controller (לוגיקה עסקית)."
  },
  {
    question: "מהו Router ב-Express?",
    answers: [
      "כלי לניתוב רשת",
      "mini-app לארגון routes בקבוצות",
      "סוג של middleware",
      "database tool"
    ],
    correct: 1,
    explanation:
      "express.Router() יוצר router instance לארגון routes בצורה מודולרית."
  },
  {
    question: "למה טוב להפריד routes לקבצים נפרדים?",
    answers: [
      "זה מהיר יותר",
      "ארגון טוב, תחזוקה קלה, קוד ברור",
      "חובה בExpress",
      "זה חוסך זיכרון"
    ],
    correct: 1,
    explanation:
      "הפרדת routes לקבצים (users.routes.js, products.routes.js) משפרת ארגון ותחזוקה."
  },
  {
    question: "מהו validation של input?",
    answers: [
      "הצפנת נתונים",
      "בדיקה שהנתונים שהתקבלו תקינים ובטוחים",
      "מחיקת נתונים",
      "שמירת נתונים"
    ],
    correct: 1,
    explanation:
      "Validation בודק שהinput עומד בכללים (type, length, format) לפני שימוש."
  },
  {
    question: "איזו ספרייה פופולרית ל-validation ב-Express?",
    answers: ["express-validator", "joi", "yup", "כל התשובות נכונות"],
    correct: 3,
    explanation: "כולן פופולריות: express-validator, joi, yup, zod - לבחירתך."
  },
  {
    question: "מהו middleware לlוגים (logging)?",
    answers: ["Morgan", "Winston", "Pino", "כל התשובות נכונות"],
    correct: 3,
    explanation:
      "Morgan (HTTP logs), Winston, Pino - כולן ספריות logging פופולריות."
  },
  {
    question: "למה חשוב environment variables (.env)?",
    answers: [
      "מאחסן סודות ותצורה מחוץ לקוד",
      "מאיץ את האפליקציה",
      "מחליף את package.json",
      "פשוט יותר מ-hardcode"
    ],
    correct: 0,
    explanation:
      ".env מאחסן הגדרות סודיות (API keys, DB connection) מחוץ לsource code."
  },
  {
    question: "איזו ספרייה טוענת .env files?",
    answers: ["dotenv", "env-loader", "config", "environment"],
    correct: 0,
    explanation: "dotenv טוען משתני .env לתוך process.env בזמן ריצה."
  },
  {
    question: "מהו Controller layer?",
    answers: [
      "קובץ HTML",
      "פונקציות שמטפלות בלוגיקה עסקית של routes",
      "middleware",
      "database schema"
    ],
    correct: 1,
    explanation:
      "Controller מכיל את הלוגיקה העסקית - מפריד אותה מה-routes לקריאות טובה יותר."
  },
  {
    question: "מה זה Service layer?",
    answers: [
      "שכבת לוגיקה עסקית נפרדת מהcontrollers",
      "סוג של database",
      "middleware",
      "route handler"
    ],
    correct: 0,
    explanation:
      "Service layer מפריד לוגיקה עסקית - Controllers קוראים ל-Services שמדברים עם DB."
  }
];
