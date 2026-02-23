# הרחבות : – יום 3 מצגת 10: SQL with Sequelize

**זמן:** 10:45–12:00
**מטרה:** היכרות עם Sequelize והבנת מתי SQL עדיף על MongoDB

---

## שקף 1 – פתיחה

ראינו MongoDB — עכשיו נסתכל על הצד השני. SQL קיים כבר 50 שנה ועדיין רלוונטי מאוד ב-2026. המצגת הזו מקוצרת בכוונה — מטרתה להבין מתי ולמה לבחור SQL.

**מה נלמד:**

- SQL vs MongoDB — ההבדלים המבניים
- Sequelize ORM — חיבור וניהול PostgreSQL מ-Node.js
- Models, CRUD, Relations — הבסיס
- Transactions — ACID atomicity
- SQL Injection — ההתקפה הנפוצה ביותר ואיך Sequelize מגן

**עקרון Migrations:**
Migrations הם קבצים שמגדירים שינויים במבנה ה-DB (הוספת עמודה, יצירת טבלה). הם עובדים כמו Git לסכמת ה-DB:

```bash
# יצירת migration
npx sequelize-cli migration:create --name add-role-to-users

# הרצת migrations
npx sequelize-cli db:migrate

# rollback
npx sequelize-cli db:migrate:undo
```

**למה Migrations חשובות:** בלעדיהן לא ניתן לנהל שינויי schema בצוות או ב-production בצורה בטוחה.

---

## שקף 2 – SQL vs MongoDB

\*\*השוואה ויזואלית:

```
MongoDB:                    SQL (PostgreSQL):
users collection            users table
─────────────────          ──────────────────
{ _id, name, email,        id | name | email
  addresses: [             1  | Alice | alice@...
    {city: 'TLV'}         2  | Bob   | bob@...
  ]
}
```

MongoDB מספק גמישות – ניתן להטמיע addresses ישירות ב-document. SQL מבוסס על relations – נתונים מוחזקים בטבלאות נפרדות.

**מתי להשתמש ב-SQL:**

- קשרים מורכבים בין ישויות
- צורך ב-ACID transactions מלאים
- נתונים מאוד structured וקבועים

---

## שקף 3 – Sequelize Connection

**דוגמת `src/config/db.js`:**

```js
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: (sql) => logger.debug(sql),
  pool: { max: 10, min: 2, idle: 10000 }
});

export async function connectDB() {
  await sequelize.authenticate();
  console.log("PostgreSQL connected");
}
```

---

## שקף 4 – Models

**דוגמה:**

```js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const User = sequelize.define(
  "User",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" }
  },
  { tableName: "users" }
);
```

---

## שקף 5 – CRUD

\*\*דוגמאות פעולות בסיסיות:

```js
// Create
const user = await User.create({ name: "Alice", email: "alice@test.com" });

// Find
const users = await User.findAll({
  where: { role: "admin" },
  attributes: ["name", "email"]
});

// Update
await user.update({ name: "Alice Smith" });

// Delete
await User.destroy({ where: { id: 5 } });
```

---

## שקף 6 – Relations

\*\*דוגמה:

```js
// associations
User.hasMany(Post, { foreignKey: "authorId" });
Post.belongsTo(User, { foreignKey: "authorId" });

// usage with include
const users = await User.findAll({
  include: [
    {
      model: Post,
      attributes: ["title", "createdAt"],
      required: false // LEFT JOIN
    }
  ]
});
```

---

## שקף 8 – SQL Injection

**הדגמה:**

```js
//   מסוכן מאוד!
const username = req.body.username; // "'; DROP TABLE users; --"
const query = `SELECT * FROM users WHERE username = '${username}'`;

//  בטוח - Sequelize מגן אוטומטית
const user = await User.findOne({ where: { username: req.body.username } });

//  בטוח - raw query עם replacements
const result = await sequelize.query(
  "SELECT * FROM users WHERE username = :name",
  { replacements: { name: req.body.username }, type: QueryTypes.SELECT }
);
```

**הפניה:** Bobby Tables – XKCD comic מדגים את הבעיה בצורה הומוריסטית.

---

## שקף 9 – Transactions

\*\*דוגמה:

```js
const result = await sequelize.transaction(async (t) => {
  const sender = await Account.findByPk(1, { transaction: t, lock: true });
  const receiver = await Account.findByPk(2, { transaction: t, lock: true });

  if (sender.balance < 100) throw new AppError("Insufficient balance", 400);

  await sender.decrement("balance", { by: 100, transaction: t });
  await receiver.increment("balance", { by: 100, transaction: t });

  return { success: true };
});
```

Transaction היא כמו עסקה בנקאית אטומית – אם משהו נכשל באמצע, כל השינויים מתבטלים.

---

## סיכום

מצגת זו סיקרה:

- SQL vs MongoDB – הבדלים מבניים
- Sequelize ORM להתחברות וניהול PostgreSQL
- Models, CRUD, Relations
- SQL Injection prevention
- Transactions

**הערות:**

- מצגת זו מקוצרת יחסית – הזמן מוגבל
- MongoDB לא "יותר טוב" – כל טכנולוגיה מתאימה ל-use case אחר
