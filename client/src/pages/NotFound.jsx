import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="wrap" style={{ padding: 'clamp(60px,10vw,120px) 0', textAlign: 'center' }}>
      <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: 0 }}>Error 404</p>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(48px,10vw,96px)', letterSpacing: '-0.02em', margin: '14px 0 0', color: 'var(--color-accent)' }}>
        TARGET NOT FOUND
      </h1>
      <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--color-text-muted)', margin: '18px auto 0', maxWidth: '480px' }}>
        That page doesn't exist or may have been moved. Try the shop, or call the counter if you were looking for something specific.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '32px' }}>
        <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none', minHeight: '48px' }}>Back home</Link>
        <Link to="/shop" className="btn btn-ghost" style={{ textDecoration: 'none', minHeight: '48px' }}>Browse the shop</Link>
        <a href="tel:+15084925955" className="btn btn-ghost" style={{ textDecoration: 'none', minHeight: '48px' }}>(508) 492-5955</a>
      </div>
    </main>
  );
}
