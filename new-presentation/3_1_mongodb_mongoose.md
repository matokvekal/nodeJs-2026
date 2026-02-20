# יום 3 – מצגת 9: MongoDB + Mongoose v7

---

## שקף 1
**כותרת ראשית:** MongoDB + Mongoose v7
**כותרת משנה:** Schema Design, Validation, Indexes, Aggregation, Cursor Pagination

---

## שקף 2
**כותרת ראשית:** מבוא ל-MongoDB
- מסד נתונים NoSQL מבוסס **מסמכים** (Documents) בפורמט BSON (כמו JSON)
- נתונים מאורגנים ב-**Collections** (כמו טבלאות) ו-**Documents** (כמו שורות)
- **אין סכמה קשיחה** ברמת ה-DB – גמישות גבוהה
- תומך בשאילתות מורכבות, אינדקסים, Aggregation, Replication
- מתאים לנתונים שמשתנים בתדירות גבוהה ולפיתוח מהיר
- הפעלה לפיתוח: `docker run -d -p 27017:27017 --name mongo mongo`

---

## שקף 3
**כותרת ראשית:** Mongoose v7 – חיבור
- ODM (Object Document Mapper) = שכבת אבסטרקציה מעל MongoDB
- התקנה: `npm install mongoose` (v7+ משתמש ב-Promises כברירת מחדל)
- ```js
  import mongoose from 'mongoose';
  await mongoose.connect(process.env.MONGODB_URI);
  mongoose.connection.on('error', (err) => logger.error(err));
  ```
- **Connection Pool**: ברירת מחדל 100 חיבורים מקבילים
- בייצור: connection string עם Replica Set + `retryWrites=true`
- `mongoose.disconnect()` בסגירת שרת נקייה

---

## שקף 4
**כותרת ראשית:** Schema Design Strategy
- Schema מגדיר צורת המסמך: שדות, טיפוסים, ברירות מחדל, ולידציה
- טיפוסים: `String`, `Number`, `Boolean`, `Date`, `ObjectId`, `Array`, `Map`
- `timestamps: true` מוסיף אוטומטית `createdAt` ו-`updatedAt`
- **Embedding vs Referencing**:
  - **Embed**: נתונים שתמיד נקראים יחד (כתובת בתוך משתמש)
  - **Reference**: נתונים גדולים/עצמאיים (פוסטים של משתמש)
- **Rule of thumb**: embed כשמספר המסמכים הפנימיים מוגבל ומוכר

---

## שקף 5
**כותרת ראשית:** Model ו-CRUD Operations
- `mongoose.model('User', userSchema)` → יוצר Model למסמכים ב-`users` collection
- `Model.create(doc)` → יוצר מסמך ושומר ב-DB
- `Model.find(filter)` → מחזיר מערך מסמכים תואמים
- `Model.findById(id)` → מחפש לפי ObjectId, מחזיר `null` אם לא נמצא
- `Model.findByIdAndUpdate(id, update, { new: true })` → מחזיר מסמך מעודכן
- `Model.findByIdAndDelete(id)` → מוחק ומחזיר את המסמך שנמחק

---

## שקף 6
**כותרת ראשית:** Validation ב-Mongoose
- Mongoose מריץ ולידציה **לפני** כל `save` ו-`create`
- ולידציות מובנות: `required`, `min/max`, `enum`, `match` (regex), `minlength/maxlength`
- ולידציה מותאמת:
  ```js
  phone: {
    type: String,
    validate: {
      validator: (v) => /\d{10}/.test(v),
      message: 'Invalid phone number'
    }
  }
  ```
- `findByIdAndUpdate` עוקף ולידציה → חובה `{ runValidators: true }`
- `ValidationError.errors` מכיל פרטי כל שדה שנכשל

---

## שקף 7
**כותרת ראשית:** Index Strategy
- אינדקס משפר ביצועי שאילתות על ידי B-tree על ערכי שדה
- `schema.index({ email: 1 })` → אינדקס עולה על `email`
- `{ unique: true }` → מונע כפילויות ברמת ה-DB
- **Compound Index**: `schema.index({ status: 1, createdAt: -1 })`
- אינדקס מאט **כתיבות** וצורך זיכרון → ליצור רק לפי דפוסי שאילתות
- `explain()` מציג אם השאילתה משתמשת באינדקס או `COLLSCAN`

---

## שקף 8
**כותרת ראשית:** lean() לביצועים
- `lean()` מחזיר אובייקטי JavaScript **רגילים** במקום Mongoose Documents
- Mongoose Document מכיל methods (`save`, `validate`, middleware) – overhead
- `lean()` זרז שאילתות עד **פי 5** – אין יצירת Document instances
- שימוש: כל שאילתת **קריאה בלבד** (API responses, reports)
- לא לשמש `lean()` כשצריך `doc.save()` לאחר מכן
- `select('name email -_id')` + `lean()` = שאילתה מינימלית

---

## שקף 9
**כותרת ראשית:** populate ו-N+1 Problem
- `populate('author')` ממלא שדה ObjectId בנתונים מ-collection אחר
- **לא JOIN** – שאילתה נפרדת ברמת האפליקציה
- `populate('author', 'name email')` – שדות ספציפיים בלבד
- **N+1 Problem**: לכל מסמך בשאילתה – שאילתה נוספת לـ populate
- פתרון: `populate` אחד לכל collection (לא nested populate מרובה)
- עדיף `aggregate` עם `$lookup` לשאילתות מורכבות עם joins מרובים

---

## שקף 10
**כותרת ראשית:** Aggregation Pipeline
- רצף שלבים שכל אחד מעבד נתונים ומעביר לשלב הבא
- `$match` → סינון (כמו `find`)
- `$group` → קיבוץ וחישוב: `$sum`, `$avg`, `$count`, `$push`
- `$sort`, `$project` → מיון ובחירת שדות
- `$lookup` → left outer join עם collection אחר ברמת ה-DB
- `$limit`, `$skip` → לעימוד
- `Model.aggregate([{ $match: {} }, { $group: {} }])` → מחזיר Promise

---

## שקף 11
**כותרת ראשית:** Cursor-Based Pagination
- **Offset pagination** (`skip`/`limit`) איטי בעמודים גבוהים
- **Cursor pagination**: שימוש בערך שדה אחרון כנקודת התחלה
  ```js
  const cursor = req.query.after; // lastId
  const tasks = await Task
    .find({ _id: { $gt: cursor } })
    .limit(20)
    .sort({ _id: 1 })
    .lean();
  const nextCursor = tasks.length === 20 ? tasks.at(-1)._id : null;
  ```
- ביצועים **קבועים** בכל עמוד – MongoDB משתמש באינדקס
- מחזיר `nextCursor: null` כשהגענו לסוף
- חיסרון: לא ניתן לקפוץ לעמוד ספציפי

---

## שקף 12
**כותרת ראשית:** Production Tips
- `lean()` בכל שאילתת קריאה בלבד
- `select()` לשדות ספציפיים – לא להחזיר כל המסמך
- אינדקסים רק על שדות עם חיפוש/מיון תדיר
- `maxTimeMS(5000)` למניעת שאילתות שתוקעות שרת
- `populate` עד רמה אחת – עדיף `$lookup` לשאילתות מורכבות
- Connection error handling + reconnect logic

---

## שקף 13
**כותרת ראשית:** סיכום – יום 3 מצגת 9
- MongoDB = NoSQL document DB; Mongoose = ODM עם Schema וולידציה
- Schema design: embed כשנתונים תמיד יחד, reference כשנתונים עצמאיים
- אינדקסים משפרים קריאות אך מאטים כתיבות
- `lean()` מחזיר plain objects ומשפר ביצועים
- Aggregation Pipeline לחישובים ו-joins מורכבים
- Cursor pagination לקולקציות גדולות
