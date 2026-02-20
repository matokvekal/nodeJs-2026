// Quiz for Day 3, Lesson 1 - MongoDB & Mongoose
export const quiz_3_1 = [
  {
    question: "מהו MongoDB?",
    answers: [
      "SQL database",
      "NoSQL document database",
      "ספריית JavaScript",
      "web framework"
    ],
    correct: 1,
    explanation:
      "MongoDB הוא NoSQL database המאחסן נתונים כdocuments בפורמט BSON (JSON-like)."
  },
  {
    question: "מהו Mongoose?",
    answers: [
      "מנוע MongoDB",
      "ODM (Object Data Modeling) ל-MongoDB",
      "database עצמה",
      "query language"
    ],
    correct: 1,
    explanation:
      "Mongoose הוא ODM library שמספק schema-based solution לעבודה עם MongoDB."
  },
  {
    question: "מהו Schema ב-Mongoose?",
    answers: [
      "קובץ תצורה",
      "הגדרת מבנה ה-document (fields, types, validation)",
      "טבלה",
      "connection string"
    ],
    correct: 1,
    explanation:
      "Schema מגדיר את מבנה ה-document: שדות, טיפוסים, validations, defaults."
  },
  {
    question: "מהו Model ב-Mongoose?",
    answers: [
      "Schema",
      "Class שמייצר documents מה-Schema",
      "Collection",
      "Connection"
    ],
    correct: 1,
    explanation:
      "Model = Constructor שנוצר מ-Schema, משמש ליצירה ושאילתות של documents."
  },
  {
    question: "איך יוצרים document חדש עם Mongoose?",
    answers: [
      "Model.insert()",
      "Model.create() או new Model().save()",
      "Model.add()",
      "Model.new()"
    ],
    correct: 1,
    explanation:
      "שתי דרכים: Model.create(data) או const doc = new Model(data); await doc.save()."
  },
  {
    question: "איך מוצאים את כל ה-documents בcollection?",
    answers: [
      "Model.getAll()",
      "Model.find()",
      "Model.select()",
      "Model.query()"
    ],
    correct: 1,
    explanation:
      "Model.find() מחזיר את כל ה-documents. Model.find({ filter }) לסינון."
  },
  {
    question: "מהו _id ב-MongoDB?",
    answers: [
      "שדה רגיל",
      "ObjectId ייחודי שנוצר אוטומטית",
      "Primary key שצריך להגדיר",
      "Index"
    ],
    correct: 1,
    explanation:
      "_id הוא ה-primary key, ObjectId ייחודי שנוצר אוטומטית לכל document."
  },
  {
    question: "איך מעדכנים document?",
    answers: [
      "Model.update()",
      "Model.findByIdAndUpdate() או Model.updateOne()",
      "Model.modify()",
      "Model.change()"
    ],
    correct: 1,
    explanation:
      "אפשרויות: findByIdAndUpdate, updateOne, updateMany - תלוי במקרה."
  },
  {
    question: "מהו populate() ב-Mongoose?",
    answers: [
      "מילוי נתונים מפולצים",
      "מחליף references (ObjectId) ב-documents מלאים",
      "יצירת documents",
      "validation"
    ],
    correct: 1,
    explanation:
      "populate() עושה join - ממלא reference fields עם ה-documents המלאים."
  },
  {
    question: "מהו middleware (hooks) ב-Mongoose?",
    answers: [
      "Express middleware",
      "פונקציות שרצות לפני/אחרי actions (save, validate, remove)",
      "route handlers",
      "validation rules"
    ],
    correct: 1,
    explanation:
      "Mongoose middleware (pre/post hooks) רץ before/after actions כמו save, validate, remove."
  }
];
