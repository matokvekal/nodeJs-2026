import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { testConnection } from './db/postgres';
import authRoutes from './routes/auth.routes';

const app = express();

// --- HTTP access log: "POST /api/auth/login 200 4.23 ms" ---
app.use(morgan('[:date[iso]] :method :url :status :response-time ms'));

// --- Security headers (helmet sets ~15 HTTP headers automatically) ---
// Prevents: clickjacking, MIME sniffing, XSS via old browsers, etc.
app.use(helmet());

// --- CORS: which frontend origins can call this API ---
// Without this, browsers block cross-origin requests from React/Vite dev server
app.use(cors({
  origin: env.corsOrigins,   // from .env: http://localhost:5173,...
  credentials: true,         // allow cookies / Authorization header
}));

// --- Body parsing ---
app.use(express.json());                          // Content-Type: application/json  → req.body = object
app.use(express.urlencoded({ extended: true })); // Content-Type: application/x-www-form-urlencoded → req.body = object

// --- Routes ---
app.use('/api/auth', authRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

async function start() {
  await testConnection();
  app.listen(env.port, () => {
    console.log(`Auth service running on http://localhost:${env.port}`);
  });
}

start();

export default app;
