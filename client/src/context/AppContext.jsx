import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const TAX_RATE = 0.0625;
const SHIP_FLAT = 9.95;
const STORAGE = {
  userId: 'los_demo_user_id',
  inventory: 'los_demo_inventory',
  stores: 'los_demo_stores',
  invoices: 'los_demo_invoices',
  customers: 'los_demo_customers',
  cart: 'los_cart'
};

const seedInventory = [
  { id: 'holosun-507c', name: 'Holosun HS507C X2', cat: 'Red Dots', priceN: 309.99, storeStock: { 'store-norwood': 3, 'store-brockton': 2, 'store-worcester': 1 }, slot: 'p-507c', placeholder: 'Holosun 507C photo' },
  { id: 'romeo5', name: 'Sig Sauer Romeo5', cat: 'Red Dots', priceN: 139.99, storeStock: { 'store-norwood': 5, 'store-brockton': 4, 'store-worcester': 2 }, slot: 'p-romeo5', placeholder: 'Romeo5 photo' },
  { id: 'tlr1-hl', name: 'Streamlight TLR-1 HL', cat: 'Weapon Lights', priceN: 164.99, storeStock: { 'store-norwood': 4, 'store-brockton': 3, 'store-worcester': 1 }, slot: 'p-tlr1', placeholder: 'TLR-1 photo' },
  { id: 'x300u', name: 'Surefire X300 Ultra', cat: 'Weapon Lights', priceN: 329.99, storeStock: { 'store-norwood': 2, 'store-brockton': 1, 'store-worcester': 0 }, slot: 'p-x300', placeholder: 'X300U photo' },
  { id: 'moe-sl', name: 'Magpul MOE SL Stock', cat: 'AR Accessories', priceN: 59.99, storeStock: { 'store-norwood': 6, 'store-brockton': 5, 'store-worcester': 3 }, slot: 'p-moe', placeholder: 'MOE SL photo' },
  { id: 'raptor-lt', name: 'Radian Raptor-LT Charging Handle', cat: 'AR Accessories', priceN: 54.99, storeStock: { 'store-norwood': 4, 'store-brockton': 3, 'store-worcester': 2 }, slot: 'p-raptor', placeholder: 'Raptor-LT photo' },
  { id: 'bcm-upper', name: 'BCM 16" Mid-Length Upper', cat: 'Upper Receivers', priceN: 649.99, storeStock: { 'store-norwood': 1, 'store-brockton': 1, 'store-worcester': 0 }, slot: 'p-bcm', placeholder: 'BCM upper photo' },
  { id: 'glock19-used', name: 'Glock 19 Gen 4', cat: 'Used Guns', priceN: 429.99, storeStock: { 'store-norwood': 1, 'store-brockton': 0, 'store-worcester': 0 }, used: true, condition: 'Very good', slot: 'p-g19', placeholder: 'Glock 19 photo' }
];

const seedStores = [
  { id: 'store-norwood', name: 'Norwood Flagship', address: '100 Access Rd, Suite 215, Norwood MA 02062', phone: '(508) 492-5955', hours: 'Mon-Fri 10am-6pm, Sat 10am-7pm, Sun 10am-3:30pm' },
  { id: 'store-brockton', name: 'Brockton Branch', address: '45 Liberty Ave, Brockton MA 02301', phone: '(508) 555-0142', hours: 'Mon-Fri 10am-6pm, Sat 10am-5pm, Sun Closed' },
  { id: 'store-worcester', name: 'Worcester Outpost', address: '220 Grafton St, Worcester MA 01604', phone: '(508) 555-0198', hours: 'Tue-Sat 10am-6pm, Sun-Mon Closed' }
];

const seedCustomers = [
  { id: 'c1', first: 'Mike', last: 'Sullivan', email: 'mike.sullivan@example.com', pass: 'demo1234', role: 'customer', status: 'active', joined: '2025-11-03', orders: 4 },
  { id: 'c2', first: 'Dana', last: 'Perez', email: 'dana.perez@example.com', pass: 'demo1234', role: 'customer', status: 'active', joined: '2026-01-18', orders: 1 },
  { id: 'c3', first: 'Tom', last: 'Chen', email: 'tom.chen@example.com', pass: 'demo1234', role: 'customer', status: 'disabled', joined: '2026-03-29', orders: 0 },
  { id: 'owner', first: 'Shop', last: 'Owner', email: 'owner@los2a.com', pass: 'liberty', role: 'owner', status: 'active', joined: '2025-01-01', orders: 0 },
  { id: 'admin', first: 'Shop', last: 'Admin', email: 'admin@los2a.com', pass: 'liberty', role: 'admin', storeId: 'store-norwood', status: 'active', joined: '2025-01-01', orders: 0 },
  { id: 'mgr-brockton', first: 'Alice', last: 'Nguyen', email: 'brockton@los2a.com', pass: 'liberty', role: 'admin', storeId: 'store-brockton', status: 'active', joined: '2025-06-02', orders: 0 },
  { id: 'mgr-worcester', first: 'Carl', last: 'Reyes', email: 'worcester@los2a.com', pass: 'liberty', role: 'admin', storeId: 'store-worcester', status: 'active', joined: '2026-04-11', orders: 0 }
];

const readStored = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const publicUser = ({ pass: _pass, ...rest }) => rest;
const money = (n) => +Number(n || 0).toFixed(2);
const statusForQty = (qty) => qty === 0 ? 'out-of-stock' : qty <= 3 ? 'low-stock' : 'in-stock';
const totalStock = (product) => Object.values(product.storeStock || {}).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
const withProductStatus = (product) => {
  const stock = totalStock(product);
  return { ...product, stock, status: statusForQty(stock) };
};

const storesWithStats = (stores, inventory) => stores.map(store => {
  let totalUnits = 0;
  let outOfStock = 0;
  let lowStock = 0;
  let products = 0;
  let stockValue = 0;

  inventory.forEach(product => {
    const qty = (product.storeStock && Number(product.storeStock[store.id])) || 0;
    if (qty > 0) products += 1;
    totalUnits += qty;
    stockValue += qty * (Number(product.priceN) || 0);
    if (qty === 0) outOfStock += 1;
    else if (qty <= 3) lowStock += 1;
  });

  return {
    ...store,
    stats: { totalUnits, outOfStock, lowStock, products, totalProducts: inventory.length, stockValue: money(stockValue) }
  };
});

const makeId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
const slug = (text) => String(text || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const AppProvider = ({ children }) => {
  const [rawInventory, setRawInventory] = useState(() => readStored(STORAGE.inventory, seedInventory));
  const [rawStores, setRawStores] = useState(() => readStored(STORAGE.stores, seedStores));
  const [invoices, setInvoices] = useState(() => readStored(STORAGE.invoices, []));
  const [customers, setCustomers] = useState(() => readStored(STORAGE.customers, seedCustomers));
  const [cartItems, setCartItems] = useState(() => readStored(STORAGE.cart, []));
  const [user, setUser] = useState(null);
  const [visibleInvoices, setVisibleInvoices] = useState([]);

  const inventory = useMemo(() => rawInventory.map(withProductStatus), [rawInventory]);
  const stores = useMemo(() => storesWithStats(rawStores, inventory), [rawStores, inventory]);

  useEffect(() => localStorage.setItem(STORAGE.inventory, JSON.stringify(rawInventory)), [rawInventory]);
  useEffect(() => localStorage.setItem(STORAGE.stores, JSON.stringify(rawStores)), [rawStores]);
  useEffect(() => localStorage.setItem(STORAGE.invoices, JSON.stringify(invoices)), [invoices]);
  useEffect(() => localStorage.setItem(STORAGE.customers, JSON.stringify(customers)), [customers]);
  useEffect(() => localStorage.setItem(STORAGE.cart, JSON.stringify(cartItems)), [cartItems]);

  useEffect(() => {
    const id = localStorage.getItem(STORAGE.userId);
    const active = customers.find(c => c.id === id && c.status === 'active');
    setUser(active ? publicUser(active) : null);
    if (!active) localStorage.removeItem(STORAGE.userId);
  }, [customers]);

  const isOwner = !!user && user.role === 'owner';
  const isStaff = !!user && (user.role === 'owner' || user.role === 'admin');
  const homeStoreId = user && user.role === 'admin' ? user.storeId : null;

  const getStoreQty = (product, storeId) => (product && product.storeStock && Number(product.storeStock[storeId])) || 0;
  const storeStatus = (product, storeId) => statusForQty(getStoreQty(product, storeId));
  const visibleStoreIds = useCallback((currentUser = user) => {
    if (!currentUser) return [];
    if (currentUser.role === 'owner') return rawStores.map(s => s.id);
    if (currentUser.role === 'admin' && currentUser.storeId) return [currentUser.storeId];
    return [];
  }, [rawStores, user]);

  useEffect(() => {
    const allowed = visibleStoreIds();
    setVisibleInvoices(invoices.filter(inv => allowed.includes(inv.storeId)));
  }, [invoices, visibleStoreIds]);

  const fetchInventory = useCallback(async () => inventory, [inventory]);
  const fetchStores = useCallback(async () => stores, [stores]);
  const fetchInvoices = useCallback(async (storeId) => {
    const allowed = visibleStoreIds();
    const next = invoices.filter(inv => allowed.includes(inv.storeId) && (!storeId || inv.storeId === storeId));
    setVisibleInvoices(next);
    return next;
  }, [invoices, visibleStoreIds]);
  const fetchStaff = useCallback(async () => customers.filter(c => c.role === 'owner' || c.role === 'admin').map(publicUser), [customers]);

  const login = async (email, pass) => {
    const account = customers.find(c => c.email.toLowerCase() === String(email).trim().toLowerCase());
    if (!account) return { error: 'No account found with that email.' };
    if (account.pass !== pass) return { error: 'Incorrect password.' };
    if (account.status !== 'active') return { error: 'This account is disabled. Call the shop for help.' };
    localStorage.setItem(STORAGE.userId, account.id);
    const nextUser = publicUser(account);
    setUser(nextUser);
    return { user: nextUser };
  };

  const register = async (first, last, email, pass) => {
    if (customers.some(c => c.email.toLowerCase() === String(email).trim().toLowerCase())) {
      return { error: 'An account with that email already exists.' };
    }
    const account = { id: makeId('c'), first, last, email: String(email).trim(), pass, role: 'customer', status: 'active', joined: new Date().toISOString().slice(0, 10), orders: 0 };
    setCustomers(prev => [...prev, account]);
    localStorage.setItem(STORAGE.userId, account.id);
    const nextUser = publicUser(account);
    setUser(nextUser);
    return { user: nextUser };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE.userId);
    setUser(null);
  };

  const updateProduct = async (id, patch) => {
    const current = rawInventory.find(p => p.id === id);
    if (!current) return { error: 'Product not found.' };
    const updated = { ...current, ...patch, id: current.id, priceN: patch.priceN !== undefined ? Number(patch.priceN) || 0 : current.priceN };
    setRawInventory(prev => prev.map(p => {
      if (p.id !== id) return p;
      return updated;
    }));
    return withProductStatus(updated);
  };

  const addProduct = async (product) => {
    const id = `${slug(product.name)}-${Date.now().toString(36)}`;
    const storeStock = {};
    rawStores.forEach(store => { storeStock[store.id] = Math.max(0, Number(product.storeStock?.[store.id]) || 0); });
    const next = { id, name: product.name, cat: product.cat, priceN: Number(product.priceN) || 0, storeStock, slot: `p-${id}`, placeholder: `${product.name} photo` };
    setRawInventory(prev => [next, ...prev]);
    return withProductStatus(next);
  };

  const deleteProduct = async (id) => {
    setRawInventory(prev => prev.filter(p => p.id !== id));
    setCartItems(prev => prev.filter(p => p.id !== id));
    return { success: true };
  };

  const patchStock = async (id, body) => {
    const currentProduct = rawInventory.find(p => p.id === id);
    if (!currentProduct) return { error: 'Product not found.' };
    const currentQty = Number(currentProduct.storeStock[body.storeId]) || 0;
    const nextQty = body.qty !== undefined ? Number(body.qty) : currentQty + (Number(body.delta) || 0);
    const updated = {
      ...currentProduct,
      storeStock: {
        ...currentProduct.storeStock,
        [body.storeId]: Math.max(0, Number.isFinite(nextQty) ? nextQty : currentQty)
      }
    };
    setRawInventory(prev => prev.map(p => {
      if (p.id !== id) return p;
      return updated;
    }));
    return withProductStatus(updated);
  };

  const adjustStoreStock = (id, storeId, delta) => patchStock(id, { storeId, delta });
  const setStoreStock = (id, storeId, qty) => patchStock(id, { storeId, qty });

  const transferStock = async (id, fromStoreId, toStoreId, qty) => {
    const amount = Math.max(0, Number(qty) || 0);
    if (!fromStoreId || !toStoreId || fromStoreId === toStoreId || amount === 0) return { error: 'Pick two different stores and a quantity.' };
    const product = rawInventory.find(p => p.id === id);
    if (!product) return { error: 'Product not found.' };
    const available = Number(product.storeStock[fromStoreId]) || 0;
    if (available < amount) return { error: `Only ${available} unit(s) available to transfer.` };
    const updated = {
      ...product,
      storeStock: {
        ...product.storeStock,
        [fromStoreId]: available - amount,
        [toStoreId]: (Number(product.storeStock[toStoreId]) || 0) + amount
      }
    };
    setRawInventory(prev => prev.map(p => {
      if (p.id !== id) return p;
      return updated;
    }));
    return withProductStatus(updated);
  };

  const addStore = async (store) => {
    if (!store.name?.trim()) return { error: 'Store name is required.' };
    const id = `store-${slug(store.name)}-${Date.now().toString(36)}`;
    const next = { id, name: store.name.trim(), address: store.address || '', phone: store.phone || '', hours: store.hours || '' };
    setRawStores(prev => [...prev, next]);
    setRawInventory(prev => prev.map(p => ({ ...p, storeStock: { ...p.storeStock, [id]: 0 } })));
    return storesWithStats([next], inventory)[0];
  };

  const updateStore = async (id, patch) => {
    const current = rawStores.find(s => s.id === id);
    if (!current) return { error: 'Store not found.' };
    const updated = { ...current, ...patch, id: current.id };
    setRawStores(prev => prev.map(s => {
      if (s.id !== id) return s;
      return updated;
    }));
    return updated;
  };

  const deleteStore = async (id) => {
    if (rawStores.length <= 1) return { error: 'Keep at least one store in the demo.' };
    setRawStores(prev => prev.filter(s => s.id !== id));
    setRawInventory(prev => prev.map(p => {
      const storeStock = { ...p.storeStock };
      delete storeStock[id];
      return { ...p, storeStock };
    }));
    setCustomers(prev => prev.map(c => c.storeId === id ? { ...c, storeId: null, status: 'disabled' } : c));
    return { success: true };
  };

  const addStaff = async (member) => {
    if (customers.some(c => c.email.toLowerCase() === String(member.email).trim().toLowerCase())) return { error: 'An account with that email already exists.' };
    const staffer = { id: makeId('staff'), first: member.first || '', last: member.last || '', email: String(member.email).trim(), pass: member.pass || 'liberty123', role: member.role, storeId: member.role === 'admin' ? member.storeId : null, status: 'active', joined: new Date().toISOString().slice(0, 10), orders: 0 };
    setCustomers(prev => [...prev, staffer]);
    return publicUser(staffer);
  };

  const updateStaff = async (id, patch) => {
    const current = customers.find(c => c.id === id);
    if (!current) return { error: 'Staff account not found.' };
    const nextRole = patch.role || current.role;
    const updated = { ...current, ...patch, role: nextRole, storeId: nextRole === 'admin' ? (patch.storeId !== undefined ? patch.storeId : current.storeId) : null };
    setCustomers(prev => prev.map(c => {
      if (c.id !== id) return c;
      return updated;
    }));
    return publicUser(updated);
  };

  const deleteStaff = async (id) => {
    if (id === user?.id) return { error: "You can't delete your own account." };
    setCustomers(prev => prev.filter(c => c.id !== id));
    return { success: true };
  };

  const invoiceNumber = () => `INV-${String(invoices.length + 1001).padStart(5, '0')}`;

  const recordSale = ({ items, storeId, channel, ship = false, customer, soldBy, payment, allowBackorder }) => {
    const store = rawStores.find(s => s.id === storeId) || rawStores[0];
    const short = [];
    if (!allowBackorder) {
      items.forEach(item => {
        const product = rawInventory.find(p => p.id === item.id);
        const available = product ? (Number(product.storeStock[store.id]) || 0) : 0;
        if (!product) short.push(`${item.id} is not in the catalog`);
        else if (available < item.qty) short.push(`${product.name}: ${available} in stock, ${item.qty} requested`);
      });
      if (short.length) return { error: `Not enough stock at this store - ${short.join('; ')}` };
    }

    // Line items come from the cart itself (name/price already carried on
    // each cart item) — not every product a shopper can buy lives in this
    // local demo catalog (e.g. items sourced live from Lightspeed), so we
    // can't require a catalog match just to record the sale.
    const lineItems = items.map(item => {
      const product = rawInventory.find(p => p.id === item.id);
      const price = product ? product.priceN : item.price;
      return { id: item.id, name: item.name, qty: item.qty, fulfilledQty: item.qty, backordered: 0, price, lineTotal: money(price * item.qty) };
    });

    // Best-effort: decrement demo-tracked stock for any items that also
    // happen to exist in the local catalog. Real, Lightspeed-sourced items
    // have their own live inventory and aren't tracked here.
    const nextInventory = rawInventory.map(product => {
      const item = items.find(i => i.id === product.id);
      if (!item) return product;
      const storeStock = { ...product.storeStock };
      const available = Number(storeStock[store.id]) || 0;
      storeStock[store.id] = Math.max(0, available - Math.min(available, item.qty));
      return { ...product, storeStock };
    });

    if (lineItems.length === 0) return { error: 'No items in order.' };
    setRawInventory(nextInventory);
    const subtotal = money(lineItems.reduce((sum, item) => sum + item.lineTotal, 0));
    const shipping = ship ? SHIP_FLAT : 0;
    const tax = money(subtotal * TAX_RATE);
    const total = money(subtotal + shipping + tax);
    const invoice = {
      id: invoiceNumber(),
      orderId: `${channel === 'in-store' ? '#POS-' : '#LOS-'}${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      channel,
      storeId: store.id,
      storeName: store.name,
      fulfillment: channel === 'in-store' ? 'counter' : (ship ? 'ship' : 'pickup'),
      customer: customer || { id: 'guest', name: 'Guest', email: '' },
      soldBy: soldBy || null,
      payment: payment || (channel === 'in-store' ? 'cash' : 'card'),
      items: lineItems,
      subtotal,
      shipping,
      tax,
      total,
      status: 'paid'
    };
    setInvoices(prev => [invoice, ...prev]);
    return { invoice };
  };

  const createManualInvoice = async ({ items, storeId, customer, payment }) => {
    const saleStoreId = user?.role === 'admin' ? user.storeId : storeId;
    const result = recordSale({
      items: items.map(item => ({ id: item.id, qty: Math.max(1, Number(item.qty) || 1) })),
      storeId: saleStoreId,
      channel: 'in-store',
      allowBackorder: false,
      customer: { id: 'walk-in', name: customer?.name || 'Walk-in customer', email: customer?.email || '', phone: customer?.phone || '' },
      soldBy: `${user?.first || ''} ${user?.last || ''}`.trim() || user?.email,
      payment
    });
    return result.error ? result : { invoiceId: result.invoice.id, invoice: result.invoice };
  };

  const pickFulfillmentStore = (items) => {
    let best = rawStores[0]?.id;
    let bestScore = -1;
    rawStores.forEach(store => {
      const score = items.reduce((sum, item) => {
        const product = rawInventory.find(p => p.id === item.id);
        return sum + Math.min(product ? Number(product.storeStock[store.id]) || 0 : 0, item.qty);
      }, 0);
      if (score > bestScore) {
        best = store.id;
        bestScore = score;
      }
    });
    return best;
  };

  const placeOrder = async (ship, opts = {}) => {
    if (cartItems.length === 0) return { error: 'No items in order.' };
    const storeId = ship ? pickFulfillmentStore(cartItems) : (opts.storeId || rawStores[0]?.id);
    const result = recordSale({
      items: cartItems,
      storeId,
      channel: 'online',
      ship,
      allowBackorder: true,
      customer: user?.role === 'customer'
        ? { id: user.id, name: `${user.first} ${user.last}`, email: user.email }
        : { id: 'guest', name: opts.customer?.name || 'Guest', email: opts.customer?.email || '' }
    });
    if (result.error) return result;
    if (user?.role === 'customer') setCustomers(prev => prev.map(c => c.id === user.id ? { ...c, orders: c.orders + 1 } : c));
    clearCart();
    return { orderId: result.invoice.orderId, invoiceId: result.invoice.id, invoice: result.invoice, storeId: result.invoice.storeId, storeName: result.invoice.storeName };
  };

  const getCustomersList = async () => customers.filter(c => c.role === 'customer').map(publicUser);
  const updateCustomer = async (id, patch) => {
    const current = customers.find(c => c.id === id);
    if (!current) return { error: 'Customer account not found.' };
    const updated = { ...current, ...patch, role: current.role };
    setCustomers(prev => prev.map(c => {
      if (c.id !== id) return c;
      return updated;
    }));
    return publicUser(updated);
  };
  const resetCustomerPassword = async (id) => updateCustomer(id, { pass: 'liberty123' });
  const deleteCustomer = async (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    return { success: true };
  };

  const addToCart = (item, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(x => x.id === item.id);
      if (existing) return prev.map(x => x.id === item.id ? { ...x, qty: x.qty + qty } : x);
      return [...prev, { id: item.id, name: item.name, cat: item.cat, price: item.priceN || item.price, qty }];
    });
  };
  const setCartQty = (id, qty) => setCartItems(prev => prev.map(x => x.id === id ? { ...x, qty } : x).filter(x => x.qty > 0));
  const removeFromCart = (id) => setCartItems(prev => prev.filter(x => x.id !== id));
  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const fmt = (n) => '$' + Number(n || 0).toFixed(2);
  const staffAccounts = useMemo(() => customers.filter(c => c.role === 'owner' || c.role === 'admin').map(publicUser), [customers]);
  const customerAccounts = useMemo(() => customers.filter(c => c.role === 'customer').map(publicUser), [customers]);

  return (
    <AppContext.Provider value={{
      user, login, register, logout,
      isOwner, isStaff, homeStoreId,
      inventory, updateProduct, addProduct, deleteProduct, fetchInventory,
      stores, addStore, updateStore, deleteStore, fetchStores,
      adjustStoreStock, setStoreStock, transferStock, getStoreQty, storeStatus,
      invoices: visibleInvoices, fetchInvoices, createManualInvoice,
      staff: staffAccounts, fetchStaff, addStaff, updateStaff, deleteStaff,
      customers: customerAccounts, getCustomersList, updateCustomer, resetCustomerPassword, deleteCustomer,
      cartItems, addToCart, setCartQty, removeFromCart, clearCart, cartCount, subtotal, fmt,
      placeOrder,
      API: 'frontend-demo', headers: {}
    }}>
      {children}
    </AppContext.Provider>
  );
};
