// Quiz for Day 3, Lesson 3 - Authentication & Authorization
export const quiz_3_3 = [
  {
    question: "מה ההבדל בין Authentication ל-Authorization?",
    answers: [
      "אין הבדל",
      "Authentication = מי אתה, Authorization = מה מותר לך",
      "Authentication מהיר יותר",
      "Authorization רק ב-APIs"
    ],
    correct: 1,
    explanation:
      "Authentication מאמת זהות (login), Authorization בודק הרשאות (האם מותר לבצע פעולה)."
  },
  {
    question: "מהו JWT?",
    answers: [
      "סוג של database",
      "JSON Web Token - טוקן חתום לאימות",
      "JavaScript Testing Tool",
      "HTTP header"
    ],
    correct: 1,
    explanation: "JWT הוא טוקן שמכיל claims (נתונים) ונחתם כדי לאמת אותנטיות."
  },
  {
    question: "ממה מורכב JWT?",
    answers: [
      "רק payload",
      "Header.Payload.Signature (3 חלקים מופרדים בנקודות)",
      "Username + Password",
      "Access Token + Refresh Token"
    ],
    correct: 1,
    explanation:
      "JWT = Header (אלגוריתם).Payload (נתונים).Signature (חתימה) מקודדים ב-base64."
  },
  {
    question: "איך שומרים סיסמאות ב-database?",
    answers: ["Plain text", "Hash מוצפן (bcrypt, argon2)", "Base64", "JWT"],
    correct: 1,
    explanation:
      "אסור לשמור סיסמאות plain text! תמיד hash עם bcrypt/argon2/scrypt."
  },
  {
    question: "מהו bcrypt?",
    answers: [
      "סוג של encryption",
      "אלגוריתם hashing לסיסמאות עם salt",
      "JWT library",
      "database"
    ],
    correct: 1,
    explanation:
      "bcrypt הוא hashing function איטי במיוחד (+ salt) - מושלם לסיסמאות."
  },
  {
    question: "מהו salt ב-hashing?",
    answers: [
      "תבלין",
      "מחרוזת אקראית שמתווספת לסיסמה לפני hash",
      "סוג של encryption",
      "הסיסמה עצמה"
    ],
    correct: 1,
    explanation: "Salt = מחרוזת אקראית שמונעת rainbow table attacks על hash."
  },
  {
    question: "איפה שומרים JWT בצד הclient?",
    answers: [
      "localStorage (לא מומלץ)",
      "httpOnly cookie (מומלץ)",
      "sessionStorage",
      "כל התשובות אפשריות, cookie הכי בטוח"
    ],
    correct: 3,
    explanation:
      "httpOnly cookie הכי בטוח (לא נגיש ל-JavaScript), אבל localStorage/sessionStorage נפוצים."
  },
  {
    question: "מהו Refresh Token?",
    answers: [
      "טוקן רגיל",
      "טוקן לקבלת Access Token חדש כשהישן פג",
      "ביטול של טוקן",
      "סוג של JWT"
    ],
    correct: 1,
    explanation:
      "Refresh Token חי יותר זמן ומשמש לקבלת Access Token חדש מבלי login מחדש."
  },
  {
    question: "מהו RBAC?",
    answers: [
      "Redis-Based Authentication",
      "Role-Based Access Control - הרשאות לפי תפקידים",
      "REST API Controller",
      "Random Authentication"
    ],
    correct: 1,
    explanation:
      "RBAC = ניהול הרשאות לפי תפקידים (admin, user, moderator) ולא לפי משתמש ספציפי."
  },
  {
    question: "איך בודקים JWT token ב-middleware?",
    answers: [
      "פשוט קוראים אותו",
      "מאמתים חתימה עם jwt.verify() והסוד",
      "מפענחים ב-base64",
      "שולחים לשרת חיצוני"
    ],
    correct: 1,
    explanation: "jwt.verify(token, secret) בודק שהחתימה תקינה ושהטוקן לא פג."
  }
];
