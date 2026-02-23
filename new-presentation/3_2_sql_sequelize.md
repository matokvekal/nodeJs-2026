# יום 3 – מצגת 10: SQL with Sequelize (מקוצר)

---

## שקף 1

**כותרת ראשית:** SQL with Sequelize
**כותרת משנה:** Models, Relations, Transactions, SQL Injection Prevention

---

## שקף 2

**כותרת ראשית:** SQL vs MongoDB – מתי מה?
| | **MongoDB** | **SQL (MySQL/PostgreSQL)** |
|---|---|---|
| מבנה | גמיש, מסמכים | קשיח, טבלאות |
| קשרים | Embedding / Reference | Foreign Keys, JOINs |
| ACID | ברמת מסמך | מלא בכל transaction |
| מקרי שימוש | CMS, Catalogs, Logs | Finance, ERP, Banking |
| Scale | Horizontal | Vertical + Read Replicas |

- **כלל**: כשיש קשרים מורכבים ועקביות מלאה נדרשת → SQL
- **כלל**: כשמבנה משתנה מהיר וסקיילינג אופקי → MongoDB

---

## שקף 3

**כותרת ראשית:** Sequelize – הגדרה וחיבור

- ORM ל-Node.js שתומך ב-MySQL, PostgreSQL, SQLite, MSSQL
- התקנה: `npm install sequelize pg pg-hstore` (לـ PostgreSQL)
- ```js
  import { Sequelize } from "sequelize";
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    pool: { max: 10, min: 2, idle: 10000 }
  });
  await sequelize.authenticate();
  ```
- **Connection Pool**: ברירת מחדל 5 חיבורים – להגדיל לפי עומס
- `logging: false` בייצור – מחבר ל-logger בנפרד

---

## שקף 4

**כותרת ראשית:** הגדרת Models

```js
const User = sequelize.define(
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
  { tableName: "users", timestamps: true }
);
```

- `DataTypes`: `STRING`, `INTEGER`, `FLOAT`, `BOOLEAN`, `DATE`, `TEXT`, `JSON`
- `timestamps: true` מוסיף `createdAt`/`updatedAt` אוטומטי

---

## שקף 5

**כותרת ראשית:** CRUD Operations

- `User.create({ name, email })` → יוצר שורה חדשה
- `User.findAll({ where: { role: 'admin' } })` → מערך שורות תואמות
- `User.findByPk(id)` → לפי primary key, `null` אם לא נמצא
- `User.findOne({ where: { email } })` → שורה ראשונה תואמת
- `instance.update({ name: 'new' })` או `User.update(values, { where: { id } })`
- `User.destroy({ where: { id } })` → מוחק שורות לפי תנאי

---

## שקף 6

**כותרת ראשית:** Relations

```js
User.hasMany(Post, { foreignKey: "authorId" });
Post.belongsTo(User, { foreignKey: "authorId" });

User.hasOne(Profile);
User.belongsToMany(Role, { through: "UserRoles" });
```

- `include` בשאילתה → טוען קשרים:
  ```js
  User.findAll({ include: [{ model: Post, attributes: ["title"] }] });
  ```
- `foreignKey` – שם מותאם לעמודת FK
- `through` – טבלת ביניים לـ many-to-many

---

## שקף 7

**כותרת ראשית:** Migration – ניהול Schemas

- Migration = קבצים שמתארים שינויים בסכמה בצורה **מבוקרת**
- `npx sequelize-cli migration:generate --name create-users`
- כל migration: `up` לביצוע, `down` לביטול
- `npx sequelize-cli db:migrate` → מריץ migrations שטרם הורצו
- **בייצור**: תמיד migrations, **לעולם לא** `sync({ force: true })`
- Migrations נכנסים ל-Git → שיתוף שינויים בין מפתחים

---

## שקף 8

**כותרת ראשית:** מניעת SQL Injection

- **SQL Injection**: הזרקת קוד SQL דרך קלט משתמש
- Sequelize מגן **אוטומטית**: כל ערך עובר parameterized query
- **לעולם לא**:
  ```js
  //   מסוכן!
  sequelize.query(`SELECT * FROM users WHERE id = ${userId}`);
  ```
- **תמיד** עם `replacements`:
  ```js
  //  בטוח
  sequelize.query("SELECT * FROM users WHERE id = ?", {
    replacements: [userId],
    type: QueryTypes.SELECT
  });
  ```
- ORM = הגנה מובנית, אבל חשוב להבין למה

---

## שקף 9

**כותרת ראשית:** Transactions

```js
const result = await sequelize.transaction(async (t) => {
  const sender = await Account.findByPk(senderId, { transaction: t });
  const receiver = await Account.findByPk(receiverId, { transaction: t });

  await sender.decrement("balance", { by: amount, transaction: t });
  await receiver.increment("balance", { by: amount, transaction: t });

  return { success: true };
});
```

- שגיאה בתוך callback → **rollback אוטומטי**
- **Atomicity**: הכל או כלום – מניעת אי-עקביות
- `SERIALIZABLE` isolation level לפעולות רגישות

---

## שקף 10

**כותרת ראשית:** Raw Queries

```js
// Replacements עם ?
const users = await sequelize.query(
  "SELECT * FROM users WHERE age > ? AND role = ?",
  { replacements: [18, "admin"], type: QueryTypes.SELECT }
);

// Named replacements
const user = await sequelize.query("SELECT * FROM users WHERE email = :email", {
  replacements: { email },
  type: QueryTypes.SELECT
});
```

- שימוש כשה-ORM לא מספיק לשאילתות מורכבות
- **תמיד** `replacements` / `bind` – לעולם לא string concatenation

---

## שקף 11

**כותרת ראשית:** MongoDB vs Sequelize – השוואה מעשית
| | **Mongoose** | **Sequelize** |
|---|---|---|
| אימות Schema | כן (pre-save) | כן (validations) |
| Relations | populate (app-level) | JOINs (DB-level) |
| Migrations | אין מובנה | sequelize-cli |
| TypeScript | mongoose types | sequelize-typescript |
| Transactions | כן (4.0+) | כן |

---

## שקף 12

**כותרת ראשית:** Production Tips

- `pool: { max: 10-20 }` לפי עומס המופע
- `logging` → חבור ל-logger, לא ל-console
- `attributes: ['name', 'email']` – לא להחזיר כל העמודות
- אינדקסים על עמודות עם חיפוש תדיר
- תמיד `migrations` לשינויי schema בייצור
- Connection error handling + retry logic

---

## שקף 13

**כותרת ראשית:** סיכום – יום 3 מצגת 10

- SQL = קשיח, ACID, קשרים ברמת DB; MongoDB = גמיש, Horizontal scale
- Sequelize = ORM עם Models, Relations, Migrations, Transactions
- SQL Injection מנוע אוטומטית עם parameterized queries
- Transactions = Atomicity; הכל או כלום
- בחירה בין MongoDB ל-SQL = אופי הנתונים + דרישות עסקיות
