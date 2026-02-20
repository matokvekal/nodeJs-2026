# מדריך למרצה – יום 4 מצגת 14: Crypto in Node.js

**זמן:** 10:30–11:15 (45 דקות)
**מטרה:** התלמידים יכירו כלי crypto מובנים וידעו מתי להשתמש בכל אחד

---

## הכנה מראש
- כל הפונקציות מובנות ב-Node.js, אין התקנה
- הכן demo-crypto.js עם כל הדוגמאות

---

## שקף 2 – crypto module (3 דקות)
**מה להגיד:**
> "crypto = gateway ל-OpenSSL מתוך Node.js. 99% מה שצריכים זמין פה. לא צריך ספריות חיצוניות."

---

## שקף 3 – Hash (8 דקות)
**Live demo:**
```js
import { createHash } from 'node:crypto';

// SHA-256
const hash = createHash('sha256').update('Hello World').digest('hex');
console.log(hash); // a591a6d40bf420404a...

// אפשר לbuild בשלבים
const hasher = createHash('sha256');
hasher.update('Hello ');
hasher.update('World');
const result = hasher.digest('hex');
```

**שאלה:** "מה המשמעות של hash חד-כיווני?"
**תשובה:** "לא ניתן לשחזר 'Hello World' מה-hash. זה בדיוק למה SHA לא מתאים לסיסמאות – brute force."

---

## שקף 4 – HMAC (8 דקות)
**Live demo – WebHook signature:**
```js
import { createHmac } from 'node:crypto';

const secret = 'my_webhook_secret';
const body = JSON.stringify({ event: 'payment.success', amount: 100 });

// Sign
const signature = createHmac('sha256', secret).update(body).digest('hex');
console.log('Signature:', signature);

// Verify (receiver side)
function verifyWebhook(receivedBody, receivedSig, secret) {
  const expected = createHmac('sha256', secret).update(receivedBody).digest('hex');
  return expected === receivedSig;
}
```

---

## שקף 5 – timingSafeEqual (5 דקות)
**Timing Attack הסבר:**
> "JavaScript string comparison stops at first mismatch. Attacker מודד זמנים ומנחש byte אחרי byte."

**Demo:**
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

## שקף 6 – randomBytes (5 דקות)
**Live demo:**
```js
import { randomBytes, randomUUID } from 'node:crypto';

// Reset token
const token = randomBytes(32).toString('hex'); // 64 hex chars
// store hash in DB, send plain to user via email

// API Key
const apiKey = `sk_${randomBytes(24).toString('base64url')}`;

// UUID
const id = randomUUID();
```

**מה להגיד:**
> "Math.random() = לא קריפטוגרפי! תוקף יכול לנבא. `randomBytes` = לא ניתן לנבא."

---

## שקף 7 – AES Encryption (8 דקות)
**Live demo:**
```js
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const KEY = randomBytes(32); // AES-256
const IV = randomBytes(16);

function encrypt(text) {
  const cipher = createCipheriv('aes-256-gcm', KEY, IV);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { data: encrypted.toString('hex'), tag: tag.toString('hex'), iv: IV.toString('hex') };
}

function decrypt({ data, tag, iv }) {
  const decipher = createDecipheriv('aes-256-gcm', KEY, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  return decipher.update(Buffer.from(data, 'hex'), null, 'utf8') + decipher.final('utf8');
}
```

---

## שקף 8 – Asymmetric (5 דקות)
**מה להגיד:**
> "RSA/ECDSA = זוג מפתחות. Public key להפצה חופשית. Private key – שמור כמו סיסמה."

**JWT Example:**
```
HS256: שרת יחיד - סימטרי, secret אחד
RS256: מספר שרתים - public key בפנים, private key במרכז
```

---

## שקף 11 – When NOT to (3 דקות)
**Repeat:**
> "לא לממש JWT בעצמך. לא לממש TLS בעצמך. לא לכתוב hash לסיסמאות. ספריות מוכחות בלבד!"

---

## הערות מרצה
- **מצגת קצרה**: 45 דקות בלבד – אל תיתן זמן לשאלות ארוכות
- **שאלות מתקדמות**: "WebAuthn, FIDO2" – "מחוץ לסקופ של הקורס"
