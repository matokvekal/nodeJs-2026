import { quiz_1_3 } from "../../data/quizzes/quiz_1_3.js";

export const slides = [
  {
    id: 1,
    type: "title",
    title: "File System & Streams",
    subtitle: "Modern APIs – fs/promises, Streams, Pipeline"
  },
  {
    id: 2,
    title: "מודול fs/promises",
    bullets: [
      "מודול מובנה לגישה אסינכרונית למערכת הקבצים באמצעות Promises",
      "ייבוא: import { readFile, writeFile, mkdir } from 'node:fs/promises'",
      "תמיד להשתמש ב-fs/promises ולא בגרסה הסינכרונית",
      "readFile(path, 'utf8') – קורא את כל תוכן הקובץ כ-string",
      "writeFile(path, data) – כותב לקובץ, יוצר אם לא קיים, מחליף אם קיים",
      "appendFile, copyFile, unlink, rename, stat – ועוד"
    ]
  },
  {
    id: 3,
    title: "פעולות קריאה, כתיבה ומחיקה",
    bullets: [
      "readFile(path, 'utf8') → מחזיר מחרוזת עם כל התוכן",
      "writeFile(path, content) → כותב ומחליף את כל תוכן הקובץ",
      "appendFile(path, content) → מוסיף לסוף הקובץ בלי למחוק",
      "copyFile(src, dest) → מעתיק קובץ",
      "unlink(path) → מוחק קובץ",
      "access(path, constants.R_OK) → בודק הרשאות גישה"
    ]
  },
  {
    id: 4,
    title: "ניהול תיקיות",
    bullets: [
      "mkdir(path, { recursive: true }) → יוצר תיקייה, כולל אבות אם לא קיימים",
      "readdir(path) → מערך של שמות הקבצים בתיקייה",
      "readdir(path, { withFileTypes: true }) → אובייקטי Dirent עם isFile(), isDirectory()",
      "rm(path, { recursive: true, force: true }) → מוחק תיקייה ותוכנה",
      "stat(path) → מידע: size, birthtime, mtime, isFile(), isDirectory()",
      "rename(oldPath, newPath) → שינוי שם / העברה"
    ]
  },
  {
    id: 5,
    title: "מודול path",
    bullets: [
      "מודול מובנה לעבודה בטוחה עם נתיבי קבצים על כל מערכת הפעלה",
      "path.join('src', 'utils', 'helper.js') → מחבר עם מפריד מתאים",
      "path.resolve('./config') → נתיב מוחלט מנתיב יחסי",
      "path.basename('/src/app.js') → 'app.js'",
      "path.extname('file.txt') → '.txt'",
      "path.dirname('/src/utils/helper.js') → '/src/utils'"
    ]
  },
  {
    id: 6,
    title: "WHATWG URL ו-import.meta.url",
    bullets: [
      "import.meta.url → URL המודול הנוכחי כ-file://... (ESM בלבד)",
      "new URL('config.json', import.meta.url) → URL מלא יחסי למיקום הקובץ",
      "fileURLToPath(url) → ממיר file:// URL לנתיב רגיל של מערכת הקבצים",
      "מחליף את __dirname ו-__filename שאינם זמינים ב-ESM",
      "דפוס מומלץ: const dir = fileURLToPath(new URL('.', import.meta.url))",
      "חשוב בעת גישה לקבצי קונפיגורציה יחסית למיקום המודול"
    ]
  },
  {
    id: 7,
    title: "מבוא לـ Streams",
    bullets: [
      "Stream = ממשק לעבודה עם נתונים שזורמים בחלקים (chunks)",
      "מאפשר עיבוד נתונים ללא טעינת הכל לזיכרון בבת אחת",
      "ארבעה סוגים: Readable, Writable, Duplex, Transform",
      "דוגמה: קובץ 10GB – readFile ייכשל; Stream יעבד ב-64KB בכל פעם",
      "Readable: מייצר נתונים (קובץ, HTTP request, stdin)",
      "Writable: מקבל נתונים (קובץ, HTTP response, stdout)"
    ]
  },
  {
    id: 8,
    title: "Readable Stream",
    bullets: [
      "createReadStream(path) → יוצר stream לקריאת קובץ בחלקים",
      "highWaterMark קובע גודל chunk (ברירת מחדל: 64KB)",
      "אירוע data – מגיע עם chunk של נתונים",
      "אירוע end – כל הנתונים נקראו",
      "אירוע error – שגיאה בקריאה",
      "ב-2026: עדיף for await...of על stream במקום האזנה ידנית לאירועים"
    ]
  },
  {
    id: 9,
    title: "Async Iteration על Streams",
    bullets: [
      "כל Readable Stream ב-Node.js מממש Symbol.asyncIterator",
      "קריאה נקייה עם for await...of",
      "break → יוצא ומנקה את ה-stream",
      "קריא הרבה יותר מהאזנה ידנית ל-data ו-end",
      "תופס שגיאות עם try/catch רגיל"
    ],
    code: `for await (const chunk of stream) {
  process(chunk);
}`
  },
  {
    id: 10,
    title: "pipeline מ-stream/promises",
    bullets: [
      "pipeline מחבר streams בשרשרת ומנהל backpressure ושגיאות אוטומטית",
      "ייבוא: import { pipeline } from 'node:stream/promises'",
      "מחזיר Promise – יש לעטוף ב-await",
      "מנקה ומשחרר את כל ה-streams בשרשרת אם יש שגיאה",
      "מחליף את .pipe() הישן שלא מטפל בשגיאות ודליפות",
      "דוגמה: await pipeline(readable, transform, writable)"
    ]
  },
  {
    id: 11,
    title: "Transform Stream ו-Backpressure",
    bullets: [
      "Transform: מקבל נתונים, מעבד, ומוציא תוצאה מעובדת",
      "zlib.createGzip() → Transform stream לדחיסה",
      "crypto.createCipheriv() → Transform stream להצפנה",
      "Backpressure: מנגנון שמונע מה-Readable לייצר מהר ממה שה-Writable יכול לאכול",
      "pipeline מטפל ב-backpressure אוטומטית",
      "ביצועים: Stream עדיף על buffer גדול כשמעבדים קבצים/נתוני רשת"
    ]
  },
  {
    id: 12,
    title: "Performance: Streams vs Buffer",
    bullets: [
      "Buffer: טוען הכל לזיכרון → מהיר אך מסוכן לקבצים גדולים",
      "Stream: עיבוד חלקי → שימוש זיכרון קבוע ללא קשר לגודל הקובץ",
      "קובץ 1GB: Buffer → זיכרון 1GB+; Stream → ~64KB בכל רגע",
      "Time to First Byte מהיר יותר ב-Stream (שולחים chunk ראשון מיד)",
      "שימוש ב-Buffer: קבצים קטנים, JSON, עיבוד שלם נדרש",
      "שימוש ב-Stream: קבצי upload, תוצאות DB גדולות, Streaming responses"
    ]
  },
  {
    id: 13,
    title: "טיפול בשגיאות ב-Streams",
    bullets: [
      "שגיאת stream לא נתפסת → קריסת התהליך",
      "pipeline מטפל בשגיאות אוטומטית ומנקה את כל ה-streams בשרשרת",
      ".pipe() לא מנקה streams בשגיאה → דליפות זיכרון",
      "try/catch סביב for await תופס שגיאות stream",
      "לסגור streams ב-finally כדי למנוע דליפות",
      "תמיד await pipeline(...) ולא .pipe() בקוד חדש"
    ]
  },
  {
    id: 14,
    title: "סיכום – יום 1 מצגת 3",
    bullets: [
      "fs/promises – API אסינכרוני מודרני; תמיד לייבא מ-node:fs/promises",
      "path מאפשר עבודה בטוחה עם נתיבים בכל מערכת הפעלה",
      "import.meta.url + fileURLToPath מחליפים __dirname ב-ESM",
      "Streams מאפשרים עיבוד קבצים גדולים ב-זיכרון קבוע",
      "pipeline הוא הדרך הנכונה לחבר streams עם ניהול שגיאות",
      "for await...of מפשט קריאה מ-streams בצורה נקייה"
    ]
  }
];
