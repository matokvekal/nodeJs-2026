# JWT Login with Cookie Parser

A simple Node.js/Express app demonstrating authentication using **JWT (JSON Web Tokens)** stored in **cookies**, with **bcrypt** password hashing.

## How It Works

1. User registers with a name and password — password is hashed with bcrypt.
2. User logs in — server verifies the password, then signs a JWT and sends it as a cookie.
3. Protected routes read the cookie, verify the JWT, and either allow or deny access.

## Project Structure

```
├── server.js       # Express app setup (cookie-parser, body-parser, EJS)
├── routes.js       # All routes + JWT middleware
├── views/
│   ├── index.ejs   # Home page
│   ├── login.ejs   # Login form
│   └── register.ejs # Registration form
└── package.json
```

## Routes

| Method | Path             | Description                        |
|--------|------------------|------------------------------------|
| GET    | `/`              | Home page                          |
| GET    | `/register`      | Show registration form             |
| POST   | `/register`      | Create a new user (hashed password)|
| GET    | `/login`         | Show login form                    |
| POST   | `/login`         | Verify credentials, set JWT cookie |
| GET    | `/protectedRoute`| Protected — requires valid JWT     |

## How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
npm start
```

The server runs on **http://localhost:3000**

> Uses `nodemon` so the server restarts automatically on file changes.

## Try It Out

1. Go to `http://localhost:3000/register` and create a user.
2. Go to `http://localhost:3000/login` and log in.
3. Visit `http://localhost:3000/protectedRoute` — you should see the protected content.
4. Clear your cookies and try `/protectedRoute` again — you'll get **401 Access Denied**.

## Key Concepts

- **bcryptjs** — hashes passwords so they are never stored in plain text.
- **jsonwebtoken** — signs and verifies tokens using a secret key.
- **cookie-parser** — parses the `token` cookie on every request.
- **authenticateToken middleware** — extracts the token from `req.cookies.token`, verifies it with `jwt.verify`, and either calls `next()` or returns an error.

> Note: Users are stored in memory (a plain array). Restarting the server clears all users.
