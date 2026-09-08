import Database from 'better-sqlite3';

export const db = new Database('data/cupcake.db');

db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    total REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,

    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

const productCount = db
  .prepare('SELECT COUNT(*) AS count FROM products')
  .get() as { count: number };

if (productCount.count === 0) {
  const insert = db.prepare(`
    INSERT INTO products (name, description, price, image)
    VALUES (?, ?, ?, ?)
  `);

  insert.run(
    'Chocolate',
    'Cupcake de chocolate com cobertura cremosa.',
    8.50,
    '/images/cupcakes/chocolate.jpg'
  );

  insert.run(
    'Baunilha',
    'Cupcake de baunilha com cobertura suave.',
    7.50,
    '/images/cupcakes/baunilha.jpg'
  );

  insert.run(
    'Morango',
    'Cupcake de morango com cobertura especial.',
    9.00,
    '/images/cupcakes/morango.jpg'
  );
}