# יום 2 – מצגת 7: REST API Design Modern

---

## שקף 1

**כותרת ראשית:** REST API Design Modern
**כותרת משנה:** Resource Naming, Status Codes, Pagination, OpenAPI

---

## שקף 2

**כותרת ראשית:** עקרונות REST

- **REST** = Representational State Transfer – ארכיטקטורת API מבוססת HTTP
- משאבים (Resources) = שמות עצם ברבים, לא פעלים
  - `/api/users` `/api/orders`
  - `/api/getUsers` `/api/createOrder`
- מתודות HTTP מבטאות את **הפעולה**: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- **Stateless** – כל בקשה עצמאית עם כל המידע הנדרש
- **Uniform Interface** – API עקבי ומנבא

---

## שקף 3

**כותרת ראשית:** Resource Naming – שמות נתיבים

- משאבים ברבים: `/users`, `/products`, `/orders`
- משאב יחיד: `/users/:id`, `/products/:productId`
- קשרים: `/users/:id/orders`, `/orders/:id/items`
- פעולות שאינן CRUD: `/users/:id/activate` (POST), `/auth/logout` (POST)
- **lowercase + hyphens** לנתיבים: `/api/user-profiles`
- גרסה בנתיב: `/api/v1/users` (לא ב-header לצד לקוח פשוט יותר)

---

## שקף 4

**כותרת ראשית:** Status Codes Philosophy
| סיטואציה | קוד |
|---|---|
| קריאה הצליחה | `200 OK` |
| נוצר משאב | `201 Created` |
| עדכון/מחיקה ללא תוכן | `204 No Content` |
| ולידציה נכשלה | `422 Unprocessable Entity` |
| משאב לא נמצא | `404 Not Found` |
| לא מאומת | `401 Unauthorized` |
| אין הרשאה | `403 Forbidden` |
| קצב בקשות חרג | `429 Too Many Requests` |

---

## שקף 5

**כותרת ראשית:** Filtering ו-Sorting

- **סינון** דרך query params: `GET /users?role=admin&active=true`
- **מיון** עם `sort`: `GET /users?sort=name` (עולה), `sort=-createdAt` (יורד)
- מספר שדות מיון: `sort=role,-createdAt`
- **חיפוש**: `GET /products?search=node+js`
- Whitelist שדות מותרים לסינון ומיון – מניעת שאילתות שרירותיות
- דוגמה מלאה: `GET /api/v1/users?role=admin&sort=-createdAt&fields=name,email`

---

## שקף 6

**כותרת ראשית:** Pagination – offset vs cursor

- **Offset Pagination**: `GET /users?page=2&limit=20`
  - תגובה: `{ data: [...], total: 100, page: 2, pages: 5 }`
  - פשוט לממש; **איטי** בעמודים גבוהים ב-DBs גדולים
- **Cursor Pagination**: `GET /users?after=<cursor>&limit=20`
  - תגובה: `{ data: [...], nextCursor: "abc123", hasMore: true }`
  - **ביצועים קבועים** – ללא קשר לגודל הקולקציה
  - מתאים לגלילה אינסופית (Social feeds, ניהול לוגים)
- **כלל**: offset לממשקי ניהול; cursor לאפליקציות ציבוריות גדולות

---

## שקף 7

**כותרת ראשית:** Versioning

- **URL Versioning**: `/api/v1/users` – פשוט, נראה בלוגים (מועדף)
- **Header Versioning**: `Accept: application/vnd.api+json;version=1` – נקי יותר
- **Deprecation Policy**: ל-announce ל-clients לפחות 6 חודשים מראש
- `Deprecated: true` header + `Sunset` date header בגרסאות ישנות
- **לעולם לא לשבור** v1 כשמשחררים v2 – שניהם חייבים לרוץ
- אסטרטגיית migration: URL שינוי → ל-clients לעדכן בזמנם

---

## שקף 8

**כותרת ראשית:** HATEOAS – סקירה

- **HATEOAS** = Hypermedia As The Engine Of Application State
- תגובת API כוללת **links** לפעולות הזמינות:
  ```json
  {
    "id": 1,
    "name": "John",
    "_links": {
      "self": { "href": "/users/1" },
      "orders": { "href": "/users/1/orders" },
      "delete": { "href": "/users/1", "method": "DELETE" }
    }
  }
  ```
- Client לא צריך לדעת URLs מראש – מגלה דרך responses
- נדרש לרמת REST מתקדמת (Richardson Maturity Model Level 3)
- בפועל: לא נפוץ מאוד; הכרת הרעיון חשובה יותר מיישום מלא

---

## שקף 9

**כותרת ראשית:** OpenAPI / Swagger

- **OpenAPI Specification** – תקן לתיעוד REST APIs (YAML/JSON)
- מגדיר: נתיבים, פרמטרים, גוף בקשה, תגובות אפשריות
- `swagger-ui-express` – ממשק web אינטראקטיבי לתיעוד מתוך Express
- `swagger-jsdoc` – מייצר OpenAPI מ-JSDoc בקוד
- `zod-to-openapi` – מייצר schema OpenAPI מ-Zod schemas (חיסכון כפילות)
- **תיעוד עדכני** = חלק בלתי נפרד מ-API מקצועי

---

## שקף 10

**כותרת ראשית:** API Documentation Discipline

- תיעוד כחלק מ-Definition of Done – לא אחרי
- דוגמה ב-JSDoc:
  ```js
  /**
   * @openapi
   * /api/users:
   *   get:
   *     summary: Get all users
   *     parameters:
   *       - name: role
   *         in: query
   *         schema: { type: string }
   */
  ```
- Postman Collection / Insomnia כחלופה לבדיקות ידניות
- **Contract-First**: כתיבת OpenAPI spec לפני הקוד
- Swagger UI בـ `localhost:3000/api-docs` בפיתוח

---

## שקף 11

**כותרת ראשית:** Response Format עקבי

- כל תגובה מוצלחת:
  ```json
  { "data": { ... }, "meta": { "total": 100 } }
  ```
- כל תגובת שגיאה (problem+json):
  ```json
  { "type": "...", "title": "...", "status": 422, "detail": "..." }
  ```
- **עקביות** בכל ה-endpoints – Clients יודעים מה לצפות
- `null` vs `{}` vs `[]` – החלטות עקביות לכל ישות
- תמיד לכלול timestamps: `createdAt`, `updatedAt` ב-responses

---

## שקף 12

**כותרת ראשית:** Best Practices Summary

- שמות עצם ברבים, לא פעלים בנתיבים
- קודי סטטוס מדויקים ומשמעותיים
- גרסאות בנתיב: `/api/v1/`
- Cursor pagination לקולקציות גדולות
- OpenAPI documentation מעודכן
- לא `GET /deleteUser`, לא `200` לכל דבר, לא URL כבד בלי pagination

---

## שקף 13

**כותרת ראשית:** סיכום – יום 2 מצגת 7

- REST = משאבים + HTTP methods + קודי סטטוס משמעותיים
- שמות נתיבים: שמות עצם ברבים, lowercase, versioned
- Offset pagination לממשקי ניהול; Cursor pagination לאפליקציות גדולות
- Filtering + Sorting דרך query params עם whitelist
- OpenAPI/Swagger = תיעוד חי ואינטראקטיבי
- Response format עקבי לאורך כל ה-API
