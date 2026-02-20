// Quiz for Day 4, Lesson 4 - Testing & Code Quality
export const quiz_4_4 = [
  {
    question: "מהו Unit Test?",
    answers: [
      "בדיקת כל האפליקציה",
      "בדיקת פונקציה/מודול בודד בבידוד",
      "בדיקת UI",
      "בדיקת performance"
    ],
    correct: 1,
    explanation:
      "Unit Test בודק יחידה קטנה (פונקציה, class) בבידוד - מהיר ומדויק."
  },
  {
    question: "מהו Integration Test?",
    answers: [
      "Unit test",
      "בדיקת אינטגרציה בין מודולים/שירותים",
      "UI test",
      "Security test"
    ],
    correct: 1,
    explanation:
      "Integration Test בודק שמודולים שונים עובדים ביחד (API + DB, routes + controllers)."
  },
  {
    question: "איזו ספרייה פופולרית לtesting ב-Node.js?",
    answers: ["Jest", "Mocha", "Vitest", "כל התשובות נכונות"],
    correct: 3,
    explanation:
      "Jest, Mocha, Vitest, AVA - כולן ספריות testing מצוינות. Jest הכי פופולרי."
  },
  {
    question: "מהו mock ב-testing?",
    answers: [
      "טסט אמיתי",
      "החלפת dependency (DB, API) בגרסה מזויפת לבדיקה",
      "שגיאה",
      "framework"
    ],
    correct: 1,
    explanation:
      "Mock = fake object שמחליף dependency (DB, external API) כדי לבדוק לוגיקה בבידוד."
  },
  {
    question: "מהו TDD?",
    answers: [
      "Testing During Development",
      "Test-Driven Development - כתיבת טסט לפני הקוד",
      "Test Database Development",
      "Type Detection"
    ],
    correct: 1,
    explanation:
      "TDD = כותבים test שנכשל, אז קוד שעובר, ואז refactor. Red → Green → Refactor."
  },
  {
    question: "מהו assertion ב-testing?",
    answers: [
      "הרצת הקוד",
      "בדיקה שערך תואם לציפייה (expect(x).toBe(y))",
      "mock",
      "cleanup"
    ],
    correct: 1,
    explanation:
      "Assertion בודק תוצאה: expect(result).toBe(5) - אם לא מתאים, הטסט נכשל."
  },
  {
    question: "מהו code coverage?",
    answers: [
      "מספר השורות בקוד",
      "אחוז הקוד שמכוסה בטסטים",
      "מהירות הטסטים",
      "מספר הטסטים"
    ],
    correct: 1,
    explanation: "Code coverage מודד כמה % מהקוד רץ בטסטים. 80%+ נחשב טוב."
  },
  {
    question: "מהו ESLint?",
    answers: [
      "Testing framework",
      "כלי לבדיקת איכות קוד ואכיפת כללים",
      "Compiler",
      "Database tool"
    ],
    correct: 1,
    explanation:
      "ESLint בודק code style, מוצא bugs פוטנציאליים, ואוכף best practices."
  },
  {
    question: "מהו Prettier?",
    answers: [
      "Testing tool",
      "Code formatter שמסדר את הקוד אוטומטית",
      "Linter",
      "Debugger"
    ],
    correct: 1,
    explanation:
      "Prettier מעצב קוד אוטומטית (indentation, spacing, quotes) - עובד עם ESLint."
  },
  {
    question: "מהו CI/CD?",
    answers: [
      "Testing framework",
      "Continuous Integration/Deployment - אוטומציה של testing ופרסום",
      "Code editor",
      "Database"
    ],
    correct: 1,
    explanation:
      "CI/CD מריץ טסטים אוטומטית בכל commit ומפרסם לייצור אם הכל עבר."
  }
];
