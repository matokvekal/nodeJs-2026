Closure – הסבר מדויק (Node.js / V8)
מה זה Closure?

Closure = פונקציה ששומרת גישה למשתנים שהיו בטווח (scope) שלה בזמן יצירתה
גם אחרי שהפונקציה החיצונית כבר הסתיימה.

לא מדובר בהעתקה של הערכים –
מדובר בשמירה של reference ל-lexical environment.

דוגמה בסיסית
function outer() {
const x = 10;

return function inner() {
console.log(x);
};
}

const fn = outer();
fn();

פלט:

10

inner שומר גישה ל־x למרות ש־outer כבר הסתיימה.

למה זה קורה?

ב־V8:

בזמן יצירת inner

המנוע שומר את ה-Lexical Environment של outer

המשתנים נשמרים ב-heap

ולכן לא נמחקים ב-GC

מתי זה חשוב?
1️⃣ שמירת State פרטי (Encapsulation)
function counter() {
let count = 0;

return function () {
count++;
return count;
};
}

const inc = counter();

console.log(inc()); // 1
console.log(inc()); // 2

count פרטי – אין דרך לגשת אליו מבחוץ.

2️⃣ Factory Functions (Pattern נפוץ ב-Node)
function createLogger(prefix) {
return function (message) {
console.log(`[${prefix}] ${message}`);
};
}

const errorLogger = createLogger("ERROR");

errorLogger("Something failed");

prefix נשמר בתוך ה-closure.

3️⃣ Async + Event Loop
function delayedMessage(msg) {
setTimeout(() => {
console.log(msg);
}, 1000);
}

delayedMessage("Hello");

msg נשמר עד שה־callback רץ.

איך ניגשים לפרמטרים?

Closure שומר גישה ל:

פרמטרים של פונקציה

משתנים מקומיים

משתנים חיצוניים ב-scope chain

דוגמה:

function outer(a) {
let b = 5;

return function inner(c) {
console.log(a, b, c);
};
}

const fn = outer(1);
fn(3);

פלט:

1 5 3

גישה ל:

a → פרמטר של outer

b → משתנה מקומי של outer

c → פרמטר של inner

Closure לא שומר ערך – שומר reference
function outer() {
let x = 1;

return function () {
console.log(x);
};
}

const fn = outer();
x = 100; // שגיאה – x לא גלובלי

אבל:

function outer() {
let x = 1;

return {
inc() { x++; },
log() { console.log(x); }
};
}

const obj = outer();

obj.log(); // 1
obj.inc();
obj.log(); // 2

שניהם משתמשים באותו reference.

Closure בתוך לולאה – חשוב מאוד
עם var (בעיה)
for (var i = 0; i < 3; i++) {
setTimeout(() => console.log(i), 0);
}

פלט:

3
3
3

כולם חולקים אותו i.

עם let (נכון)
for (let i = 0; i < 3; i++) {
setTimeout(() => console.log(i), 0);
}

פלט:

0
1
2

let יוצר binding חדש בכל איטרציה.

מתי Closure מסוכן?
Memory Leak

אם פונקציה פנימית מחזיקה משתנה גדול:

function bigData() {
const huge = new Array(1e6).fill("data");

return function () {
console.log("still alive");
};
}

const fn = bigData();

huge יישאר בזיכרון אם נעשה בו שימוש ב-closure.

איך זה עובד טכנית (V8)

בעת יצירת פונקציה:

נוצר Function Object

נשמר pointer ל-[[Environment]]

נשמר Scope Chain

אם יש משתנים חיצוניים → מועברים ל-heap

מתי משתמשים בזה בעולם Node?

Middleware factories

Configuration injection

Logger factories

Private state

Caching

Currying

Dependency injection

דוגמה אמיתית Node
function createService(db) {
return {
getUser(id) {
return db.find(id);
}
};
}

const service = createService(myDbInstance);

db נשמר בתוך ה-closure.

TL;DR

Closure = פונקציה ששומרת גישה ל-scope שבו נוצרה

✔ מאפשר state פרטי
✔ מאפשר factories
✔ עובד עם async
✔ שומר reference לא ערך
⚠ עלול לגרום ל-memory leak
