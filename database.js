import mysql from "mysql2/promise";
import { products } from "./src/products.js";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "photo_frame_store",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true,
});

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(24) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(254) NOT NULL UNIQUE,
      password_salt CHAR(32) NOT NULL,
      password_hash CHAR(128) NOT NULL,
      phone VARCHAR(32) NOT NULL DEFAULT '',
      address TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS inventory (
      product_id VARCHAR(64) PRIMARY KEY,
      stock INT UNSIGNED NOT NULL
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(40) PRIMARY KEY,
      user_id VARCHAR(24) NOT NULL,
      total DECIMAL(10, 2) NOT NULL,
      payment_method VARCHAR(20) NOT NULL,
      payment_status VARCHAR(40) NOT NULL,
      status VARCHAR(24) NOT NULL DEFAULT 'Placed',
      shipping_address TEXT NOT NULL,
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      INDEX orders_user_created (user_id, created_at),
      CONSTRAINT orders_user_fk FOREIGN KEY (user_id) REFERENCES users(id)
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(40) NOT NULL,
      product_id VARCHAR(64) NOT NULL,
      name VARCHAR(180) NOT NULL,
      size VARCHAR(40) NOT NULL,
      image VARCHAR(500) NOT NULL,
      unit_price DECIMAL(10, 2) NOT NULL,
      quantity INT UNSIGNED NOT NULL,
      INDEX order_items_order (order_id),
      CONSTRAINT order_items_order_fk FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);

  const seedInventory = "INSERT INTO inventory (product_id, stock) VALUES (?, ?) ON DUPLICATE KEY UPDATE product_id = VALUES(product_id)";
  for (const product of products) await pool.execute(seedInventory, [product.id, product.stock]);
  await pool.query("SELECT 1");
  console.log(`Connected to MySQL database '${process.env.DB_NAME || "photo_frame_store"}'`);
}

export async function findUserByEmail(email) {
  const [rows] = await pool.execute("SELECT id, name, email, password_salt AS salt, password_hash AS hash, phone, address FROM users WHERE email = ?", [email]);
  return rows[0] || null;
}

export async function findUserById(id) {
  const [rows] = await pool.execute("SELECT id, name, email, password_salt AS salt, password_hash AS hash, phone, address FROM users WHERE id = ?", [id]);
  return rows[0] || null;
}

export async function createUser(user) {
  await pool.execute(
    "INSERT INTO users (id, name, email, password_salt, password_hash, phone, address) VALUES (?, ?, ?, ?, ?, ?, '')",
    [user.id, user.name, user.email, user.salt, user.hash, user.phone]
  );
}

export async function updateUserProfile(id, profile) {
  await pool.execute("UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?", [profile.name, profile.phone, profile.address, id]);
  return findUserById(id);
}

export async function listProducts() {
  const [rows] = await pool.query("SELECT product_id, stock FROM inventory");
  const stockById = new Map(rows.map((row) => [row.product_id, row.stock]));
  return products.map((product) => ({ ...product, stock: stockById.get(product.id) ?? 0 }));
}

export async function createOrder({ id, user, requestedItems, paymentMethod }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const items = [];
    for (const [productId, quantity] of requestedItems) {
      const product = products.find((candidate) => candidate.id === productId);
      if (!product) throw Object.assign(new Error("A product in your cart is no longer available."), { statusCode: 400 });
      const [inventoryRows] = await connection.execute("SELECT stock FROM inventory WHERE product_id = ? FOR UPDATE", [productId]);
      const stock = inventoryRows[0]?.stock ?? 0;
      if (quantity > stock) throw Object.assign(new Error(`Only ${stock} left in stock for ${product.name} (${product.size}).`), { statusCode: 409 });
      items.push({ id: product.id, name: product.name, size: product.size, image: product.image, price: product.price, qty: quantity });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const paymentStatus = paymentMethod === "cod" ? "Pay on delivery" : "Demo payment pending";
    await connection.execute(
      "INSERT INTO orders (id, user_id, total, payment_method, payment_status, shipping_address) VALUES (?, ?, ?, ?, ?, ?)",
      [id, user.id, total, paymentMethod, paymentStatus, user.address]
    );
    for (const item of items) {
      await connection.execute("UPDATE inventory SET stock = stock - ? WHERE product_id = ?", [item.qty, item.id]);
      await connection.execute(
        "INSERT INTO order_items (order_id, product_id, name, size, image, unit_price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id, item.id, item.name, item.size, item.image, item.price, item.qty]
      );
    }
    await connection.commit();
    return { id, userId: user.id, items, total, paymentMethod, paymentStatus, status: "Placed", shippingAddress: user.address, createdAt: new Date().toISOString() };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function listOrders(userId) {
  const [rows] = await pool.execute(
    `SELECT o.id, o.total, o.payment_method AS paymentMethod, o.payment_status AS paymentStatus,
            o.status, o.shipping_address AS shippingAddress, o.created_at AS createdAt,
            i.product_id AS productId, i.name, i.size, i.image, i.unit_price AS price, i.quantity AS qty
     FROM orders o LEFT JOIN order_items i ON i.order_id = o.id
     WHERE o.user_id = ? ORDER BY o.created_at DESC, i.id ASC`,
    [userId]
  );
  const ordersById = new Map();
  for (const row of rows) {
    if (!ordersById.has(row.id)) {
      ordersById.set(row.id, {
        id: row.id,
        userId,
        total: Number(row.total),
        paymentMethod: row.paymentMethod,
        paymentStatus: row.paymentStatus,
        status: row.status,
        shippingAddress: row.shippingAddress,
        createdAt: new Date(row.createdAt).toISOString(),
        items: [],
      });
    }
    if (row.productId) ordersById.get(row.id).items.push({ id: row.productId, name: row.name, size: row.size, image: row.image, price: Number(row.price), qty: row.qty });
  }
  return [...ordersById.values()];
}