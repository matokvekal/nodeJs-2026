import { Request, Response } from 'express';
import { ZodError } from 'zod';
import * as authService from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth.validator';

// POST /api/auth/register
// Body:
// {
//   "username": "gilad",
//   "email": "gilad@test.com",
//   "password": "123456"
// }
// Response 201:
// {
//   "message": "User created successfully",
//   "user": { "id": 1, "username": "gilad", "email": "gilad@test.com", "created_at": "..." }
// }
export async function register(req: Request, res: Response): Promise<void> {
  try {
    // Zod validates AND types the body in one step.
    // If email is missing, password too short, etc → ZodError is thrown automatically.
    const input = registerSchema.parse(req.body);

    const user = await authService.registerUser(input);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      // Return the first validation message to the client
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    const message = error instanceof Error ? error.message : 'Registration failed';
    const status = message === 'User already exists' ? 409 : 500;
    res.status(status).json({ error: message });
  }
}

// POST /api/auth/login
// Body:
// {
//   "email": "gilad@test.com",
//   "password": "123456"
// }
// Response 200:
// {
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
//   "user": { "id": 1, "username": "gilad" }
// }
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const input = loginSchema.parse(req.body);

    const result = await authService.loginUser(input);
    res.json(result);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    const message = error instanceof Error ? error.message : 'Login failed';
    const status = message === 'Invalid credentials' ? 401 : 500;
    res.status(status).json({ error: message });
  }
}

// GET /api/auth/profile   (protected)
// Header:
//   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
// Response 200:
// {
//   "user": { "id": 1, "username": "gilad", "email": "gilad@test.com", "created_at": "...", "last_login": "..." }
// }
export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const user = await authService.getUserById(userId);
    res.json({ user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get profile';
    res.status(500).json({ error: message });
  }
}
