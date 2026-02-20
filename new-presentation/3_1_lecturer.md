# מדריך למרצה – יום 3 מצגת 9: MongoDB + Mongoose v7

**זמן:** 09:00–10:30 (90 דקות)
**מטרה:** התלמידים יחברו ה-API מיום 2 למסד MongoDB אמיתי

---

## הכנה מראש
- הפעל MongoDB: `docker run -d -p 27017:27017 --name mongo mongo`
- הכן connection string ב-.env: `MONGODB_URI=mongodb://localhost:27017/taskdb`
- `npm install mongoose`

---

## שקף 2 – MongoDB (8 דקות)
**מה להגיד:**
> "MongoDB = document database. במקום טבלאות ושורות יש לנו collections ו-documents. Document = JSON object שחי ב-DB."

**ציור:**
```
SQL:    users (table) → row: { id, name, email }
MongoDB: users (collection) → document: { _id, name, email, addresses: [...] }
```

---

## שקף 3 – Mongoose Connection (10 דקות)
**Live coding – `src/config/db.js`:**
```js
import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
    mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));
  } catch (err) {
    console.error('Failed to connect:', err);
    process.exit(1);
  }
}
```

```js
// src/server.js
import { connectDB } from './config/db.js';
await connectDB();
app.listen(PORT);
```

---

## שקף 4 – Schema Design (12 דקות)
**Live coding – `src/models/task.model.js`:**
```js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], maxlength: 100 },
  description: { type: String, maxlength: 500 },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: Date
}, { timestamps: true });

// אינדקסים
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ createdAt: -1 });

export const Task = mongoose.model('Task', taskSchema);
```

---

## שקף 5 – CRUD (12 דקות)
**Live coding – `src/services/tasks.service.js`:**
```js
import { Task } from '../models/task.model.js';
import { AppError } from '../utils/AppError.js';

export async function findAll({ userId, status, sort = '-createdAt' }) {
  const filter = { user: userId };
  if (status) filter.status = status;
  return Task.find(filter).sort(sort).lean();
}

export async function findById(id, userId) {
  const task = await Task.findOne({ _id: id, user: userId }).lean();
  if (!task) throw new AppError('Task not found', 404);
  return task;
}

export async function create(data, userId) {
  return Task.create({ ...data, user: userId });
}
```

**הדגש lean():** "בכל קריאה בלבד – `lean()`. מהר פי 5."

---

## שקף 6 – Validation (8 דקות)
**מה להגיד:**
> "Mongoose validation = שורת הגנה ראשונה. לא מחליפה Zod ב-route – מוסיפה שכבה נוספת."

**דמו ValidationError:**
```js
try {
  await Task.create({ title: '' }); // required!
} catch (err) {
  if (err.name === 'ValidationError') {
    console.log(err.errors); // { title: { message: 'Title is required' } }
  }
}
```

---

## שקף 7 – Indexes (8 דקות)
**מה להגיד:**
> "Index = B-tree שמאפשר לשאילתה לקפוץ ישירות לתוצאות במקום לסרוק הכל."

**demo explain():**
```js
const result = await Task.find({ user: userId }).explain('executionStats');
console.log(result.executionStats.totalDocsExamined);
// ללא index: סורק הכל
// עם index: קופץ ישירות
```

---

## שקף 8 – lean() (7 דקות)
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
console.time('without lean');
await Task.find();
console.timeEnd('without lean');

console.time('with lean');
await Task.find().lean();
console.timeEnd('with lean');
```

---

## שקף 9 – populate (8 דקות)
**Live demo:**
```js
const tasks = await Task
  .find({ user: userId })
  .populate('user', 'name email')  // שדות ספציפיים!
  .lean();
```

**N+1 הסבר:** "אם יש לך 100 posts ועושה populate על כל אחד – 101 queries! Mongoose עושה 2 queries."

---

## שקף 10 – Aggregation (8 דקות)
**Live demo – סטטיסטיקות:**
```js
const stats = await Task.aggregate([
  { $match: { user: userId } },
  { $group: {
    _id: '$status',
    count: { $sum: 1 }
  }},
  { $sort: { count: -1 } }
]);
// [{ _id: 'todo', count: 5 }, { _id: 'done', count: 3 }]
```

---

## שקף 11-12 – Pagination (10 דקות)
**Cursor pagination demo:**
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

## הערות מרצה
- **בעיית connection**: אם MongoDB לא עולה → `docker ps && docker start mongo`
- **ObjectId errors**: אם id לא valid ObjectId → Mongoose זורק CastError
