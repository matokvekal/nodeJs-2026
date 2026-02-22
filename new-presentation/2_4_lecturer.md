# מדריך למרצה – יום 2 מצגת 8: סדנה מעשית

**זמן:** 15:00–16:30
**מטרה:** בניית API מלא עצמאית וחיבור כל המרכיבים שנלמדו

---

## שקף 1 – פתיחת הסדנה

סיימנו ללמוד תיאוריה — עכשיו מיישמים. הסדנה הזו היא הזדמנות לגבש את כל מה שנלמד ביום 2 ולבנות API אמיתי מאפס.

**מה בונים:** Tasks API — CRUD מלא עם ולידציה, error handling ו-Swagger.

**למה Tasks API ספציפית:**
- פשוט מספיק לסיים בשעה וחצי
- מייצג pattern שחוזר בכל API: Resource + CRUD + Auth (ביום 3)
- ה-codebase שנבנה ישמש כבסיס לחיבור MongoDB ביום 3

**מה מצפים לקבל בסוף:**
```
POST   /api/v1/tasks        → 201 Created
GET    /api/v1/tasks        → 200 + array
GET    /api/v1/tasks/:id    → 200 / 404
PUT    /api/v1/tasks/:id    → 200 / 404 / 422
DELETE /api/v1/tasks/:id    → 204 / 404
GET    /api-docs            → Swagger UI
```

---

## מבנה הסדנה

| זמן         | פעילות                 |
| ----------- | ---------------------- |
| 15:00–15:15 | Setup + הסבר המשימה    |
| 15:15–16:00 | עבודה עצמאית           |
| 16:00–16:20 | Code review בכיתה      |
| 16:20–16:30 | סיכום + Preview ליום 3 |

---

## הסבר המשימה

המשימה: בניית Tasks API מלא – CRUD, Validation עם Zod, Swagger.

**מבנה הפרויקט (לפי שקפי המצגת):**

1. עמוד 3 = מבנה תיקיות
2. עמוד 4 = Zod schema
3. עמוד 5 = validate middleware
4. עמוד 6 = service
5. עמוד 7 = controller
6. עמוד 8 = router
7. עמוד 9 = error middleware

---

## עבודה עצמאית

**סדר מומלץ:**

1. `npm init + install packages`
2. `AppError.js` + `error middleware`
3. `task.schema.js` (Zod)
4. `tasks.service.js` (in-memory Map)
5. `tasks.controller.js`
6. `tasks.routes.js`
7. `app.js` + `server.js`
8. **בונוס**: Swagger, unit tests

**שגיאות נפוצות:**

- שכחת `"type": "module"` ב-package.json → require error
- שכחת `.js` בסיומת import → ERR_MODULE_NOT_FOUND
- `express.json()` לא מוגדר → req.body = undefined
- Error middleware עם 3 פרמטרים במקום 4 → לא עובד

---

## Code Review

**נקודות לבדיקה:**

1. האם `errorHandler` הוא אחרון ב-`app.js`?
2. האם `validate(schema)` מחזיר middleware?
3. האם `controller` קורא ל-`service` ולא לוגיקה ישירות?
4. האם `404` מוחזר כשtask לא קיים?
5. האם Swagger UI עובד?

**שגיאות נפוצות לדיון:**

```js
// ❌ שגוי – AppError ב-controller
throw new AppError("Not found", 404);

// ✅ נכון – AppError ב-service
// controller רק קורא לservice ומחזיר תגובה
```

---

## Preview ליום 3

ביום 3 נחבר את ה-API שבנינו ל-MongoDB אמיתי. ה-codebase שבנינו יעבוד עם DB אמיתי כמעט בלי שינויים – רק ה-Service layer ישתנה.

---

## סיכום

הסדנה מאפשרת יישום מעשי של כל המרכיבים שנלמדו ביום 2:

- ESM modules
- Express 5 routing
- Zod validation
- Error handling
- REST API design

**הערות:**

- אם לא כולם גמרו – בסדר, ה-checklist בשקף 12 עוזר לדעת מה חסר
- אם הכל גמר מהר – אפשר להוסיף filtering ו-sorting ל-getAll
