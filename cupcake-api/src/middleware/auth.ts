import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET não configurado.');
  }

  return secret;
})();

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Não autenticado.' });
    return;
  }

  const token = authorization.substring(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (
      typeof payload === 'string' ||
      payload.sub === undefined ||
      typeof payload.email !== 'string'
    ) {
      res.status(401).json({ message: 'Token inválido.' });
      return;
    }

    req.user = {
      id: Number(payload.sub),
      email: payload.email
    };

    next();
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}