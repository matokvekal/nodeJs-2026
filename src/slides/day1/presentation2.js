import { quiz_1_2 } from "../../data/quizzes/quiz_1_2.js";

export const slides = [
  {
    id: 1,
    type: "title",
    title: "Async Patterns & Control Flow",
    subtitle: "מהקולבק המודרני ועד Async Iterators"
  },
  {
    id: 2,
    title: "Callback – היסטוריה קצרה (5 דקות)",
    bullets: [
      "הדפוס ההיסטורי של Node.js: פונקציה מקבלת פונקציה כארגומנט אחרון",
      "מוסכמה: (error, data) – פרמטר ראשון תמיד שגיאה (Error-First Callback)",
      "הבעיה: Callback Hell – קינון עמוק שמקשה על קריאה ותחזוקה",
      "Node.js APIs ישנים עדיין משתמשים בזה: fs.readFile(path, cb)",
      "util.promisify הופך callback-style לـ Promise-style",
      "כיום: לא כותבים callbacks חדשים – משתמשים ב-Promise/async-await"
    ]
  },
  {
    id: 3,
    title: "Promise – מה זה?",
    bullets: [
      "אובייקט שמייצג תוצאה עתידית של פעולה אסינכרונית",
      "שלושה מצבים: pending (מחכה), fulfilled (הצליח), rejected (נכשל)",
      "שרשור עם .then() ו-.catch() – כל .then מחזיר Promise חדש",
      ".catch() תופס שגיאות מכל .then קודם בשרשרת",
      "Promise שנדחה ולא טופל → unhandledRejection event ב-Node.js",
      "ברגע שעבר ל-fulfilled/rejected – לא ניתן לשנות"
    ]
  },
  {
    id: 4,
    title: "יצירת Promise",
    bullets: [
      "new Promise((resolve, reject) => { }) – יוצר Promise ידנית",
      "resolve(value) – מעביר ל-fulfilled עם ערך",
      "reject(error) – מעביר ל-rejected עם שגיאה",
      "Promise.resolve(value) – ויצוא מהיר של Promise מוכן",
      "Promise.reject(new Error('msg')) – ויצוא מהיר של Promise נכשל",
      "util.promisify(fs.readFile) – אוטומטי עבור functions עם Error-First signature"
    ]
  },
  {
    id: 5,
    title: "async / await",
    bullets: [
      "async function מחזירה תמיד Promise",
      "await עוצר את הביצוע בתוך הפונקציה עד ש-Promise מסתיים",
      "הקוד נקרא כמו קוד סינכרוני אבל מתנהג אסינכרונית",
      "await פועל רק בתוך async function או top-level ESM module",
      "שגיאה ב-Promise שמחכים לו → נזרקת כ-throw רגיל",
      "הדפוס המועדף ב-2026 לכל קוד אסינכרוני חדש"
    ]
  },
  {
    id: 6,
    title: "טיפול בשגיאות עם async/await",
    bullets: [
      "try/catch עוטף await כדי לתפוס rejections",
      "ניתן לתפוס סוגי שגיאות שונים באותו catch",
      "שגיאה שלא נתפסת עולה למעלה כ-rejected Promise",
      "ב-Express 5: שגיאות מ-async handlers מועברות אוטומטית ל-error middleware",
      "ב-Express 4: צריך next(error) ידנית בתוך catch",
      "אסור להשאיר catch ריק – תמיד לפחות logger.error(err)"
    ]
  },
  {
    id: 7,
    title: "Promise.all ו-allSettled",
    bullets: [
      "Promise.all([p1, p2, p3]) – מחכה לכולם, מחזיר מערך תוצאות",
      "אם אחד נכשל – Promise.all נכשל מיידית (fail-fast)",
      "תוצאות בסדר זהה למערך המקורי ללא קשר לסדר הסיום",
      "Promise.allSettled([p1, p2]) – ממתין לכולם גם אם יש כישלונות",
      "כל פריט ב-allSettled: { status: 'fulfilled'|'rejected', value|reason }",
      "שימוש: הרצת מספר בקשות API במקביל לחיסכון בזמן"
    ]
  },
  {
    id: 8,
    title: "Promise.race ו-any",
    bullets: [
      "Promise.race([p1, p2]) – מחזיר תוצאת ה-Promise הראשון שמסיים (גם אם נכשל)",
      "שימוש נפוץ: מימוש timeout – race בין הפעולה ל-setTimeout",
      "Promise.any([p1, p2]) – מחזיר את ה-Promise הראשון שהצליח",
      "Promise.any נכשל רק אם כולם נכשלו – זורק AggregateError",
      "ב-2026: מועדף AbortSignal.timeout(ms) על פני Promise.race לـ timeout",
      "שילוב עם fetch: fetch(url, { signal: AbortSignal.timeout(5000) })"
    ]
  },
  {
    id: 9,
    title: "finally מעשי",
    bullets: [
      ".finally(fn) – רץ תמיד בסוף השרשרת, ללא קשר לתוצאה",
      "לא מקבל ארגומנטים ולא משנה את הערך שעובר בשרשרת",
      "שימוש: ניקוי משאבים – סגירת חיבורים, ביטול spinners, הסרת loading",
      "עובד גם עם await בתוך try/catch/finally",
      "מבטיח שקוד ניקוי ירוץ גם אחרי שגיאה",
      "כלל אצבע: כל פתיחת resource → finally סוגר אותו"
    ]
  },
  {
    id: 10,
    title: "Async Iterators ו-for await",
    bullets: [
      "for await...of מאפשר איטרציה על מקור נתונים אסינכרוני",
      "כל איטרציה ממתינה ל-Promise הבא לפני שממשיכה",
      "שימושי לקריאת Streams, תוצאות מ-DB, אירועים, WebSocket messages",
      "האובייקט חייב לממש Symbol.asyncIterator",
      "break בתוך for await → מפעיל .return() של ה-iterator לשחרור משאבים",
      "קריא הרבה יותר מהאזנה ידנית לאירועי data ו-end"
    ]
  },
  {
    id: 11,
    title: "AbortSignal כ-Flow Control",
    bullets: [
      "AbortSignal מאפשר ביטול של כל פעולה אסינכרונית שתומכת בו",
      "מעביר signal ל-functions שמקבלות options.signal",
      "שימושי לביטול שרשראות Promise מורכבות כשהתוצאה כבר לא רלוונטית",
      "addEventListener עם { signal } מסיר אוטומטית את ה-listener בביטול",
      "מנגנון מפתח למניעת דליפות זיכרון בפעולות ארוכות",
      "דוגמה: ביטול כל בקשות הנתונים כשהמשתמש מנווט לדף אחר"
    ]
  },
  {
    id: 12,
    title: "Cancellation Patterns",
    bullets: [
      "Pattern 1: AbortSignal.timeout(5000) – timeout אוטומטי",
      "Pattern 2: AbortController משותף – ביטול מרכזי של מספר פעולות",
      "Pattern 3: בדיקת signal.aborted לפני כל שלב בפעולה ארוכה",
      "לאחר ביטול: signal.reason מכיל את סיבת הביטול",
      "AbortError – סוג השגיאה שנזרקת בביטול (בדוק ב-catch)",
      "חשוב: תמיד לנקות resources ב-finally גם אחרי ביטול"
    ]
  },
  {
    id: 13,
    title: "סיכום – יום 1 מצגת 2",
    bullets: [
      "Callbacks – היסטוריה; async/await – הסטנדרט המודרני",
      "Promise מייצג ערך עתידי עם שלושה מצבים מוגדרים",
      "Promise.all – מקבילי, Promise.race – הראשון שמסיים",
      "Promise.allSettled – כולם, ללא fail-fast",
      "for await...of – איטרציה נקייה על נתונים אסינכרוניים",
      "AbortSignal – מנגנון אחיד לביטול ומניעת דליפות"
    ]
  }
];
