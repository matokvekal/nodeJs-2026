# מדריך למרצה – יום 4 מצגת 14: Crypto in Node.js

**זמן:** 10:30–11:15
**מטרה:** היכרות עם כלי crypto מובנים והבנת מתי להשתמש בכל אחד

---

## שקף 1 – פתיחה

ב-Auth השתמשנו ב-argon2. ב-WebHooks השתמשנו ב-HMAC. עכשיו נבין מה יש בתוך מודול `crypto` של Node.js ומתי להשתמש בכל כלי.

**מה נלמד:**
- `createHash` — SHA-256 לverification ו-checksums
- HMAC — אימות חתימה (webhooks, API signatures)
- `timingSafeEqual` — השוואה בטוחה מפני timing attacks
- `randomBytes` — אקראיות קריפטוגרפית אמיתית
- AES-256-GCM — הצפנה סימטרית עם authenticated encryption
- RSA/ECDSA — הצפנה אסימטרית ו-JWT signing

**תכונות Hash functions — לדעת בעל פה:**

| תכונה | משמעות |
|-------|--------|
| Deterministic | אותו input תמיד → אותו output |
| Fixed Length | output תמיד אותו גודל (SHA-256 = 256 bits) |
| One-Way | לא ניתן לשחזר input מה-hash |
| Avalanche Effect | שינוי קטן ב-input → שינוי גדול ב-output |

**סיסמאות — Salt ו-Stretching:**
- **Salt**: מחרוזת אקראית ייחודית לכל משתמש, נוסף לסיסמה לפני hashing
- מונע rainbow tables (טבלאות hash מוכנות מראש)
- **Key Stretching**: hashing מכוון לוקח זמן (~150ms), מונע brute force
- לכן argon2/bcrypt ולא SHA-256 לסיסמאות!

---

## שקף 2 – crypto module

מודול `crypto` מספק gateway ל-OpenSSL מתוך Node.js. 99% מהפונקציונליות הנדרשת זמינה, ללא צורך בספריות חיצוניות.

---

## שקף 3 – Hash

**דוגמה:**

```js
import { createHash } from "node:crypto";

// SHA-256
const hash = createHash("sha256").update("Hello World").digest("hex");
console.log(hash); // a591a6d40bf420404a...

// אפשר לbuild בשלבים
const hasher = createHash("sha256");
hasher.update("Hello ");
hasher.update("World");
const result = hasher.digest("hex");
```

**הסבר:** Hash חד-כיווני משמעו שלא ניתן לשחזר 'Hello World' מה-hash. לכן SHA לא מתאים לסיסמאות (brute force).

---

## שקף 4 – HMAC

**דוגמת WebHook signature:**

```js
import { createHmac } from "node:crypto";

const secret = "my_webhook_secret";
const body = JSON.stringify({ event: "payment.success", amount: 100 });

// Sign
const signature = createHmac("sha256", secret).update(body).digest("hex");
console.log("Signature:", signature);

// Verify (receiver side)
function verifyWebhook(receivedBody, receivedSig, secret) {
  const expected = createHmac("sha256", secret)
    .update(receivedBody)
    .digest("hex");
  return expected === receivedSig;
}
```

---

## שקף 5 – timingSafeEqual

**Timing Attack:**
JavaScript string comparison עוצר באי התאמה הראשונה. תוקף יכול למדוד זמנים ולנחש byte אחרי byte.

**דוגמה:**

```js
import { timingSafeEqual } from 'node:crypto';

// ❌ לא בטוח
if (received === expected) { ... }

// ✅ בטוח - תמיד לוקח אותו זמן
const safe = timingSafeEqual(
  Buffer.from(received),
  Buffer.from(expected)
);
```

---

## שקף 6 – randomBytes

**דוגמאות:**

```js
import { randomBytes, randomUUID } from "node:crypto";

// Reset token
const token = randomBytes(32).toString("hex"); // 64 hex chars
// store hash in DB, send plain to user via email

// API Key
const apiKey = `sk_${randomBytes(24).toString("base64url")}`;

// UUID
const id = randomUUID();
```

**חשוב:** `Math.random()` אינו קריפטוגרפי ותוקף יכול לנבא. `randomBytes` מספק אקראיות אמיתית.

---

## שקף 7 – AES Encryption

**דוגמה:**

```js
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const KEY = randomBytes(32); // AES-256
const IV = randomBytes(16);

function encrypt(text) {
  const cipher = createCipheriv("aes-256-gcm", KEY, IV);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();
  return {
    data: encrypted.toString("hex"),
    tag: tag.toString("hex"),
    iv: IV.toString("hex")
  };
}

function decrypt({ data, tag, iv }) {
  const decipher = createDecipheriv("aes-256-gcm", KEY, Buffer.from(iv, "hex"));
  decipher.setAuthTag(Buffer.from(tag, "hex"));
  return (
    decipher.update(Buffer.from(data, "hex"), null, "utf8") +
    decipher.final("utf8")
  );
}
```

---

## שקף 8 – Asymmetric

RSA/ECDSA משתמשים בזוג מפתחות: Public key להפצה חופשית, Private key נשמר בבטחון.

\*\*דוגמת JWT:

```
HS256: שרת יחיד - סימטרי, secret אחד
RS256: מספר שרתים - public key בפנים, private key במרכז
```

---

## שקף 11 – When NOT to

**עקרונות חשובים:**

- לא לממש JWT בעצמך
- לא לממש TLS בעצמך
- לא לכתוב hash לסיסמאות
- תמיד להשתמש בספריות מוכחות!

---

## סיכום

מצגת זו סיקרה:

- crypto module ויכולותיו
- Hash (SHA-256)
- HMAC ל-webhooks
- timingSafeEqual
- randomBytes קריפטוגרפי
- AES encryption/decryption
- Asymmetric crypto (RSA/ECDSA)

**הערות:**

- מצגת קצרה (45 דקות)
- WebAuthn, FIDO2 מחוץ לסקופ
