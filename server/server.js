import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import {
  getCustomers, saveCustomers,
  getInventory, saveInventory,
  getOrders, saveOrders,
  getStores, saveStores,
  getInvoices, saveInvoices, nextInvoiceNumber
} from './db.js';
import { getRetailer, getAllActiveProducts, getCategoryList, createSale, getProductsMissingImages, uploadProductImage } from './lightspeed.js';
import { generateProductImage } from './imageGen.js';
import { startAutoImageGenLoop } from './autoImageGen.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Root — mostly hit by Render's own health check, not real traffic (the
// storefront calls /api/* only). Answer with something meaningful instead of
// Express's default 404.
app.get('/', (req, res) => {
  res.json({ service: 'Liberty Ordnance Supply API', status: 'ok' });
});

const JWT_SECRET = 'liberty-secret-key-1234';
const TAX_RATE = 0.0625;
const SHIP_FLAT = 9.95;

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

const getUserFromToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const customers = getCustomers();
    const user = customers.find(c => c.id === decoded.id) || null;
    if (!user || user.status !== 'active') return null;
    return user;
  } catch (e) {
    return null;
  }
};

const isOwner = (user) => !!user && user.role === 'owner';
const isStaff = (user) => !!user && (user.role === 'owner' || user.role === 'admin');

// A store manager may only ever act on the store they're assigned to.
// The owner may act on any store.
const canAccessStore = (user, storeId) => {
  if (!user) return false;
  if (user.role === 'owner') return true;
  if (user.role === 'admin') return user.storeId === storeId;
  return false;
};

// Store ids this user is allowed to see (owner => all).
const visibleStoreIds = (user) => {
  const all = getStores().map(s => s.id);
  if (isOwner(user)) return all;
  if (user && user.role === 'admin' && user.storeId) return [user.storeId];
  return [];
};

const requireStaff = (req, res, next) => {
  const user = getUserFromToken(req);
  if (!isStaff(user)) return res.status(403).json({ error: 'Staff access required' });
  req.currentUser = user;
  next();
};

const requireOwner = (req, res, next) => {
  const user = getUserFromToken(req);
  if (!isOwner(user)) return res.status(403).json({ error: 'Owner access required' });
  req.currentUser = user;
  next();
};

const publicUser = ({ pass, ...rest }) => rest;

// ---------------------------------------------------------------------------
// AUTH
// ---------------------------------------------------------------------------

app.post('/api/auth/login', (req, res) => {
  const { email, pass } = req.body;
  const customers = getCustomers();
  const c = customers.find(x => x.email.toLowerCase() === String(email).trim().toLowerCase());

  if (!c) return res.status(400).json({ error: 'No account found with that email.' });
  if (c.pass !== pass) return res.status(400).json({ error: 'Incorrect password.' });
  if (c.status !== 'active') return res.status(400).json({ error: 'This account is disabled. Call the shop for help.' });

  const token = jwt.sign({ id: c.id, role: c.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: publicUser(c), token });
});

app.post('/api/auth/register', (req, res) => {
  const { first, last, email, pass } = req.body;
  const customers = getCustomers();
  if (customers.some(x => x.email.toLowerCase() === String(email).trim().toLowerCase())) {
    return res.status(400).json({ error: 'An account with that email already exists.' });
  }

  const c = { id: 'c' + Date.now(), first, last, email: String(email).trim(), pass, role: 'customer', status: 'active', joined: new Date().toISOString().slice(0, 10), orders: 0 };
  customers.push(c);
  saveCustomers(customers);

  const token = jwt.sign({ id: c.id, role: c.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: publicUser(c), token });
});

app.get('/api/auth/me', (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ user: publicUser(user) });
});

// ---------------------------------------------------------------------------
// STORES
// Each store carries live stats computed off current inventory, so the admin
// console always reflects what is actually on the shelf at that location.
// ---------------------------------------------------------------------------

const storesWithStats = () => {
  const stores = getStores();
  const inventory = getInventory();
  return stores.map(s => {
    let totalUnits = 0, outOfStock = 0, lowStock = 0, products = 0, stockValue = 0;
    inventory.forEach(p => {
      const qty = (p.storeStock && p.storeStock[s.id]) || 0;
      if (qty > 0) products++;
      totalUnits += qty;
      stockValue += qty * (p.priceN || 0);
      if (qty === 0) outOfStock++;
      else if (qty <= 3) lowStock++;
    });
    return { ...s, stats: { totalUnits, outOfStock, lowStock, products, totalProducts: inventory.length, stockValue: +stockValue.toFixed(2) } };
  });
};

app.get('/api/stores', (req, res) => {
  res.json(storesWithStats());
});

app.post('/api/stores', requireOwner, (req, res) => {
  const { name, address, phone, hours } = req.body;
  if (!name || !String(name).trim()) return res.status(400).json({ error: 'Store name is required.' });
  const stores = getStores();
  const id = 'store-' + String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
  stores.push({ id, name: String(name).trim(), address: address || '', phone: phone || '', hours: hours || '' });
  saveStores(stores);

  // Add the store to every product's stock map (at 0) so the catalog stays
  // consistent across locations immediately.
  saveInventory(getInventory().map(p => ({ ...p, storeStock: { ...p.storeStock, [id]: 0 } })));

  res.json(storesWithStats().find(s => s.id === id));
});

app.patch('/api/stores/:id', requireOwner, (req, res) => {
  let stores = getStores();
  let found = false;
  stores = stores.map(s => {
    if (s.id === req.params.id) { found = true; return { ...s, ...req.body, id: s.id }; }
    return s;
  });
  if (!found) return res.status(404).json({ error: 'Not found' });
  saveStores(stores);
  res.json(storesWithStats().find(s => s.id === req.params.id));
});

app.delete('/api/stores/:id', requireOwner, (req, res) => {
  let stores = getStores();
  if (!stores.some(s => s.id === req.params.id)) return res.status(404).json({ error: 'Not found' });
  saveStores(stores.filter(s => s.id !== req.params.id));

  // Strip the removed store's stock column from every product.
  saveInventory(getInventory().map(p => {
    const storeStock = { ...p.storeStock };
    delete storeStock[req.params.id];
    return { ...p, storeStock };
  }));

  // Unassign any manager who pointed at it.
  saveCustomers(getCustomers().map(c => c.storeId === req.params.id ? { ...c, storeId: null, status: 'disabled' } : c));

  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// INVENTORY
// The catalog itself (adding/removing products, pricing) is owner-controlled.
// Stock counts are per-store and editable by that store's manager.
// ---------------------------------------------------------------------------

app.get('/api/inventory', (req, res) => {
  res.json(getInventory());
});

app.post('/api/inventory', requireOwner, (req, res) => {
  const list = getInventory();
  const stores = getStores();
  const p = req.body;
  const id = (p.name || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

  const storeStock = {};
  if (p.storeStock && typeof p.storeStock === 'object') {
    stores.forEach(s => { storeStock[s.id] = Math.max(0, Number(p.storeStock[s.id]) || 0); });
  } else {
    stores.forEach((s, i) => { storeStock[s.id] = i === 0 ? Math.max(0, Number(p.stock) || 0) : 0; });
  }

  list.unshift({ id, name: p.name, cat: p.cat, priceN: Number(p.priceN) || 0, storeStock, slot: 'p-' + id, placeholder: p.name + ' photo' });
  saveInventory(list);
  res.json(getInventory().find(x => x.id === id));
});

app.patch('/api/inventory/:id', requireOwner, (req, res) => {
  let found = false;
  const list = getInventory().map(p => {
    if (p.id === req.params.id) { found = true; return { ...p, ...req.body, id: p.id }; }
    return p;
  });
  if (!found) return res.status(404).json({ error: 'Not found' });
  saveInventory(list);
  res.json(getInventory().find(p => p.id === req.params.id));
});

// Adjust or set one store's stock for a product. A store manager can only
// touch their own store. Recomputes the item's total + status immediately, so
// the change is reflected everywhere (storefront, admin, every other view).
app.patch('/api/inventory/:id/stock', requireStaff, (req, res) => {
  const { storeId, qty, delta } = req.body;
  if (!storeId) return res.status(400).json({ error: 'storeId is required' });
  if (!canAccessStore(req.currentUser, storeId)) {
    return res.status(403).json({ error: 'You can only manage stock for your own store.' });
  }

  let found = false;
  const list = getInventory().map(p => {
    if (p.id !== req.params.id) return p;
    found = true;
    const storeStock = { ...p.storeStock };
    const current = Number(storeStock[storeId]) || 0;
    const next = (qty !== undefined && qty !== null) ? Number(qty) : current + (Number(delta) || 0);
    storeStock[storeId] = Math.max(0, Number.isFinite(next) ? next : current);
    return { ...p, storeStock };
  });
  if (!found) return res.status(404).json({ error: 'Not found' });
  saveInventory(list);
  res.json(getInventory().find(p => p.id === req.params.id));
});

// Move units between stores — the owner rebalancing shelves.
app.post('/api/inventory/:id/transfer', requireOwner, (req, res) => {
  const { fromStoreId, toStoreId, qty } = req.body;
  const amount = Math.max(0, Number(qty) || 0);
  if (!fromStoreId || !toStoreId || amount === 0) return res.status(400).json({ error: 'fromStoreId, toStoreId and a positive qty are required.' });
  if (fromStoreId === toStoreId) return res.status(400).json({ error: 'Pick two different stores.' });

  const item = getInventory().find(p => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  const available = Number(item.storeStock[fromStoreId]) || 0;
  if (available < amount) return res.status(400).json({ error: `Only ${available} unit(s) available to transfer.` });

  saveInventory(getInventory().map(p => {
    if (p.id !== req.params.id) return p;
    const storeStock = { ...p.storeStock };
    storeStock[fromStoreId] = (Number(storeStock[fromStoreId]) || 0) - amount;
    storeStock[toStoreId] = (Number(storeStock[toStoreId]) || 0) + amount;
    return { ...p, storeStock };
  }));

  res.json(getInventory().find(p => p.id === req.params.id));
});

app.delete('/api/inventory/:id', requireOwner, (req, res) => {
  saveInventory(getInventory().filter(p => p.id !== req.params.id));
  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// STAFF (owner only)
// ---------------------------------------------------------------------------

app.get('/api/staff', requireOwner, (req, res) => {
  res.json(getCustomers().filter(c => c.role === 'owner' || c.role === 'admin').map(publicUser));
});

app.post('/api/staff', requireOwner, (req, res) => {
  const { first, last, email, pass, role, storeId } = req.body;
  if (!email || !String(email).trim()) return res.status(400).json({ error: 'Email is required.' });
  if (!['owner', 'admin'].includes(role)) return res.status(400).json({ error: 'Role must be owner or admin.' });
  if (role === 'admin' && !storeId) return res.status(400).json({ error: 'A store manager must be assigned to a store.' });
  if (storeId && !getStores().some(s => s.id === storeId)) return res.status(400).json({ error: 'That store does not exist.' });

  const customers = getCustomers();
  if (customers.some(x => x.email.toLowerCase() === String(email).trim().toLowerCase())) {
    return res.status(400).json({ error: 'An account with that email already exists.' });
  }

  const staff = {
    id: 'staff-' + Date.now().toString(36),
    first: first || '', last: last || '',
    email: String(email).trim(),
    pass: pass || 'liberty123',
    role,
    storeId: role === 'admin' ? storeId : null,
    status: 'active',
    joined: new Date().toISOString().slice(0, 10),
    orders: 0
  };
  customers.push(staff);
  saveCustomers(customers);
  res.json(publicUser(staff));
});

app.patch('/api/staff/:id', requireOwner, (req, res) => {
  const { role, storeId, status, first, last } = req.body;
  if (role && !['owner', 'admin'].includes(role)) return res.status(400).json({ error: 'Role must be owner or admin.' });

  let updated = null;
  const list = getCustomers().map(c => {
    if (c.id !== req.params.id) return c;
    const nextRole = role || c.role;
    updated = {
      ...c,
      ...(first !== undefined && { first }),
      ...(last !== undefined && { last }),
      ...(status !== undefined && { status }),
      role: nextRole,
      storeId: nextRole === 'admin' ? (storeId !== undefined ? storeId : c.storeId) : null
    };
    return updated;
  });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  if (updated.role === 'admin' && !updated.storeId) return res.status(400).json({ error: 'A store manager must be assigned to a store.' });

  // Don't let the last active owner lock everyone out.
  const owners = list.filter(c => c.role === 'owner' && c.status === 'active');
  if (owners.length === 0) return res.status(400).json({ error: 'There must be at least one active owner.' });

  saveCustomers(list);
  res.json(publicUser(updated));
});

app.delete('/api/staff/:id', requireOwner, (req, res) => {
  if (req.params.id === req.currentUser.id) return res.status(400).json({ error: "You can't delete your own account." });
  const list = getCustomers().filter(c => c.id !== req.params.id);
  if (!list.some(c => c.role === 'owner' && c.status === 'active')) {
    return res.status(400).json({ error: 'There must be at least one active owner.' });
  }
  saveCustomers(list);
  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// CUSTOMERS — staff can view, owner can modify
// ---------------------------------------------------------------------------

app.get('/api/customers', requireStaff, (req, res) => {
  res.json(getCustomers().filter(c => c.role === 'customer').map(publicUser));
});

app.patch('/api/customers/:id', requireOwner, (req, res) => {
  let updated = null;
  const list = getCustomers().map(c => {
    if (c.id === req.params.id) { updated = { ...c, ...req.body, role: c.role }; return updated; }
    return c;
  });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  saveCustomers(list);
  res.json(publicUser(updated));
});

app.post('/api/customers/:id/reset', requireOwner, (req, res) => {
  let found = false;
  const list = getCustomers().map(c => {
    if (c.id === req.params.id) { found = true; return { ...c, pass: 'liberty123' }; }
    return c;
  });
  if (!found) return res.status(404).json({ error: 'Not found' });
  saveCustomers(list);
  res.json({ newPassword: 'liberty123' });
});

app.delete('/api/customers/:id', requireOwner, (req, res) => {
  saveCustomers(getCustomers().filter(c => c.id !== req.params.id));
  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// SALES — shared billing core
// Both the website checkout and the in-store point of sale run through
// `recordSale`, so a walk-in purchase and an online order hit inventory the
// exact same way. Anything sold at the counter drops off the website's
// available stock immediately, and vice versa.
// ---------------------------------------------------------------------------

const recordSale = ({ items, storeId, channel, ship = false, customer, soldBy, payment, allowBackorder }) => {
  const stores = getStores();
  const store = stores.find(s => s.id === storeId) || null;
  const inventory = getInventory();

  // In-store sales can never oversell — you cannot hand over a product that
  // isn't on the shelf. Online orders may backorder the shortfall.
  if (!allowBackorder) {
    const short = [];
    for (const it of items) {
      const prod = inventory.find(p => p.id === it.id);
      const avail = prod ? (Number(prod.storeStock[storeId]) || 0) : 0;
      if (!prod) short.push(`${it.id} is not in the catalog`);
      else if (avail < it.qty) short.push(`${prod.name}: ${avail} in stock, ${it.qty} requested`);
    }
    if (short.length) return { error: 'Not enough stock at this store — ' + short.join('; ') };
  }

  const lineItems = [];
  const nextInventory = inventory.map(p => {
    const line = items.find(it => it.id === p.id);
    if (!line) return p;
    const storeStock = { ...p.storeStock };
    const avail = Number(storeStock[storeId]) || 0;
    const fulfilledQty = Math.min(avail, line.qty);
    storeStock[storeId] = Math.max(0, avail - fulfilledQty);
    lineItems.push({
      id: p.id,
      name: p.name,
      qty: line.qty,
      fulfilledQty,
      backordered: line.qty - fulfilledQty,
      price: p.priceN,
      lineTotal: +(p.priceN * line.qty).toFixed(2)
    });
    return { ...p, storeStock };
  });

  if (lineItems.length === 0) return { error: 'None of those products are in the catalog.' };
  saveInventory(nextInventory);

  const subtotal = +lineItems.reduce((s, l) => s + l.lineTotal, 0).toFixed(2);
  const shipping = ship ? SHIP_FLAT : 0;
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  const orderId = (channel === 'in-store' ? '#POS-' : '#LOS-') + String(Math.floor(1000 + Math.random() * 9000));
  const invoice = {
    id: nextInvoiceNumber(),
    orderId,
    date: new Date().toISOString(),
    channel,
    storeId,
    storeName: store ? store.name : 'Unassigned',
    fulfillment: channel === 'in-store' ? 'counter' : (ship ? 'ship' : 'pickup'),
    customer: customer || { id: 'guest', name: 'Walk-in customer', email: '' },
    soldBy: soldBy || null,
    payment: payment || (channel === 'in-store' ? 'cash' : 'card'),
    items: lineItems,
    subtotal, shipping, tax, total,
    status: 'paid'
  };

  const invoices = getInvoices();
  invoices.unshift(invoice);
  saveInvoices(invoices);

  const orders = getOrders();
  orders.push({ id: orderId, date: invoice.date, channel, items, ship, total, storeId, customerId: invoice.customer.id, invoiceId: invoice.id });
  saveOrders(orders);

  return { invoice };
};

// Pick a fulfilling store for shipped orders: whichever covers the most units.
const pickFulfillmentStore = (items, stores, inventory) => {
  let best = null, bestScore = -1;
  for (const s of stores) {
    let score = 0;
    for (const it of items) {
      const prod = inventory.find(p => p.id === it.id);
      score += Math.min(prod ? (Number(prod.storeStock[s.id]) || 0) : 0, it.qty);
    }
    if (score > bestScore) { bestScore = score; best = s.id; }
  }
  return best || (stores[0] && stores[0].id) || null;
};

// --- Website checkout ---
app.post('/api/orders', (req, res) => {
  const { items, ship, storeId: requestedStoreId, customer: guestInfo } = req.body;
  const user = getUserFromToken(req);

  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items in order.' });

  const stores = getStores();
  const storeId = requestedStoreId && stores.some(s => s.id === requestedStoreId)
    ? requestedStoreId
    : pickFulfillmentStore(items, stores, getInventory());

  const result = recordSale({
    items, storeId, channel: 'online', ship,
    allowBackorder: true,
    customer: {
      id: user ? user.id : 'guest',
      name: user ? `${user.first} ${user.last}` : (guestInfo && guestInfo.name) || 'Guest',
      email: user ? user.email : (guestInfo && guestInfo.email) || ''
    }
  });
  if (result.error) return res.status(400).json({ error: result.error });

  if (user && user.role === 'customer') {
    saveCustomers(getCustomers().map(c => c.id === user.id ? { ...c, orders: c.orders + 1 } : c));
  }

  const inv = result.invoice;
  res.json({ orderId: inv.orderId, invoiceId: inv.id, invoice: inv, storeId: inv.storeId, storeName: inv.storeName });
});

// --- In-store point of sale ---
// Staff ring up a walk-in sale. Stock leaves that store's shelf right away,
// which is what makes the item disappear from the website when the last one
// is sold over the counter.
app.post('/api/invoices/manual', requireStaff, (req, res) => {
  const { items, storeId: requestedStoreId, customer, payment } = req.body;
  const user = req.currentUser;
  const storeId = isOwner(user) ? requestedStoreId : user.storeId;

  if (!storeId) return res.status(400).json({ error: 'A store is required.' });
  if (!getStores().some(s => s.id === storeId)) return res.status(400).json({ error: 'That store does not exist.' });
  if (!canAccessStore(user, storeId)) return res.status(403).json({ error: 'You can only sell from your own store.' });
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Add at least one item to the sale.' });
  if (items.some(it => !it.id || !(Number(it.qty) > 0))) return res.status(400).json({ error: 'Every line needs a product and a quantity.' });

  const result = recordSale({
    items: items.map(it => ({ id: it.id, qty: Math.max(1, Number(it.qty) || 1) })),
    storeId,
    channel: 'in-store',
    ship: false,
    allowBackorder: false,
    customer: {
      id: 'walk-in',
      name: (customer && customer.name) || 'Walk-in customer',
      email: (customer && customer.email) || '',
      phone: (customer && customer.phone) || ''
    },
    soldBy: `${user.first} ${user.last}`.trim() || user.email,
    payment
  });
  if (result.error) return res.status(400).json({ error: result.error });

  res.json({ invoiceId: result.invoice.id, invoice: result.invoice });
});

// ---------------------------------------------------------------------------
// INVOICES — scoped by role
// ---------------------------------------------------------------------------

app.get('/api/invoices', requireStaff, (req, res) => {
  const allowed = visibleStoreIds(req.currentUser);
  let invoices = getInvoices().filter(i => allowed.includes(i.storeId));
  if (req.query.storeId) invoices = invoices.filter(i => i.storeId === req.query.storeId);
  if (req.query.channel) invoices = invoices.filter(i => i.channel === req.query.channel);
  res.json(invoices);
});

app.get('/api/invoices/:id', (req, res) => {
  const invoice = getInvoices().find(i => i.id === req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Not found' });
  const user = getUserFromToken(req);
  const owns = user && invoice.customer.id === user.id;
  const staffScoped = isStaff(user) && visibleStoreIds(user).includes(invoice.storeId);
  if (!owns && !staffScoped) return res.status(403).json({ error: 'Not authorized' });
  res.json(invoice);
});

// Cross-store reporting for the owner: sales split by store and channel.
app.get('/api/reports/sales', requireStaff, (req, res) => {
  const allowed = visibleStoreIds(req.currentUser);
  const invoices = getInvoices().filter(i => allowed.includes(i.storeId));
  const stores = getStores().filter(s => allowed.includes(s.id));

  const byStore = stores.map(s => {
    const mine = invoices.filter(i => i.storeId === s.id);
    const online = mine.filter(i => i.channel === 'online');
    const inStore = mine.filter(i => i.channel === 'in-store');
    const sum = (arr) => +arr.reduce((t, i) => t + i.total, 0).toFixed(2);
    return {
      storeId: s.id, storeName: s.name,
      invoices: mine.length,
      revenue: sum(mine),
      online: { count: online.length, revenue: sum(online) },
      inStore: { count: inStore.length, revenue: sum(inStore) },
      unitsSold: mine.reduce((t, i) => t + i.items.reduce((n, l) => n + l.fulfilledQty, 0), 0)
    };
  });

  res.json({
    byStore,
    totals: {
      invoices: invoices.length,
      revenue: +invoices.reduce((t, i) => t + i.total, 0).toFixed(2),
      online: invoices.filter(i => i.channel === 'online').length,
      inStore: invoices.filter(i => i.channel === 'in-store').length
    }
  });
});

// ---------------------------------------------------------------------------
// LIGHTSPEED (X-Series) INTEGRATION
// Proxies the retailer's Lightspeed catalog through our own server so the
// personal access token never reaches the browser.
// ---------------------------------------------------------------------------

app.get('/api/lightspeed/status', async (req, res) => {
  try {
    const retailer = await getRetailer();
    res.json({ connected: true, retailer: retailer?.data || retailer });
  } catch (e) {
    res.status(e.status || 500).json({ connected: false, error: e.message });
  }
});

app.get('/api/lightspeed/products', async (req, res) => {
  try {
    const [products, categories] = await Promise.all([getAllActiveProducts(), getCategoryList()]);
    res.json({ products, categories });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

// Records a real, closed sale in the retailer's live Lightspeed account —
// real sales history, real inventory decrement. Prices are re-looked-up
// server-side from the live catalog rather than trusted from the client.
// Only items that match a real Lightspeed product are included; if none do,
// nothing is written and the caller falls back to a local-only order.
app.post('/api/lightspeed/orders', async (req, res) => {
  try {
    const { items, customerName, customerEmail, fulfillment } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ synced: false, error: 'No items provided' });
    }

    const catalog = await getAllActiveProducts();
    const catalogById = new Map(catalog.map(p => [p.id, p]));
    const sellable = items
      .map(it => {
        const product = catalogById.get(it.id);
        if (!product) return null;
        return { id: product.id, qty: Math.max(1, Number(it.qty) || 1), price: product.priceN };
      })
      .filter(Boolean);

    if (sellable.length === 0) {
      return res.status(422).json({ synced: false, error: 'None of these items are in the live Lightspeed catalog' });
    }

    const sale = await createSale({ items: sellable, customerName, customerEmail, fulfillment });
    res.json({ synced: true, saleId: sale.id, skippedCount: items.length - sellable.length });
  } catch (e) {
    res.status(e.status || 500).json({ synced: false, error: e.message, detail: e.body || null });
  }
});

// Products with no photo yet, so the caller can preview scope before
// spending on generation.
app.get('/api/lightspeed/products-missing-images', async (req, res) => {
  try {
    const missing = await getProductsMissingImages();
    res.json({
      count: missing.length,
      sample: missing.slice(0, 20).map(p => ({ id: p.id, name: p.name, cat: p.cat }))
    });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

// Generates a photo (OpenAI) for up to `limit` photo-less products and
// uploads each one onto the real Lightspeed product — same photo then shows
// in-store on the POS and on the website once the catalog cache refreshes.
// Runs sequentially and keeps going past individual failures so one bad
// generation (e.g. blocked prompt) doesn't stop the rest of the batch.
app.post('/api/lightspeed/generate-images', async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.body?.limit) || 12, 1), 100);
    const missing = await getProductsMissingImages();
    const batch = missing.slice(0, limit);

    // A variant (e.g. one trigger model in a "Geissele Trigger" family) can
    // only take a photo on its parent product — Lightspeed rejects uploads
    // aimed at the variant itself. So each family only needs one generated
    // photo; every sibling variant then inherits it automatically.
    const handledFamilies = new Set();
    const results = [];
    for (const product of batch) {
      const targetId = product.variantParentId || product.id;
      if (handledFamilies.has(targetId)) {
        results.push({ id: product.id, name: product.name, status: 'ok', note: 'shares family photo' });
        continue;
      }
      try {
        const buffer = await generateProductImage(product);
        await uploadProductImage(targetId, buffer, `${targetId}.png`);
        handledFamilies.add(targetId);
        results.push({ id: product.id, name: product.name, status: 'ok' });
      } catch (e) {
        results.push({ id: product.id, name: product.name, status: 'error', error: e.message });
      }
    }

    // Best-effort: refresh the cache so new photos show up immediately. A
    // transient failure here shouldn't make an otherwise-successful batch
    // look like a total failure — the 5-minute cache TTL will pick it up.
    await getAllActiveProducts({ force: true }).catch(() => {});

    res.json({
      totalMissing: missing.length,
      attempted: batch.length,
      succeeded: results.filter(r => r.status === 'ok').length,
      failed: results.filter(r => r.status === 'error').length,
      results
    });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

// Catch-all 404 — must stay last. This is a JSON API with no pages of its
// own, so an unmatched route gets a clean error body instead of Express's
// default plain-text "Cannot GET /path" page.
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startAutoImageGenLoop();
});
