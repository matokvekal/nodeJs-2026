import type { Quiz } from "../../types";

// Quiz for Day 2, Lesson 1 - Modules & NPM Architecture
export const quiz_2_1: Quiz = [
  {
    question: "מה ההבדל בין CommonJS ל-ESM?",
    answers: [
      "אין הבדל",
      "CommonJS משתמש ב-require(), ESM משתמש ב-import",
      "ESM ישן יותר",
      "CommonJS עובד רק בדפדפן"
    ],
    correct: 1,
    explanation:
      "CommonJS (require/module.exports) הוא המערכת הישנה, ESM (import/export) היא התקן המודרני."
  },
  {
    question: "איך מציינים שפרויקט משתמש ב-ESM?",
    answers: [
      "בקובץ .babelrc",
      '"type": "module" ב-package.json',
      "סיומת .mjs לכל קובץ",
      "flag ב-command line"
    ],
    correct: 1,
    explanation:
      'מוסיפים "type": "module" ב-package.json כדי להשתמש ב-ESM עם סיומת .js רגילה.'
  },
  {
    question: "מהו npm?",
    answers: ["שרת", "מנהל החבילות של Node.js", "מנוע JavaScript", "עורך קוד"],
    correct: 1,
    explanation:
      "npm (Node Package Manager) הוא כלי להורדה וניהול של ספריות ותלויות."
  },
  {
    question: "מה עושה npm install?",
    answers: [
      "יוצר package.json",
      "מתקין תלויות מ-package.json",
      "מריץ את האפליקציה",
      "מוחק node_modules"
    ],
    correct: 1,
    explanation:
      "npm install מתקין את כל התלויות שמוגדרות ב-package.json לתוך node_modules."
  },
  {
    question: "מה ההבדל בין dependencies ל-devDependencies?",
    answers: [
      "אין הבדל",
      "dependencies לייצור, devDependencies לפיתוח בלבד",
      "devDependencies מהירות יותר",
      "dependencies חינמיות"
    ],
    correct: 1,
    explanation:
      "dependencies נדרשות בייצור, devDependencies רק לפיתוח (testing, build tools)."
  },
  {
    question: "מהו package-lock.json?",
    answers: [
      "גיבוי של package.json",
      "קובץ שנועל גרסאות מדויקות של תלויות",
      "רשימת שגיאות",
      "חלק מה-source code"
    ],
    correct: 1,
    explanation:
      "package-lock.json נועל גרסאות מדויקות של כל החבילות להתקנה עקבית."
  },
  {
    question: "איך מתקינים חבילה גלובלית?",
    answers: [
      "npm install package",
      "npm install -g package",
      "npm global package",
      "npm add package --global"
    ],
    correct: 1,
    explanation:
      "npm install -g מתקין חבילה גלובלית, זמינה כ-CLI בכל מקום במערכת."
  },
  {
    question: "מהי semantic versioning (1.2.3)?",
    answers: [
      "מספר אקראי",
      "MAJOR.MINOR.PATCH",
      "שנה.חודש.יום",
      "גרסה.תיקון.עדכון"
    ],
    correct: 1,
    explanation:
      "1.2.3 = MAJOR (breaking changes).MINOR (new features).PATCH (bug fixes)."
  },
  {
    question: "מה המשמעות של ^ ב-package.json (^1.2.3)?",
    answers: [
      "גרסה מדויקת בלבד",
      "מאפשר עדכוני MINOR ו-PATCH",
      "מאפשר רק PATCH",
      "הגרסה האחרונה תמיד"
    ],
    correct: 1,
    explanation: "^1.2.3 מאפשר עדכונים תואמים לאחור: 1.2.4, 1.3.0 אבל לא 2.0.0."
  },
  {
    question: "איך בודקים אילו חבילות מיושנות?",
    answers: ["npm check", "npm outdated", "npm old", "npm list --old"],
    correct: 1,
    explanation: "npm outdated מציג רשימה של חבילות שיש להן גרסאות חדשות יותר."
  }
];
