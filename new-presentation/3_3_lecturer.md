# מדריך למרצה – יום 3 מצגת 11: Authentication & Authorization 2026

**זמן:** 13:00–14:45 (105 דקות)
**מטרה:** התלמידים יממשו JWT auth מלא עם Refresh Tokens ו-Rotation

---

## הכנה מראש
- `npm install jsonwebtoken argon2 ioredis`
- הפעל Redis: `docker run -d -p 6379:6379 --name redis redis`
- הכן JWT decoder tool (jwt.io) לדמו

---

## שקף 2 – Stateful vs Stateless (10 דקות)
**ציור על הלוח:**
```
Stateful (Session):
Client → Server → DB (check session) → Response

Stateless (JWT):
Client → Server → verify JWT (no DB!) → Response
```

**מה להגיד:**
> "Stateless מאפשר לנו להריץ 10 שרתים – כל אחד יכול לאמת בלי DB. Stateful דורש סנכרון."

---

## שקף 3 – JWT Anatomy (12 דקות) ← **Demo מגניב**
**הצג jwt.io:**
1. עבור לـ `jwt.io`
2. הזן: `{ "sub": "123", "role": "admin", "exp": 1700000000 }`
3. הדגם שניתן **לקרוא** את ה-payload – הוא לא מוצפן!
4. נסה לשנות `role` בלי secret → "Invalid signature"
5. הדגם שעם secret נכון החתימה תקינה

**מה להגיד:**
> "JWT = קבלת כניסה. אתה יכול לקרוא שכתוב עליה 'VIP', אבל לא יכול לזייף את חתימת המארגן."

---

## שקף 4 – Access + Refresh Tokens (12 דקות)
**ציור זרימה:**
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

## שקף 5 – Token Rotation (10 דקות)
**Live coding - auth flow:**
```js
export async function refresh(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) throw new AppError('No refresh token', 401);

  // 1. אמת את הrefresh token
  const payload = jwt.verify(token, process.env.REFRESH_SECRET);

  // 2. בדוק שהוא קיים ב-DB (לא נמחק)
  const stored = await RefreshToken.findOne({ token, userId: payload.sub });
  if (!stored) {
    // ROTATION ATTACK! מחק את כל הtokens של המשתמש
    await RefreshToken.deleteMany({ userId: payload.sub });
    throw new AppError('Refresh token reuse detected', 401);
  }

  // 3. מחק ישן, צור חדש
  await stored.deleteOne();
  const { accessToken, refreshToken } = await generateTokens(payload.sub);

  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' });
  res.json({ accessToken });
}
```

---

## שקף 6 – argon2 (10 דקות)
**Live coding:**
```js
import argon2 from 'argon2';

// Register
const hash = await argon2.hash(password);
await User.create({ email, passwordHash: hash });

// Login
const isValid = await argon2.verify(user.passwordHash, password);
if (!isValid) throw new AppError('Invalid credentials', 401);
```

**השוואה:**
```
bcrypt(password, 12) → ~250ms ← בסדר
argon2.hash(password) → ~150ms ← מהיר יותר, יותר בטוח
MD5(password) → ~0.001ms ← NEVER!
```

---

## שקף 7 – Blacklist עם Redis (8 דקות)
**Live coding:**
```js
import { createClient } from 'redis';
const redis = createClient();

// logout - blacklist the access token
export async function logout(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  const payload = jwt.decode(token);
  const ttl = payload.exp - Math.floor(Date.now() / 1000);

  await redis.setEx(`blacklist:${payload.jti}`, ttl, '1');

  // delete refresh token
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
}

// middleware check
const isBlacklisted = await redis.exists(`blacklist:${payload.jti}`);
if (isBlacklisted) throw new AppError('Token revoked', 401);
```

---

## שקף 8 – Token Expiration Design (5 דקות)
**מה להגיד:**
> "15 דקות לaccess token = אם נגנב, תוקף פג מהר. 7 ימים לrefresh token = user לא צריך login מחדש בכל פעם שפותח אפליקציה."

---

## שקף 11 – Auth Middleware (10 דקות)
**Live coding:**
```js
export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('No token', 401);
  }

  const token = authHeader.split(' ')[1];
  const payload = jwt.verify(token, process.env.JWT_SECRET);

  const isBlacklisted = await redis.exists(`blacklist:${payload.jti}`);
  if (isBlacklisted) throw new AppError('Token revoked', 401);

  req.user = payload;
  next();
}
```

---

## שקף 12 – RBAC (8 דקות)
**Live coding:**
```js
export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('Forbidden', 403);
    }
    next();
  };
}

// usage
router.delete('/:id', authenticate, authorize('admin'), deleteUser);
```

**BOLA demo:**
```js
// ❌ לא בטוח - משתמש יכול לגשת לtask של אחר
const task = await Task.findById(req.params.id);

// ✅ בטוח - ownership check
const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
if (!task) throw new AppError('Not found', 404);
```

---

## הערות מרצה
- **שאלה: "למה לא שמור את כל הinfo ב-token?"** → גודל token + ביטחון (token exposed אם נגנב)
- **OAuth2**: ציין שזה overview – ספרייה מוכחת תמיד
