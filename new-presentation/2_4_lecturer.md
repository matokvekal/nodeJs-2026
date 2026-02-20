# מדריך למרצה – יום 2 מצגת 8: סדנה מעשית

**זמן:** 15:00–16:30 (90 דקות)
**מטרה:** התלמידים יבנו API מלא בעצמם ויחברו את כל מה שלמדו

---

## הכנה מראש
- הכן קוד starter ב-repo עם package.json בסיסי
- בדוק שכולם יכולים להריץ `npm install`
- הכן solution branch להצגה בסוף

---

## מבנה הסדנה
| זמן | פעילות |
|-----|---------|
| 15:00–15:15 | Setup + הסבר המשימה |
| 15:15–16:00 | עבודה עצמאית |
| 16:00–16:20 | Code review בכיתה |
| 16:20–16:30 | סיכום + Preview ליום 3 |

---

## הסבר המשימה (15 דקות)
**מה להגיד:**
> "מה שבנינו היום בדמואים – עכשיו תבנו בעצמכם. Tasks API. CRUD מלא, Validation עם Zod, Swagger."

**הצג את שקפי המצגת 8 כ-blueprint:**
1. עמוד 3 = מבנה תיקיות
2. עמוד 4 = Zod schema
3. עמוד 5 = validate middleware
4. עמוד 6 = service
5. עמוד 7 = controller
6. עמוד 8 = router
7. עמוד 9 = error middleware

---

## עבודה עצמאית (45 דקות)
**בסדר מומלץ:**
1. `npm init + install packages`
2. `AppError.js` + `error middleware`
3. `task.schema.js` (Zod)
4. `tasks.service.js` (in-memory Map)
5. `tasks.controller.js`
6. `tasks.routes.js`
7. `app.js` + `server.js`
8. **בונוס**: Swagger, unit tests

**כשלים נפוצים לצפות:**
- שכחת `"type": "module"` ב-package.json → require error
- שכחת `.js` בסיומת import → ERR_MODULE_NOT_FOUND
- `express.json()` לא מוגדר → req.body = undefined
- Error middleware עם 3 פרמטרים במקום 4 → לא עובד

---

## Code Review (20 דקות)
**מה לבדוק:**
1. האם `errorHandler` הוא אחרון ב-`app.js`?
2. האם `validate(schema)` מחזיר middleware?
3. האם `controller` קורא ל-`service` ולא לוגיקה ישירות?
4. האם `404` מוחזר כשtask לא קיים?
5. האם Swagger UI עובד?

**שגיאות נפוצות לדיון:**
```js
// ❌ שגוי – AppError ב-controller
throw new AppError('Not found', 404);

// ✅ נכון – AppError ב-service
// controller רק קורא לservice ומחזיר תגובה
```

---

## Preview ליום 3 (10 דקות)
**מה להגיד:**
> "יופי! עשינו API עם in-memory storage. מחר מחברים ל-MongoDB אמיתי. הcodebase שבנינו היום בדיוק עובד עם DB אמיתי – רק ה-service משתנה."

---

## הערות מרצה
- **אם קבוצה לא גמרה**: בסדר! ה-checklist בשקף 12 עוזר לדעת מה חסר
- **אם הכל גמר מהר**: הצע להוסיף filtering ב-getAll וסדרת מיון
- **דמו solution**: הצג רק אם נשאר זמן ורוב הכיתה נתקעה
