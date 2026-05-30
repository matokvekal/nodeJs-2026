import express from 'express';
import { env } from './config/env';
import { testConnection } from './db/postgres';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(express.json());

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
