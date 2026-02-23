# יום 4 – מצגת 14: Crypto in Node.js

---

## שקף 1

**כותרת ראשית:** Crypto in Node.js
**כותרת משנה:** Hash, HMAC, randomBytes, Symmetric vs Asymmetric

---

## שקף 2

**כותרת ראשית:** מודול crypto

- מודול מובנה ב-Node.js; גישה ל-OpenSSL
- `import { createHash, createHmac, randomBytes } from 'node:crypto'`
- כולל: Hash, HMAC, Cipher/Decipher, KeyPair, Random
- **Web Crypto API** (`globalThis.crypto`) – חלופה מודרנית, תואמת דפדפן
- ברוב המקרים: אין לכתוב crypto מאפס – להשתמש בספריות מוכחות
- **כלל מספר 1**: לא להמציא גלגל קריפטוגרפי

---

## שקף 3

**כותרת ראשית:** Hash – גיבוב חד-כיווני

```js
import { createHash } from "node:crypto";

const hash = createHash("sha256").update("Hello World").digest("hex");
// => 'a591a6d40bf420404a011733cfb7b190...'
```

- **SHA-256** / **SHA-512** – מקובלים לאימות שלמות
- Hash = חד-כיווני: לא ניתן לשחזר את הקלט מהפלט
- שימושים: אימות שלמות קובץ (checksum), Fingerprinting
- **לא** לשימוש ישיר בהצפנת סיסמאות (MD5/SHA קלים ל-brute force)
- **ETag** לـ HTTP caching = hash של תוכן התגובה

---

## שקף 4

**כותרת ראשית:** HMAC – Hash עם מפתח סודי

```js
import { createHmac } from "node:crypto";

function signWebhook(body, secret) {
  return createHmac("sha256", secret).update(body).digest("hex");
}

function verifyWebhook(body, signature, secret) {
  const expected = signWebhook(body, secret);
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
```

- **HMAC** = Hash + Secret Key; מאמת **מקור** וגם **שלמות**
- שימושים: חתימת WebHooks, JWT (HS256), API request signing

---

## שקף 5

**כותרת ראשית:** timingSafeEqual – השוואה בטוחה

```js
import { timingSafeEqual } from 'node:crypto';

//   לא בטוח – עלול לחשוף דרך timing
if (expected === received) { ... }

//  בטוח
const match = timingSafeEqual(
  Buffer.from(expected, 'hex'),
  Buffer.from(received, 'hex')
);
```

- **Timing Attack**: תוקף מודד זמן השוואה כדי לנחש bytes
- `timingSafeEqual` לוקח זמן קבוע ללא קשר להתאמה
- **חובה** בהשוואת signatures, tokens, secrets

---

## שקף 6

**כותרת ראשית:** randomBytes – ערכים אקראיים

```js
import { randomBytes, randomUUID } from "node:crypto";

// Token אקראי מאובטח
const token = randomBytes(32).toString("hex"); // 64 chars
const base64Token = randomBytes(32).toString("base64url");

// UUID v4
const id = randomUUID(); // '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
```

- **Cryptographically secure** – לא `Math.random()`!
- שימושים: reset password tokens, session IDs, API keys
- `base64url` = URL-safe (ללא `+`, `/`, `=`)

---

## שקף 7

**כותרת ראשית:** Symmetric Encryption – AES

```js
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const key = randomBytes(32); // AES-256
const iv = randomBytes(16); // Initialization Vector

function encrypt(text) {
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { encrypted: encrypted.toString("hex"), iv: iv.toString("hex"), tag };
}
```

- **AES-256-GCM**: מהיר, מאובטח, מכיל Authentication Tag (AEAD)
- שימוש: הצפנת נתונים רגישים ב-DB, קבצים, sessions

---

## שקף 8

**כותרת ראשית:** Asymmetric – RSA / ECDSA

```js
import { generateKeyPairSync } from "node:crypto";

const { privateKey, publicKey } = generateKeyPairSync("ec", {
  namedCurve: "P-256", // ECDSA P-256
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" }
});
```

- **RSA**: נפוץ לחתימה, מפתח 2048/4096 bits
- **ECDSA (P-256)**: מהיר יותר מ-RSA, מפתח קטן יותר
- שימושים JWT: `HS256` = סימטרי; `RS256`/`ES256` = אסימטרי
- Public key להפצה; Private key **לעולם לא** לחשוף

---

## שקף 9

**כותרת ראשית:** Symmetric vs Asymmetric
| | **Symmetric (AES)** | **Asymmetric (RSA/ECDSA)** |
|---|---|---|
| מפתחות | מפתח אחד | זוג ציבורי/פרטי |
| מהירות | מהיר מאוד | איטי יחסית |
| שימוש | הצפנת כמויות נתונים | חתימה, חילופי מפתח |
| JWT | `HS256` | `RS256`, `ES256` |
| יתרון | פשוט | Public key להפצה בלי סיכון |

- **JWT Multi-Service**: RS256 = כל שרת מאמת עם public key בלי לדעת secret

---

## שקף 10

**כותרת ראשית:** Web Crypto API (Modern)

```js
// גיבוב עם Web Crypto (גלובלי ב-Node 20+)
const encoder = new TextEncoder();
const data = encoder.encode("Hello World");
const hash = await crypto.subtle.digest("SHA-256", data);
const hexHash = Buffer.from(hash).toString("hex");
```

- `globalThis.crypto.subtle` – זמין גם ב-Node 20+ וגם בדפדפן
- API אחיד בין שרת ל-client
- **Promise-based** – נקי לשימוש עם async/await
- מחליף בהדרגה את `require('crypto')` הישן

---

## שקף 11

**כותרת ראשית:** מתי לא לכתוב Crypto בעצמך

- **לא** לממש אלגוריתם הצפנה מאפס
- **לא** לאחסן passwords עם SHA/MD5 ישירות – השתמש ב-argon2/bcrypt
- **לא** ליצור JWT library – השתמש ב-`jsonwebtoken` / `jose`
- **לא** לכתוב TLS – Node.js + `https` module עושה זאת
- **כן** לכתוב: חתימת WebHooks, Token generation, Data encryption ב-DB
- **כלל**: ספריות מוכחות > קוד עצמי לכל דבר קריפטוגרפי

---

## שקף 12

**כותרת ראשית:** Practical Patterns

```js
// 1. Reset password token
const resetToken = randomBytes(32).toString("hex");
const hashedToken = createHash("sha256").update(resetToken).digest("hex");
// שמור hashedToken ב-DB; שלח resetToken בmail

// 2. API key generation
const apiKey = `sk_${randomBytes(24).toString("base64url")}`;

// 3. Webhook signature verification (GitHub style)
const sig = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
```

---

## שקף 13

**כותרת ראשית:** סיכום – יום 4 מצגת 14

- `createHash` → גיבוב חד-כיווני לאימות שלמות
- `createHmac` → גיבוב + מפתח; לחתימת WebHooks ו-JWT
- `randomBytes` / `randomUUID` → ערכים אקראיים מאובטחים
- `timingSafeEqual` → השוואה בטוחה כדי למנוע Timing Attacks
- AES-256-GCM = הצפנה סימטרית מהירה ומוסמכת
- RSA/ECDSA = הצפנה אסימטרית לחתימה ו-JWT multi-service
