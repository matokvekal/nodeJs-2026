// Person.js - כיתה בסיסית עם כל המאפיינים של OOP

class Person {
  // Static property - משתנה סטטי השייך לכיתה עצמה
  static numberOfPeople = 0;
  static MIN_AGE = 0;
  static MAX_AGE = 150;

  // Constructor - פונקציה שרצה כאשר יוצרים אובייקט חדש
  constructor(name, age, country = "Israel") {
    this.name = name;
    this.age = age;
    this.country = country;
    this.id = Person.generateId();
    Person.numberOfPeople++;
  }

  // Method רגיל - פונקציה שפועלת על האובייקט
  introduce() {
    return `שלום, שמי ${this.name} ואני בן ${this.age}`;
  }

  // Method רגיל נוסף
  celebrateBirthday() {
    this.age++;
    console.log(`🎉 יום הולדת שמח ל-${this.name}! כעת בן ${this.age}`);
  }

  // Method עם parameter
  greet(otherPerson) {
    return `${this.name} אומר שלום ל-${otherPerson.name}`;
  }

  // Getter - מאפשר לקרוא לפרופרטי כמו property ולא כמו function
  get info() {
    return `${this.name} (${this.age}) מ-${this.country}`;
  }

  // Setter - מאפשר לשנות ערך עם ולידציה
  set age(newAge) {
    if (newAge < Person.MIN_AGE || newAge > Person.MAX_AGE) {
      throw new Error(`גיל לא חוקי: ${newAge}`);
    }
    this._age = newAge;
  }

  get age() {
    return this._age;
  }

  // Static method - פונקציה השייכת לכיתה עצמה ולא לאובייקט
  static getPopulation() {
    return `יש ${Person.numberOfPeople} אנשים במערכת`;
  }

  // Static method נוסף - יוצר ID אוטומטי
  static generateId() {
    return `P${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Static method - משווה בין שני אנשים
  static compareAge(person1, person2) {
    if (person1.age > person2.age) {
      return `${person1.name} מבוגר יותר מ-${person2.name}`;
    } else if (person1.age < person2.age) {
      return `${person2.name} מבוגר יותר מ-${person1.name}`;
    } else {
      return `${person1.name} ו-${person2.name} באותו גיל`;
    }
  }

  // Static method - יוצר אובייקט מJSON
  static fromJSON(json) {
    const data = JSON.parse(json);
    return new Person(data.name, data.age, data.country);
  }

  // Method רגיל - המרה ל-JSON
  toJSON() {
    return {
      name: this.name,
      age: this.age,
      country: this.country,
      id: this.id
    };
  }
}

// Export - מאפשר לייבא את הכיתה בקבצים אחרים
export default Person;
