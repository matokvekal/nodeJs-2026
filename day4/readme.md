# Node.js Final Project Demo - Setup Guide

## 1. Install WSL

Open PowerShell as Administrator:

```powershell
wsl --install -d Ubuntu
```

Restart Windows.

Check installation:

```powershell
wsl -l -v
```

Open Ubuntu:

```powershell
wsl
```

---

## 2. Update Ubuntu

```bash
sudo apt update
sudo apt upgrade -y
```

Install tools:

```bash
sudo apt install -y git curl wget unzip build-essential
```

---

## 3. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify:

```bash
node -v
npm -v
```

---

## 4. Install PM2

```bash
sudo npm install -g pm2
```

Verify:

```bash
pm2 -v
```

---

## 5. Install Docker Desktop (Windows)

Verify from WSL:

```bash
docker ps
```

---

## 6. PostgreSQL Container

Create a docker-compose.yml file:

```yaml
pgadmin:
  image: dpage/pgadmin4
  container_name: pgadmin
  environment:
    PGADMIN_DEFAULT_EMAIL: admin@demo.com
    PGADMIN_DEFAULT_PASSWORD: admin
  ports:
    - "8080:80"
```

Open:

http://localhost:8080/browser/

Login:

Email: admin@demo.com
Password: admin

Start the database:

docker compose up -d

Verify container status:

docker ps
Database Connection

Connection details:


---add server 
server name POSTGRES

Add Server

Name: PostgreSQL

Host: postgres
Port: 5432
Database: tickets
User: postgres
Password: a1a1a1
---
use SQLTools


CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    login_attempts INT NOT NULL DEFAULT 0,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);



CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,

    ticket_number UUID NOT NULL UNIQUE,

    show_name VARCHAR(200) NOT NULL,
    show_date TIMESTAMP NOT NULL,

    original_price NUMERIC(10,2) NOT NULL,
    discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(10,2) NOT NULL,

    purchased_at TIMESTAMP NULL,
    paid_at TIMESTAMP NULL,

    is_paid BOOLEAN NOT NULL DEFAULT FALSE,

    user_id BIGINT NULL
);

INSERT INTO tickets
(
    ticket_number,
    show_name,
    show_date,
    original_price,
    discount_percent,
    paid_amount,
    is_paid,
    user_id
)
VALUES
(gen_random_uuid(),'Node.js Conference','2026-10-01 20:00',100,0,100,FALSE,NULL),
(gen_random_uuid(),'Node.js Conference','2026-10-01 20:00',100,0,100,FALSE,NULL),
(gen_random_uuid(),'Node.js Conference','2026-10-01 20:00',100,0,100,FALSE,NULL),
(gen_random_uuid(),'Node.js Conference','2026-10-01 20:00',100,0,100,FALSE,NULL),
(gen_random_uuid(),'Node.js Conference','2026-10-01 20:00',100,0,100,FALSE,NULL),

(gen_random_uuid(),'React Summit','2026-10-05 19:00',120,10,108,FALSE,NULL),
(gen_random_uuid(),'React Summit','2026-10-05 19:00',120,10,108,FALSE,NULL),
(gen_random_uuid(),'React Summit','2026-10-05 19:00',120,10,108,FALSE,NULL),
(gen_random_uuid(),'React Summit','2026-10-05 19:00',120,10,108,FALSE,NULL),
(gen_random_uuid(),'React Summit','2026-10-05 19:00',120,10,108,FALSE,NULL),

(gen_random_uuid(),'AI Developers Day','2026-11-01 18:00',150,0,150,FALSE,NULL),
(gen_random_uuid(),'AI Developers Day','2026-11-01 18:00',150,0,150,FALSE,NULL),
(gen_random_uuid(),'AI Developers Day','2026-11-01 18:00',150,0,150,FALSE,NULL),
(gen_random_uuid(),'AI Developers Day','2026-11-01 18:00',150,0,150,FALSE,NULL),
(gen_random_uuid(),'AI Developers Day','2026-11-01 18:00',150,0,150,FALSE,NULL),

(gen_random_uuid(),'Full Stack Workshop','2026-11-15 09:00',80,5,76,FALSE,NULL),
(gen_random_uuid(),'Full Stack Workshop','2026-11-15 09:00',80,5,76,FALSE,NULL),
(gen_random_uuid(),'Full Stack Workshop','2026-11-15 09:00',80,5,76,FALSE,NULL),
(gen_random_uuid(),'Full Stack Workshop','2026-11-15 09:00',80,5,76,FALSE,NULL),
(gen_random_uuid(),'Full Stack Workshop','2026-11-15 09:00',80,5,76,FALSE,NULL);

## 7. Clone Project

```bash
git clone <repo-url>
cd <repo-folder>
```

Install dependencies:

```bash
npm install
```

---

## 8. Start Services

Auth Service:

```bash
pm2 start auth-service.js --name auth
```

Ticket Service:

```bash
pm2 start ticket-service.js --name ticket
```

Check:

```bash
pm2 list
```

Logs:

```bash
pm2 logs
```

---

## 9. PM2 Cluster Demo

```bash
pm2 restart ticket -i 2
```

Or:

```bash
pm2 restart ticket -i max
```

Check:

```bash
pm2 list
```

---

## 10. PM2 Crash Recovery Demo

```javascript
process.exit(1);
```

Check logs:

```bash
pm2 logs
```

---

## 11. Install Nginx

```bash
sudo apt install -y nginx
```

Verify:

```bash
nginx -v
```

Start:

```bash
sudo service nginx start
```

---

## 12. Nginx Reverse Proxy

```text
/
    -> React Build

/api/auth
    -> Auth Service

/api/tickets
    -> Ticket Service
```

Test:

```bash
sudo nginx -t
sudo service nginx reload
```

---

## 13. API Testing

Register:

```http
POST /api/auth/register
```

Login:

```http
POST /api/auth/login
```

Buy Ticket:

```http
POST /api/tickets/buy
```

My Tickets:

```http
GET /api/tickets/my
```

Use Postman and JWT Token.

---

## 14. WebSocket Demo

```text
React Tab 1
      ⇅
Node Socket.IO Server
      ⇅
React Tab 2
```

Demonstrate real-time messaging without polling.

---

## 15. Jest Demo

Install:

```bash
npm install --save-dev jest supertest
```

Run:

```bash
npm test
```

Example:

```javascript
describe('Login API', () => {
  it('should login', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'test@test.com',
        password: '1234'
      });

    expect(res.statusCode).toBe(200);
  });
});
```

---

## Presentation Flow

1. PostgreSQL + Docker
2. Auth Service + JWT
3. Ticket Service
4. API Gateway
5. React Client
6. Git Clone
7. WSL Linux
8. PM2
9. PM2 Cluster
10. Nginx
11. WebSocket Chat
12. Jest Tests
13. Q&A
