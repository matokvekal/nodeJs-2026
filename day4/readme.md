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


## 7. Deploy Application To Linux

Create folders:

```bash
sudo mkdir -p /opt/ticket-demo/auth-service
sudo mkdir -p /opt/ticket-demo/ticket-service
sudo mkdir -p /var/www/ticket-demo
```

Copy Auth Service:

```bash
sudo cp -r \
"/mnt/c/Users/gilad.dolev/Desktop/node js 26/sela-node-26--final/day4/servers/auth-service/"* \
/opt/ticket-demo/auth-service/
```

Copy Ticket Service:

```bash
sudo cp -r \
"/mnt/c/Users/gilad.dolev/Desktop/node js 26/sela-node-26--final/day4/servers/ticket-service/"* \
/opt/ticket-demo/ticket-service/
```

Copy Client Build:

```bash
sudo cp -r \
"/mnt/c/Users/gilad.dolev/Desktop/node js 26/sela-node-26--final/day4/client/dist/"* \
/var/www/ticket-demo/
```

Copy Environment Files:

```bash
sudo cp -r "/mnt/c/Users/gilad.dolev/Desktop/node js 26/sela-node-26--final/day4/servers/auth-service/." /opt/ticket-demo/auth-service/
```

```bash
sudo cp \
"/mnt/c/Users/gilad.dolev/Desktop/node js 26/sela-node-26--final/day4/servers/ticket-service/.env" \
/opt/ticket-demo/ticket-service/
```

Verify:

```bash
ls /opt/ticket-demo/auth-service
ls /opt/ticket-demo/ticket-service
ls /var/www/ticket-demo
```

---

## 8. Build Services

Auth Service:

```bash
cd /opt/ticket-demo/auth-service

npm install

npx tsc
```

Ticket Service:

```bash
cd /opt/ticket-demo/ticket-service

npm install

npx tsc
```

Verify:

```bash
ls dist
```

---

## 9. Start Services With PM2

## 9. Start Services With PM2

Auth Service:

```bash
cd /opt/ticket-demo/auth-service

pm2 start dist/app.js \
  --name auth
```

Ticket Service:

```bash
cd /opt/ticket-demo/ticket-service

pm2 start dist/app.js \
  --name ticket \
  -i 2
```

Verify:

```bash
pm2 list
```

Expected:

```text
auth
ticket 0
ticket 1
```

Check Logs:

```bash
pm2 logs
```

Specific Service Logs:

```bash
pm2 logs auth
```

```bash
pm2 logs ticket
```

Monitor:

```bash
pm2 monit
```

Save PM2 Configuration:

```bash
pm2 save
```

Restart Services:

```bash
pm2 restart auth
pm2 restart ticket
```

Stop Services:

```bash
pm2 stop auth
pm2 stop ticket
```

Delete Services:

```bash
pm2 delete auth
pm2 delete ticket
```

Check Running Processes:

```bash
pm2 list
```

Verify Open Ports:

```bash
ss -tulpn | grep LISTEN
```

Verify API:

```bash
curl http://localhost:3001
```

```bash
curl http://localhost:3002
```


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

Install:

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

Check:

```bash
curl http://localhost
```

You should see:

```text
Welcome to nginx!
```

---

## 12. Configure Nginx

Create a site configuration:

```bash
sudo nano /etc/nginx/sites-available/ticket-demo
```

Configuration:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/ticket-demo;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/auth/ {
        proxy_pass http://127.0.0.1:3001/;
    }

    location /api/tickets/ {
        proxy_pass http://127.0.0.1:3002/;
    }
}
```

Enable the site:

```bash
sudo ln -s \
/etc/nginx/sites-available/ticket-demo \
/etc/nginx/sites-enabled/
```

Remove the default site:

```bash
sudo rm /etc/nginx/sites-enabled/default
```

---

## 13. Nginx Reverse Proxy Architecture

```text
Browser
    |
Nginx
    |
    +--> React Client
    |       /var/www/ticket-demo
    |
    +--> /api/auth
    |         |
    |         +--> Auth Service
    |
    +--> /api/tickets
              |
              +--> Ticket Service
```

---

## 14. Verify Configuration

Test configuration:

```bash
sudo nginx -t
```

Reload:

```bash
sudo systemctl reload nginx
```

Verify:

```bash
curl http://localhost
```

Expected:

```html
<!doctype html>
<html>
```

Check React files:

```bash
ls /var/www/ticket-demo
```

Expected:

```text
index.html
assets
```

Open browser:

```text
http://localhost
```

The React application should now be served through Nginx.




-------------------------------------------
## 15. PM2 Cluster Mode

Node.js runs as a single process by default and uses only one CPU core.

PM2 Cluster Mode allows running multiple instances of the same service and automatically load balances requests between them.

Check CPU cores:

```bash
nproc
```

Run Ticket Service with 2 instances:

```bash
pm2 delete ticket

pm2 start dist/app.js \
  --name ticket \
  -i 2
```

Or use all available CPU cores:

```bash
pm2 delete ticket

pm2 start dist/app.js \
  --name ticket \
  -i max
```

Verify:

```bash
pm2 list
```

Expected:

```text
ticket 0
ticket 1
```

or

```text
ticket 0
ticket 1
ticket 2
ticket 3
```


_________________________________________

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
