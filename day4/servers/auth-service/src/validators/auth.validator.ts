import { z } from 'zod';

// Zod schemas define the shape AND rules for incoming request bodies.
// .parse() throws a ZodError if anything is wrong — no manual if-checks needed.

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username: only letters, numbers and underscore'),

  email: z
    .string()
    .email('Invalid email format'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password too long'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// TypeScript types inferred directly from the schemas — no duplication
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput   = z.infer<typeof loginSchema>;
