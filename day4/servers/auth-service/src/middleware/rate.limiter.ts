import rateLimit from 'express-rate-limit';

// Applied to POST /login — brute-force protection
// 5 attempts per IP per 15 minutes
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,  // sends RateLimit-* headers so the client knows how long to wait
  legacyHeaders: false,
});

// Applied to POST /register — prevents account-spam bots
// 10 registrations per IP per hour
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'Too many accounts created from this IP. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
