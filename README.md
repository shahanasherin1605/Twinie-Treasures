# Twinie Treasures

A responsive React storefront with a Node.js API and MySQL-backed customer accounts, inventory, and order history.

## Requirements

- Node.js 20.6 or newer
- MySQL 8 (local or remote)

## Local setup

1. Install dependencies with `npm install`.
2. Create the database in MySQL:

   ```sql
   CREATE DATABASE photo_frame_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. Copy `.env.example` to `.env` and enter your MySQL password and connection settings.
4. Run `npm run dev` and open `http://localhost:5173`.

The API creates its tables and seeds initial inventory at startup. Inventory, customer accounts, orders, and order items persist in MySQL. Passwords are salted and hashed. Authentication tokens are held in server memory, so customers sign in again after an API server restart.

## MySQL tables

- `users`: customer accounts and saved delivery details
- `inventory`: available stock per catalog product
- `orders`: totals, payment choice/status, shipping address, and timestamp
- `order_items`: purchased products and price/quantity snapshots

Order placement is transactional. The API uses catalog prices (not browser-submitted prices), locks inventory rows, checks availability, writes the order and its items, and decrements stock atomically.

## Build and production

```bash
npm run build
npm start
```

Set the MySQL environment variables for the production database before running `npm start`. The Node server serves the built frontend and API from one origin. Keep database credentials private; use managed MySQL and HTTPS for deployment.

Card, UPI, and netbanking are demo-only and do not charge customers. Connect a payment provider before accepting online payments. Cash on delivery is available for checkout testing.
