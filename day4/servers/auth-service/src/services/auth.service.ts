import bcrypt from 'bcrypt';
import { pool } from '../db/postgres';
import { signToken } from '../utils/jwt';

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const SALT_ROUNDS = 10;

export async function registerUser(input: RegisterInput) {
  const { username, email, password } = input;

  // Check if user already exists
  const existing = await pool.query(
    'SELECT id FROM users WHERE email = $1 OR username = $2',
    [email, username]
  );

  if (existing.rows.length > 0) {
    throw new Error('User already exists');
  }

  // Hash password before saving
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await pool.query(
    `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, username, email, created_at`,
    [username, email, passwordHash]
  );

  return result.rows[0];
}

export async function loginUser(input: LoginInput) {
  const { email, password } = input;

  const result = await pool.query(
    'SELECT id, username, email, password_hash, is_locked FROM users WHERE email = $1',
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (user.is_locked) {
    throw new Error('Account is locked');
  }

  // Compare plain password with stored hash
  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    throw new Error('Invalid credentials');
  }

  // Track last login time
  await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

  const token = signToken({ id: user.id, username: user.username });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  };
}

export async function getUserById(id: number) {
  const result = await pool.query(
    'SELECT id, username, email, created_at, last_login FROM users WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
}
