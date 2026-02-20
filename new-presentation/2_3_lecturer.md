# מדריך למרצה – יום 2 מצגת 7: REST API Design Modern

**זמן:** 13:30–14:45 (75 דקות)
**מטרה:** התלמידים יבינו עקרונות REST מודרניים ויישמו pagination ותיעוד

---

## הכנה מראש
- הכן דוגמאות של API ישן (getFoo, createBar) לעומת REST נכון
- הכן swagger-ui דמו מוכן
- הכן queries עם Postman לדמו filtering

---

## שקף 2 – REST Principles (10 דקות)
**מה להגיד:**
> "REST הוא style, לא תקן. אבל יש עקרונות שכולם מסכימים עליהם."

**Quiz – מה נכון?**
```
❌ POST /api/getAllUsers
❌ GET /api/deleteUser/5
✅ GET /api/v1/users
✅ DELETE /api/v1/users/5
```

---

## שקף 3 – Resource Naming (8 דקות)
**Live examples:**
```
✅ GET  /api/v1/users         - כל המשתמשים
✅ GET  /api/v1/users/42      - משתמש ספציפי
✅ POST /api/v1/users         - יצירת משתמש
✅ GET  /api/v1/users/42/orders  - הזמנות של משתמש
✅ POST /api/v1/users/42/activate  - פעולה על משתמש
```

---

## שקף 4 – Status Codes (10 דקות)
**בדיקת הבנה:**
- "יצרת post חדש" → 201
- "POST /users, email כבר קיים" → 409
- "PUT /users/5 ולא מצאת" → 404
- "שדה חסר ב-request body" → 422
- "Rate limit חרגת" → 429

**הדגש:** "200 לכל דבר = לא REST. Client צריך לדעת מה קרה!"

---

## שקף 5 – Filtering & Sorting (10 דקות)
**Live demo:**
```js
// GET /users?role=admin&active=true&sort=-createdAt&fields=name,email
app.get('/users', async (req, res) => {
  const { role, active, sort, fields } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (active !== undefined) filter.active = active === 'true';

  const sortObj = sort?.startsWith('-')
    ? { [sort.slice(1)]: -1 }
    : { [sort]: 1 };

  const users = await User.find(filter).sort(sortObj).lean();
  res.json({ data: users });
});
```

---

## שקף 6 – Pagination (15 דקות) ← **חשוב**
**Offset:**
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

**Cursor:**
```js
const after = req.query.after;
const query = after ? { _id: { $gt: after } } : {};
const users = await User.find(query).limit(21).lean();
const hasMore = users.length === 21;
const data = hasMore ? users.slice(0, -1) : users;
res.json({ data, nextCursor: hasMore ? data.at(-1)._id : null });
```

**מסר:** "Offset = OFFSET 10000 ב-SQL = scan 10,000 שורות. Cursor = index scan ישיר."

---

## שקף 7 – Versioning (5 דקות)
**אנלוגיה:** "גרסאות כמו דירות. v1 = שכן ישן שגר שם. v2 = שכן חדש. שניהם גרים. לא מגרשים את הישן."

---

## שקף 9 – OpenAPI/Swagger (12 דקות)
**Live setup:**
```bash
npm install swagger-ui-express swagger-jsdoc
```

```js
// swagger.js
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const spec = swaggerJsdoc({
  definition: { openapi: '3.0.0', info: { title: 'My API', version: '1.0.0' } },
  apis: ['./src/routes/*.js']
});

export function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
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

## הערות מרצה
- **HATEOAS**: ציין שזה רמה 3 של REST maturity – נדיר בעולם האמיתי
- **Swagger**: הצג שהתיעוד אינטראקטיבי – אפשר לשלוח בקשות ישירות
