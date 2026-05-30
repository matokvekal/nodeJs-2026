# JWT Advanced Authentication

A production-style JWT authentication system using **access tokens + refresh tokens** stored in HTTP-only cookies.

---

## Concepts Covered

| Feature | Details |
|---|---|
| Access Token | Short-lived JWT sent in `Authorization: Bearer <token>` header |
| Refresh Token | Long-lived token stored in an `httpOnly` cookie (not accessible via JS) |
| Token Blacklisting | Invalidates access tokens on logout before they expire |
| Refresh Token Rotation | Each `/refresh` call issues a new refresh token and revokes the old one |
| Family Tracking | Detects refresh token reuse — revokes the entire family on suspicious activity |
| Protected Routes | `authenticate` middleware validates the access token on every request |

---

## Project Structure

```
3-jwt-advanced/
├── server.js          # Entry point — Express app setup
├── package.json
└── README.md
```

> The `server.js` file contains the full implementation including routes, controllers, and middleware combined for learning purposes.

---

## API Endpoints

### Public

| Method | Route | Description |
|---|---|---|
| `POST` | `/auth/register` | Create a new account |
| `POST` | `/auth/login` | Login and receive tokens |
| `POST` | `/auth/refresh` | Use the cookie to get a new access token |

### Protected (requires `Authorization: Bearer <accessToken>` header)

| Method | Route | Description |
|---|---|---|
| `POST` | `/auth/logout` | Invalidate both tokens |
| `GET` | `/auth/me` | Get the current logged-in user |
| `POST` | `/auth/change-password` | Change the user's password |

---

## How It Works

```
1. Register / Login
   → Server creates an access token (short TTL, e.g. 15 min)
   → Server creates a refresh token (long TTL, e.g. 7 days)
   → Refresh token is set as an httpOnly cookie
   → Access token is returned in the JSON response body

2. Authenticated Request
   → Client sends: Authorization: Bearer <accessToken>
   → Middleware verifies the token and checks the blacklist
   → If valid, req.user is populated

3. Token Refresh
   → Access token expires → client calls POST /auth/refresh
   → Server reads the httpOnly cookie automatically
   → Issues a NEW access token + NEW refresh token (rotation)
   → Old refresh token is revoked

4. Logout
   → Access token is added to the blacklist (until its natural expiry)
   → The entire refresh token family is revoked
   → Cookie is cleared
```

---

## How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
# Production
npm start

# Development (auto-restarts on file change)
npm run dev
```

### 3. Test with a REST client (e.g. Postman / Thunder Client)

**Register:**
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "Secret123!"
}
```

**Login:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "Secret123!"
}
```
Response includes `accessToken`. The refresh token is set automatically as a cookie.

**Access a protected route:**
```http
GET /auth/me
Authorization: Bearer <accessToken>
```

**Refresh the access token:**
```http
POST /auth/refresh
```
(Cookie is sent automatically by the browser/Postman)

---

## Security Notes

- Refresh tokens are stored in `httpOnly; SameSite=Strict` cookies — JavaScript cannot read them.
- Access tokens are kept short-lived to limit damage if leaked.
- On logout, the access token is blacklisted so it cannot be reused before it expires.
- Refresh token families: if an already-revoked token is used, the whole family is invalidated (detects token theft).
