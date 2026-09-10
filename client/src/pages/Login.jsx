import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Login() {
  const { user, login, register, logout, isStaff, isOwner } = useAppContext();
  const [mode, setMode] = useState('signin');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements['l-email'].value;
    const pass = e.target.elements['l-pass'].value;
    let r;
    if (mode === 'signin') {
      r = await login(email, pass);
    } else {
      const first = e.target.elements['l-first'].value.trim();
      const last = e.target.elements['l-last'].value.trim();
      r = await register(first, last, email, pass);
    }
    if (r && r.error) setError(r.error);
    else setError('');
  };

  if (user) {
    return (
      <main className="wrap" style={{ padding: 'clamp(40px,6vw,72px) 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '32px 28px', borderBottom: '1px solid var(--color-divider)', textAlign: 'center' }}>
            <span className="tag tag-accent" style={{ marginBottom: '12px' }}>{user.role.toUpperCase()} ACCOUNT</span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '32px', margin: '4px 0 0' }}>Welcome back, {user.first}.</h1>
            <p style={{ fontSize: '14.5px', margin: '8px 0 0', color: 'var(--color-text-muted)' }}>{user.email} &middot; Member since {user.joined}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
            {isStaff && (
              <Link to="/admin" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                <span>{isOwner ? 'Open Super Admin / Owner Console' : 'Open Store Admin Console'}</span>
                <span style={{ color: 'var(--color-accent)' }}>&rarr;</span>
              </Link>
            )}
            <Link to="/shop" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderRadius: 'var(--radius-md)', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>
              <span>Continue Shopping</span>
              <span style={{ color: 'var(--color-accent)' }}>&rarr;</span>
            </Link>
            <Link to="/cart" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderRadius: 'var(--radius-md)', fontWeight: 600, color: 'var(--color-text)', marginBottom: '16px' }}>
              <span>View Cart</span>
              <span style={{ color: 'var(--color-accent)' }}>&rarr;</span>
            </Link>
            <button type="button" onClick={logout} className="btn btn-secondary btn-block">Sign Out</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap" style={{ padding: 'clamp(40px,6vw,72px) 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(32px,4vw,44px)', margin: '0 0 8px' }}>
          {mode === 'signin' ? 'Sign In to Your Account' : 'Create an Account'}
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', margin: 0 }}>Access your orders, saved items, and store console</p>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', background: 'var(--color-surface)', padding: '6px', borderBottom: '1px solid var(--color-divider)' }}>
          <button 
            type="button" 
            onClick={() => { setMode('signin'); setError(''); }} 
            className={`btn ${mode === 'signin' ? 'btn-primary' : 'btn-ghost'}`} 
            style={{ flex: 1, borderRadius: 'var(--radius-md)', minHeight: '44px' }}
          >
            Sign In
          </button>
          <button 
            type="button" 
            onClick={() => { setMode('signup'); setError(''); }} 
            className={`btn ${mode === 'signup' ? 'btn-primary' : 'btn-ghost'}`} 
            style={{ flex: 1, borderRadius: 'var(--radius-md)', minHeight: '44px' }}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px 28px' }}>
          {mode === 'signup' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="field">
                <label htmlFor="l-first">First Name *</label>
                <input className="input" id="l-first" name="l-first" required />
              </div>
              <div className="field">
                <label htmlFor="l-last">Last Name *</label>
                <input className="input" id="l-last" name="l-last" required />
              </div>
            </div>
          )}
          <div className="field">
            <label htmlFor="l-email">Email Address *</label>
            <input className="input" id="l-email" name="l-email" type="email" required placeholder="name@example.com" />
          </div>
          <div className="field">
            <label htmlFor="l-pass">Password *</label>
            <input className="input" id="l-pass" name="l-pass" type="password" required placeholder="••••••••" />
          </div>
          {error && (
            <p style={{ margin: 0, padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-light)', color: 'var(--color-accent-active)', fontSize: '14px', fontWeight: 600 }}>
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '8px' }}>
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', marginTop: '24px', padding: '20px 24px', background: 'var(--color-surface)' }}>
        <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: '0 0 10px' }}>Demo Login Credentials</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
          <div><strong>Super Admin / Owner:</strong> <code>owner@los2a.com</code> &middot; Password: <code>liberty</code></div>
          <div><strong>Store Admin:</strong> <code>admin@los2a.com</code> &middot; Password: <code>liberty</code></div>
          <div><strong>Customer:</strong> <code>mike.sullivan@example.com</code> &middot; Password: <code>demo1234</code></div>
        </div>
      </div>
    </main>
  );
}
