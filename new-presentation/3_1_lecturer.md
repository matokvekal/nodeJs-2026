# מדריך למרצה – יום 3 מצגת 9: MongoDB + Mongoose v7

**זמן:** 09:00–10:30
**מטרה:** חיבור ה-API מיום 2 למסד MongoDB אמיתי

---

## שקף 1 – פתיחה

ביום 2 בנינו API עם נתונים ב-Memory (Map). היום מחברים אותו למסד נתונים אמיתי — MongoDB. כמעט לא נצטרך לשנות את ה-Controllers, רק את ה-Service layer.

**מה נלמד:**
- MongoDB – Document database, מה הוא ומתי עדיף על SQL
- Mongoose v7 – ODM שמוסיף schema, validation, ו-middleware
- CRUD עם Mongoose: findById, create, findOneAndUpdate, deleteOne
- Indexes – המפתח לביצועים
- `lean()` – שיפור ביצועים פשוט ויעיל
- `populate` – joins ב-MongoDB
- Aggregation – סטטיסטיקות ודוחות
- Cursor Pagination – pagination יעיל לכמויות גדולות

**MongoDB vs SQL — מתי להשתמש:**

| MongoDB | SQL |
|---------|-----|
| נתונים לא-מובנים (flexible schema) | קשרים מורכבים בין ישויות |
| Real-time, high write throughput | ACID transactions מלאים |
| JSON-native (מושלם ל-Node.js) | נתונים מאוד מובנים וקבועים |

**כלל אצבע:** המסד הנכון תלוי ב-use case, לא בטרנד.

---

## שקף 2 – MongoDB

MongoDB הוא document database. במקום טבלאות ושורות (SQL), MongoDB משתמש ב-collections ו-documents. Document הוא JSON object שנשמר במסד הנתונים.

**השוואה:**

```
SQL:    users (table) → row: { id, name, email }
MongoDB: users (collection) → document: { _id, name, email, addresses: [...] }
```

---

## שקף 3 – Mongoose Connection

**דוגמת `src/config/db.js`:**

```js
import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
    mongoose.connection.on("error", (err) =>
      console.error("MongoDB error:", err)
    );
  } catch (err) {
    console.error("Failed to connect:", err);
    process.exit(1);
  }
}
```

```js
// src/server.js
import { connectDB } from "./config/db.js";
await connectDB();
app.listen(PORT);
```

---

## שקף 4 – Schema Design

**דוגמת `src/models/task.model.js`:**

```js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxlength: 100
    },
    description: { type: String, maxlength: 500 },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: Date
  },
  { timestamps: true }
);

// אינדקסים
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ createdAt: -1 });

export const Task = mongoose.model("Task", taskSchema);
```

---

## שקף 5 – CRUD

**דוגמת `src/services/tasks.service.js`:**

```js
import { Task } from "../models/task.model.js";
import { AppError } from "../utils/AppError.js";

export async function findAll({ userId, status, sort = "-createdAt" }) {
  const filter = { user: userId };
  if (status) filter.status = status;
  return Task.find(filter).sort(sort).lean();
}

export async function findById(id, userId) {
  const task = await Task.findOne({ _id: id, user: userId }).lean();
  if (!task) throw new AppError("Task not found", 404);
  return task;
}

export async function create(data, userId) {
  return Task.create({ ...data, user: userId });
}
```

**חשוב:** בכל קריאה בלבד (read), שימוש ב-`lean()` מהיר את הביצועים פי 5.

---

## שקף 6 – Validation

Mongoose validation מספקת שורת הגנה ראשונה ברמת המודל. היא לא מחליפה את Zod validation ב-route layer, אלא מוסיפה שכבה נוספת.

**דוגמת ValidationError:**

```js
try {
  await Task.create({ title: "" }); // required!
} catch (err) {
  if (err.name === "ValidationError") {
    console.log(err.errors); // { title: { message: 'Title is required' } }
  }
}
```

---

## שקף 7 – Indexes

Index הוא B-tree שמאפשר לשאילתה לקפוץ ישירות לתוצאות במקום לסרוק את כל ה-collection.

**דוגמת explain():**

```js
const result = await Task.find({ user: userId }).explain("executionStats");
console.log(result.executionStats.totalDocsExamined);
// ללא index: סורק הכל
// עם index: קופץ ישירות
```

---

## שקף 8 – lean()

**הדגמה:**

```js
// עם lean() - plain object
const task = await Task.findById(id).lean();
console.log(task.save); // undefined - לא קיים

// בלי lean() - Mongoose Document
const taskDoc = await Task.findById(id);
console.log(typeof taskDoc.save); // function
```

**מדידה:**

```js
console.time("without lean");
await Task.find();
console.timeEnd("without lean");

console.time("with lean");
await Task.find().lean();
console.timeEnd("with lean");
```

---

## שקף 9 – populate

**דוגמה:**

```js
const tasks = await Task.find({ user: userId })
  .populate("user", "name email") // שדות ספציפיים!
  .lean();
```

**N+1 problem:** אם יש 100 posts ועושים populate על כל אחד ב-loop = 101 queries. Mongoose מבצע 2 queries בלבד באופן מופעל.

---

## שקף 10 – Aggregation

**דוגמת סטטיסטיקות:**

```js
const stats = await Task.aggregate([
  { $match: { user: userId } },
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
]);
// [{ _id: 'todo', count: 5 }, { _id: 'done', count: 3 }]
```

---

## שקף 11-12 – Pagination

**Cursor pagination דוגמה:**

```js
export async function findAll({ after, limit = 20, userId }) {
  const query = { user: userId };
  if (after) query._id = { $gt: after };

  const tasks = await Task.find(query)
    .sort({ _id: 1 })
    .limit(limit + 1)
    .lean();

  const hasMore = tasks.length > limit;
  return {
    data: hasMore ? tasks.slice(0, -1) : tasks,
    nextCursor: hasMore ? tasks.at(-2)._id : null
  };
}
```

---

## סיכום

מצגת זו סיקרה:

- MongoDB והמושגים הבסיסיים
- Mongoose schemas ו-models
- CRUD operations
- Validation, Indexes, lean()
- populate ו-aggregation
- Cursor-based pagination

**הערות:**

- אם MongoDB לא עולה: `docker ps && docker start mongo`
- ObjectId validation errors: Mongoose זורק CastError כש-id לא valid
