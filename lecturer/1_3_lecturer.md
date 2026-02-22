# הרחבות : – יום 1 מצגת 3: File System & Streams

**זמן:** 13:00–14:30
**מטרה:** עבודה עם fs/promises והבנת מתי ולמה להשתמש ב-Streams

---

## שקף 1 – פתיחה

במצגת הקודמת ראינו async/await ואיך Node.js מנהל קוד אסינכרוני. עכשיו נשים את הידע הזה לעבודה עם קבצים ו-Streams.

**מה נלמד:**

- מודול `fs/promises` – הדרך המודרנית לעבוד עם קבצים
- מודולי `path` ו-`url` – עבודה נכונה עם נתיבי קבצים
- Streams – הכלי החזק ביותר לטיפול בנתונים גדולים
- `pipeline` – חיבור streams בצורה בטוחה ויעילה

**למה זה חשוב:**

- כמעט כל שרת Node.js קורא קבצי קונפיגורציה, לוגים, ותמונות
- Streams הם המפתח לעבד קבצים של גיגה-בייט בלי לקרוס את הזיכרון
- `pipeline` הוא הפתרון הנכון ל-backpressure שכולם נתקלים בו

**4 סוגי Streams ב-Node.js:**

| סוג       | תיאור                   | דוגמאות                              |
| --------- | ----------------------- | ------------------------------------ |
| Readable  | מקור נתונים — קורא בלבד | `fs.createReadStream`, HTTP response |
| Writable  | יעד נתונים — כותב בלבד  | `fs.createWriteStream`, HTTP request |
| Duplex    | גם קורא וגם כותב        | TCP socket                           |
| Transform | Duplex שמשנה את הנתונים | `zlib.createGzip()`, crypto stream   |

---

## שקף 2 – fs/promises

החל מ-Node.js 14, המודול `fs/promises` הוא הסטנדרט לעבודה עם קבצים. הגרסה הסינכרונית (`readFileSync`) חוסמת את ה-Event Loop ואינה מתאימה לסביבת production. כל הפעולות צריכות להיות אסינכרוניות.

**דוגמה:**

```js
import { readFile, writeFile, mkdir } from "node:fs/promises";

const content = await readFile("./config.json", "utf8");
const config = JSON.parse(content);

await writeFile("./output.json", JSON.stringify(result));
await mkdir("./logs", { recursive: true });
```

**הערה חשובה:** האופציה `recursive: true` במקרה של mkdir מונעת שגיאה במקרה שהתיקייה כבר קיימת, ומאפשרת יצירה של תיקיות מקוננות (nested) בפעולה אחת.

---

## שקף 3-4 – פעולות קבצים ותיקיות

**שימוש ב-stat לקבלת מידע על קובץ:**

```js
import { stat } from "node:fs/promises";

const info = await stat("./package.json");
console.log("Size:", info.size, "bytes");
console.log("Modified:", info.mtime);
console.log("Is file:", info.isFile());
```

**קריאת תיקייה עם withFileTypes:**

```js
import { readdir } from "node:fs/promises";

const entries = await readdir("./src", { withFileTypes: true });
const jsFiles = entries
  .filter((e) => e.isFile() && e.name.endsWith(".js"))
  .map((e) => e.name);
```

---

## שקף 5 – path

מודול `path` חיוני למניעת באגים הנובעים מהבדלי פלטפורמות. Windows משתמש ב-`\` ואילו Unix/Linux משתמשים ב-`/`. path.join מטפל בהבדלים אלו באופן אוטומטי.

**דוגמה:**

```js
import path from "node:path";
console.log(path.join("src", "utils", "helper.js"));
// Windows: src\utils\helper.js
// Linux:   src/utils/helper.js
```

---

## שקף 6 – import.meta.url

ב-CommonJS היו זמינים `__dirname` ו-`__filename` באופן גלובלי. במודולים ESM המשתנים הללו אינם קיימים. הפתרון הסטנדרטי הוא שימוש ב-`import.meta.url`.

**דוגמה:**

```js
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const configPath = path.join(__dirname, "..", "config.json");
```

---

## שקף 7 – מבוא ל-Streams

**הבעיה עם Buffers:**
קריאת קובץ של 2GB באמצעות `readFile` תנסה להעלות 2GB מלאים לזיכרון. Stream מעבד את הנתונים ב-chunks של 64KB (כברירת מחדל), מה שמאפשר שימוש בזיכרון קבוע ויעיל.

**השוואה ויזואלית:**

```
Buffer:  ████████████████████████ → זיכרון 2GB
Stream:  ████                    → 64KB → process → 64KB → process...
```

**אנלוגיה:** שתייה ישירות מהברז (stream) לעומת מילוי דלי שלם ורק אז התחלת שתייה (buffer).

---

## שקף 8 – Readable Stream

**דוגמת שימוש:**

```js
import { createReadStream } from "node:fs";

const stream = createReadStream("./large-file.txt", {
  encoding: "utf8",
  highWaterMark: 64 * 1024 // 64KB chunks
});

stream.on("data", (chunk) => console.log("Got chunk:", chunk.length));
stream.on("end", () => console.log("Done!"));
stream.on("error", (err) => console.error(err));
```

---

## שקף 9 – Async Iteration

הדרך המודרנית והמומלצת ב-2026 לקריאת streams היא שימוש ב-`for await...of`. הסינטקס קריא יותר ומטפל בשגיאות בצורה טבעית עם try/catch.

**דוגמה:**

```js
import { createReadStream } from "node:fs";

const stream = createReadStream("./large-file.txt", { encoding: "utf8" });
let lineCount = 0;

try {
  for await (const chunk of stream) {
    lineCount += chunk.split("\n").length;
  }
  console.log("Lines:", lineCount);
} catch (err) {
  console.error("Stream error:", err);
}
```

---

## שקף 10 – pipeline

`pipeline` היא הדרך המומלצת והבטוחה לחיבור streams. הפונקציה מטפלת באופן אוטומטי ב-backpressure, סגירת streams, וניהול שגיאות.

**דוגמת דחיסת קובץ:**

```js
import { createReadStream, createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";

await pipeline(
  createReadStream("./big-file.txt"),
  createGzip(),
  createWriteStream("./big-file.txt.gz")
);
console.log("Compressed!");
```

**מדידת צריכת זיכרון:**

```js
console.log("Memory:", process.memoryUsage().heapUsed / 1024 / 1024, "MB");
```

---

## שקף 11 – Transform + Backpressure

**Backpressure** מתרחש כאשר המקור (Readable) מייצר נתונים מהר יותר מהיכולת של היעד (Writable) לעבד אותם. `pipeline` מטפלת בבעיה זו אוטומטית – ה-Readable מושהה עד שה-Writable יהיה מוכן לקבל נתונים נוספים.

**איך Backpressure עובד בפועל:**

- הפונקציה `write()` על Writable מחזירה `false` כאשר הבאפר מלא
- צריך להמתין לאירוע `drain` לפני שממשיכים לכתוב
- `pipeline` עושה את כל זה אוטומטית — לכן תמיד עדיף להשתמש ב-pipeline

**Transform Stream – לעיבוד נתונים תוך כדי העברה:**
Transform הוא stream שגם קורא וגם כותב, ומשנה את הנתונים ביניהם.
דוגמאות: דחיסה (gzip), הצפנה (AES), המרת encoding, ניתוח CSV.

```js
import { Transform } from "node:stream";

const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  }
});

// שרשור: קרא → המר לאותיות גדולות → כתוב
await pipeline(
  createReadStream("./input.txt"),
  upperCaseTransform,
  createWriteStream("./output.txt")
);
```

---

## שקף 12 – Performance

**השוואת גישות:**

```js
// Buffer - צריכת זיכרון גבוהה
const big = await readFile("./2gb-file.txt"); // ❌ 2GB בזיכרון

// Stream - צריכת זיכרון קבועה ונמוכה
for await (const chunk of createReadStream("./2gb-file.txt")) {
  process(chunk); // ✅ רק chunks בזיכרון
}
```

---

## שקף 13 – Error Handling

שגיאת stream שלא נתפסה תגרום ל-crash של התהליך. `pipeline` מטפלת בשגיאות אוטומטית ומבצעת cleanup של כל ה-streams. בעת שימוש ב-`for await...of`, יש לעטוף את הקוד ב-try/catch.

---

## שקף 14 – סיכום

**שאלות לסיכום:**

1. מה ההבדל בין `readFile` ל-`createReadStream`?
2. מתי להשתמש ב-`pipeline` לעומת `for await`?
3. למה `__dirname` לא עובד ב-ESM?

**תשובות עיקריות:**

- `readFile` טוען את כל הקובץ לזיכרון, `createReadStream` מעבד chunks
- `pipeline` לחיבור streams, `for await` לעיבוד פשוט של chunks
- ב-ESM אין globals כמו `__dirname`, יש להשתמש ב-`import.meta.url`

**נקודה חשובה:** עבור קבצים קטנים (< 1MB), השימוש ב-buffer עם `readFile` פשוט וברור יותר. Streams מתאימים לקבצים גדולים או כאשר צריך לעבד נתונים תוך כדי קריאה.
