import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { loginLimiter, registerLimiter } from '../middleware/rate.limiter';

const router = Router();

// POST /api/auth/register   (max 10 registrations per IP per hour)
router.post('/register', registerLimiter, register);

// POST /api/auth/login      (max 5 attempts per IP per 15 minutes)
router.post('/login', loginLimiter, login);

// GET /api/auth/profile     (protected - requires Authorization: Bearer <token>)
router.get('/profile', authMiddleware, getProfile);

export default router;
