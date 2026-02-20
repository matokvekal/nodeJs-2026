// Quiz for Day 3, Lesson 4 - Security Deep Dive
export const quiz_3_4 = [
  {
    question: "מהו Helmet ב-Express?",
    answers: [
      "כובע",
      "Middleware שמוסיף security headers",
      "Authentication library",
      "Database tool"
    ],
    correct: 1,
    explanation:
      "Helmet מוסיף security headers (CSP, HSTS, X-Frame-Options) כדי להגן מפני attacks."
  },
  {
    question: "מהו CORS?",
    answers: [
      "סוג של attack",
      "Cross-Origin Resource Sharing - מנגנון שמאפשר/חוסם גישה בין domains",
      "Database protocol",
      "Encryption method"
    ],
    correct: 1,
    explanation: "CORS מאפשר לשרת לקבוע איזה origins יכולים לגשת ל-API שלו."
  },
  {
    question: "מהו XSS attack?",
    answers: [
      "SQL injection",
      "Cross-Site Scripting - הזרקת JavaScript זדונית",
      "Password cracking",
      "DDoS attack"
    ],
    correct: 1,
    explanation:
      "XSS = תוקף מזריק <script> זדוני שרץ אצל משתמשים אחרים. מונעים עם sanitization ו-CSP."
  },
  {
    question: "מהו SQL Injection?",
    answers: [
      "XSS attack",
      "הזרקת SQL queries זדוניות דרך input",
      "Password attack",
      "Network attack"
    ],
    correct: 1,
    explanation:
      "SQL Injection = תוקף מזריק SQL code דרך input. מונעים עם prepared statements/parameterized queries."
  },
  {
    question: "מהו Rate Limiting?",
    answers: [
      "הגבלת רוחב פס",
      "הגבלת מספר בקשות לשרת בזמן נתון",
      "סינון נתונים",
      "Validation"
    ],
    correct: 1,
    explanation:
      "Rate Limiting מגביל כמה בקשות משתמש יכול לבצע (למשל 100/15 דקות) - מונע brute force."
  },
  {
    question: "מהו BOLA (IDOR)?",
    answers: [
      "סוג של encryption",
      "Broken Object Level Authorization - גישה לresources של משתמשים אחרים",
      "Authentication protocol",
      "Database type"
    ],
    correct: 1,
    explanation:
      "BOLA = תוקף משנה ID ב-URL (/api/users/123 → /api/users/456) וניגש לנתונים שלא שלו."
  },
  {
    question: "איך מונעים BOLA?",
    answers: [
      "Rate limiting",
      "בדיקה שהמשתמש מורשה לגשת ל-resource הספציפי",
      "CORS",
      "HTTPS"
    ],
    correct: 1,
    explanation:
      "תמיד לבדוק ב-middleware: האם user_id = resource.owner_id לפני החזרת נתונים."
  },
  {
    question: "מהו Input Sanitization?",
    answers: [
      "מחיקת נתונים",
      "ניקוי/פילטור input להסרת תווים מסוכנים",
      "Validation",
      "Encryption"
    ],
    correct: 1,
    explanation:
      "Sanitization מנקה input (הסרת HTML tags, escape characters) להגנה מפני XSS."
  },
  {
    question: "למה לא לשמור secrets (API keys) בקוד?",
    answers: [
      "זה לא מהיר",
      "הם נחשפים ב-git וב-source code",
      "זה לא עובד",
      "זה דורש permission"
    ],
    correct: 1,
    explanation:
      "Secrets ב-code נחשפים ב-git history. תמיד להשתמש ב-.env files (ולא לcommit אותם!)."
  },
  {
    question: "מהו CSP (Content Security Policy)?",
    answers: [
      "CSS framework",
      "Header שמגביל מאיפה ניתן לטעון resources (scripts, styles, images)",
      "Authentication method",
      "Database security"
    ],
    correct: 1,
    explanation:
      "CSP header מגדיר מאיפה מותר לטעון JavaScript/CSS/images - מונע XSS attacks."
  }
];
