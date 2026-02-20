export const slides = [
  {
    id: 1,
    type: "title",
    title: "Authentication & Authorization 2026",
    subtitle: "JWT, Refresh Tokens, Rotation, argon2, OAuth2/OIDC"
  },
  {
    id: 2,
    title: "Stateful vs Stateless",
    panels: [
      {
        comparison: {
          headers: ["", "Stateful (Session)", "Stateless (JWT)"],
          rows: [
            ["אחסון", "Server-side (DB/Redis)", "Client-side (token)"],
            ["Horizontal Scale", "מסובך (sync)", "פשוט (אין state)"],
            ["ביטול מיידי", "קל", "דורש מנגנון נוסף"],
            ["גודל", "Session ID קטן", "Token יכול להיות גדול"],
            ["שימוש", "Web apps מסורתיות", "APIs, מיקרו-שירותים"]
          ]
        }
      }
    ],
    bullets: [
      "רוב ה-APIs המודרניים → Stateless עם JWT",
      "Stateful מתאים כשביטול מיידי הוא דרישה קריטית"
    ]
  },
  {
    id: 3,
    title: "JWT Anatomy – שלושה חלקים",
    bullets: [
      "header.payload.signature – מופרדים בנקודה",
      'Header: { "alg": "HS256", "typ": "JWT" } – Base64url encoded',
      'Payload (Claims): { "sub": "userId", "role": "admin", "iat": ..., "exp": ... }',
      "Signature: HMAC-SHA256(base64Header + '.' + base64Payload, secret)",
      "חשוב: JWT מקודד, לא מוצפן – כל אחד יכול לקרוא ה-payload",
      "החתימה מבטיחה שתוכן לא שונה, לא שהתוכן חסוי"
    ]
  },
  {
    id: 4,
    title: "Access Token + Refresh Token",
    bullets: [
      "Access Token: חיי מדף קצרים – 15 דקות עד שעה",
      "- נשלח בכל בקשה: Authorization: Bearer <token>",
      "- מכיל: userId, role, exp",
      "Refresh Token: חיי מדף ארוכים – 7-30 יום",
      "- נשלח רק ל-endpoint ייעודי לחידוש",
      "- נשמר בצד שרת (DB/Redis) לצורך ביטול",
      "- נשלח כ-HttpOnly Cookie (מוגן מ-XSS)"
    ]
  },
  {
    id: 5,
    title: "Token Rotation Strategy",
    bullets: [
      "בכל שימוש ב-Refresh Token → מונפק Refresh Token חדש והישן מבוטל",
      "Reuse Detection: אם נשתמש בטוקן ישן שכבר רוטט → בטל כל הטוקנים של המשתמש",
      "מצמצם את חלון הפגיעות במקרה של גניבת טוקן",
      "Token Rotation מומלץ לכל מערכת production-grade"
    ],
    code: `POST /auth/refresh
Cookie: refreshToken=<token>
→ Response: { accessToken }, Set-Cookie: refreshToken=<newToken>`
  },
  {
    id: 6,
    title: "Blacklist Strategy",
    bullets: [
      "בעיה: Access Token לא ניתן לביטול לפני תפוגה",
      "Blacklist: רשימת token IDs (jti claim) שבוטלו",
      "Redis + TTL = מימוש מהיר; Redis מוחק אוטומטית כשה-TTL מסתיים",
      "עלות: קריאת Redis בכל בקשה (~1ms) – שווה את האבטחה"
    ],
    code: `// בכניסה/logout: הוסף jti לרשימה שחורה
await redis.setex(\`blacklist:\${jti}\`, expiresIn, '1');
// בכל בקשה: בדוק
const isBlacklisted = await redis.exists(\`blacklist:\${jti}\`);`
  },
  {
    id: 7,
    title: "הצפנת סיסמאות – argon2",
    bullets: [
      "אסור לאחסן סיסמאות בטקסט גלוי",
      "bcrypt – ותיק ומוכח; saltRounds = 12 מומלץ",
      "argon2 – מועדף ב-2026, זכה ב-Password Hashing Competition",
      "- argon2.hash(password) → hash עם salt מובנה",
      "- argon2.verify(hash, password) → אימות",
      "- תומך ב-3 מצבים: argon2i, argon2d, argon2id (מומלץ)",
      "להתקין: npm install argon2",
      "לעולם לא SHA-256/MD5 ישירות לסיסמאות"
    ]
  },
  {
    id: 8,
    title: "Token Expiration Design",
    bullets: [
      "Access Token: 15 דק' – קצר = נזק מוגבל בגניבה",
      "Refresh Token: 7-30 יום – ארוך = UX טוב (לא נדרש login מחדש)",
      "Token Expiration = exp claim ב-payload: Date.now() / 1000 + 900",
      "Silent Refresh: הלקוח מחדש Access Token אוטומטית כשפג תוקפו",
      "Grace Period: חידוש אפשרי כמה שניות לאחר פקיעה (למניעת race conditions)",
      "Token Family: קבוצת tokens ששייכים לאותה session"
    ]
  },
  {
    id: 9,
    title: "OAuth2 + OIDC Overview",
    bullets: [
      "OAuth2 = פרוטוקול הרשאה; מאפשר גישה ל-resource ב-שם המשתמש",
      "OIDC (OpenID Connect) = שכבת אימות מעל OAuth2",
      "Flow נפוץ: Authorization Code + PKCE (לאפליקציות SPA/Mobile)",
      "Providers: Google, GitHub, Microsoft, Apple, Auth0, Cognito",
      "בפועל: שימוש בספריות מוכנות: passport.js, @auth/express, openid-client",
      "לעולם לא לממש OAuth2 מאפס – להשתמש בספרייה מוכחת"
    ]
  },
  {
    id: 10,
    title: "Threat Modeling בסיסי",
    bullets: [
      "סיכון 1: גניבת Access Token → מיטגציה: TTL קצר + HTTPS בלבד",
      "סיכון 2: גניבת Refresh Token → מיטגציה: Rotation + HttpOnly Cookie",
      "סיכון 3: Brute Force → מיטגציה: Rate limiting על /auth/login",
      "סיכון 4: Password Breach → מיטגציה: argon2 + haveibeenpwned check",
      "סיכון 5: Session Hijacking → מיטגציה: SameSite=Strict Cookie",
      "STRIDE מודל: Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation"
    ]
  },
  {
    id: 11,
    title: "Auth Middleware",
    code: `export async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new AppError('No token provided', 401);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const isBlacklisted = await redis.exists(\`blacklist:\${payload.jti}\`);
    if (isBlacklisted) throw new AppError('Token revoked', 401);
    req.user = payload;
    next();
  } catch (err) {
    throw new AppError('Invalid or expired token', 401);
  }
}`
  },
  {
    id: 12,
    title: "Authorization – RBAC",
    bullets: [
      "RBAC (Role-Based Access Control): הרשאות לפי תפקיד",
      'role claim ב-token: "admin", "user", "moderator"',
      "Broken Object Level Authorization – OWASP #1: תמיד לוודא req.user.id === resource.userId"
    ],
    code: `export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }
    next();
  };
}
// שימוש:
router.delete('/:id', authenticate, authorize('admin'), deleteUser);`
  },
  {
    id: 13,
    title: "סיכום – יום 3 מצגת 11",
    bullets: [
      "Stateless JWT מתאים לـ APIs ומיקרו-שירותים; Stateful לـ web apps מסורתיות",
      "Access Token קצר מועד + Refresh Token ארוך + Rotation = security מקסימלי",
      "argon2 מועדף ב-2026 להצפנת סיסמאות",
      "Blacklist ב-Redis לביטול מיידי של Access Tokens",
      "OAuth2/OIDC = ספרייה מוכחת, לא מימוש עצמי",
      "תמיד לבדוק BOLA: המשתמש ניגש רק למשאבים שלו"
    ]
  }
];
