import { quiz_1_1 } from "../../data/quizzes/quiz_1_1.js";

export const slides = [
  {
    id: 1,
    type: "title",
    title: "Modern Node.js Runtime 2026",
    subtitle: "איך Node.js עובד מבפנים",
    bullets: [
      "V8 Engine – קומפילציה JIT ומנגנון זיכרון",
      "libuv – Event Loop ו-Thread Pool",
      "Non-Blocking I/O – ליבת הפרדיגמה",
      "Built-in APIs מודרניים – fetch, AbortController, --watch",
      "ניהול שגיאות עם try / catch / finally"
    ]
  },
  {
    id: 2,
    title: "מה זה Node.js?",
    bullets: [
      "סביבת ריצה לـ JavaScript מחוץ לדפדפן – בנויה על מנוע V8 של Chrome",
      "מאפשר לכתוב קוד שרת, כלי command-line ואוטומציה ב-JavaScript",
      "אירוע-מונחה (Event-Driven), לא-חוסם (Non-Blocking I/O)",
      "רץ על Windows, Mac, Linux – חד-תהליכוני אך עם יכולת עבודה מקבילית",
      "מהיר מאוד לפעולות I/O: קריאת קבצים, בקשות HTTP, מסד נתונים",
      "לא מתאים לחישובים CPU כבדים – לכך יש worker_threads"
    ],
    code: `// שרת HTTP פשוט ב-Node.js – 5 שורות!
import { createServer } from "node:http";

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("שלום עולם מ-Node.js!\\n");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});

// הרצה: node --watch server.mjs
// פלט: Server running at http://localhost:3000/`,
    note: "Node.js הוא לא שפה – JavaScript היא השפה. Node.js הוא סביבת ריצה"
  },
  {
    id: 3,
    title: "V8 – מנוע ה-JavaScript",
    bullets: [
      "מנוע JavaScript בקוד פתוח של Google – מריץ גם Chrome וגם Node.js",
      "מתרגם JavaScript לקוד מכונה ישירות (Just-In-Time compilation)",
      "מנהל זיכרון: Heap לאובייקטים, Stack לקריאות פונקציות",
      "Garbage Collector: Scavenge לאובייקטים חדשים, Mark-Sweep לישנים",
      "New Space (2MB) לאובייקטים קצרי חיים, Old Space (1GB+) לאובייקטים שורדים",
      "V8 מיישם את כל תכונות ES2015+ ומעלה"
    ],
    code: `// V8 Heap Statistics
import v8 from "node:v8";

const heapStats = v8.getHeapStatistics();

console.log("=== V8 Heap Memory ===");
console.log(\`Total Heap: \${(heapStats.total_heap_size / 1024 / 1024).toFixed(2)} MB\`);
console.log(\`Used Heap:  \${(heapStats.used_heap_size  / 1024 / 1024).toFixed(2)} MB\`);
console.log(\`Heap Limit: \${(heapStats.heap_size_limit / 1024 / 1024).toFixed(2)} MB\`);

const percentUsed = (
  (heapStats.used_heap_size / heapStats.heap_size_limit) * 100
).toFixed(2);
console.log(\`Usage: \${percentUsed}%\`);`,
    animation: "heap",
    note: "process.memoryUsage() – בדיקת שימוש בזיכרון בזמן אמת"
  },
  {
    id: 4,
    title: "libuv – ספריית ה-Async",
    bullets: [
      "ספריית C בקוד פתוח שמספקת Event Loop ו-Thread Pool לـ Node.js",
      "מנהלת I/O אסינכרוני: קבצים, רשת, DNS, Timer",
      "Thread Pool (ברירת מחדל: 4 threads) – לפעולות שה-OS לא תומך בהן אסינכרונית",
      "ניתן לשנות גודל ה-Thread Pool: UV_THREADPOOL_SIZE=8",
      "פעולות שמשתמשות ב-Pool: fs, crypto, dns.lookup, zlib",
      "רשת (TCP/UDP) – ישירות עם OS, לא דרך Thread Pool"
    ],
    code: `// 8 פעולות crypto במקביל עם Thread Pool
import crypto from "node:crypto";

const promises = Array.from({ length: 8 }, (_, i) =>
  new Promise((resolve) => {
    crypto.pbkdf2("password", "salt", 100_000, 64, "sha512",
      (err, key) => resolve({ task: i + 1, done: true })
    );
  })
);

console.time("8 tasks");
await Promise.all(promises);
console.timeEnd("8 tasks");
// עם 4 threads: ~2 batches
// עם UV_THREADPOOL_SIZE=8: ~1 batch (מהיר יותר!)`,
    animation: "threadpool",
    note: "Thread Pool = פתרון לפעולות blocking ללא חסימת Event Loop"
  },
  {
    id: 5,
    title: "Event Loop – שלבים (Phases)",
    bullets: [
      "ה-Event Loop הוא לב פועם של Node.js – מריץ callback אחר callback",
      "timers – מריץ callbacks של setTimeout ו-setInterval שפג תוקפם",
      "pending callbacks – callbacks של שגיאות I/O מהסבב הקודם",
      "poll – מחכה ל-I/O חדש ומריץ callbacks שלו (רוב העבודה מתבצעת כאן)",
      "check – מריץ callbacks של setImmediate",
      "close callbacks – סגירת סוקטים ומשאבים"
    ],
    code: `// סדר ביצוע Event Loop
console.log("1: Synchronous");

process.nextTick(() => console.log("2: nextTick (highest priority)"));
Promise.resolve().then(() => console.log("3: Promise microtask"));
queueMicrotask(() => console.log("4: queueMicrotask"));
setTimeout(() => console.log("5: setTimeout – timers phase"), 0);
setImmediate(() => console.log("6: setImmediate – check phase"));

console.log("7: More synchronous");

// פלט צפוי: 1, 7, 2, 3, 4, 5, 6`,
    animation: "eventloop",
    note: "nextTick > Promise.then > queueMicrotask > setTimeout > setImmediate"
  },
  {
    id: 6,
    title: "Microtasks vs Macrotasks",
    bullets: [
      "Microtasks מתבצעים מיד אחרי כל callback, לפני המשך ה-Event Loop",
      "process.nextTick – עדיפות גבוהה ביותר, רץ לפני כל microtask",
      "Promise.then / catch / finally → תור microtask",
      "Macrotasks: setTimeout, setInterval, setImmediate, I/O callbacks",
      "יותר מדי Microtasks ברצף יכולים לחסום Macrotasks (starvation)"
    ],
    comparison: {
      headers: ["תכונה", "Microtasks", "Macrotasks"],
      rows: [
        [
          "דוגמאות",
          "Promise.then, nextTick, queueMicrotask",
          "setTimeout, setInterval, setImmediate, I/O"
        ],
        [
          "עדיפות",
          "גבוהה – לפני כל macrotask הבא",
          "נמוכה – לפי שלבי Event Loop"
        ],
        [
          "מתי רץ",
          "אחרי כל callback, לפני שלב הבא",
          "בשלבים מוגדרים של Event Loop"
        ],
        ["חסימה אפשרית?", "כן – יותר מדי = starvation", "לא – כל שלב מוגבל"]
      ]
    },
    code: `// סדר ריצה: Microtasks לפני Macrotasks
console.log("1: sync start");

setTimeout(() => console.log("5: macrotask (setTimeout)"), 0);
setImmediate(() => console.log("6: macrotask (setImmediate)"));

Promise.resolve()
  .then(() => console.log("3: microtask (Promise)"))
  .then(() => console.log("4: microtask (Promise chain)"));

process.nextTick(() => console.log("2: microtask (nextTick – first!)"));

console.log("7: sync end");

// פלט: 1 → 7 → 2 → 3 → 4 → 5 → 6
// nextTick > Promise.then > setTimeout > setImmediate`,
    note: "  מנגנון הבנה זה חיוני לאבחון בעיות אסינכרוניות"
  },
  {
    id: 7,
    title: "setImmediate vs setTimeout(0)",
    bullets: [
      "setTimeout(fn, 0) – מריץ callback ב-timers phase, לא מיידי",
      "setImmediate(fn) – מריץ callback ב-check phase, אחרי ה-poll",
      "בתוך callback של I/O: setImmediate תמיד לפני setTimeout(fn,0)",
      "מחוץ ל-I/O callback: הסדר אינו מובטח ותלוי בזמן ריצה",
      "process.nextTick רץ לפני שניהם – שימוש בזהירות!"
    ],
    comparison: {
      headers: ["היבט", "setImmediate", "setTimeout(0)"],
      rows: [
        ["שלב", "check phase", "timers phase"],
        ["בתוך I/O callback", "תמיד ראשון ✅", "אחרי setImmediate"],
        ["מחוץ ל-I/O", "לא מובטח", "לא מובטח"],
        ["המלצה", "עדיף – יותר צפוי", "השתמש ב-setImmediate"]
      ]
    },
    code: `import { readFile } from "node:fs/promises";

// מחוץ ל-I/O: סדר לא מובטח
setTimeout(() => console.log("setTimeout (מחוץ)"), 0);
setImmediate(() => console.log("setImmediate (מחוץ)"));
// יכול להיות כל סדר!

// בתוך I/O callback: setImmediate תמיד ראשון
readFile("./package.json", "utf8", () => {
  setTimeout(() => console.log("setTimeout (I/O)"), 0);
  setImmediate(() => console.log("setImmediate (I/O) ← ראשון תמיד!"));
});

// process.nextTick לפני כולם:
process.nextTick(() => console.log("nextTick – לפני הכל!"));`,
    note: "ב-99% מהמקרים: בתוך I/O callback – setImmediate תמיד ראשון"
  },
  {
    id: 8,
    title: "Non-Blocking I/O",
    bullets: [
      "Node.js שולח פעולות I/O לـ libuv וממשיך מיד לעבוד",
      "אין המתנה ('חסימה') עד שהפעולה מסתיימת",
      "שרת אחד יכול לטפל באלפי בקשות מקביליות",
      "אנלוגיה: מלצר שמגיש ל-50 שולחנות ולא ממתין ליד כל אחד",
      "חשוב: חישובים כבדים בלולאה הראשית חוסמים את כולם!",
      "פתרון לחישובים: worker_threads או child_process"
    ],
    code: `import { readFile } from "node:fs/promises";

console.log("Start reading file...");

// Non-blocking – Node.js ממשיך מיד
readFile("./package.json", "utf8")
  .then((data) => {
    console.log("File read complete!");
    console.log("File size:", data.length, "chars");
  });

// שורה זו רצה לפני שהקובץ נקרא!
console.log("This runs BEFORE the file is read");

for (let i = 0; i < 3; i++) {
  console.log(\`Processing item \${i + 1}\`);
}
// פלט: Start → This runs → Processing 1,2,3 → File read`,
    note: "❌ fs.readFileSync חוסם את כל האפליקציה · ✅ fs.readFile אסינכרוני"
  },
  {
    id: 9,
    title: "אובייקט process",
    bullets: [
      "process.env – גישה למשתני סביבה (process.env.PORT, NODE_ENV)",
      "process.argv – מערך הארגומנטים שהועברו בהרצת הסקריפט",
      "process.exit(code) – יציאה מהתהליך; קוד 0 = הצלחה",
      "process.on('uncaughtException', handler) – תפיסת שגיאות לא מטופלות",
      "process.on('unhandledRejection', handler) – תפיסת Promise לא מטופל",
      "process.memoryUsage() – מידע על שימוש זיכרון בזמן אמת"
    ],
    code: `// שימוש ב-process object
const port = Number(process.env.PORT) || 3000;
console.log("Node Env:", process.env.NODE_ENV);
console.log("Server port:", port);

// CLI arguments: node app.js --name=Israel
const args = process.argv.slice(2);
const nameArg = args.find(a => a.startsWith("--name="));
const name = nameArg?.split("=")[1] || "Anonymous";
console.log("Hello,", name);

// Global error handlers
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});`,
    note: "process = ממשק ישיר לסביבת הריצה של Node.js"
  },
  {
    id: 10,
    title: "Built-in Fetch (Node 18+)",
    bullets: [
      "Node.js 18+ מגיע עם fetch מובנה – אין צורך ב-axios לשימושים פשוטים",
      "מבוסס על ספריית undici – לקוח HTTP מהיר ומודרני",
      "API זהה לـ fetch בדפדפן – קריאה אחידה בשרת ולקוח",
      "חשוב: fetch לא זורק שגיאה על 404/500 – יש לבדוק response.ok",
      "תומך ב-AbortController לביטול בקשות",
      "response.json() ניתן לקריאה פעם אחת בלבד!"
    ],
    code: `// GET request
async function fetchData() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/todos/1"
  );

  // ⚠️ חובה לבדוק status ידנית!
  if (!response.ok) {
    throw new Error(\`HTTP error: \${response.status}\`);
  }

  const data = await response.json();
  console.log("Title:", data.title);
}

// POST request
async function createPost() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Node.js 2026", userId: 1 })
    }
  );
  const newPost = await response.json();
  console.log("Created:", newPost.id);
}`,
    note: "fetch זורק שגיאה רק על network errors – לא על 404/500!"
  },
  {
    id: 11,
    title: "AbortController ו-AbortSignal",
    bullets: [
      "AbortController מאפשר לבטל פעולות אסינכרוניות בצורה אחידה",
      "controller.abort() – שולח signal לביטול לכל מי שמאזין",
      "AbortSignal.timeout(ms) – יוצר signal שמתבטל אוטומטית אחרי זמן",
      "AbortSignal.any([sig1, sig2]) – ביטול כשאחד מה-signals מופעל",
      "עובד עם: fetch, fs.readFile, EventEmitter, Streams",
      "מנגנון מפתח למניעת דליפות זיכרון ולטיפול נכון ב-timeout"
    ],
    code: `// AbortSignal.timeout – הכי פשוט
try {
  const res = await fetch("https://slow-api.example.com", {
    signal: AbortSignal.timeout(3000) // ביטול אחרי 3 שניות
  });
  const data = await res.json();
} catch (err) {
  if (err.name === "TimeoutError") {
    console.log("Request timed out!");
  }
}

// AbortSignal.any – ביטול מריבוי מקורות
const userCancel = new AbortController();
const combined = AbortSignal.any([
  userCancel.signal,
  AbortSignal.timeout(5000)
]);

const res = await fetch("https://api.example.com/data", {
  signal: combined
});`,
    note: "AbortController = כפתור 'ביטול' אוניברסלי לפעולות אסינכרוניות"
  },
  {
    id: 12,
    title: "כלים מודרניים: --watch, --env-file, node:test",
    bullets: [
      "node --watch server.js – מפעיל מחדש אוטומטית כשקובץ משתנה (Node 18+)",
      "node --env-file=.env server.js – טוען משתני סביבה מקובץ (Node 20.6+)",
      "node:test – מודול בדיקות מובנה, ללא צורך ב-Jest/Mocha (Node 18+)",
      "הרצת בדיקות: node --test *.test.js",
      "שלושת הכלים מפחיתים תלות בחבילות חיצוניות",
      "node --version – תמיד להריץ לפני להבטיח גרסה נכונה"
    ],
    code: `// --watch: תחליף מובנה ל-nodemon
node --watch server.js
node --watch-path=./src server.js

// --env-file: תחליף מובנה לـ dotenv
// .env:
// PORT=4000
// NODE_ENV=development
node --env-file=.env server.js

// node:test: בדיקות מובנות
import { test, describe } from "node:test";
import assert from "node:assert";

describe("Math operations", () => {
  test("addition", () => {
    assert.strictEqual(1 + 1, 2);
  });
});
// הרצה: node --test app.test.js`,
    comparison: {
      headers: ["כלי", "node --watch", "nodemon"],
      rows: [
        ["התקנה", "מובנה!", "npm install -D nodemon"],
        ["תלויות", "אפס", "חבילת npm"],
        ["קונפיגורציה", "מינימלית", "nodemon.json"]
      ]
    }
  },
  {
    id: 13,
    title: "try / catch / finally לניקוי משאבים",
    bullets: [
      "try – קוד שעלול לזרוק שגיאה",
      "catch(err) – מטפל בשגיאה; err.message, err.name, err.stack",
      "finally – רץ תמיד, גם אם יש שגיאה וגם אם אין (גם אחרי return!)",
      "שימוש מרכזי ב-finally: סגירת חיבורים, שחרור locks, ניקוי resources",
      "עם async/await: catch תופס גם rejections של Promises",
      "לעולם לא להשאיר catch ריק בייצור – תמיד לפחות לרשום ל-log"
    ],
    code: `import { open } from "node:fs/promises";

async function processFile(filePath) {
  let fileHandle;
  try {
    fileHandle = await open(filePath, "r");
    const content = await fileHandle.readFile("utf8");

    if (content.length < 10) {
      throw new Error("File content too short");
    }

    return content.substring(0, 50);

  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("File not found:", filePath);
    } else {
      console.error("Processing failed:", error.message);
    }
    return null;

  } finally {
    // תמיד נסגר – גם בשגיאה וגם בהצלחה!
    if (fileHandle) await fileHandle.close();
    console.log("Cleanup complete.");
  }
}`,
    note: "finally = הבטחה לניקוי משאבים – אף פעם לא ידלג"
  },
  {
    id: 14,
    title: "  Challenge – Runtime Monitor CLI",
    bullets: [
      "בנו CLI אינטראקטיבי לניטור Node.js runtime",
      "תפריט: 1) CPU usage  2) Memory  3) Heap Growth  4) Event Loop Delay  5) Exit",
      "השתמשו ב-process.memoryUsage(), process.cpuUsage()",
      "ניסוי צמיחת Heap עם closures רקורסיביים",
      "מדדו Event Loop delay בעזרת setTimeout ו-Date.now()",
      "Exit מסודר עם cleanup ב-SIGINT handler"
    ],
    code: `// מבנה ה-Challenge
import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function showMenu() {
  console.log("\\n=== Node Runtime Monitor ===");
  console.log("1) CPU usage");
  console.log("2) Memory usage");
  console.log("3) Heap growth experiment");
  console.log("4) Event Loop delay test");
  console.log("5) Exit");
  rl.question("\\nבחר אפשרות: ", handleChoice);
}

function handleChoice(choice) {
  switch (choice.trim()) {
    case "1": showCPU(); break;
    case "2": showMemory(); break;
    case "5": rl.close(); process.exit(0);
    default:  showMenu();
  }
}

// TODO: מימוש showCPU(), showMemory(), וכו'
showMenu();`,
    note: "למידה מעשית של Node.js internals – שחקו עם הקוד!"
  },
  {
    id: 100,
    type: "quiz",
    lessonTitle: "Modern Node.js Runtime",
    questions: quiz_1_1
  }
];
