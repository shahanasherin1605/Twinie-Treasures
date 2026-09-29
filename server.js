import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { randomBytes, pbkdf2Sync, timingSafeEqual, createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { products } from "./src/products.js";

try { process.loadEnvFile(); } catch (error) { if (error.code !== "ENOENT") throw error; }

const {
  initializeDatabase,
  findUserByEmail,
  findUserById,
  createUser,
  updateUserProfile,
  listProducts,
  createOrder,
  listOrders,
} = await import("./database.js");

const root = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production" || process.argv.includes("--production");
const port = Number(process.env.PORT || (isProduction ? 4173 : 3001));
const sessions = new Map();
let databaseReady = false;

const hashPassword = (password, salt = randomBytes(16).toString("hex")) => ({
  salt,
  hash: pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex"),
});
const safeEqual = (left, right) => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
};
const publicUser = ({ id, name, email, phone = "", address = "" }) => ({ id, name, email, phone, address });

function readBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";
    request.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) reject(new Error("Request is too large."));
    });
    request.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error("Invalid JSON request.")); }
    });
    request.on("error", reject);
  });
}

function send(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(payload));
}

async function authenticatedUser(request) {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  const userId = token && sessions.get(createHash("sha256").update(token).digest("hex"));
  return userId ? findUserById(userId) : null;
}

async function handleApi(request, response) {
  const route = new URL(request.url, "http://localhost").pathname;
  const method = request.method;
  if (method === "GET" && route === "/api/health") return send(response, databaseReady ? 200 : 503, { status: databaseReady ? "ok" : "database-unavailable" });
  if (method === "GET" && route === "/api/products") {
    const catalog = databaseReady ? await listProducts() : products;
    return send(response, 200, { products: catalog });
  }
  if (!databaseReady && route !== "/api/auth/logout") {
    return send(response, 503, { error: "MySQL is unavailable. Configure the database connection in .env and restart the server to use accounts and checkout." });
  }

  if (method === "POST" && ["/api/auth/register", "/api/auth/login"].includes(route)) {
    const body = await readBody(request);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
      return send(response, 400, { error: "Enter a valid email and a password with at least 8 characters." });
    }
    let user = await findUserByEmail(email);
    if (route.endsWith("register")) {
      if (user) return send(response, 409, { error: "An account with this email already exists." });
      const phone = String(body.phone || "").trim();
      const phoneDigits = phone.replace(/\D/g, "").length;
      if (phone.length > 24 || !/^\+?[0-9\s().-]+$/.test(phone) || phoneDigits < 7 || phoneDigits > 15) {
        return send(response, 400, { error: "Enter a valid mobile number, including the country code if applicable." });
      }
      const credentials = hashPassword(password);
      user = { id: randomBytes(12).toString("hex"), name: String(body.name || "").trim(), email, ...credentials, phone, address: "" };
      if (user.name.length < 2) return send(response, 400, { error: "Please enter your name." });
      try { await createUser(user); }
      catch (error) {
        if (error.code === "ER_DUP_ENTRY") return send(response, 409, { error: "An account with this email already exists." });
        throw error;
      }
    } else {
      if (!user) return send(response, 401, { error: "Email or password is incorrect." });
      const candidate = hashPassword(password, user.salt).hash;
      if (!safeEqual(candidate, user.hash)) return send(response, 401, { error: "Email or password is incorrect." });
    }
    const token = randomBytes(32).toString("hex");
    sessions.set(createHash("sha256").update(token).digest("hex"), user.id);
    return send(response, 200, { token, user: publicUser(user) });
  }

  if (method === "POST" && route === "/api/auth/logout") {
    const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (token) sessions.delete(createHash("sha256").update(token).digest("hex"));
    return send(response, 200, { status: "ok" });
  }

  const user = await authenticatedUser(request);
  if (!user) return send(response, 401, { error: "Please sign in to continue." });
  if (method === "GET" && route === "/api/profile") return send(response, 200, { user: publicUser(user) });
  if (method === "PATCH" && route === "/api/profile") {
    const body = await readBody(request);
    const profile = {
      name: String(body.name || "").trim(),
      phone: String(body.phone || "").trim(),
      address: String(body.address || "").trim(),
    };
    if (profile.name.length < 2 || profile.phone.length < 5 || profile.address.length < 8) {
      return send(response, 400, { error: "Enter your name, a valid phone number, and a complete address." });
    }
    return send(response, 200, { user: publicUser(await updateUserProfile(user.id, profile)) });
  }
  if (method === "GET" && route === "/api/orders") {
    return send(response, 200, { orders: await listOrders(user.id) });
  }
  if (method === "POST" && route === "/api/orders") {
    const body = await readBody(request);
    if (!user.phone || !user.address) return send(response, 400, { error: "Add a phone number and shipping address to your profile first." });
    if (!Array.isArray(body.items) || body.items.length === 0) return send(response, 400, { error: "Your cart is empty." });
    if (!["card", "upi", "netbanking", "cod"].includes(body.paymentMethod)) return send(response, 400, { error: "Choose a valid payment method." });
    const quantities = new Map();
    for (const item of body.items) {
      if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 20) return send(response, 400, { error: "Cart quantities must be between 1 and 20." });
      quantities.set(item.id, (quantities.get(item.id) || 0) + item.qty);
    }
    const id = `TT-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;
    try {
      const order = await createOrder({ id, user, requestedItems: quantities, paymentMethod: body.paymentMethod });
      return send(response, 201, { order });
    } catch (error) {
      if (error.statusCode) return send(response, error.statusCode, { error: error.message });
      throw error;
    }
  }
  return send(response, 404, { error: "API route not found." });
}

async function serveStatic(request, response) {
  const urlPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const distRoot = path.join(root, "dist");
  const requested = path.resolve(distRoot, `.${urlPath}`);
  const filePath = (requested === distRoot || requested.startsWith(`${distRoot}${path.sep}`)) && existsSync(requested) ? requested : path.join(distRoot, "index.html");
  try {
    const body = await readFile(filePath);
    const type = filePath.endsWith(".js") ? "text/javascript" : filePath.endsWith(".css") ? "text/css" : filePath.endsWith(".svg") ? "image/svg+xml" : "text/html";
    response.writeHead(200, { "Content-Type": `${type}; charset=utf-8` });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Run npm run build before starting the production server.");
  }
}

try {
  await initializeDatabase();
  databaseReady = true;
} catch (error) {
  console.error(`MySQL unavailable; catalog browsing remains enabled, but accounts and checkout are disabled. Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD and DB_NAME. ${error.message}`);
}
const server = createServer(async (request, response) => {
  try {
    if (request.url.startsWith("/api/")) await handleApi(request, response);
    else if (isProduction) await serveStatic(request, response);
    else response.writeHead(404).end("Not found");
  } catch (error) {
    console.error(error);
    if (!response.headersSent) send(response, 500, { error: "The server could not complete this request." });
  }
});

server.listen(port, () => console.log(`API listening on http://localhost:${port}`));
let viteProcess;
if (!isProduction) {
  viteProcess = spawn(process.execPath, [path.join(root, "node_modules/vite/bin/vite.js"), "--host", "0.0.0.0"], { cwd: root, stdio: "inherit" });
  viteProcess.on("exit", (code) => { if (code && code !== 0) process.exitCode = code; server.close(); });
}
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => {
  viteProcess?.kill(signal);
  server.close(() => process.exit(0));
});