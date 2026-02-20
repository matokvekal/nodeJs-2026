// Quiz for Day 3, Lesson 2 - SQL & Sequelize
export const quiz_3_2 = [
  {
    question: "מהו SQL?",
    answers: [
      "NoSQL database",
      "Structured Query Language - שפת שאילתות למסדי נתונים יחסיים",
      "JavaScript framework",
      "MongoDB driver"
    ],
    correct: 1,
    explanation:
      "SQL היא שפת שאילתות סטנדרטית לניהול מסדי נתונים יחסיים (MySQL, PostgreSQL, SQLite)."
  },
  {
    question: "מהו Sequelize?",
    answers: [
      "SQL database",
      "ORM (Object-Relational Mapping) ל-Node.js",
      "Query builder",
      "Migration tool"
    ],
    correct: 1,
    explanation:
      "Sequelize הוא ORM שמאפשר לעבוד עם SQL databases דרך JavaScript objects."
  },
  {
    question: "מהו Model ב-Sequelize?",
    answers: [
      "טבלה במסד הנתונים",
      "Class המייצג טבלה ב-database",
      "Connection",
      "Query"
    ],
    correct: 1,
    explanation:
      "Model הוא representation של טבלה - מגדיר columns, types, relationships."
  },
  {
    question: "איך יוצרים row חדש ב-Sequelize?",
    answers: ["Model.insert()", "Model.create()", "Model.add()", "Model.new()"],
    correct: 1,
    explanation:
      "Model.create(data) יוצר row חדש ב-database והחזיר את ה-instance."
  },
  {
    question: "מהו Migration ב-Sequelize?",
    answers: [
      "העברת database למקום אחר",
      "קובץ שמגדיר שינויים בschema (create/alter/drop tables)",
      "גיבוי נתונים",
      "סוג של query"
    ],
    correct: 1,
    explanation:
      "Migration = script לשינויי schema (create table, add column, etc) - ניתן לביצוע ולביטול."
  },
  {
    question: "מהו Association ב-Sequelize?",
    answers: [
      "Index",
      "קשר בין models (hasOne, hasMany, belongsTo)",
      "Transaction",
      "Validation"
    ],
    correct: 1,
    explanation:
      "Associations מגדירים קשרים: hasOne (1:1), hasMany (1:N), belongsToMany (N:M)."
  },
  {
    question: "מה ההבדל בין hasMany ל-belongsTo?",
    answers: [
      "אין הבדל",
      "hasMany = אחד לרבים, belongsTo = רבים לאחד (הכיוון ההפוך)",
      "hasMany מהיר יותר",
      "belongsTo רק ל-MongoDB"
    ],
    correct: 1,
    explanation:
      "User.hasMany(Post) = למשתמש יש פוסטים רבים. Post.belongsTo(User) = פוסט שייך למשתמש."
  },
  {
    question: "מהו Transaction ב-SQL?",
    answers: [
      "סוג של query",
      "קבוצת פעולות שמתבצעות ביחד (all or nothing)",
      "Connection pool",
      "Index type"
    ],
    correct: 1,
    explanation:
      "Transaction מבטיח שכל הפעולות מתבצעות או שכולן מתבטלות (commit/rollback)."
  },
  {
    question: "איך מבצעים JOIN ב-Sequelize?",
    answers: [
      "Model.join()",
      "include option ב-findAll()",
      "Model.merge()",
      "populate()"
    ],
    correct: 1,
    explanation:
      "Model.findAll({ include: [OtherModel] }) מבצע JOIN ומחזיר נתונים מקושרים."
  },
  {
    question: "מהו Seed ב-Sequelize?",
    answers: [
      "Primary key",
      "קובץ שממלא את ה-database בנתוני דמה",
      "Backup",
      "Index"
    ],
    correct: 1,
    explanation:
      "Seed = script להכנסת נתוני starting/demo ל-database אחרי migrations."
  }
];
