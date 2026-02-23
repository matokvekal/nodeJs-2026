# הרחבות : – יום 3 מצגת 11: Authentication & Authorization 2026

**זמן:** 13:00–14:45
**מטרה:** יישום JWT auth מלא עם Refresh Tokens ו-Rotation

---

## שקף 1 – פתיחה

ה-API שלנו עובד, אבל כרגע כל אחד יכול לגשת לכל endpoint. עכשיו מוסיפים Authentication (מי אתה?) ו-Authorization (מה מותר לך?).

**מה נלמד:**

- Stateful vs Stateless — Sessions לעומת JWT
- JWT anatomy — מה בפנים הטוקן ואיך מאמתים אותו
- Access Token + Refresh Token — הפיצול שמאפשר UX טוב + security
- Token Rotation — הגנה מפני גניבת Refresh Token
- argon2 — hashing סיסמאות בצורה נכונה
- Redis Blacklist — ביטול tokens לפני פקיעתם
- RBAC — Role-Based Access Control

**שלושה שאלות שכל מערכת Auth עונה:**

| שאלה            | מושג             | מימוש                    |
| --------------- | ---------------- | ------------------------ |
| מי אתה?         | Authentication   | Login + JWT              |
| מה מותר לך?     | Authorization    | RBAC / permissions       |
| האם הtoken תקף? | Token Validation | verify + blacklist check |

**OAuth2 + OIDC — Overview:**
OAuth2 הוא פרוטוקול להאצלת הרשאות (delegated authorization). OIDC מוסיף Identity Layer עליו.
**בפרודקשן:** תמיד להשתמש בספרייה מוכחת (Passport.js, Auth0, Keycloak) ולא לממש מאפס.

---

## שקף 2 – Stateful vs Stateless

**דיאגרמה:**

```
Stateful (Session):
Client → Server → DB (check session) → Response

Stateless (JWT):
Client → Server → verify JWT (no DB!) → Response
```

Stateless מאפשר הרצת מספר שרתים במקביל – כל שרת יכול לאמת tokens באופן עצמאי ללא DB. Stateful דורש סנכרון בין שרתים.

---

## שקף 3 – JWT Anatomy

**הדגמה עם jwt.io:**

1. פתיחת `jwt.io`
2. הזנת payload: `{ "sub": "123", "role": "admin", "exp": 1700000000 }`
3. הדגמה: payload **קריא** – הוא לא מוצפן!
4. ניסיון לשנות `role` ללא secret → "Invalid signature"
5. הדגמה: עם secret נכון החתימה תקפה

**מושג:** JWT כמו כרטיס כניסה – ניתן לקרוא מה כתוב עליו ("VIP"), אך לא ניתן לזייף את חתימת המארגן.

---

## שקף 4 – Access + Refresh Tokens

\*\*זרימת Authentication:

```
Login:
  POST /auth/login → { email, password }
  ← Access Token (15m) + Refresh Token (7d) [HttpOnly Cookie]

Request:
  GET /api/users → Authorization: Bearer <access_token>
  ← 200 data

Refresh:
  POST /auth/refresh → Cookie: refreshToken=<token>
  ← new Access Token + new Refresh Token [rotation!]

Logout:
  POST /auth/logout → Cookie: refreshToken=<token>
  ← blacklist access token + delete refresh token
```

---

## שקף 5 – Token Rotation

**דוגמת refresh flow:**

```js
export async function refresh(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) throw new AppError("No refresh token", 401);

  // 1. אמת את הrefresh token
  const payload = jwt.verify(token, process.env.REFRESH_SECRET);

  // 2. בדוק שהוא קיים ב-DB (לא נמחק)
  const stored = await RefreshToken.findOne({ token, userId: payload.sub });
  if (!stored) {
    // ROTATION ATTACK! מחק את כל הtokens של המשתמש
    await RefreshToken.deleteMany({ userId: payload.sub });
    throw new AppError("Refresh token reuse detected", 401);
  }

  // 3. מחק ישן, צור חדש
  await stored.deleteOne();
  const { accessToken, refreshToken } = await generateTokens(payload.sub);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict"
  });
  res.json({ accessToken });
}
```

---

## שקף 6 – argon2

\*\*דוגמה:

```js
import argon2 from "argon2";

// Register
const hash = await argon2.hash(password);
await User.create({ email, passwordHash: hash });

// Login
const isValid = await argon2.verify(user.passwordHash, password);
if (!isValid) throw new AppError("Invalid credentials", 401);
```

**השוואה:**

```
bcrypt(password, 12) → ~250ms ← בסדר
argon2.hash(password) → ~150ms ← מהיר יותר, יותר בטוח
MD5(password) → ~0.001ms ← NEVER!
```

---

## שקף 7 – Blacklist עם Redis

\*\*דוגמה:

```js
import { createClient } from "redis";
const redis = createClient();

// logout - blacklist the access token
export async function logout(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = jwt.decode(token);
  const ttl = payload.exp - Math.floor(Date.now() / 1000);

  await redis.setEx(`blacklist:${payload.jti}`, ttl, "1");

  // delete refresh token
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
}

// middleware check
const isBlacklisted = await redis.exists(`blacklist:${payload.jti}`);
if (isBlacklisted) throw new AppError("Token revoked", 401);
```

---

## שקף 8 – Token Expiration Design

**אסטרטגיית תוקף:**

- Access Token: 15 דקות – אם נגנב, תוקף פג מהר
- Refresh Token: 7 ימים – מאפשר שימוש נוח ללא login חוזר

---

## שקף 11 – Auth Middleware

\*\*דוגמה:

```js
export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("No token", 401);
  }

  const token = authHeader.split(" ")[1];
  const payload = jwt.verify(token, process.env.JWT_SECRET);

  const isBlacklisted = await redis.exists(`blacklist:${payload.jti}`);
  if (isBlacklisted) throw new AppError("Token revoked", 401);

  req.user = payload;
  next();
}
```

---

## שקף 12 – RBAC

**Role-Based Access Control:**

```js
export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("Forbidden", 403);
    }
    next();
  };
}

// usage
router.delete("/:id", authenticate, authorize("admin"), deleteUser);
```

**BOLA demo:**

```js
//   לא בטוח - משתמש יכול לגשת לtask של אחר
const task = await Task.findById(req.params.id);

//  בטוח - ownership check
const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
if (!task) throw new AppError("Not found", 404);
```

---

## סיכום

מצגת זו סיקרה:

- Stateful vs Stateless authentication
- JWT structure ואיך הוא עובד
- Access + Refresh tokens pattern
- Token rotation למניעת reuse attacks
- argon2 לhashing סיסמאות
- Redis blacklist
- RBAC ו-BOLA prevention

**הערות:**

- למה לא לשמור הכל ב-token? גודל + ביטחון
- OAuth2 נזכר כ-overview – בפרודקשן להשתמש בספרייה מוכחת
