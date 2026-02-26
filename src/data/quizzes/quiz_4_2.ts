import type { Quiz } from "../../types";

// Quiz for Day 4, Lesson 2 - Crypto in Node
export const quiz_4_2: Quiz = [
  {
    question: "מהו hashing?",
    answers: [
      "הצפנה דו-כיוונית",
      "המרה חד-כיוונית של נתונים לערך קבוע",
      "דחיסה",
      "encoding"
    ],
    correct: 1,
    explanation:
      "Hashing = פונקציה חד-כיוונית שממירה input לערך קבוע. לא ניתן לחזור מהhash למקור."
  },
  {
    question: "מהו SHA-256?",
    answers: [
      "אלגוריתם הצפנה",
      "אלגוריתם hashing קריפטוגרפי",
      "password manager",
      "compression algorithm"
    ],
    correct: 1,
    explanation:
      "SHA-256 הוא hash algorithm שמייצר 256-bit hash. משמש לintegrity checks, fingerprints."
  },
  {
    question: "מהו HMAC?",
    answers: [
      "סוג של hash",
      "Hash-based Message Authentication Code - hashing עם secret key",
      "encryption algorithm",
      "password hashing"
    ],
    correct: 1,
    explanation:
      "HMAC = hash + secret key. משמש לאימות שההודעה לא שונתה (webhooks, API signatures)."
  },
  {
    question: "מה ההבדל בין symmetric ל-asymmetric encryption?",
    answers: [
      "אין הבדל",
      "Symmetric = מפתח אחד, Asymmetric = זוג מפתחות (public/private)",
      "Symmetric מהיר יותר תמיד",
      "Asymmetric רק להצפנה"
    ],
    correct: 1,
    explanation:
      "Symmetric (AES) = אותו מפתח להצפנה ופענוח. Asymmetric (RSA) = public key להצפנה, private לפענוח."
  },
  {
    question: "מהו AES?",
    answers: [
      "Hash algorithm",
      "Advanced Encryption Standard - אלגוריתם הצפנה symmetric",
      "Authentication protocol",
      "Public key encryption"
    ],
    correct: 1,
    explanation:
      "AES הוא הסטנדרט ל-symmetric encryption. מהיר ובטוח (AES-256-GCM מומלץ)."
  },
  {
    question: "מהו IV (Initialization Vector)?",
    answers: [
      "שם של algorithm",
      "ערך אקראי שמונע זיהוי דפוסים בהצפנה",
      "סוג של key",
      "hash function"
    ],
    correct: 1,
    explanation:
      "IV = random value שמשתמש בכל הצפנה כדי שאותו plaintext ייתן ciphertext שונה."
  },
  {
    question: "מהו RSA?",
    answers: [
      "Symmetric encryption",
      "Asymmetric encryption algorithm",
      "Hash function",
      "Random generator"
    ],
    correct: 1,
    explanation:
      "RSA = asymmetric algorithm. משתמש ב-public key להצפנה ו-private key לפענוח."
  },
  {
    question: "למה משתמשים ב-crypto.randomBytes()?",
    answers: [
      "Hashing",
      "יצירת ערכים אקראיים cryptographically secure",
      "Encryption",
      "Compression"
    ],
    correct: 1,
    explanation:
      "randomBytes() מייצר מספרים אקראיים בטוחים - לtokens, IVs, salts, session IDs."
  },
  {
    question: "מהו PBKDF2?",
    answers: [
      "Encryption algorithm",
      "Password-Based Key Derivation - hashing איטי לסיסמאות",
      "Random generator",
      "Compression"
    ],
    correct: 1,
    explanation:
      "PBKDF2 עובד iterations רבות כדי להאט brute force. משמש ל-password hashing."
  },
  {
    question: "מתי משתמשים ב-digital signature?",
    answers: [
      "להצפנת נתונים",
      "לאימות שההודעה באמת מהשולח ולא שונתה",
      "לcompress נתונים",
      "לhashing"
    ],
    correct: 1,
    explanation:
      "Digital signature מאמתת מקור ושלמות. חותמים עם private key, מאמתים עם public key."
  }
];
