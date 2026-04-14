// main.js - קובץ ראשי המדגים את כל התכונות של OOP ב-Node.js

// ========================================
// 1. IMPORT - ייבוא הכיתות
// ========================================
import Person from "./Person.js";
import Student from "./Student.js";
import Teacher from "./Teacher.js";

console.log("═══════════════════════════════════════════════════════════");
console.log("📚 הדגמת Object-Oriented Programming ב-Node.js");
console.log("═══════════════════════════════════════════════════════════\n");

// ========================================
// 2. יצירת אובייקטים - INSTANCES
// ========================================
console.log("🔸 חלק 1: יצירת אובייקטים (Instances)\n");

// יצירת Person רגיל
const person1 = new Person("אברהם", 45, "Israel");
const person2 = new Person("שרה", 42, "Israel");

console.log(person1.introduce());
console.log(person2.introduce());
console.log("");

// ========================================
// 3. METHODS רגילים
// ========================================
console.log("🔸 חלק 2: שימוש ב-Methods רגילים\n");

person1.celebrateBirthday();
console.log(person1.greet(person2));
console.log("");

// ========================================
// 4. GETTERS - שימוש בGetter
// ========================================
console.log("🔸 חלק 3: Getters\n");

console.log("מידע מלא:", person1.info);
console.log("מידע מלא:", person2.info);
console.log("");

// ========================================
// 5. STATIC METHODS - פונקציות סטטיות
// ========================================
console.log("🔸 חלק 4: Static Methods (שייכות לכיתה, לא לאובייקט)\n");

console.log(Person.getPopulation());
console.log(Person.compareAge(person1, person2));
console.log("");

// ========================================
// 6. INHERITANCE - הורשה
// ========================================
console.log("🔸 חלק 5: Inheritance (הורשה) - Student יורש מ-Person\n");

const student1 = new Student("דני", 22, "Israel", 123456, 85);
const student2 = new Student("מיכל", 21, "Israel", 789012, 90);
const student3 = Student.createRandom(); // static method

console.log(student1.introduce()); // Override של method
console.log(student2.introduce());
console.log(student3.introduce());
console.log("");

// ========================================
// 7. הוספת קורסים
// ========================================
console.log("🔸 חלק 6: עבודה עם Methods של Student\n");

student1.addCourse("מתמטיקה", 95);
student1.addCourse("פיזיקה", 88);
student1.addCourse("אנגלית", 92);

student2.addCourse("מתמטיקה", 100);
student2.addCourse("כימיה", 85);
student2.addCourse("ביולוגיה", 95);

console.log("");
console.log(student1.showCourses());
console.log(student2.showCourses());
console.log("");

// ========================================
// 8. חישוב ממוצעים
// ========================================
console.log("🔸 חלק 7: חישובים ובדיקות\n");

console.log(`ממוצע ${student1.name}:`, student1.calculateAverage());
console.log(
  `האם ${student1.name} עובר?`,
  student1.isPassing() ? "✅ כן" : "❌ לא"
);
console.log("");

console.log(`ממוצע ${student2.name}:`, student2.calculateAverage());
console.log(
  `האם ${student2.name} עובר?`,
  student2.isPassing() ? "✅ כן" : "❌ לא"
);
console.log("");

// ========================================
// 9. Getter מורכב
// ========================================
console.log("🔸 חלק 8: Getter מורכב (fullInfo)\n");

console.log(student1.fullInfo);
console.log(student2.fullInfo);
console.log("");

// ========================================
// 10. Static methods של Student
// ========================================
console.log("🔸 חלק 9: Static Methods של Student\n");

console.log(Student.getStudentCount());
console.log(Student.compareBetter(student1, student2));
console.log("");

// ========================================
// 11. Teacher Class - כיתה נוספת שיורשת מ-Person
// ========================================
console.log("🔸 חלק 10: Teacher Class (כיתה נוספת עם הורשה)\n");

const teacher1 = new Teacher("פרופ' כהן", 50, "Israel", "מתמטיקה", 15000);
const teacher2 = Teacher.createTeacher('ד"ר לוי', 45, "פיזיקה");

console.log(teacher1.introduce());
console.log(teacher2.introduce());
console.log("");

// ========================================
// 12. הוספת תלמידים למורה
// ========================================
console.log("🔸 חלק 11: הוספת תלמידים למורה\n");

teacher1.addStudent(student1);
teacher1.addStudent(student2);
teacher1.addStudent(student3);

console.log("");
console.log(teacher1.showStudents());
console.log("");

console.log(
  `ממוצע הכיתה של ${teacher1.name}: ${teacher1.calculateClassAverage()}`
);
console.log("");

// ========================================
// 13. שינוי משכורת
// ========================================
console.log("🔸 חלק 12: שינוי משכורת מורה\n");

teacher1.giveRaise(10);
console.log("");

// ========================================
// 14. Static methods של Teacher
// ========================================
console.log("🔸 חלק 13: Static Methods של Teacher\n");

console.log(Teacher.getTeacherCount());
console.log(Teacher.compareSalary(teacher1, teacher2));
console.log("");

// ========================================
// 15. סיכום סטטיסטיקות
// ========================================
console.log("🔸 חלק 14: סטטיסטיקות כלליות (Static Properties)\n");

console.log(Person.getPopulation());
console.log(Student.getStudentCount());
console.log(Teacher.getTeacherCount());
console.log("");

// ========================================
// 16. המרה ל-JSON
// ========================================
console.log("🔸 חלק 15: המרה ל-JSON\n");

console.log("Person JSON:", JSON.stringify(person1.toJSON(), null, 2));
console.log("\nStudent JSON:", JSON.stringify(student1.toJSON(), null, 2));
console.log("\nTeacher JSON:", JSON.stringify(teacher1.toJSON(), null, 2));
console.log("");

// ========================================
// 17. בדיקת INSTANCEOF
// ========================================
console.log("🔸 חלק 16: בדיקת טיפוסים (instanceof)\n");

console.log("student1 instanceof Student:", student1 instanceof Student);
console.log("student1 instanceof Person:", student1 instanceof Person);
console.log("person1 instanceof Student:", person1 instanceof Student);
console.log("teacher1 instanceof Person:", teacher1 instanceof Person);
console.log("teacher1 instanceof Teacher:", teacher1 instanceof Teacher);
console.log("");

// ========================================
// 18. גישה ל-Static Properties
// ========================================
console.log("🔸 חלק 17: גישה ל-Static Properties\n");

console.log("Student.PASSING_GRADE:", Student.PASSING_GRADE);
console.log("Teacher.MIN_SALARY:", Teacher.MIN_SALARY);
console.log("Teacher.MAX_SALARY:", Teacher.MAX_SALARY);
console.log("Person.MIN_AGE:", Person.MIN_AGE);
console.log("Person.MAX_AGE:", Person.MAX_AGE);
console.log("");

// ========================================
// 19. Getters מיוחדים
// ========================================
console.log("🔸 חלק 18: שימוש ב-Getters מיוחדים\n");

console.log("מידע מורה מלא:", teacher1.teacherInfo);
console.log("מספר תלמידים של המורה:", teacher1.studentCount);
console.log("");

// ========================================
// סיכום
// ========================================
console.log("═══════════════════════════════════════════════════════════");
console.log("✅ סיום ההדגמה!");
console.log("═══════════════════════════════════════════════════════════");
console.log("\n📝 סיכום מה למדנו:");
console.log("   ✓ יצירת Classes");
console.log("   ✓ Constructor ו-this");
console.log("   ✓ Methods רגילים");
console.log("   ✓ Static Methods ו-Properties");
console.log("   ✓ Inheritance (הורשה)");
console.log("   ✓ super() - קריאה ל-constructor של האב");
console.log("   ✓ Override של methods");
console.log("   ✓ Getters ו-Setters");
console.log("   ✓ Import / Export (module.exports ו-require)");
console.log("   ✓ instanceof - בדיקת טיפוסים");
console.log("   ✓ JSON conversion");
console.log("═══════════════════════════════════════════════════════════\n");
