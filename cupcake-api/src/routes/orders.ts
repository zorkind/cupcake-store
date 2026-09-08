import { Router } from 'express';
import { db } from '../database.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';

export const ordersRouter = Router();

interface OrderItemRequest {
  productId: number;
  quantity: number;
}

interface Product {
  id: number;
  price: number;
}

ordersRouter.post('/', requireAuth, (req: AuthRequest, res) => {
  const { address, city, paymentMethod, items } = req.body ?? {};

  if (
    !req.user ||
    !address ||
    !city ||
    !paymentMethod ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    res.status(400).json({ message: 'Dados do pedido inválidos.' });
    return;
  }

  try {
    const createOrder = db.transaction(() => {
      let total = 0;

      const orderItems = items.map(item => {
        if (
          !Number.isInteger(item.productId) ||
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0
        ) {
          throw new Error('Item inválido.');
        }

        const product = db
          .prepare(`
            SELECT id, price
            FROM products
            WHERE id = ?
          `)
          .get(item.productId) as Product | undefined;

        if (!product) {
          throw new Error('Produto não encontrado.');
        }

        total += product.price * item.quantity;

        return {
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price
        };
      });

      const result = db
        .prepare(`
          INSERT INTO orders (
            user_id,
            address,
            city,
            payment_method,
            total
          )
          VALUES (?, ?, ?, ?, ?)
        `)
        .run(
          req.user!.id,
          address,
          city,
          paymentMethod,
          total
        );

      const orderId = Number(result.lastInsertRowid);

      const insertItem = db.prepare(`
        INSERT INTO order_items (
          order_id,
          product_id,
          quantity,
          unit_price
        )
        VALUES (?, ?, ?, ?)
      `);

      for (const item of orderItems) {
        insertItem.run(
          orderId,
          item.productId,
          item.quantity,
          item.unitPrice
        );
      }

      return {
        orderId,
        total
      };
    });

    const order = createOrder();

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: 'Não foi possível criar o pedido.'
    });
  }
});

ordersRouter.get('/', requireAuth, (req: AuthRequest, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Não autenticado.' });
    return;
  }

  const orders = db
    .prepare(`
      SELECT
        id,
        address,
        city,
        payment_method AS paymentMethod,
        total,
        created_at AS createdAt
      FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC, id DESC
    `)
    .all(req.user.id);

  res.json(orders);
});