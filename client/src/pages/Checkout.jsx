import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { API_BASE } from '../lib/api';

const FIREARM_CATS = ['Used Guns', 'Consignment Guns', 'Pistol', 'AR', 'frame'];
const isFirearm = (cat) => FIREARM_CATS.includes(cat);

export default function Checkout() {
  const { cartItems, fmt, placeOrder, stores, inventory, getStoreQty } = useAppContext();
  const [ship, setShip] = useState(false);
  const [storeId, setStoreId] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [fflDealer, setFflDealer] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [orderNo, setOrderNo] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    if (!storeId && stores.length > 0) setStoreId(stores[0].id);
  }, [stores, storeId]);

  const sub = cartItems.reduce((s, x) => s + x.price * x.qty, 0);
  const shipCost = ship ? 9.95 : 0;
  const tax = sub * 0.0625;
  const total = sub + shipCost + tax;

  const cartHasFirearm = cartItems.some(it => isFirearm(it.cat));
  const needsFfl = ship && cartHasFirearm;
  const fflComplete = !needsFfl || fflDealer.trim();
  const canPlaceOrder = agreedToTerms && fflComplete;

  // For pickup orders, show the shopper how well each store can cover the
  // cart right now so they pick a location that actually has everything.
  const storeShortfall = (store) => cartItems.reduce((short, it) => {
    const product = inventory.find(p => p.id === it.id);
    const qty = product ? getStoreQty(product, store.id) : 0;
    return short + Math.max(0, it.qty - qty);
  }, 0);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || !canPlaceOrder) return;
    const name = document.getElementById('co-name')?.value || '';
    const email = document.getElementById('co-email')?.value || '';
    setOrderError('');
    const data = await placeOrder(ship, { storeId: ship ? undefined : storeId, customer: { name, email } });
    if (data.error) {
      setOrderError(data.error);
      return;
    }
    if (data.orderId) {
      setOrderNo(data.orderId);
      setInvoice(data.invoice || null);
      setConfirmed(true);
      window.scrollTo(0, 0);

      // Best-effort: also record this as a real sale in Lightspeed, so it
      // shows up in the shop's actual POS sales history and decrements real
      // inventory. Never blocks the customer's own order confirmation —
      // items that aren't in the live Lightspeed catalog (e.g. demo/fallback
      // products) are simply skipped server-side.
      fetch(`${API_BASE}/api/lightspeed/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(it => ({ id: it.id, qty: it.qty })),
          customerName: name,
          customerEmail: email,
          fulfillment: ship ? 'ship' : 'pickup'
        })
      }).catch(() => {});
    }
  };

  if (cartItems.length === 0 && !confirmed) {
    return (
      <main className="wrap" style={{ padding: 'clamp(40px,6vw,72px) 0' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', letterSpacing: '-0.02em', margin: 0 }}>Checkout</h1>
        <div style={{ border: '2px solid var(--color-divider)', padding: 'clamp(28px,4vw,48px)', textAlign: 'center', marginTop: '28px', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '22px', margin: 0 }}>Nothing to check out.</p>
          <Link to="/shop" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: '20px', minHeight: '48px' }}>Browse the shop</Link>
        </div>
      </main>
    );
  }

  if (confirmed) {
    return (
      <main className="wrap" style={{ padding: 'clamp(40px,6vw,72px) 0' }}>
        <div style={{ border: '2px solid var(--color-accent)', padding: 'clamp(28px,4vw,48px)', maxWidth: '720px', marginLeft: 'auto', marginRight: 'auto' }}>
          <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: 0 }}>Order confirmed</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(28px,4vw,44px)', margin: '14px 0 0' }}>Thank you.</h1>
          <p style={{ fontSize: '16px', lineHeight: 1.6, margin: '14px 0 0' }}>Order <strong>{orderNo}</strong> is confirmed{invoice ? <> &middot; invoice <strong>{invoice.id}</strong></> : ''}. We'll get in touch to finalize pickup or shipping.</p>
          {needsFfl && (
            <p style={{ fontSize: '14px', lineHeight: 1.6, margin: '14px 0 0', color: 'var(--color-text-muted)' }}>Your firearm will ship to <strong>{fflDealer}</strong> once we confirm the transfer with them &mdash; we'll reach out if anything's needed.</p>
          )}
          {invoice && (
            <div style={{ border: '2px solid var(--color-divider)', padding: '16px 18px', marginTop: '20px', maxWidth: '420px' }}>
              <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 10px' }}>{invoice.fulfillment === 'ship' ? 'Shipping from' : 'Pickup at'} &mdash; {invoice.storeName}</p>
              {invoice.items.map(li => (
                <div key={li.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                  <span>{li.name} &times; {li.qty}{li.backordered > 0 && <span className="tag tag-outline" style={{ marginLeft: '6px' }}>{li.backordered} backordered</span>}</span>
                  <span style={{ fontWeight: 700 }}>{fmt(li.lineTotal)}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--color-divider)', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total</span><span>{fmt(invoice.total)}</span>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '22px' }}>
            <a href="tel:+15084925955" className="btn btn-primary" style={{ textDecoration: 'none', minHeight: '48px' }}>(508) 492-5955</a>
            <Link to="/shop" className="btn btn-ghost" style={{ textDecoration: 'none', minHeight: '48px' }}>Continue shopping</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap" style={{ padding: 'clamp(40px,6vw,72px) 0' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', letterSpacing: '-0.02em', margin: '0 0 28px' }}>Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(24px,4vw,56px)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div>
            <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 14px' }}>Contact</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="field" style={{ marginBottom: 0 }}><label htmlFor="co-name">Full name *</label><input className="input" id="co-name" required style={{ minHeight: '48px' }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="field" style={{ marginBottom: 0 }}><label htmlFor="co-email">Email *</label><input className="input" id="co-email" type="email" required style={{ minHeight: '48px' }} /></div>
                <div className="field" style={{ marginBottom: 0 }}><label htmlFor="co-phone">Phone *</label><input className="input" id="co-phone" type="tel" required style={{ minHeight: '48px' }} /></div>
              </div>
            </div>
          </div>

          <div>
            <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 14px' }}>Fulfillment</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label onClick={() => setShip(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', border: `2px solid ${!ship ? 'var(--color-accent)' : 'var(--color-divider)'}`, cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                <input type="radio" name="fulfill" checked={!ship} onChange={() => setShip(false)} /> Pickup in store
              </label>
              <label onClick={() => setShip(true)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', border: `2px solid ${ship ? 'var(--color-accent)' : 'var(--color-divider)'}`, cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                <input type="radio" name="fulfill" checked={ship} onChange={() => setShip(true)} /> Ship to me
              </label>
            </div>

            {!ship && stores.length > 0 && (
              <div style={{ marginTop: '14px' }}>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label htmlFor="co-store">Pickup location</label>
                  <select className="input" id="co-store" value={storeId} onChange={(e) => setStoreId(e.target.value)} style={{ minHeight: '48px' }}>
                    {stores.map(s => {
                      const short = storeShortfall(s);
                      return <option key={s.id} value={s.id}>{s.name}{short > 0 ? ` — ${short} item${short === 1 ? '' : 's'} short` : ' — fully in stock'}</option>;
                    })}
                  </select>
                </div>
              </div>
            )}

            {ship && (
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="field" style={{ marginBottom: 0 }}><label htmlFor="co-addr">Street address *</label><input className="input" id="co-addr" required style={{ minHeight: '48px' }} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px' }}>
                  <div className="field" style={{ marginBottom: 0 }}><label htmlFor="co-city">City *</label><input className="input" id="co-city" required style={{ minHeight: '48px' }} /></div>
                  <div className="field" style={{ marginBottom: 0 }}><label htmlFor="co-state">State *</label><input className="input" id="co-state" required style={{ minHeight: '48px' }} defaultValue="MA" /></div>
                  <div className="field" style={{ marginBottom: 0 }}><label htmlFor="co-zip">ZIP *</label><input className="input" id="co-zip" required style={{ minHeight: '48px' }} /></div>
                </div>
              </div>
            )}

            {needsFfl && (
              <div style={{ border: '2px solid var(--color-accent)', padding: 'clamp(16px,2.5vw,22px)', marginTop: '14px' }}>
                <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent)', margin: '0 0 10px', fontWeight: 700 }}>FFL transfer required</p>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--color-text-muted)', margin: '0 0 14px' }}>Federal law requires firearms shipped to you to go to a Federal Firearms Licensee (FFL) first &mdash; you'll pick it up there after a background check.</p>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label htmlFor="co-ffl-dealer">FFL dealer name &amp; address *</label>
                  <input className="input" id="co-ffl-dealer" required placeholder="e.g. Norwood Guns & Ammo, 12 Main St, Norwood MA" style={{ minHeight: '48px' }} value={fflDealer} onChange={(e) => setFflDealer(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          <div>
            <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 14px' }}>Payment</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="field"><label htmlFor="co-card">Card number *</label><input className="input" id="co-card" required style={{ minHeight: '48px' }} placeholder="•••• •••• •••• ••••" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="field"><label htmlFor="co-exp">Expiry *</label><input className="input" id="co-exp" required style={{ minHeight: '48px' }} placeholder="MM / YY" /></div>
                <div className="field"><label htmlFor="co-cvv">CVV *</label><input className="input" id="co-cvv" required style={{ minHeight: '48px' }} placeholder="•••" /></div>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: 'color-mix(in srgb, var(--color-text) 60%, transparent)', margin: '10px 0 0' }}>Demo checkout — no real payment is processed.</p>
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} style={{ marginTop: '3px' }} />
            I have read and agree to the website terms and conditions *
          </label>
        </div>

        <div style={{ border: '2px solid var(--color-accent)', padding: 'clamp(20px,3vw,28px)', position: 'sticky', top: '100px' }}>
          <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 14px' }}>Order summary</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
            {cartItems.map(it => (
              <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '14.5px' }}>
                <span>{it.name} &times; {it.qty}</span><span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{fmt(it.price * it.qty)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--color-divider)', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14.5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span style={{ fontWeight: 700 }}>{fmt(sub)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{ship ? 'Shipping (flat)' : 'Pickup in store'}</span><span style={{ fontWeight: 700 }}>{ship ? fmt(9.95) : 'Free'}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax (6.25%)</span><span style={{ fontWeight: 700 }}>{fmt(tax)}</span></div>
          </div>
          <div style={{ borderTop: '2px solid var(--color-divider)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 700 }}>Total</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '22px' }}>{fmt(total)}</span>
          </div>
          <button type="button" onClick={handlePlaceOrder} className="btn btn-primary btn-block" disabled={!canPlaceOrder} style={{ marginTop: '20px', minHeight: '48px' }}>Place order — {fmt(total)}</button>
          {orderError ? (
            <p style={{ fontSize: '12.5px', color: 'var(--color-accent)', margin: '10px 0 0', textAlign: 'center' }}>{orderError}</p>
          ) : !canPlaceOrder && (
            <p style={{ fontSize: '12.5px', color: 'var(--color-accent-700)', margin: '10px 0 0', textAlign: 'center' }}>
              {needsFfl && !fflComplete ? 'Select an FFL dealer first' : 'Agree to the terms to continue'}
            </p>
          )}
        </div>
      </div>
      </div>
    </main>
  );
}
