// Student.js - כיתה שיורשת מ-Person (Inheritance)

// Import - מייבא את כיתת Person
import Person from "./Person.js";

class Student extends Person {
  // Static property ספציפי לסטודנטים
  static numberOfStudents = 0;
  static PASSING_GRADE = 60;

  // Constructor - קורא ל-constructor של האב עם super
  constructor(name, age, country, studentId, grade = 0) {
    // super - קורא ל-constructor של הכיתה האב (Person)
    super(name, age, country);

    this.studentId = studentId;
    this.grade = grade;
    this.courses = [];
    Student.numberOfStudents++;
  }

  // Override - דורס את ה-method של הכיתה האב
  introduce() {
    // משתמש ב-method של האב ומוסיף עליו
    const baseIntro = super.introduce();
    return `${baseIntro}, ואני סטודנט עם מספר ${this.studentId}`;
  }

  // Method חדש - ספציפי לסטודנט
  addCourse(courseName, courseGrade) {
    this.courses.push({
      name: courseName,
      grade: courseGrade
    });
    console.log(`✅ ${courseName} נוסף לתלמיד ${this.name}`);
  }

  // Method - מחשב ממוצע ציונים
  calculateAverage() {
    if (this.courses.length === 0) {
      return 0;
    }
    const sum = this.courses.reduce((acc, course) => acc + course.grade, 0);
    return (sum / this.courses.length).toFixed(2);
  }

  // Method - בודק האם הסטודנט עבר
  isPassing() {
    const avg = this.calculateAverage();
    return avg >= Student.PASSING_GRADE;
  }

  // Getter - מחזיר מידע מלא על הסטודנט
  get fullInfo() {
    const avg = this.calculateAverage();
    const status = this.isPassing() ? "✅ עובר" : "❌ נכשל";
    return `${this.info} | תעודת זהות: ${this.studentId} | ממוצע: ${avg} | ${status}`;
  }

  // Method - מציג את כל הקורסים
  showCourses() {
    if (this.courses.length === 0) {
      return `${this.name} לא רשום לקורסים`;
    }
    let courseList = `📚 קורסים של ${this.name}:\n`;
    this.courses.forEach((course, index) => {
      courseList += `   ${index + 1}. ${course.name}: ${course.grade}\n`;
    });
    return courseList;
  }

  // Static method - מחזיר את מספר הסטודנטים
  static getStudentCount() {
    return `יש ${Student.numberOfStudents} סטודנטים במערכת`;
  }

  // Static method - משווה בין שני סטודנטים לפי ממוצע
  static compareBetter(student1, student2) {
    const avg1 = student1.calculateAverage();
    const avg2 = student2.calculateAverage();

    if (avg1 > avg2) {
      return `${student1.name} (${avg1}) טוב יותר מ-${student2.name} (${avg2})`;
    } else if (avg1 < avg2) {
      return `${student2.name} (${avg2}) טוב יותר מ-${student1.name} (${avg1})`;
    } else {
      return `${student1.name} ו-${student2.name} באותו ממוצע (${avg1})`;
    }
  }

  // Static method - יוצר סטודנט אקראי
  static createRandom() {
    const names = ["יוסי", "דני", "שרה", "רחל", "משה", "דוד"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomAge = Math.floor(Math.random() * 13) + 18; // 18-30
    const randomId = Math.floor(Math.random() * 900000) + 100000; // 6 digits

    return new Student(randomName, randomAge, "Israel", randomId);
  }

  // Override - המרה ל-JSON
  toJSON() {
    return {
      ...super.toJSON(),
      studentId: this.studentId,
      grade: this.grade,
      courses: this.courses,
      average: this.calculateAverage()
    };
  }
}

// Export
export default Student;
