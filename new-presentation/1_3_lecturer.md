# מדריך למרצה – יום 1 מצגת 3: File System & Streams

**זמן:** 13:00–14:30 (90 דקות)
**מטרה:** התלמידים יעבדו עם fs/promises וידעו מתי ולמה להשתמש ב-Streams

---

## הכנה מראש
- הכן קובץ גדול (100MB) לדמו Stream
- הכן קוד דמו: `read-file.js`, `stream-file.js`, `pipeline-demo.js`
- בדוק ש-`node:stream/promises` זמין (Node 16+)

---

## שקף 2 – fs/promises (10 דקות)
**מה להגיד:**
> "מהיום, כשצריך לגעת בקבצים – תמיד fs/promises, לא fs. הגרסה הסינכרונית (readFileSync) חוסמת את ה-Event Loop!"

**דמו:**
```js
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const content = await readFile('./config.json', 'utf8');
const config = JSON.parse(content);

await writeFile('./output.json', JSON.stringify(result));
await mkdir('./logs', { recursive: true }); // recursive: לא יכשל אם קיים
```

**שאלה לכיתה:** "למה `recursive: true` חשוב?"
**תשובה:** "בלי זה, mkdir יכשל אם תיקיית הורה לא קיימת, או אם התיקייה כבר קיימת."

---

## שקף 3-4 – פעולות קבצים ותיקיות (10 דקות)
**דמו stat:**
```js
import { stat } from 'node:fs/promises';

const info = await stat('./package.json');
console.log('Size:', info.size, 'bytes');
console.log('Modified:', info.mtime);
console.log('Is file:', info.isFile());
```

**דמו readdir עם withFileTypes:**
```js
import { readdir } from 'node:fs/promises';

const entries = await readdir('./src', { withFileTypes: true });
const jsFiles = entries
  .filter(e => e.isFile() && e.name.endsWith('.js'))
  .map(e => e.name);
```

---

## שקף 5 – path (8 דקות)
**מה להגיד:**
> "מודול path מונע באגים. Windows משתמש ב-`\` ו-Unix ב-`/`. path.join מטפל בזה אוטומטית."

**דמו:**
```js
import path from 'node:path';
console.log(path.join('src', 'utils', 'helper.js'));
// Windows: src\utils\helper.js
// Linux:   src/utils/helper.js
```

---

## שקף 6 – import.meta.url (7 דקות)
**מה להגיד:**
> "ב-CommonJS היה לנו `__dirname`. ב-ESM אין זאת. הפתרון הוא import.meta.url."

**דמו:**
```js
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const configPath = path.join(__dirname, '..', 'config.json');
```

---

## שקף 7 – מבוא ל-Streams (10 דקות) ← **חשוב מאוד**
**מה להגיד:**
> "נניח שיש לכם קובץ של 2GB. readFile → Node.js ינסה להכניס 2GB לזיכרון. Stream → מעבד 64KB בכל פעם, זיכרון קבוע."

**ויזואליזציה:**
```
Buffer:  ████████████████████████ → זיכרון 2GB
Stream:  ████                    → 64KB → process → 64KB → process...
```

**אנלוגיה:** "כמו לשתות ישר מהברז (stream) לעומת למלא דלי ואז לשתות (buffer)."

---

## שקף 8 – Readable Stream (7 דקות)
**דמו:**
```js
import { createReadStream } from 'node:fs';

const stream = createReadStream('./large-file.txt', {
  encoding: 'utf8',
  highWaterMark: 64 * 1024  // 64KB chunks
});

stream.on('data', (chunk) => console.log('Got chunk:', chunk.length));
stream.on('end', () => console.log('Done!'));
stream.on('error', (err) => console.error(err));
```

---

## שקף 9 – Async Iteration (10 דקות) ← **הדרך המודרנית**
**מה להגיד:**
> "הדרך המודרנית ב-2026 – for await. קריא יותר, מטפל בשגיאות עם try/catch."

**דמו:**
```js
import { createReadStream } from 'node:fs';

const stream = createReadStream('./large-file.txt', { encoding: 'utf8' });
let lineCount = 0;

try {
  for await (const chunk of stream) {
    lineCount += chunk.split('\n').length;
  }
  console.log('Lines:', lineCount);
} catch (err) {
  console.error('Stream error:', err);
}
```

---

## שקף 10 – pipeline (12 דקות) ← **CORE**
**מה להגיד:**
> "pipeline היא הדרך הנכונה לחבר streams. היא מטפלת ב-backpressure ושגיאות אוטומטית."

**דמו gzip:**
```js
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

await pipeline(
  createReadStream('./big-file.txt'),
  createGzip(),
  createWriteStream('./big-file.txt.gz')
);
console.log('Compressed!');
```

**מדוד זיכרון לפני ואחרי:**
```js
console.log('Memory:', process.memoryUsage().heapUsed / 1024 / 1024, 'MB');
```

---

## שקף 11 – Transform + Backpressure (8 דקות)
**מה להגיד:**
> "Backpressure = שדה המקור מייצר מהר מדי. pipeline מטפל בזה אוטומטית – Readable עוצר עד שה-Writable מוכן."

---

## שקף 12 – Performance (5 דקות)
**דמו השוואה:**
```js
// Buffer - זיכרון גבוה
const big = await readFile('./2gb-file.txt');  // ❌

// Stream - זיכרון נמוך
for await (const chunk of createReadStream('./2gb-file.txt')) {
  process(chunk);  // ✅
}
```

---

## שקף 13 – Error Handling (5 דקות)
**מה להגיד:**
> "שגיאת stream שלא תופסים = crash! pipeline מטפל אוטומטית. כשמשתמשים ב-for await – try/catch."

---

## שקף 14 – סיכום (3 דקות)
**שאלות:**
1. מה ההבדל בין `readFile` ל-`createReadStream`?
2. מתי תשתמש ב-`pipeline` ומתי ב-`for await`?
3. למה `__dirname` לא עובד ב-ESM?

---

## הערות מרצה
- **שאלה נפוצה**: "מתי stream לא כדאי?" → כשהקובץ קטן, buffer פשוט יותר
- **דמו מרשים**: הצג Monitor של זיכרון בזמן stream לעומת readFile על קובץ גדול
