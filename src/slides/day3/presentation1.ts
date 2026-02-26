import type { Slide } from "../../types";
import { quiz_3_1 } from "../../data/quizzes/quiz_3_1";

export const slides: Slide[] = [
  {
    id: 1,
    type: "title",
    title: "MongoDB + Mongoose v7",
    subtitle:
      "Schema Design, Validation, Indexes, Aggregation, Cursor Pagination"
  },
  {
    id: 2,
    title: "מבוא ל-MongoDB",
    bullets: [
      "מסד נתונים NoSQL מבוסס מסמכים (Documents) בפורמט BSON (כמו JSON)",
      "נתונים מאורגנים ב-Collections (כמו טבלאות) ו-Documents (כמו שורות)",
      "אין סכמה קשיחה ברמת ה-DB – גמישות גבוהה",
      "תומך בשאילתות מורכבות, אינדקסים, Aggregation, Replication",
      "מתאים לנתונים שמשתנים בתדירות גבוהה ולפיתוח מהיר",
      "הפעלה לפיתוח: docker run -d -p 27017:27017 --name mongo mongo"
    ]
  },
  {
    id: 3,
    title: "Mongoose v7 – חיבור",
    bullets: [
      "ODM (Object Document Mapper) = שכבת אבסטרקציה מעל MongoDB",
      "התקנה: npm install mongoose (v7+ משתמש ב-Promises כברירת מחדל)",
      "Connection Pool: ברירת מחדל 100 חיבורים מקבילים",
      "בייצור: connection string עם Replica Set + retryWrites=true",
      "mongoose.disconnect() בסגירת שרת נקייה"
    ],
    code: `import mongoose from 'mongoose';
await mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => logger.error(err));`
  },
  {
    id: 4,
    title: "Schema Design Strategy",
    bullets: [
      "Schema מגדיר צורת המסמך: שדות, טיפוסים, ברירות מחדל, ולידציה",
      "טיפוסים: String, Number, Boolean, Date, ObjectId, Array, Map",
      "timestamps: true מוסיף אוטומטית createdAt ו-updatedAt",
      "Embedding vs Referencing:",
      "- Embed: נתונים שתמיד נקראים יחד (כתובת בתוך משתמש)",
      "- Reference: נתונים גדולים/עצמאיים (פוסטים של משתמש)",
      "Rule of thumb: embed כשמספר המסמכים הפנימיים מוגבל ומוכר"
    ]
  },
  {
    id: 5,
    title: "Model ו-CRUD Operations",
    bullets: [
      "mongoose.model('User', userSchema) → יוצר Model למסמכים ב-users collection",
      "Model.create(doc) → יוצר מסמך ושומר ב-DB",
      "Model.find(filter) → מחזיר מערך מסמכים תואמים",
      "Model.findById(id) → מחפש לפי ObjectId, מחזיר null אם לא נמצא",
      "Model.findByIdAndUpdate(id, update, { new: true }) → מחזיר מסמך מעודכן",
      "Model.findByIdAndDelete(id) → מוחק ומחזיר את המסמך שנמחק"
    ]
  },
  {
    id: 6,
    title: "Validation ב-Mongoose",
    bullets: [
      "Mongoose מריץ ולידציה לפני כל save ו-create",
      "ולידציות מובנות: required, min/max, enum, match (regex), minlength/maxlength",
      "findByIdAndUpdate עוקף ולידציה → חובה { runValidators: true }",
      "ValidationError.errors מכיל פרטי כל שדה שנכשל"
    ],
    code: `phone: {
  type: String,
  validate: {
    validator: (v) => /\\d{10}/.test(v),
    message: 'Invalid phone number'
  }
}`
  },
  {
    id: 7,
    title: "Index Strategy",
    bullets: [
      "אינדקס משפר ביצועי שאילתות על ידי B-tree על ערכי שדה",
      "schema.index({ email: 1 }) → אינדקס עולה על email",
      "{ unique: true } → מונע כפילויות ברמת ה-DB",
      "Compound Index: schema.index({ status: 1, createdAt: -1 })",
      "אינדקס מאט כתיבות וצורך זיכרון → ליצור רק לפי דפוסי שאילתות",
      "explain() מציג אם השאילתה משתמשת באינדקס או COLLSCAN"
    ]
  },
  {
    id: 8,
    title: "lean() לביצועים",
    bullets: [
      "lean() מחזיר אובייקטי JavaScript רגילים במקום Mongoose Documents",
      "Mongoose Document מכיל methods (save, validate, middleware) – overhead",
      "lean() זרז שאילתות עד פי 5 – אין יצירת Document instances",
      "שימוש: כל שאילתת קריאה בלבד (API responses, reports)",
      "לא לשמש lean() כשצריך doc.save() לאחר מכן",
      "select('name email -_id') + lean() = שאילתה מינימלית"
    ]
  },
  {
    id: 9,
    title: "populate ו-N+1 Problem",
    bullets: [
      "populate('author') ממלא שדה ObjectId בנתונים מ-collection אחר",
      "לא JOIN – שאילתה נפרדת ברמת האפליקציה",
      "populate('author', 'name email') – שדות ספציפיים בלבד",
      "N+1 Problem: לכל מסמך בשאילתה – שאילתה נוספת לـ populate",
      "פתרון: populate אחד לכל collection (לא nested populate מרובה)",
      "עדיף aggregate עם $lookup לשאילתות מורכבות עם joins מרובים"
    ]
  },
  {
    id: 10,
    title: "Aggregation Pipeline",
    bullets: [
      "רצף שלבים שכל אחד מעבד נתונים ומעביר לשלב הבא",
      "$match → סינון (כמו find)",
      "$group → קיבוץ וחישוב: $sum, $avg, $count, $push",
      "$sort, $project → מיון ובחירת שדות",
      "$lookup → left outer join עם collection אחר ברמת ה-DB",
      "$limit, $skip → לעימוד",
      "Model.aggregate([{ $match: {} }, { $group: {} }]) → מחזיר Promise"
    ]
  },
  {
    id: 11,
    title: "Cursor-Based Pagination",
    bullets: [
      "Offset pagination (skip/limit) איטי בעמודים גבוהים",
      "Cursor pagination: שימוש בערך שדה אחרון כנקודת התחלה",
      "ביצועים קבועים בכל עמוד – MongoDB משתמש באינדקס",
      "מחזיר nextCursor: null כשהגענו לסוף",
      "חיסרון: לא ניתן לקפוץ לעמוד ספציפי"
    ],
    code: `const cursor = req.query.after; // lastId
const tasks = await Task
  .find({ _id: { $gt: cursor } })
  .limit(20)
  .sort({ _id: 1 })
  .lean();
const nextCursor = tasks.length === 20 ? tasks.at(-1)._id : null;`
  },
  {
    id: 12,
    title: "Production Tips",
    bullets: [
      "lean() בכל שאילתת קריאה בלבד",
      "select() לשדות ספציפיים – לא להחזיר כל המסמך",
      "אינדקסים רק על שדות עם חיפוש/מיון תדיר",
      "maxTimeMS(5000) למניעת שאילתות שתוקעות שרת",
      "populate עד רמה אחת – עדיף $lookup לשאילתות מורכבות",
      "Connection error handling + reconnect logic"
    ]
  },
  {
    id: 13,
    title: "סיכום – יום 3 מצגת 9",
    bullets: [
      "MongoDB = NoSQL document DB; Mongoose = ODM עם Schema וולידציה",
      "Schema design: embed כשנתונים תמיד יחד, reference כשנתונים עצמאיים",
      "אינדקסים משפרים קריאות אך מאטים כתיבות",
      "lean() מחזיר plain objects ומשפר ביצועים",
      "Aggregation Pipeline לחישובים ו-joins מורכבים",
      "Cursor pagination לקולקציות גדולות"
    ]
  }
];
