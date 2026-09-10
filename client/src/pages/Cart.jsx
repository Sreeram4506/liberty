import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Cart() {
  const { cartItems, setCartQty, removeFromCart, fmt, subtotal } = useAppContext();
  const n = cartItems.reduce((s, x) => s + x.qty, 0);

  return (
    <main className="wrap">
      <section style={{ padding: 'clamp(32px,5vw,56px) 0 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', letterSpacing: '-0.02em', margin: '0 0 0 -0.058em' }}>
          {n === 0 ? 'Cart' : n + (n === 1 ? ' item' : ' items')}
        </h1>
      </section>

      {cartItems.length === 0 ? (
        <section style={{ padding: '0 0 clamp(44px,6vw,72px)' }}>
          <div style={{ border: '2px solid var(--color-divider)', padding: 'clamp(28px,4vw,48px)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '22px', margin: 0 }}>Your cart is empty.</p>
            <p style={{ fontSize: '15px', color: 'color-mix(in srgb, var(--color-text) 70%, transparent)', margin: '14px 0 0' }}>Find something in the shop and add it here.</p>
            <Link to="/shop" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: '22px', minHeight: '48px' }}>Browse the shop</Link>
          </div>
        </section>
      ) : (
        <section style={{ padding: '0 0 clamp(44px,6vw,72px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(24px,4vw,56px)', alignItems: 'start' }}>
          <div>
            {cartItems.map(it => (
              <div key={it.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', padding: '18px 0', borderBottom: '2px solid var(--color-divider)' }}>
                <div style={{ minWidth: '160px', flex: 1 }}>
                  <p style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: 0 }}>{it.cat}</p>
                  <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '17px', margin: '6px 0 0' }}>{it.name}</p>
                  <p style={{ fontSize: '14px', color: 'color-mix(in srgb, var(--color-text) 70%, transparent)', margin: '4px 0 0' }}>{fmt(it.price)} each</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div className="qty-stepper">
                    <button type="button" onClick={() => setCartQty(it.id, it.qty - 1)} aria-label="Decrease" style={{ width: '44px', height: '44px' }}>&minus;</button>
                    <span className="qty-val" style={{ minWidth: '40px', fontSize: '15px' }}>{it.qty}</span>
                    <button type="button" onClick={() => setCartQty(it.id, it.qty + 1)} aria-label="Increase" style={{ width: '44px', height: '44px' }}>+</button>
                  </div>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '17px', minWidth: '80px', textAlign: 'right' }}>{fmt(it.price * it.qty)}</span>
                  <button type="button" onClick={() => removeFromCart(it.id)} aria-label="Remove item" className="icon-btn" style={{ width: '44px', height: '44px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ border: '2px solid var(--color-accent)', padding: 'clamp(20px,3vw,28px)', position: 'sticky', top: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '22px' }}>{fmt(subtotal)}</span>
            </div>
            <p style={{ fontSize: '13.5px', color: 'color-mix(in srgb, var(--color-text) 70%, transparent)', margin: '12px 0 0' }}>Taxes calculated at checkout.</p>
            <Link to="/checkout" className="btn btn-primary btn-block" style={{ textDecoration: 'none', marginTop: '20px', minHeight: '48px' }}>Checkout — {fmt(subtotal)}</Link>
            <Link to="/shop" className="btn btn-ghost btn-block" style={{ textDecoration: 'none', marginTop: '10px', minHeight: '48px' }}>Continue shopping</Link>
          </div>
        </section>
      )}
    </main>
  );
}
