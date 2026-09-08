import { Router } from 'express';
import { db } from '../database.js';

export const productsRouter = Router();

productsRouter.get('/', (_req, res) => {
  const products = db
    .prepare(`
      SELECT id, name, description, price, image
      FROM products
      ORDER BY id
    `)
    .all();

  res.json(products);
});