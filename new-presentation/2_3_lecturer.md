# מדריך למרצה – יום 2 מצגת 7: REST API Design Modern

**זמן:** 13:30–14:45
**מטרה:** הבנת עקרונות REST מודרניים ויישום pagination ותיעוד

---

## שקף 1 – פתיחה

יש לנו Express app עובד. עכשיו נלמד לעצב אותו נכון — REST API מקצועי שאחרים ישמחו לעבוד איתו.

**מה נלמד:**
- Resource naming – מוסכמות שמות נכונות
- Status codes – כל קוד אומר משהו
- Filtering, Sorting, Pagination – שאלות נפוצות בכל API
- Versioning – איך משדרגים API בלי לשבור לקוחות קיימים
- OpenAPI/Swagger – תיעוד שמייצר את עצמו

**REST Maturity Levels (Richardson Model):**

| רמה | תיאור | דוגמה |
|-----|-------|-------|
| Level 0 | HTTP כטנל — שגוי | POST /api?action=getUser |
| Level 1 | משאבים | GET /users/42 |
| Level 2 | HTTP Verbs + Status Codes | DELETE /users/42 → 204 |
| Level 3 | HATEOAS | תגובה כוללת links לפעולות הבאות |

**רוב APIs בעולם האמיתי הם Level 2** — Level 3 נדיר ומורכב.

---

## שקף 2 – REST Principles

REST הוא architectural style, לא תקן. יש עקרונות מקובלים שמגדירים REST נכון.

**דוגמאות – לא נכון vs נכון:**

```
❌ POST /api/getAllUsers
❌ GET /api/deleteUser/5
✅ GET /api/v1/users
✅ DELETE /api/v1/users/5
```

---

## שקף 3 – Resource Naming

**דוגמאות נכונות:**

```
✅ GET  /api/v1/users         - כל המשתמשים
✅ GET  /api/v1/users/42      - משתמש ספציפי
✅ POST /api/v1/users         - יצירת משתמש
✅ GET  /api/v1/users/42/orders  - הזמנות של משתמש
✅ POST /api/v1/users/42/activate  - פעולה על משתמש
```

---

## שקף 4 – Status Codes

**דוגמאות לשימוש נכון:**

- יצירת post חדש → 201
- POST /users, email כבר קיים → 409 Conflict
- PUT /users/5 והמשאב לא נמצא → 404
- שדה חסר ב-request body → 422 Unprocessable Entity
- חריגה מ-rate limit → 429 Too Many Requests

**עקרון:** החזרת 200 לכל מצב אינה RESTful. הלקוח צריך לדעת מה קרה מה-status code.

---

## שקף 5 – Filtering & Sorting

**דוגמה:**

```js
// GET /users?role=admin&active=true&sort=-createdAt&fields=name,email
app.get("/users", async (req, res) => {
  const { role, active, sort, fields } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (active !== undefined) filter.active = active === "true";

  const sortObj = sort?.startsWith("-")
    ? { [sort.slice(1)]: -1 }
    : { [sort]: 1 };

  const users = await User.find(filter).sort(sortObj).lean();
  res.json({ data: users });
});
```

---

## שקף 6 – Pagination

**גישת Offset-based pagination:**

```js
const page = parseInt(req.query.page) || 1;
const limit = Math.min(parseInt(req.query.limit) || 20, 100);
const skip = (page - 1) * limit;

const [users, total] = await Promise.all([
  User.find().skip(skip).limit(limit).lean(),
  User.countDocuments()
]);

res.json({
  data: users,
  meta: { page, limit, total, pages: Math.ceil(total / limit) }
});
```

**גישת Cursor-based pagination:**

```js
const after = req.query.after;
const query = after ? { _id: { $gt: after } } : {};
const users = await User.find(query).limit(21).lean();
const hasMore = users.length === 21;
const data = hasMore ? users.slice(0, -1) : users;
res.json({ data, nextCursor: hasMore ? data.at(-1)._id : null });
```

**השוואה:** Offset pagination ב-SQL מבצע OFFSET 10000 = scan של 10,000 שורות. Cursor pagination מבצע index scan ישיר ויעיל הרבה יותר.

---

## שקף 7 – Versioning

Versioning מאפשר לשמור שתי גרסאות API במקביל. v1 ו-v2 יכולים להתקיים ביחד מבלי לשבור backward compatibility.

---

## שקף 8 – HATEOAS (סקירה)

**HATEOAS** = Hypermedia As The Engine Of Application State — רמה 3 של Richardson Model.

**הרעיון:** תגובת ה-API כוללת links לפעולות הבאות האפשריות.

```json
{
  "id": 42,
  "name": "Alice",
  "status": "active",
  "_links": {
    "self":    { "href": "/users/42" },
    "orders":  { "href": "/users/42/orders" },
    "deactivate": { "href": "/users/42/deactivate", "method": "POST" }
  }
}
```

**בעולם האמיתי:** מעטים מיישמים HATEOAS. הלקוח צריך לדעת לקרוא את ה-links ולא כולם עושים זאת. **Level 2 REST מספיק** לרוב ה-APIs.

---

## שקף 9 – OpenAPI/Swagger

**התקנה:**

```bash
npm install swagger-ui-express swagger-jsdoc
```

**הגדרה:**

```js
// swagger.js
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const spec = swaggerJsdoc({
  definition: { openapi: "3.0.0", info: { title: "My API", version: "1.0.0" } },
  apis: ["./src/routes/*.js"]
});

export function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
}
```

**JSDoc בـ route:**

```js
/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
```

---

## סיכום

מצגת זו סיקרה עקרונות REST מודרניים:

- Resource naming נכון
- Status codes מביעים
- Filtering, Sorting, Pagination
- Versioning
- תיעוד עם OpenAPI/Swagger

**הערות:**

- HATEOAS הוא רמה 3 של REST maturity model, נדיר בעולם האמיתי
- Swagger מספק תיעוד אינטראקטיבי שמאפשר שליחת בקשות ישירות
