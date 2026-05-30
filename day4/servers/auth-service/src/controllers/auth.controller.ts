import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: 'username, email and password are required' });
      return;
    }

    const user = await authService.registerUser({ username, email, password });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    const status = message === 'User already exists' ? 409 : 500;
    res.status(status).json({ error: message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required' });
      return;
    }

    const result = await authService.loginUser({ email, password });
    res.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Login failed';
    const status = message === 'Invalid credentials' ? 401 : 500;
    res.status(status).json({ error: message });
  }
}

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
