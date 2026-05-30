import { Router } from 'express';
import { getAvailableTickets, buyTicket, getMyTickets } from '../controllers/ticket.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { buyLimiter, readLimiter } from '../middleware/rate.limiter';

const router = Router();

// GET /api/tickets   (public - no JWT required)
router.get('/', readLimiter, getAvailableTickets);

// POST /api/tickets/buy/:id   (protected - JWT required, max 10 purchases per IP per 15 min)
router.post('/buy/:id', authMiddleware, buyLimiter, buyTicket);

// GET /api/tickets/my   (protected - JWT required)
router.get('/my', authMiddleware, readLimiter, getMyTickets);

export default router;
