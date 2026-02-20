import { quiz_3_2 } from "../../data/quizzes/quiz_3_2.js";

export const slides = [
  {
    id: 1,
    type: "title",
    title: "SQL with Sequelize",
    subtitle: "Models, Relations, Transactions, SQL Injection Prevention"
  },
  {
    id: 2,
    title: "SQL vs MongoDB – מתי מה?",
    panels: [
      {
        comparison: {
          headers: ["", "MongoDB", "SQL (MySQL/PostgreSQL)"],
          rows: [
            ["מבנה", "גמיש, מסמכים", "קשיח, טבלאות"],
            ["קשרים", "Embedding / Reference", "Foreign Keys, JOINs"],
            ["ACID", "ברמת מסמך", "מלא בכל transaction"],
            ["מקרי שימוש", "CMS, Catalogs, Logs", "Finance, ERP, Banking"],
            ["Scale", "Horizontal", "Vertical + Read Replicas"]
          ]
        }
      }
    ],
    bullets: [
      "כלל: כשיש קשרים מורכבים ועקביות מלאה נדרשת → SQL",
      "כלל: כשמבנה משתנה מהיר וסקיילינג אופקי → MongoDB"
    ]
  },
  {
    id: 3,
    title: "Sequelize – הגדרה וחיבור",
    bullets: [
      "ORM ל-Node.js שתומך ב-MySQL, PostgreSQL, SQLite, MSSQL",
      "התקנה: npm install sequelize pg pg-hstore (לـ PostgreSQL)",
      "Connection Pool: ברירת מחדל 5 חיבורים – להגדיל לפי עומס",
      "logging: false בייצור – מחבר ל-logger בנפרד"
    ],
    code: `import { Sequelize } from 'sequelize';
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  pool: { max: 10, min: 2, idle: 10000 }
});
await sequelize.authenticate();`
  },
  {
    id: 4,
    title: "הגדרת Models",
    code: `const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' }
}, { tableName: 'users', timestamps: true });`,
    bullets: [
      "DataTypes: STRING, INTEGER, FLOAT, BOOLEAN, DATE, TEXT, JSON",
      "timestamps: true מוסיף createdAt/updatedAt אוטומטי"
    ]
  },
  {
    id: 5,
    title: "CRUD Operations",
    bullets: [
      "User.create({ name, email }) → יוצר שורה חדשה",
      "User.findAll({ where: { role: 'admin' } }) → מערך שורות תואמות",
      "User.findByPk(id) → לפי primary key, null אם לא נמצא",
      "User.findOne({ where: { email } }) → שורה ראשונה תואמת",
      "instance.update({ name: 'new' }) או User.update(values, { where: { id } })",
      "User.destroy({ where: { id } }) → מוחק שורות לפי תנאי"
    ]
  },
  {
    id: 6,
    title: "Relations",
    code: `User.hasMany(Post, { foreignKey: 'authorId' });
Post.belongsTo(User, { foreignKey: 'authorId' });

User.hasOne(Profile);
User.belongsToMany(Role, { through: 'UserRoles' });`,
    bullets: [
      "include בשאילתה → טוען קשרים",
      "foreignKey – שם מותאם לעמודת FK",
      "through – טבלת ביניים לـ many-to-many"
    ],
    code2: `User.findAll({ include: [{ model: Post, attributes: ['title'] }] })`
  },
  {
    id: 7,
    title: "Migration – ניהול Schemas",
    bullets: [
      "Migration = קבצים שמתארים שינויים בסכמה בצורה מבוקרת",
      "npx sequelize-cli migration:generate --name create-users",
      "כל migration: up לביצוע, down לביטול",
      "npx sequelize-cli db:migrate → מריץ migrations שטרם הורצו",
      "בייצור: תמיד migrations, לעולם לא sync({ force: true })",
      "Migrations נכנסים ל-Git → שיתוף שינויים בין מפתחים"
    ]
  },
  {
    id: 8,
    title: "מניעת SQL Injection",
    bullets: [
      "SQL Injection: הזרקת קוד SQL דרך קלט משתמש",
      "Sequelize מגן אוטומטית: כל ערך עובר parameterized query",
      "לעולם לא:",
      "ORM = הגנה מובנית, אבל חשוב להבין למה"
    ],
    code: `// ❌ מסוכן!
sequelize.query(\`SELECT * FROM users WHERE id = \${userId}\`);

// ✅ בטוח
sequelize.query('SELECT * FROM users WHERE id = ?',
  { replacements: [userId], type: QueryTypes.SELECT });`
  },
  {
    id: 9,
    title: "Transactions",
    code: `const result = await sequelize.transaction(async (t) => {
  const sender = await Account.findByPk(senderId, { transaction: t });
  const receiver = await Account.findByPk(receiverId, { transaction: t });

  await sender.decrement('balance', { by: amount, transaction: t });
  await receiver.increment('balance', { by: amount, transaction: t });

  return { success: true };
});`,
    bullets: [
      "שגיאה בתוך callback → rollback אוטומטי",
      "Atomicity: הכל או כלום – מניעת אי-עקביות",
      "SERIALIZABLE isolation level לפעולות רגישות"
    ]
  },
  {
    id: 10,
    title: "Raw Queries",
    code: `// Replacements עם ?
const users = await sequelize.query(
  'SELECT * FROM users WHERE age > ? AND role = ?',
  { replacements: [18, 'admin'], type: QueryTypes.SELECT }
);

// Named replacements
const user = await sequelize.query(
  'SELECT * FROM users WHERE email = :email',
  { replacements: { email }, type: QueryTypes.SELECT }
);`,
    bullets: [
      "שימוש כשה-ORM לא מספיק לשאילתות מורכבות",
      "תמיד replacements / bind – לעולם לא string concatenation"
    ]
  },
  {
    id: 11,
    title: "MongoDB vs Sequelize – השוואה מעשית",
    panels: [
      {
        comparison: {
          headers: ["", "Mongoose", "Sequelize"],
          rows: [
            ["אימות Schema", "כן (pre-save)", "כן (validations)"],
            ["Relations", "populate (app-level)", "JOINs (DB-level)"],
            ["Migrations", "אין מובנה", "sequelize-cli"],
            ["TypeScript", "mongoose types", "sequelize-typescript"],
            ["Transactions", "כן (4.0+)", "כן"]
          ]
        }
      }
    ]
  },
  {
    id: 12,
    title: "Production Tips",
    bullets: [
      "pool: { max: 10-20 } לפי עומס המופע",
      "logging → חבור ל-logger, לא ל-console",
      "attributes: ['name', 'email'] – לא להחזיר כל העמודות",
      "אינדקסים על עמודות עם חיפוש תדיר",
      "תמיד migrations לשינויי schema בייצור",
      "Connection error handling + retry logic"
    ]
  },
  {
    id: 13,
    title: "סיכום – יום 3 מצגת 10",
    bullets: [
      "SQL = קשיח, ACID, קשרים ברמת DB; MongoDB = גמיש, Horizontal scale",
      "Sequelize = ORM עם Models, Relations, Migrations, Transactions",
      "SQL Injection מנוע אוטומטית עם parameterized queries",
      "Transactions = Atomicity; הכל או כלום",
      "בחירה בין MongoDB ל-SQL = אופי הנתונים + דרישות עסקיות"
    ]
  }
];
