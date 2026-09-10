import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const eyebrow = { fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: 0 };
const boxed = { border: '2px solid var(--color-divider)' };
const sectionTitle = { fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '22px', margin: '0 0 16px' };
const muted = { color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' };
const ALL = 'all';

const STATUS_LABEL = { 'in-stock': 'In stock', 'low-stock': 'Low stock', 'out-of-stock': 'Out of stock' };
const STATUS_CLASS = { 'in-stock': 'tag tag-neutral', 'low-stock': 'tag tag-accent', 'out-of-stock': 'tag tag-outline' };

const StatusTag = ({ status }) => <span className={STATUS_CLASS[status] || 'tag tag-neutral'}>{STATUS_LABEL[status] || status}</span>;

const KpiCard = ({ value, label, warn }) => (
  <div style={{ ...boxed, padding: '18px 20px' }}>
    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '26px', color: warn ? 'var(--color-accent-700)' : 'var(--color-accent)', margin: 0 }}>{value}</p>
    <p style={{ fontSize: '12.5px', letterSpacing: '0.08em', textTransform: 'uppercase', ...muted, margin: '6px 0 0' }}>{label}</p>
  </div>
);

const Notice = ({ tone = 'error', children }) => children ? (
  <p style={{
    margin: '0 0 14px', padding: '12px 14px', fontSize: '14px', fontWeight: 600,
    border: '2px solid var(--color-accent)',
    color: tone === 'error' ? 'var(--color-accent-700)' : 'inherit',
    background: tone === 'ok' ? 'var(--color-accent-light)' : 'transparent'
  }}>{children}</p>
) : null;

export default function Admin() {
  const {
    user, logout, isOwner, isStaff, homeStoreId,
    inventory, addProduct, deleteProduct, updateProduct,
    stores, addStore, updateStore, deleteStore,
    adjustStoreStock, setStoreStock, transferStock, getStoreQty, storeStatus,
    invoices, fetchInvoices, createManualInvoice,
    staff, fetchStaff, addStaff, updateStaff, deleteStaff,
    customers: demoCustomers, updateCustomer, resetCustomerPassword, deleteCustomer,
    fmt
  } = useAppContext();

  // A store manager is pinned to their own store; the owner can scope to any
  // store or view everything at once.
  const [scope, setScope] = useState(ALL);
  const [tab, setTab] = useState('overview');
  const [customers, setCustomers] = useState([]);
  const [resetIds, setResetIds] = useState(new Set());
  const [err, setErr] = useState('');

  useEffect(() => { if (homeStoreId) setScope(homeStoreId); }, [homeStoreId]);

  const scopedStoreId = isOwner ? (scope === ALL ? null : scope) : homeStoreId;
  const visibleStores = useMemo(
    () => isOwner ? stores : stores.filter(s => s.id === homeStoreId),
    [isOwner, stores, homeStoreId]
  );

  const TABS = useMemo(() => ([
    { id: 'overview', label: 'Overview' },
    ...(isOwner ? [{ id: 'stores', label: 'Stores' }] : []),
    { id: 'inventory', label: 'Inventory' },
    { id: 'pos', label: 'Point of sale' },
    { id: 'invoices', label: 'Invoices' },
    ...(isOwner ? [{ id: 'staff', label: 'Staff' }] : []),
    ...(isOwner ? [{ id: 'customers', label: 'Customers' }] : [])
  ]), [isOwner]);

  useEffect(() => {
    if (!isStaff) return;
    fetchInvoices(scopedStoreId || undefined);
    if (isOwner) {
      fetchStaff();
      setCustomers(demoCustomers);
    }
  }, [isStaff, isOwner, scopedStoreId, demoCustomers, fetchInvoices, fetchStaff]);

  if (!isStaff) {
    return (
      <main className="wrap" style={{ padding: 'clamp(40px,6vw,72px) 0' }}>
        <div style={{ ...boxed, padding: 'clamp(28px,4vw,48px)', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '28px', margin: 0 }}>Staff console</h1>
          <p style={{ fontSize: '15px', margin: '14px 0 0', ...muted }}>Sign in with an owner or store manager account to continue.</p>
          <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: '20px', minHeight: '48px' }}>Sign in</Link>
        </div>
      </main>
    );
  }

  const scopeName = scopedStoreId ? (stores.find(s => s.id === scopedStoreId)?.name || 'Store') : 'All stores';

  // Stock figures respect the current scope: a single store shows that
  // store's shelf, "All stores" shows the company-wide totals.
  const qtyInScope = (p) => scopedStoreId ? getStoreQty(p, scopedStoreId) : (p.stock || 0);
  const statusInScope = (p) => scopedStoreId ? storeStatus(p, scopedStoreId) : p.status;

  const scopedInventory = inventory.map(p => ({ ...p, scopedQty: qtyInScope(p), scopedStatus: statusInScope(p) }));
  const lowStockItems = scopedInventory.filter(p => p.scopedStatus === 'low-stock');
  const outOfStockItems = scopedInventory.filter(p => p.scopedStatus === 'out-of-stock');
  const totalUnits = scopedInventory.reduce((s, p) => s + p.scopedQty, 0);
  const stockValue = scopedInventory.reduce((s, p) => s + p.scopedQty * (p.priceN || 0), 0);
  const revenue = invoices.reduce((s, i) => s + (i.total || 0), 0);
  const inStoreCount = invoices.filter(i => i.channel === 'in-store').length;
  const onlineCount = invoices.filter(i => i.channel === 'online').length;

  const run = async (fn) => { setErr(''); const r = await fn(); if (r && r.error) setErr(r.error); return r; };

  return (
    <main className="wrap" style={{ padding: 'clamp(40px,6vw,72px) 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div>
          <p style={eyebrow}>{isOwner ? 'Owner console' : 'Store console'}</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(26px,4vw,40px)', margin: '8px 0 0' }}>
            {user.first} {user.last}
          </h1>
          <p style={{ fontSize: '14px', margin: '6px 0 0', ...muted }}>
            {isOwner ? 'Full access across every location' : `Managing ${scopeName}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {isOwner && (
            <select className="input" value={scope} onChange={(e) => setScope(e.target.value)} style={{ minHeight: '44px', width: 'auto' }}>
              <option value={ALL}>All stores</option>
              {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          )}
          <button type="button" onClick={logout} className="btn btn-ghost" style={{ minHeight: '44px' }}>Sign out</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 0 24px' }}>
        {TABS.map(t => (
          <button key={t.id} type="button" onClick={() => { setTab(t.id); setErr(''); }}
            className={`btn ${tab === t.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ whiteSpace: 'nowrap', flexShrink: 0, minHeight: '44px' }}>
            {t.label}
          </button>
        ))}
      </div>

      <Notice>{err}</Notice>

      {tab === 'overview' && (
        <>
          <p style={{ ...eyebrow, marginBottom: '12px' }}>Showing &mdash; {scopeName}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '12px', marginBottom: 'clamp(28px,4vw,44px)' }}>
            {isOwner && <KpiCard value={stores.length} label="Stores" />}
            <KpiCard value={inventory.length} label="Products" />
            <KpiCard value={totalUnits} label="Units on hand" />
            <KpiCard value={lowStockItems.length} label="Low stock" warn={lowStockItems.length > 0} />
            <KpiCard value={outOfStockItems.length} label="Out of stock" warn={outOfStockItems.length > 0} />
            <KpiCard value={fmt(stockValue)} label="Stock value" />
            <KpiCard value={invoices.length} label="Invoices" />
            <KpiCard value={fmt(revenue)} label="Revenue" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '12px', marginBottom: 'clamp(28px,4vw,44px)' }}>
            <div style={{ ...boxed, padding: '16px 18px' }}>
              <p style={{ fontWeight: 700, margin: 0 }}>Counter sales</p>
              <p style={{ fontSize: '13.5px', margin: '4px 0 0', ...muted }}>{inStoreCount} invoice{inStoreCount === 1 ? '' : 's'} rung up in store</p>
            </div>
            <div style={{ ...boxed, padding: '16px 18px' }}>
              <p style={{ fontWeight: 700, margin: 0 }}>Website orders</p>
              <p style={{ fontSize: '13.5px', margin: '4px 0 0', ...muted }}>{onlineCount} order{onlineCount === 1 ? '' : 's'} placed online</p>
            </div>
          </div>

          {outOfStockItems.length > 0 && (
            <div style={{ border: '2px solid var(--color-accent)', background: 'var(--color-accent-light)', padding: '16px 18px', marginBottom: '28px' }}>
              <p style={{ fontWeight: 700, margin: 0 }}>{outOfStockItems.length} item{outOfStockItems.length === 1 ? '' : 's'} out of stock at {scopeName.toLowerCase()}.</p>
              <p style={{ fontSize: '14px', margin: '6px 0 0' }}>{outOfStockItems.map(p => p.name).join(', ')}</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 'clamp(24px,4vw,40px)' }}>
            <section>
              <h2 style={sectionTitle}>{isOwner ? 'Store snapshot' : 'Your store'}</h2>
              <div style={{ overflowX: 'auto' }}>
                <table className="table" style={{ width: '100%', minWidth: '440px' }}>
                  <thead><tr><th>Store</th><th>Units</th><th>Low</th><th>Out</th><th>Value</th></tr></thead>
                  <tbody>
                    {visibleStores.map(s => (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 700 }}>{s.name}</td>
                        <td>{s.stats?.totalUnits ?? 0}</td>
                        <td>{s.stats?.lowStock ?? 0}</td>
                        <td>{s.stats?.outOfStock ?? 0}</td>
                        <td>{fmt(s.stats?.stockValue ?? 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section>
              <h2 style={sectionTitle}>Recent invoices</h2>
              {invoices.length === 0 ? <p style={muted}>No invoices yet — they're generated automatically for both website orders and counter sales.</p> : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="table" style={{ width: '100%', minWidth: '440px' }}>
                    <thead><tr><th>Invoice</th><th>Channel</th><th>Store</th><th>Total</th></tr></thead>
                    <tbody>
                      {invoices.slice(0, 6).map(inv => (
                        <tr key={inv.id}>
                          <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{inv.id}</td>
                          <td><span className={inv.channel === 'in-store' ? 'tag tag-accent' : 'tag tag-neutral'}>{inv.channel === 'in-store' ? 'In store' : 'Online'}</span></td>
                          <td>{inv.storeName}</td>
                          <td style={{ fontWeight: 700 }}>{fmt(inv.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </>
      )}

      {tab === 'stores' && <StoresTab {...{ stores, addStore, updateStore, deleteStore, fmt, run }} />}

      {tab === 'inventory' && (
        <InventoryTab {...{
          scopedInventory, stores, visibleStores, scopedStoreId, scopeName, isOwner,
          addProduct, deleteProduct, updateProduct, adjustStoreStock, setStoreStock, transferStock, fmt, run
        }} />
      )}

      {tab === 'pos' && (
        <PosTab {...{ inventory, stores, scopedStoreId, isOwner, homeStoreId, getStoreQty, createManualInvoice, fmt, setErr }} />
      )}

      {tab === 'invoices' && <InvoicesTab {...{ invoices, fmt }} />}

      {tab === 'staff' && <StaffTab {...{ staff, stores, addStaff, updateStaff, deleteStaff, user, run }} />}

      {tab === 'customers' && (
        <CustomersTab {...{ customers, setCustomers, resetIds, setResetIds, updateCustomer, resetCustomerPassword, deleteCustomer }} />
      )}
    </main>
  );
}

/* ------------------------------------------------------------------ Stores */

function StoresTab({ stores, addStore, updateStore, deleteStore, fmt, run }) {
  const submit = (e) => {
    e.preventDefault();
    const f = e.target.elements;
    run(() => addStore({ name: f['ns-name'].value.trim(), address: f['ns-address'].value.trim(), phone: f['ns-phone'].value.trim(), hours: f['ns-hours'].value.trim() }));
    e.target.reset();
  };

  return (
    <section>
      <h2 style={sectionTitle}>Stores</h2>
      <form onSubmit={submit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '20px', padding: '16px 18px', ...boxed }}>
        <div className="field" style={{ flex: '1 1 160px' }}><label htmlFor="ns-name">Store name</label><input className="input" id="ns-name" name="ns-name" required style={{ minHeight: '44px' }} /></div>
        <div className="field" style={{ flex: '2 1 220px' }}><label htmlFor="ns-address">Address</label><input className="input" id="ns-address" name="ns-address" style={{ minHeight: '44px' }} /></div>
        <div className="field" style={{ flex: '1 1 140px' }}><label htmlFor="ns-phone">Phone</label><input className="input" id="ns-phone" name="ns-phone" style={{ minHeight: '44px' }} /></div>
        <div className="field" style={{ flex: '1 1 180px' }}><label htmlFor="ns-hours">Hours</label><input className="input" id="ns-hours" name="ns-hours" placeholder="Mon-Fri 10am-6pm" style={{ minHeight: '44px' }} /></div>
        <button type="submit" className="btn btn-primary" style={{ minHeight: '44px' }}>Add store</button>
      </form>
      <div style={{ overflowX: 'auto' }}>
        <table className="table" style={{ width: '100%', minWidth: '820px' }}>
          <thead><tr><th>Store</th><th>Address</th><th>Phone</th><th>Products</th><th>Units</th><th>Low</th><th>Out</th><th>Value</th><th></th></tr></thead>
          <tbody>
            {stores.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{s.name}</td>
                <td><input className="input" defaultValue={s.address} onBlur={(e) => e.target.value !== s.address && run(() => updateStore(s.id, { address: e.target.value }))} style={{ minHeight: '40px', minWidth: '200px' }} /></td>
                <td><input className="input" defaultValue={s.phone} onBlur={(e) => e.target.value !== s.phone && run(() => updateStore(s.id, { phone: e.target.value }))} style={{ minHeight: '40px', width: '140px' }} /></td>
                <td>{s.stats?.products ?? 0} / {s.stats?.totalProducts ?? 0}</td>
                <td>{s.stats?.totalUnits ?? 0}</td>
                <td>{s.stats?.lowStock ?? 0}</td>
                <td>{s.stats?.outOfStock ?? 0}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{fmt(s.stats?.stockValue ?? 0)}</td>
                <td><button type="button" onClick={() => { if (confirm(`Delete "${s.name}"? Its stock column is removed from every product and its manager is unassigned.`)) run(() => deleteStore(s.id)); }} className="btn btn-ghost" style={{ minHeight: '40px', padding: '6px 12px', fontSize: '13px', color: 'var(--color-accent-700)' }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: '13.5px', margin: '14px 0 0', ...muted }}>Adding a store adds a stock column to every product automatically; deleting one removes it everywhere.</p>
    </section>
  );
}

/* --------------------------------------------------------------- Inventory */

function InventoryTab({ scopedInventory, stores, visibleStores, scopedStoreId, scopeName, isOwner, addProduct, deleteProduct, updateProduct, adjustStoreStock, setStoreStock, transferStock, fmt, run }) {
  const [filter, setFilter] = useState('all');
  const [transferFor, setTransferFor] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    const f = e.target.elements;
    const storeStock = {};
    stores.forEach(s => { storeStock[s.id] = Number(f['np-stock-' + s.id]?.value) || 0; });
    run(() => addProduct({ name: f['np-name'].value.trim(), cat: f['np-cat'].value, priceN: f['np-price'].value, storeStock }));
    e.target.reset();
  };

  const shown = scopedInventory.filter(p => filter === 'all' || p.scopedStatus === filter);

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <h2 style={{ ...sectionTitle, margin: 0 }}>Inventory &mdash; {scopeName}</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[['all', 'All'], ['in-stock', 'In stock'], ['low-stock', 'Low'], ['out-of-stock', 'Out']].map(([v, label]) => (
            <button key={v} type="button" onClick={() => setFilter(v)} className={`btn ${filter === v ? 'btn-primary' : 'btn-secondary'}`} style={{ minHeight: '40px', padding: '6px 14px', fontSize: '13px' }}>{label}</button>
          ))}
        </div>
      </div>

      {isOwner && (
        <form onSubmit={submit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '20px', padding: '16px 18px', ...boxed }}>
          <div className="field" style={{ flex: '2 1 180px' }}><label htmlFor="np-name">Product name</label><input className="input" id="np-name" name="np-name" required style={{ minHeight: '44px' }} /></div>
          <div className="field" style={{ flex: '1 1 130px' }}>
            <label htmlFor="np-cat">Category</label>
            <select className="input" id="np-cat" name="np-cat" style={{ minHeight: '44px' }}>
              <option>Red Dots</option><option>Weapon Lights</option><option>AR Accessories</option><option>Upper Receivers</option><option>Used Guns</option>
            </select>
          </div>
          <div className="field" style={{ flex: '0 1 100px' }}><label htmlFor="np-price">Price</label><input className="input" id="np-price" name="np-price" type="number" step="0.01" min="0" required style={{ minHeight: '44px' }} /></div>
          {stores.map(s => (
            <div className="field" key={s.id} style={{ flex: '0 1 100px' }}>
              <label htmlFor={'np-stock-' + s.id}>{s.name}</label>
              <input className="input" id={'np-stock-' + s.id} name={'np-stock-' + s.id} type="number" min="0" defaultValue={0} style={{ minHeight: '44px' }} />
            </div>
          ))}
          <button type="submit" className="btn btn-primary" style={{ minHeight: '44px' }}>Add product</button>
        </form>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table className="table" style={{ width: '100%', minWidth: scopedStoreId ? '720px' : (560 + visibleStores.length * 130) + 'px' }}>
          <thead>
            <tr>
              <th>Product</th><th>Category</th><th>Price</th>
              {scopedStoreId
                ? <th>On hand</th>
                : visibleStores.map(s => <th key={s.id}>{s.name}</th>)}
              {!scopedStoreId && <th>Total</th>}
              <th>Status</th>
              {isOwner && <th></th>}
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 ? (
              <tr><td colSpan={12} style={{ ...muted }}>Nothing matches this filter.</td></tr>
            ) : shown.map(p => (
              <React.Fragment key={p.id}>
                <tr>
                  <td style={{ fontWeight: 700 }}>{p.name}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{p.cat}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {isOwner ? (
                      <input className="input" type="number" step="0.01" min="0" defaultValue={p.priceN}
                        onBlur={(e) => run(() => updateProduct(p.id, { priceN: Math.max(0, Number(e.target.value) || 0) }))}
                        style={{ width: '96px', minHeight: '40px', padding: '4px 8px' }} />
                    ) : fmt(p.priceN)}
                  </td>

                  {scopedStoreId ? (
                    <td><StockStepper productId={p.id} storeId={scopedStoreId} qty={p.scopedQty} {...{ adjustStoreStock, setStoreStock, run }} /></td>
                  ) : visibleStores.map(s => (
                    <td key={s.id}><StockStepper productId={p.id} storeId={s.id} qty={(p.storeStock && p.storeStock[s.id]) || 0} {...{ adjustStoreStock, setStoreStock, run }} /></td>
                  ))}

                  {!scopedStoreId && <td style={{ fontWeight: 700, textAlign: 'center' }}>{p.stock}</td>}
                  <td><StatusTag status={p.scopedStatus} /></td>
                  {isOwner && (
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button type="button" onClick={() => setTransferFor(transferFor === p.id ? null : p.id)} className="btn btn-ghost" style={{ minHeight: '40px', padding: '6px 10px', fontSize: '13px' }}>Move</button>
                      <button type="button" onClick={() => { if (confirm('Delete this product from the catalog?')) run(() => deleteProduct(p.id)); }} className="btn btn-ghost" style={{ minHeight: '40px', padding: '6px 10px', fontSize: '13px', color: 'var(--color-accent-700)' }}>Delete</button>
                    </td>
                  )}
                </tr>
                {transferFor === p.id && (
                  <tr>
                    <td colSpan={12} style={{ background: 'var(--color-surface)' }}>
                      <TransferRow product={p} stores={stores} onDone={() => setTransferFor(null)} {...{ transferStock, run }} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: '13.5px', margin: '14px 0 0', ...muted }}>
        Stock saves instantly and recomputes status — in stock, low stock (&le;3 units) or out of stock (0 units). Anything that hits zero everywhere drops off the website automatically.
      </p>
    </section>
  );
}

function StockStepper({ productId, storeId, qty, adjustStoreStock, setStoreStock, run }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <button type="button" onClick={() => run(() => adjustStoreStock(productId, storeId, -1))} className="btn btn-secondary" style={{ minHeight: '36px', width: '32px', padding: 0, justifyContent: 'center' }}>&minus;</button>
      <input className="input" type="number" min="0" value={qty} readOnly
        onDoubleClick={(e) => e.target.readOnly = false}
        onBlur={(e) => { e.target.readOnly = true; const v = Math.max(0, Number(e.target.value) || 0); if (v !== qty) run(() => setStoreStock(productId, storeId, v)); }}
        style={{ width: '54px', minHeight: '36px', padding: '4px 6px', textAlign: 'center' }} />
      <button type="button" onClick={() => run(() => adjustStoreStock(productId, storeId, 1))} className="btn btn-secondary" style={{ minHeight: '36px', width: '32px', padding: 0, justifyContent: 'center' }}>+</button>
    </div>
  );
}

function TransferRow({ product, stores, transferStock, run, onDone }) {
  const withStock = stores.filter(s => (product.storeStock?.[s.id] || 0) > 0);
  const [from, setFrom] = useState(withStock[0]?.id || stores[0]?.id || '');
  const [to, setTo] = useState(stores.find(s => s.id !== from)?.id || '');
  const [qty, setQty] = useState(1);

  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end', padding: '12px 4px' }}>
      <div className="field" style={{ marginBottom: 0 }}>
        <label>Move from</label>
        <select className="input" value={from} onChange={(e) => setFrom(e.target.value)} style={{ minHeight: '40px' }}>
          {stores.map(s => <option key={s.id} value={s.id}>{s.name} ({product.storeStock?.[s.id] || 0})</option>)}
        </select>
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label>To</label>
        <select className="input" value={to} onChange={(e) => setTo(e.target.value)} style={{ minHeight: '40px' }}>
          {stores.filter(s => s.id !== from).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label>Qty</label>
        <input className="input" type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} style={{ width: '80px', minHeight: '40px' }} />
      </div>
      <button type="button" className="btn btn-primary" style={{ minHeight: '40px' }}
        onClick={async () => { const r = await run(() => transferStock(product.id, from, to, Number(qty))); if (!r?.error) onDone(); }}>
        Transfer
      </button>
      <button type="button" className="btn btn-ghost" style={{ minHeight: '40px' }} onClick={onDone}>Cancel</button>
    </div>
  );
}

/* ------------------------------------------------------------ Point of sale */

function PosTab({ inventory, stores, scopedStoreId, isOwner, homeStoreId, getStoreQty, createManualInvoice, fmt, setErr }) {
  const firstStore = scopedStoreId || homeStoreId || stores[0]?.id || '';
  const [sellStore, setSellStore] = useState(firstStore);
  const [lines, setLines] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setSellStore(scopedStoreId || homeStoreId || stores[0]?.id || ''); }, [scopedStoreId, homeStoreId, stores]);
  useEffect(() => { setLines([]); }, [sellStore]);

  const sellable = inventory.filter(p => getStoreQty(p, sellStore) > 0);
  const available = (id) => { const p = inventory.find(x => x.id === id); return p ? getStoreQty(p, sellStore) : 0; };

  const addLine = (id) => {
    if (!id) return;
    setLines(prev => prev.some(l => l.id === id)
      ? prev.map(l => l.id === id ? { ...l, qty: Math.min(available(id), l.qty + 1) } : l)
      : [...prev, { id, qty: 1 }]);
  };
  const setQty = (id, qty) => setLines(prev => prev.map(l => l.id === id ? { ...l, qty: Math.max(1, Math.min(available(id), qty)) } : l));
  const removeLine = (id) => setLines(prev => prev.filter(l => l.id !== id));

  const detailed = lines.map(l => {
    const p = inventory.find(x => x.id === l.id);
    return { ...l, name: p?.name || l.id, price: p?.priceN || 0, lineTotal: (p?.priceN || 0) * l.qty, avail: available(l.id) };
  });
  const sub = detailed.reduce((s, l) => s + l.lineTotal, 0);
  const tax = sub * 0.0625;
  const total = sub + tax;

  const submit = async (e) => {
    e.preventDefault();
    const f = e.target.elements;
    setBusy(true);
    const r = await createManualInvoice({
      items: lines,
      storeId: sellStore,
      payment: f['pos-payment'].value,
      customer: { name: f['pos-name'].value.trim(), email: f['pos-email'].value.trim(), phone: f['pos-phone'].value.trim() }
    });
    setBusy(false);
    if (r.error) { setErr(r.error); return; }
    setErr('');
    setReceipt(r.invoice);
    setLines([]);
    e.target.reset();
  };

  if (receipt) {
    return (
      <section>
        <div style={{ border: '2px solid var(--color-accent)', padding: 'clamp(22px,3vw,34px)', maxWidth: '560px' }}>
          <p style={eyebrow}>Sale complete &middot; stock updated</p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '26px', margin: '12px 0 0' }}>Invoice {receipt.id}</h2>
          <p style={{ fontSize: '14px', margin: '6px 0 16px', ...muted }}>
            {receipt.storeName} &middot; {new Date(receipt.date).toLocaleString()} &middot; sold by {receipt.soldBy} &middot; {receipt.payment}
          </p>
          <table className="table" style={{ width: '100%' }}>
            <thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Total</th></tr></thead>
            <tbody>
              {receipt.items.map(li => (
                <tr key={li.id}><td>{li.name}</td><td>{li.qty}</td><td>{fmt(li.price)}</td><td>{fmt(li.lineTotal)}</td></tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '14.5px', marginTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>{fmt(receipt.subtotal)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax</span><span>{fmt(receipt.tax)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '18px', borderTop: '2px solid var(--color-divider)', paddingTop: '8px' }}><span>Total</span><span>{fmt(receipt.total)}</span></div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
            <button type="button" onClick={() => window.print()} className="btn btn-secondary" style={{ minHeight: '46px' }}>Print</button>
            <button type="button" onClick={() => setReceipt(null)} className="btn btn-primary" style={{ minHeight: '46px' }}>New sale</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 style={sectionTitle}>Point of sale</h2>
      <p style={{ fontSize: '14px', margin: '0 0 18px', maxWidth: '62ch', ...muted }}>
        Ring up a walk-in customer. The units come off this store's shelf the moment you generate the invoice, so anything sold here stops showing as available on the website.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(20px,3vw,36px)', alignItems: 'start' }}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isOwner && (
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="pos-store">Selling from</label>
              <select className="input" id="pos-store" value={sellStore} onChange={(e) => setSellStore(e.target.value)} style={{ minHeight: '46px' }}>
                {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}

          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="pos-pick">Add product</label>
            <select className="input" id="pos-pick" value="" onChange={(e) => addLine(e.target.value)} style={{ minHeight: '46px' }}>
              <option value="">Choose a product in stock here…</option>
              {sellable.map(p => (
                <option key={p.id} value={p.id}>{p.name} — {fmt(p.priceN)} ({getStoreQty(p, sellStore)} on hand)</option>
              ))}
            </select>
            {sellable.length === 0 && <p style={{ fontSize: '13px', margin: '8px 0 0', ...muted }}>Nothing is in stock at this location.</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="field" style={{ marginBottom: 0 }}><label htmlFor="pos-name">Customer name</label><input className="input" id="pos-name" placeholder="Walk-in customer" style={{ minHeight: '46px' }} /></div>
            <div className="field" style={{ marginBottom: 0 }}><label htmlFor="pos-phone">Phone</label><input className="input" id="pos-phone" style={{ minHeight: '46px' }} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="field" style={{ marginBottom: 0 }}><label htmlFor="pos-email">Email</label><input className="input" id="pos-email" type="email" style={{ minHeight: '46px' }} /></div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="pos-payment">Payment</label>
              <select className="input" id="pos-payment" style={{ minHeight: '46px' }}><option value="cash">Cash</option><option value="card">Card</option><option value="check">Check</option></select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={lines.length === 0 || busy} style={{ minHeight: '48px' }}>
            {busy ? 'Generating…' : `Generate invoice — ${fmt(total)}`}
          </button>
        </form>

        <div style={{ ...boxed, borderColor: 'var(--color-accent)', padding: 'clamp(18px,3vw,26px)' }}>
          <p style={eyebrow}>Current ticket</p>
          {detailed.length === 0 ? (
            <p style={{ fontSize: '14.5px', margin: '14px 0 0', ...muted }}>No items yet. Pick a product to start the sale.</p>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '16px 0' }}>
                {detailed.map(l => (
                  <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', borderBottom: '1px solid var(--color-divider)', paddingBottom: '10px' }}>
                    <div style={{ flex: '1 1 130px', minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: '14.5px', margin: 0 }}>{l.name}</p>
                      <p style={{ fontSize: '12.5px', margin: '2px 0 0', ...muted }}>{fmt(l.price)} each &middot; {l.avail} on hand</p>
                    </div>
                    <div className="qty-stepper">
                      <button type="button" onClick={() => setQty(l.id, l.qty - 1)} style={{ width: '36px', height: '36px' }}>&minus;</button>
                      <span className="qty-val" style={{ minWidth: '32px', fontSize: '14px' }}>{l.qty}</span>
                      <button type="button" onClick={() => setQty(l.id, l.qty + 1)} disabled={l.qty >= l.avail} style={{ width: '36px', height: '36px' }}>+</button>
                    </div>
                    <span style={{ fontWeight: 700, minWidth: '68px', textAlign: 'right' }}>{fmt(l.lineTotal)}</span>
                    <button type="button" onClick={() => removeLine(l.id)} className="btn btn-ghost" style={{ minHeight: '36px', padding: '4px 8px', fontSize: '12.5px', color: 'var(--color-accent-700)' }}>Remove</button>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span style={{ fontWeight: 700 }}>{fmt(sub)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax (6.25%)</span><span style={{ fontWeight: 700 }}>{fmt(tax)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--color-divider)', paddingTop: '10px', marginTop: '4px' }}>
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '22px' }}>{fmt(total)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Invoices */

function InvoicesTab({ invoices, fmt }) {
  const [channel, setChannel] = useState('all');
  const [openId, setOpenId] = useState(null);
  const shown = invoices.filter(i => channel === 'all' || i.channel === channel);

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <h2 style={{ ...sectionTitle, margin: 0 }}>Invoices</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[['all', 'All'], ['in-store', 'In store'], ['online', 'Online']].map(([v, label]) => (
            <button key={v} type="button" onClick={() => { setChannel(v); setOpenId(null); }} className={`btn ${channel === v ? 'btn-primary' : 'btn-secondary'}`} style={{ minHeight: '40px', padding: '6px 14px', fontSize: '13px' }}>{label}</button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p style={muted}>No invoices here yet. They're generated automatically for website orders and for every counter sale.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', minWidth: '820px' }}>
            <thead><tr><th>Invoice</th><th>Channel</th><th>Date</th><th>Store</th><th>Customer</th><th>Sold by</th><th>Total</th><th></th></tr></thead>
            <tbody>
              {shown.map(inv => (
                <React.Fragment key={inv.id}>
                  <tr>
                    <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{inv.id}</td>
                    <td><span className={inv.channel === 'in-store' ? 'tag tag-accent' : 'tag tag-neutral'}>{inv.channel === 'in-store' ? 'In store' : 'Online'}</span></td>
                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(inv.date).toLocaleString()}</td>
                    <td>{inv.storeName}</td>
                    <td>{inv.customer?.name}</td>
                    <td style={{ ...muted }}>{inv.soldBy || '—'}</td>
                    <td style={{ fontWeight: 700 }}>{fmt(inv.total)}</td>
                    <td><button type="button" onClick={() => setOpenId(openId === inv.id ? null : inv.id)} className="btn btn-ghost" style={{ minHeight: '36px', padding: '6px 12px', fontSize: '13px' }}>{openId === inv.id ? 'Hide' : 'View'}</button></td>
                  </tr>
                  {openId === inv.id && (
                    <tr>
                      <td colSpan={8} style={{ background: 'var(--color-surface)' }}>
                        <div style={{ padding: '12px 4px' }}>
                          <table className="table" style={{ width: '100%', maxWidth: '540px' }}>
                            <thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Line total</th></tr></thead>
                            <tbody>
                              {inv.items.map(li => (
                                <tr key={li.id}>
                                  <td>{li.name}{li.backordered > 0 && <span className="tag tag-outline" style={{ marginLeft: '6px' }}>{li.backordered} backordered</span>}</td>
                                  <td>{li.qty}</td><td>{fmt(li.price)}</td><td>{fmt(li.lineTotal)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', maxWidth: '260px', marginTop: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>{fmt(inv.subtotal)}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span>{fmt(inv.shipping)}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax</span><span>{fmt(inv.tax)}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid var(--color-divider)', paddingTop: '4px' }}><span>Total</span><span>{fmt(inv.total)}</span></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* ----------------------------------------------------------------- Staff */

function StaffTab({ staff, stores, addStaff, updateStaff, deleteStaff, user, run }) {
  const [role, setRole] = useState('admin');

  const submit = (e) => {
    e.preventDefault();
    const f = e.target.elements;
    run(() => addStaff({
      first: f['st-first'].value.trim(), last: f['st-last'].value.trim(),
      email: f['st-email'].value.trim(), pass: f['st-pass'].value || 'liberty123',
      role, storeId: role === 'admin' ? f['st-store'].value : null
    }));
    e.target.reset();
  };

  return (
    <section>
      <h2 style={sectionTitle}>Staff</h2>
      <p style={{ fontSize: '14px', margin: '0 0 18px', maxWidth: '64ch', ...muted }}>
        Owners see and control every store. Store managers only see their own store's inventory, point of sale and invoices.
      </p>

      <form onSubmit={submit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '20px', padding: '16px 18px', ...boxed }}>
        <div className="field" style={{ flex: '1 1 120px' }}><label htmlFor="st-first">First name</label><input className="input" id="st-first" style={{ minHeight: '44px' }} /></div>
        <div className="field" style={{ flex: '1 1 120px' }}><label htmlFor="st-last">Last name</label><input className="input" id="st-last" style={{ minHeight: '44px' }} /></div>
        <div className="field" style={{ flex: '2 1 200px' }}><label htmlFor="st-email">Email</label><input className="input" id="st-email" type="email" required style={{ minHeight: '44px' }} /></div>
        <div className="field" style={{ flex: '1 1 130px' }}><label htmlFor="st-pass">Password</label><input className="input" id="st-pass" placeholder="liberty123" style={{ minHeight: '44px' }} /></div>
        <div className="field" style={{ flex: '1 1 130px' }}>
          <label htmlFor="st-role">Role</label>
          <select className="input" id="st-role" value={role} onChange={(e) => setRole(e.target.value)} style={{ minHeight: '44px' }}>
            <option value="admin">Store manager</option><option value="owner">Owner</option>
          </select>
        </div>
        {role === 'admin' && (
          <div className="field" style={{ flex: '1 1 160px' }}>
            <label htmlFor="st-store">Store</label>
            <select className="input" id="st-store" required style={{ minHeight: '44px' }}>
              {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        )}
        <button type="submit" className="btn btn-primary" style={{ minHeight: '44px' }}>Add staff</button>
      </form>

      <div style={{ overflowX: 'auto' }}>
        <table className="table" style={{ width: '100%', minWidth: '760px' }}>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Store</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {staff.map(m => (
              <tr key={m.id}>
                <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{m.first} {m.last}{m.id === user.id && <span className="tag tag-neutral" style={{ marginLeft: '6px' }}>You</span>}</td>
                <td>{m.email}</td>
                <td><span className={m.role === 'owner' ? 'tag tag-accent' : 'tag tag-neutral'}>{m.role === 'owner' ? 'Owner' : 'Store manager'}</span></td>
                <td>
                  {m.role === 'admin' ? (
                    <select className="input" value={m.storeId || ''} onChange={(e) => run(() => updateStaff(m.id, { storeId: e.target.value }))} style={{ minHeight: '38px', minWidth: '150px' }}>
                      {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  ) : <span style={muted}>All stores</span>}
                </td>
                <td><span className={m.status === 'active' ? 'tag tag-neutral' : 'tag tag-outline'}>{m.status === 'active' ? 'Active' : 'Disabled'}</span></td>
                <td>
                  {m.id !== user.id ? (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button type="button" onClick={() => run(() => updateStaff(m.id, { status: m.status === 'active' ? 'disabled' : 'active' }))} className="btn btn-secondary" style={{ minHeight: '38px', padding: '6px 12px', fontSize: '13px' }}>{m.status === 'active' ? 'Disable' : 'Enable'}</button>
                      <button type="button" onClick={() => run(() => updateStaff(m.id, { role: m.role === 'owner' ? 'admin' : 'owner', storeId: m.role === 'owner' ? (stores[0]?.id) : null }))} className="btn btn-ghost" style={{ minHeight: '38px', padding: '6px 12px', fontSize: '13px' }}>Make {m.role === 'owner' ? 'manager' : 'owner'}</button>
                      <button type="button" onClick={() => { if (confirm('Delete this staff account?')) run(() => deleteStaff(m.id)); }} className="btn btn-ghost" style={{ minHeight: '38px', padding: '6px 12px', fontSize: '13px', color: 'var(--color-accent-700)' }}>Delete</button>
                    </div>
                  ) : <span style={{ fontSize: '13px', ...muted }}>&mdash;</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Customers */

function CustomersTab({ customers, setCustomers, resetIds, setResetIds, updateCustomer, resetCustomerPassword, deleteCustomer }) {
  const toggle = async (c) => {
    const status = c.status === 'active' ? 'disabled' : 'active';
    await updateCustomer(c.id, { status });
    setCustomers(prev => prev.map(x => x.id === c.id ? { ...x, status } : x));
  };
  const reset = async (id) => {
    await resetCustomerPassword(id);
    setResetIds(prev => new Set(prev).add(id));
  };
  const remove = async (id) => {
    if (!confirm('Delete this customer account?')) return;
    await deleteCustomer(id);
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  return (
    <section>
      <h2 style={sectionTitle}>Customer accounts</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="table" style={{ width: '100%', minWidth: '700px' }}>
          <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Orders</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{c.first} {c.last}</td>
                <td>{c.email}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{c.joined}</td>
                <td>{c.orders}</td>
                <td>
                  <span className={c.status === 'active' ? 'tag tag-neutral' : 'tag tag-outline'}>{c.status === 'active' ? 'Active' : 'Disabled'}</span>
                  {resetIds.has(c.id) && <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-accent-700)', marginTop: '4px' }}>Password reset</span>}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => toggle(c)} className="btn btn-secondary" style={{ minHeight: '38px', padding: '6px 12px', fontSize: '13px' }}>{c.status === 'active' ? 'Disable' : 'Enable'}</button>
                    <button type="button" onClick={() => reset(c.id)} className="btn btn-ghost" style={{ minHeight: '38px', padding: '6px 12px', fontSize: '13px' }}>Reset pw</button>
                    <button type="button" onClick={() => remove(c.id)} className="btn btn-ghost" style={{ minHeight: '38px', padding: '6px 12px', fontSize: '13px', color: 'var(--color-accent-700)' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
