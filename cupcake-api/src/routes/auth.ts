import 'dotenv/config';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../database.js';
import jwt from 'jsonwebtoken';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não configurado.');
}

authRouter.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Nome, e-mail e senha são obrigatórios.'
    });
  }

  const existingUser = db
    .prepare('SELECT id FROM users WHERE email = ?')
    .get(email);

  if (existingUser) {
    return res.status(409).json({
      error: 'E-mail já cadastrado.'
    });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const result = db
    .prepare(`
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
    `)
    .run(name, email, passwordHash);

  return res.status(201).json({
    id: Number(result.lastInsertRowid),
    name,
    email
  });
});

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'E-mail e senha são obrigatórios.'
    });
  }

  const user = db
    .prepare(`
      SELECT id, name, email, password_hash
      FROM users
      WHERE email = ?
    `)
    .get(email) as {
      id: number;
      name: string;
      email: string;
      password_hash: string;
    } | undefined;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({
      error: 'E-mail ou senha inválidos.'
    });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email
    },
    JWT_SECRET,
    {
      expiresIn: '1h'
    }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});