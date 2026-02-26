import type { Quiz } from "../../types";

// Quiz for Day 4, Lesson 3 - Advanced Node
export const quiz_4_3: Quiz = [
  {
    question: "מהו AsyncLocalStorage?",
    answers: [
      "localStorage אסינכרוני",
      "מנגנון לשמירת context לאורך async operations",
      "סוג של database",
      "cache mechanism"
    ],
    correct: 1,
    explanation:
      "AsyncLocalStorage שומר state שנגיש בכל הasync chain - כמו thread-local storage."
  },
  {
    question: "למה AsyncLocalStorage שימושי?",
    answers: [
      "לשמירת קבצים",
      "למעקב request ID, user, logging בלי prop drilling",
      "לhashing",
      "לencryption"
    ],
    correct: 1,
    explanation:
      "AsyncLocalStorage נותן גישה ל-context (user, requestId) בכל מקום בלי להעביר parameters."
  },
  {
    question: "מהו EventEmitter?",
    answers: [
      "HTTP server",
      "Class לניהול events - pub/sub pattern",
      "WebSocket library",
      "Logging tool"
    ],
    correct: 1,
    explanation:
      "EventEmitter מאפשר publish/subscribe pattern - emit events, listen עם .on()."
  },
  {
    question: "מהם Worker Threads?",
    answers: [
      "HTTP workers",
      "Threads לריצת JavaScript code במקביל",
      "Database connections",
      "Async functions"
    ],
    correct: 1,
    explanation:
      "Worker Threads מאפשרים multi-threading ב-Node.js - מצוין ל-CPU intensive tasks."
  },
  {
    question: "מתי להשתמש ב-Worker Threads?",
    answers: [
      "לכל פעולה",
      "לחישובים כבדים (CPU-intensive) - image processing, encryption, calculations",
      "ל-I/O operations",
      "ל-HTTP requests"
    ],
    correct: 1,
    explanation:
      "Worker Threads ל-CPU tasks. I/O operations (files, network) כבר non-blocking עם Event Loop."
  },
  {
    question: "מהי memory leak?",
    answers: [
      "שגיאה בקוד",
      "זיכרון שלא משתחרר כי יש references שלא נמחקו",
      "database error",
      "network issue"
    ],
    correct: 1,
    explanation:
      "Memory leak = אובייקטים שנשארים בזיכרון כי יש references (event listeners, closures, caches)."
  },
  {
    question: "איך מונעים memory leaks עם event listeners?",
    answers: [
      "לא צריך",
      "להסיר listeners עם .removeListener() או .off()",
      "להשתמש רק ב-once()",
      "לרסטרט את השרת"
    ],
    correct: 1,
    explanation:
      "תמיד להסיר event listeners שלא נחוצים: emitter.removeListener() או emitter.off()."
  },
  {
    question: "מהו process.memoryUsage()?",
    answers: [
      "מנקה זיכרון",
      "מחזיר מידע על שימוש בזיכרון",
      "מגדיל heap",
      "עוצר תהליך"
    ],
    correct: 1,
    explanation:
      "process.memoryUsage() מראה: rss, heapTotal, heapUsed, external - לניטור זיכרון."
  },
  {
    question: "מהו Graceful Shutdown?",
    answers: [
      "כיבוי מיידי",
      "סגירה מסודרת - סיום requests, סגירת connections, cleanup",
      "restart אוטומטי",
      "error handling"
    ],
    correct: 1,
    explanation:
      "Graceful Shutdown מאזין ל-SIGTERM/SIGINT, מסיים requests פעילים, סוגר DB, ואז יוצא."
  },
  {
    question: "איך מטפלים ב-SIGTERM signal?",
    answers: [
      "מתעלמים",
      "מאזינים עם process.on('SIGTERM') ועושים cleanup",
      "זה קורה אוטומטית",
      "משתמשים ב-try/catch"
    ],
    correct: 1,
    explanation:
      "process.on('SIGTERM') תופס shutdown signal - מאפשר לסגור connections לפני exit."
  }
];
