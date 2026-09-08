import express from 'express';
import cors from 'cors';
import './database.js';
import { authRouter } from './routes/auth.js';
import { productsRouter } from './routes/products.js';
import { ordersRouter } from './routes/orders.js';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/orders', ordersRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

app.listen(3000, () => {
  console.log('Cupcake API running on http://localhost:3000');
});