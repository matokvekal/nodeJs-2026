import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { testConnection, pool } from './db/postgres';
import { initCache } from './cache/ticket.cache';
import ticketRoutes from './routes/ticket.routes';

const app = express();

// HTTP access log: "GET /api/tickets 200 3.12 ms"
app.use(morgan('[:date[iso]] :method :url :status :response-time ms'));

// Security headers
app.use(helmet());

// CORS - allow frontend origins (WSL / local dev)
app.use(cors({
  origin: env.corsOrigins,
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/tickets', ticketRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ticket-service', pid: process.pid });
});

async function start() {
  await testConnection();

  // Seed the in-process cache with the current DB count.
  // Each PM2 instance runs this independently — they each start with the same number
  // but diverge as purchases hit different pids.
  const result = await pool.query('SELECT COUNT(*) FROM tickets WHERE user_id IS NULL');
  initCache(parseInt(result.rows[0].count));

  app.listen(env.port, () => {
    console.log(`Ticket service running on http://localhost:${env.port} (pid ${process.pid})`);
  });
}

// In test mode Jest imports this file directly — we skip listen() and DB init
// so tests don't need a running server and won't hang after finishing
if (process.env.NODE_ENV !== 'test') {
  start();
}

export default app;
