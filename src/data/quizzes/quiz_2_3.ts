import type { Quiz } from "../../types";

// Quiz for Day 2, Lesson 3 - REST API Design
export const quiz_2_3: Quiz = [
  {
    question: "מהו REST?",
    answers: [
      "שפת תכנות",
      "סגנון ארכיטקטורה ל-APIs",
      "מסד נתונים",
      "פרוטוקול רשת"
    ],
    correct: 1,
    explanation:
      "REST (Representational State Transfer) הוא סגנון ארכיטקטורה לעיצוב APIs."
  },
  {
    question: "איזה HTTP method משמש לקבלת נתונים (Read)?",
    answers: ["POST", "GET", "PUT", "DELETE"],
    correct: 1,
    explanation:
      "GET משמש לקריאת נתונים. הוא idempotent (ללא side effects) ו-cacheable."
  },
  {
    question: "איזה HTTP method משמש ליצירת משאב חדש?",
    answers: ["GET", "POST", "PUT", "PATCH"],
    correct: 1,
    explanation: "POST משמש ליצירת משאב חדש. השרת מחליט על ה-ID של המשאב."
  },
  {
    question: "מה ההבדל בין PUT ל-PATCH?",
    answers: [
      "אין הבדל",
      "PUT מחליף משאב שלם, PATCH מעדכן חלקית",
      "PATCH מהיר יותר",
      "PUT רק ליצירה"
    ],
    correct: 1,
    explanation: "PUT מחליף את כל המשאב, PATCH מעדכן רק שדות ספציפיים."
  },
  {
    question: "איזה status code נכון ליצירת משאב בהצלחה?",
    answers: ["200 OK", "201 Created", "204 No Content", "301 Moved"],
    correct: 1,
    explanation:
      "201 Created מציין שמשאב חדש נוצר בהצלחה, בדרך כלל עם Location header."
  },
  {
    question: "מהו RESTful endpoint נכון לקבלת משתמש בודד?",
    answers: [
      "GET /getUser?id=123",
      "GET /users/123",
      "GET /user/get/123",
      "POST /users/123"
    ],
    correct: 1,
    explanation:
      "REST משתמש ב-nouns (resources) לא verbs: GET /users/123 (לא /getUser)."
  },
  {
    question: "מה זה idempotent operation?",
    answers: [
      "פעולה מהירה",
      "פעולה שנותנת אותה תוצאה גם אם נריץ אותה כמה פעמים",
      "פעולה שתמיד נכשלת",
      "פעולה שצריכה authentication"
    ],
    correct: 1,
    explanation:
      "Idempotent = אותה תוצאה בכל פעם. GET, PUT, DELETE הם idempotent. POST לא."
  },
  {
    question: "איזה status code נכון למשאב שלא נמצא?",
    answers: [
      "400 Bad Request",
      "404 Not Found",
      "500 Internal Error",
      "403 Forbidden"
    ],
    correct: 1,
    explanation:
      "404 Not Found - המשאב לא קיים. 400 = bad syntax, 403 = אין הרשאה, 500 = server error."
  },
  {
    question: "מהו pagination ב-API?",
    answers: [
      "מחיקת דפים",
      "חלוקת תוצאות לעמודים (limit/offset או page/size)",
      "קריאה חוזרת",
      "סוג של cache"
    ],
    correct: 1,
    explanation:
      "Pagination מחלק תוצאות רבות לעמודים: GET /users?page=2&limit=20."
  },
  {
    question: "מהי best practice לversioningב-REST API?",
    answers: [
      "לא צריך versioning",
      "לשים גרסה ב-URL או header (/api/v1/users)",
      "להשתמש רק ב-query params",
      "לשנות port לכל גרסה"
    ],
    correct: 1,
    explanation:
      "API versioning ב-URL (GET /api/v1/users) או header מאפשר backward compatibility."
  }
];
