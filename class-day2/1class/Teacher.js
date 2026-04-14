// Teacher.js - כיתה נוספת שיורשת מ-Person

import Person from "./Person.js";

class Teacher extends Person {
  // Static properties
  static numberOfTeachers = 0;
  static MIN_SALARY = 8000;
  static MAX_SALARY = 25000;

  constructor(name, age, country, subject, salary) {
    super(name, age, country);
    this.subject = subject;
    this.salary = salary;
    this.students = []; // רשימת תלמידים
    this.yearsOfExperience = 0;
    Teacher.numberOfTeachers++;
  }

  // Override method
  introduce() {
    return `${super.introduce()}, ואני מורה ל${this.subject}`;
  }

  // Method - מוסיף תלמיד
  addStudent(student) {
    this.students.push(student);
    console.log(`👨‍🎓 ${student.name} נוסף לכיתה של ${this.name}`);
  }

  // Method - מציג את כל התלמידים
  showStudents() {
    if (this.students.length === 0) {
      return `${this.name} אין תלמידים`;
    }
    let list = `👥 תלמידים של ${this.name} (${this.subject}):\n`;
    this.students.forEach((student, index) => {
      list += `   ${index + 1}. ${student.name} - ממוצע: ${student.calculateAverage()}\n`;
    });
    return list;
  }

  // Method - מחשב ממוצע הכיתה
  calculateClassAverage() {
    if (this.students.length === 0) {
      return 0;
    }
    const sum = this.students.reduce((acc, student) => {
      return acc + parseFloat(student.calculateAverage());
    }, 0);
    return (sum / this.students.length).toFixed(2);
  }

  // Method - נותן העלאת שכר
  giveRaise(percentage) {
    const oldSalary = this.salary;
    this.salary += this.salary * (percentage / 100);
    console.log(
      `💰 ${this.name} קיבל העלאה מ-${oldSalary} ל-${this.salary} (${percentage}%)`
    );
  }

  // Getter
  get teacherInfo() {
    return `${this.info} | מקצוע: ${this.subject} | שכר: ₪${this.salary} | ניסיון: ${this.yearsOfExperience} שנים`;
  }

  // Getter - מספר תלמידים
  get studentCount() {
    return this.students.length;
  }

  // Static method
  static getTeacherCount() {
    return `יש ${Teacher.numberOfTeachers} מורים במערכת`;
  }

  // Static method - משווה משכורות
  static compareSalary(teacher1, teacher2) {
    if (teacher1.salary > teacher2.salary) {
      return `${teacher1.name} מרוויח יותר (₪${teacher1.salary} vs ₪${teacher2.salary})`;
    } else if (teacher1.salary < teacher2.salary) {
      return `${teacher2.name} מרוויח יותר (₪${teacher2.salary} vs ₪${teacher1.salary})`;
    } else {
      return `שניהם מרוויחים אותו דבר (₪${teacher1.salary})`;
    }
  }

  // Static method - יוצר מורה חדש
  static createTeacher(name, age, subject) {
    const baseSalary = 12000;
    return new Teacher(name, age, "Israel", subject, baseSalary);
  }

  // Method - המרה ל-JSON
  toJSON() {
    return {
      ...super.toJSON(),
      subject: this.subject,
      salary: this.salary,
      yearsOfExperience: this.yearsOfExperience,
      studentCount: this.students.length,
      classAverage: this.calculateClassAverage()
    };
  }
}

export default Teacher;
