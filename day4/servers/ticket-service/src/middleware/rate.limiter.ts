import rateLimit from 'express-rate-limit';

// POST /buy/:id — prevents bots from bulk-buying all tickets
// 10 purchases per IP per 15 minutes
export const buyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many purchase attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// GET /tickets and GET /tickets/my — general read protection
// 60 requests per IP per minute
export const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many requests. Slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});
