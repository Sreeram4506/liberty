import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// --- Initial Data Seeds ---

const SEED_STORES = [
  { id: 'store-norwood', name: 'Norwood Flagship', address: '100 Access Rd, Suite 215, Norwood MA 02062', phone: '(508) 492-5955', hours: 'Mon-Fri 10am-6pm, Sat 10am-7pm, Sun 10am-3:30pm' },
  { id: 'store-brockton', name: 'Brockton Branch', address: '45 Liberty Ave, Brockton MA 02301', phone: '(508) 555-0142', hours: 'Mon-Fri 10am-6pm, Sat 10am-5pm, Sun Closed' },
  { id: 'store-worcester', name: 'Worcester Outpost', address: '220 Grafton St, Worcester MA 01604', phone: '(508) 555-0198', hours: 'Tue-Sat 10am-6pm, Sun-Mon Closed' }
];

// Roles:
//   owner    - full control across every store, manages staff & the catalog
//   admin    - store manager, scoped to a single storeId (see `storeId`)
//   customer - shopper
const SEED_CUSTOMERS = [
  { id: 'c1', first: 'Mike', last: 'Sullivan', email: 'mike.sullivan@example.com', pass: 'demo1234', role: 'customer', status: 'active', joined: '2025-11-03', orders: 4 },
  { id: 'c2', first: 'Dana', last: 'Perez', email: 'dana.perez@example.com', pass: 'demo1234', role: 'customer', status: 'active', joined: '2026-01-18', orders: 1 },
  { id: 'c3', first: 'Tom', last: 'Chen', email: 'tom.chen@example.com', pass: 'demo1234', role: 'customer', status: 'disabled', joined: '2026-03-29', orders: 0 },
  { id: 'owner', first: 'Shop', last: 'Owner', email: 'owner@los2a.com', pass: 'liberty', role: 'owner', status: 'active', joined: '2025-01-01', orders: 0 },
  { id: 'admin', first: 'Shop', last: 'Admin', email: 'admin@los2a.com', pass: 'liberty', role: 'owner', status: 'active', joined: '2025-01-01', orders: 0 },
  { id: 'mgr-norwood', first: 'Ray', last: 'Doyle', email: 'norwood@los2a.com', pass: 'liberty', role: 'admin', storeId: 'store-norwood', status: 'active', joined: '2025-02-14', orders: 0 },
  { id: 'mgr-brockton', first: 'Alice', last: 'Nguyen', email: 'brockton@los2a.com', pass: 'liberty', role: 'admin', storeId: 'store-brockton', status: 'active', joined: '2025-06-02', orders: 0 },
  { id: 'mgr-worcester', first: 'Carl', last: 'Reyes', email: 'worcester@los2a.com', pass: 'liberty', role: 'admin', storeId: 'store-worcester', status: 'active', joined: '2026-04-11', orders: 0 }
];

// storeStock keys must match SEED_STORES ids
const SEED_INVENTORY = [
  { id: 'holosun-507c', name: 'Holosun HS507C X2', cat: 'Red Dots', priceN: 309.99, storeStock: { 'store-norwood': 3, 'store-brockton': 2, 'store-worcester': 1 }, slot: 'p-507c', placeholder: 'Holosun 507C photo' },
  { id: 'romeo5', name: 'Sig Sauer Romeo5', cat: 'Red Dots', priceN: 139.99, storeStock: { 'store-norwood': 5, 'store-brockton': 4, 'store-worcester': 2 }, slot: 'p-romeo5', placeholder: 'Romeo5 photo' },
  { id: 'tlr1-hl', name: 'Streamlight TLR-1 HL', cat: 'Weapon Lights', priceN: 164.99, storeStock: { 'store-norwood': 4, 'store-brockton': 3, 'store-worcester': 1 }, slot: 'p-tlr1', placeholder: 'TLR-1 photo' },
  { id: 'x300u', name: 'Surefire X300 Ultra', cat: 'Weapon Lights', priceN: 329.99, storeStock: { 'store-norwood': 2, 'store-brockton': 1, 'store-worcester': 0 }, slot: 'p-x300', placeholder: 'X300U photo' },
  { id: 'moe-sl', name: 'Magpul MOE SL Stock', cat: 'AR Accessories', priceN: 59.99, storeStock: { 'store-norwood': 6, 'store-brockton': 5, 'store-worcester': 3 }, slot: 'p-moe', placeholder: 'MOE SL photo' },
  { id: 'raptor-lt', name: 'Radian Raptor-LT Charging Handle', cat: 'AR Accessories', priceN: 54.99, storeStock: { 'store-norwood': 4, 'store-brockton': 3, 'store-worcester': 2 }, slot: 'p-raptor', placeholder: 'Raptor-LT photo' },
  { id: 'bcm-upper', name: 'BCM 16" Mid-Length Upper', cat: 'Upper Receivers', priceN: 649.99, storeStock: { 'store-norwood': 1, 'store-brockton': 1, 'store-worcester': 0 }, slot: 'p-bcm', placeholder: 'BCM upper photo' },
  { id: 'glock19-used', name: 'Glock 19 Gen 4', cat: 'Used Guns', priceN: 429.99, storeStock: { 'store-norwood': 1, 'store-brockton': 0, 'store-worcester': 0 }, used: true, condition: 'Very good', slot: 'p-g19', placeholder: 'Glock 19 photo' }
];

const readJson = (file, seed) => {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, JSON.stringify(seed, null, 2));
    return seed;
  }
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    return seed;
  }
};

const writeJson = (file, data) => {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
};

// --- Stores ---
export const getStores = () => readJson('stores.json', SEED_STORES);
export const saveStores = (data) => writeJson('stores.json', data);

// --- Customers ---
export const getCustomers = () => readJson('customers.json', SEED_CUSTOMERS);
export const saveCustomers = (data) => writeJson('customers.json', data);

// --- Inventory ---
// Every read/write of inventory passes through here so stock totals & status
// stay in sync no matter which store's stock changed.
export const computeItemDerived = (item) => {
  const storeStock = item.storeStock || {};
  const total = Object.values(storeStock).reduce((a, b) => a + (Number(b) || 0), 0);
  let status = 'in-stock';
  if (total === 0) status = 'out-of-stock';
  else if (total <= 3) status = 'low-stock';
  return { ...item, storeStock, stock: total, status };
};

const rawInventory = () => readJson('inventory.json', SEED_INVENTORY);

export const getInventory = () => rawInventory().map(computeItemDerived);

// Save raw (pre-derived) inventory - strips computed fields before persisting
export const saveInventory = (data) => {
  const clean = data.map(({ stock, status, ...rest }) => rest);
  writeJson('inventory.json', clean);
};

// --- Orders ---
export const getOrders = () => readJson('orders.json', []);
export const saveOrders = (data) => writeJson('orders.json', data);

// --- Invoices ---
export const getInvoices = () => readJson('invoices.json', []);
export const saveInvoices = (data) => writeJson('invoices.json', data);

export const nextInvoiceNumber = () => {
  const invoices = getInvoices();
  const max = invoices.reduce((m, inv) => {
    const n = parseInt(String(inv.id).replace(/\D/g, ''), 10);
    return Number.isFinite(n) && n > m ? n : m;
  }, 1000);
  return `INV-${max + 1}`;
};
