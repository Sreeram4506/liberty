// Server-side client for the Lightspeed Retail (X-Series) API.
// The personal token and store domain prefix live only in server/.env —
// never sent to the frontend.

const API_VERSION = '2.0';
// Sale creation lives on the newer dated-version API — the 2.0 surface only
// supports reading sales, not writing them.
const SALES_API_VERSION = '2026-07';

const apiUrl = (version, path) => {
  const prefix = process.env.LIGHTSPEED_DOMAIN_PREFIX;
  if (!prefix) throw new Error('LIGHTSPEED_DOMAIN_PREFIX is not set in server/.env');
  return `https://${prefix}.retail.lightspeed.app/api/${version}${path}`;
};

const doFetch = async (url, options = {}) => {
  const token = process.env.LIGHTSPEED_PERSONAL_TOKEN;
  if (!token) throw new Error('LIGHTSPEED_PERSONAL_TOKEN is not set in server/.env');

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }

  if (!res.ok) {
    const message = (body && body.error) || res.statusText || 'Lightspeed request failed';
    const err = new Error(`Lightspeed API ${res.status}: ${message}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
};

export const lightspeedFetch = (path, options = {}) => doFetch(apiUrl(API_VERSION, path), options);
const lightspeedFetchSalesApi = (path, options = {}) => doFetch(apiUrl(SALES_API_VERSION, path), options);

export const getRetailer = () => lightspeedFetch('/retailer');
export const getOutlets = () => lightspeedFetch('/outlets');
export const getProducts = (params = '') => lightspeedFetch(`/products${params}`);
export const getInventory = (params = '') => lightspeedFetch(`/inventory${params}`);

const slug = (text) => String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Paginate an X-Series list endpoint fully, using its version-cursor scheme.
const fetchAllPages = async (fetchPage, onItem) => {
  let after = '';
  for (let page = 0; page < 20; page++) {
    const query = after ? `?after=${after}` : '';
    const res = await fetchPage(query);
    const items = res.data || [];
    items.forEach(onItem);
    if (items.length === 0 || !res.version?.max) break;
    after = res.version.max;
  }
};

// Stock is tracked per outlet, so a product's sellable quantity is the sum
// across every outlet (this retailer currently has one, but this stays
// correct if more are added).
const fetchStockByProduct = async () => {
  const stockByProduct = new Map();
  await fetchAllPages(getInventory, (inv) => {
    if (inv.deleted_at) return;
    const current = stockByProduct.get(inv.product_id) || 0;
    stockByProduct.set(inv.product_id, current + (Number(inv.inventory_level) || 0));
  });
  return stockByProduct;
};

const normalizeProduct = (p, stockByProduct) => ({
  id: p.id,
  sku: p.sku || '',
  name: p.name,
  priceN: +(Number(p.price_including_tax ?? p.price_excluding_tax ?? 0)).toFixed(2),
  cat: p.product_category?.name || (p.categories && p.categories[0]?.name) || 'Uncategorized',
  brand: p.brand?.name || null,
  image: p.images?.[0]?.sizes?.original || p.images?.[0]?.url || null,
  description: p.description || null,
  stock: stockByProduct.get(p.id) || 0
});

// Fetch every page of active, sellable, retailer-owned products (plus their
// real stock levels) and cache the normalized result in memory for a few
// minutes so we don't hammer the Lightspeed API on every storefront request.
let cache = { at: 0, products: null };
let inFlight = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

const fetchAllProducts = async () => {
  const rawProducts = [];
  const [, stockByProduct] = await Promise.all([
    fetchAllPages(getProducts, (p) => {
      if (p.source === 'USER' && p.active && p.has_inventory) rawProducts.push(p);
    }),
    fetchStockByProduct()
  ]);
  return rawProducts.map(p => normalizeProduct(p, stockByProduct));
};

export const getAllActiveProducts = async ({ force = false } = {}) => {
  if (!force && cache.products && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.products;
  }
  // Coalesce concurrent cold-cache requests (e.g. Header + Shop fetching at
  // once) into a single upstream pagination pass instead of duplicating it.
  if (!inFlight) {
    inFlight = fetchAllProducts()
      .then(products => { cache = { at: Date.now(), products }; return products; })
      .finally(() => { inFlight = null; });
  }
  return inFlight;
};

export const getCategoryList = async () => {
  const products = await getAllActiveProducts();
  const counts = new Map();
  for (const p of products) {
    counts.set(p.cat, (counts.get(p.cat) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: slug(name), count }))
    .sort((a, b) => b.count - a.count);
};

// ---------------------------------------------------------------------------
// REGISTER SALES — writes a real, closed sale into the retailer's live
// Lightspeed account (real sales history, real inventory decrement). Only
// call this when the caller has genuinely opted into that.
// ---------------------------------------------------------------------------

let accountDefaults = null;

const getAccountDefaults = async () => {
  if (accountDefaults) return accountDefaults;
  const [outlets, registers, users, paymentTypes] = await Promise.all([
    lightspeedFetch('/outlets'),
    lightspeedFetch('/registers'),
    lightspeedFetch('/users'),
    lightspeedFetch('/payment_types')
  ]);
  const outlet = outlets.data[0];
  const register = registers.data.find(r => !r.deleted_at && /online/i.test(r.name))
    || registers.data.find(r => !r.deleted_at)
    || registers.data[0];
  const user = users.data.find(u => u.account_type === 'admin') || users.data[0];
  const paymentType = paymentTypes.data.find(p => p.type_id === 171 && !p.deleted_at)
    || paymentTypes.data.find(p => !p.deleted_at)
    || paymentTypes.data[0];

  if (!outlet || !register || !user || !paymentType) {
    throw new Error('Could not resolve outlet/register/user/payment type from Lightspeed account');
  }
  accountDefaults = {
    outletId: outlet.id,
    taxId: outlet.default_tax_id,
    registerId: register.id,
    registerName: register.name,
    userId: user.id,
    paymentTypeId: paymentType.id
  };
  return accountDefaults;
};

const TAX_RATE = 0.0625;

// items: [{ id (real Lightspeed product id), qty, price }]
// Uses the dated 2026-07 Sales API — the schema here (nested source/
// line_items/payments) is unrelated to the flat register_sale_products
// shape from Lightspeed's older, now-superseded sales endpoint.
export const createSale = async ({ items, customerName, customerEmail, fulfillment }) => {
  if (!items.length) throw new Error('No sellable items to record');
  const defaults = await getAccountDefaults();

  const line_items = items.map(it => ({
    product: { id: it.id },
    quantity: it.qty,
    pricing: { price: it.price },
    tax: { id: defaults.taxId, amount: +(it.price * it.qty * TAX_RATE).toFixed(2) }
  }));

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  const noteBits = ['Web order'];
  if (customerName) noteBits.push(customerName);
  if (customerEmail) noteBits.push(customerEmail);
  if (fulfillment) noteBits.push(fulfillment);

  const body = {
    source: {
      author_id: defaults.userId,
      register_id: defaults.registerId,
      type: 'Website'
    },
    state: 'closed',
    note: noteBits.join(' — '),
    line_items,
    payments: [{
      amount: total,
      type: { config_id: defaults.paymentTypeId }
    }]
  };

  const res = await lightspeedFetchSalesApi('/sales', { method: 'POST', body: JSON.stringify(body) });
  return res.data || res;
};
