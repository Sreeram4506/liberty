import React, { useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductsMegaMenu from './ProductsMegaMenu';

export default function Header() {
  const { isStaff, cartCount } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const closeTimer = useRef(null);

  const openShopMenu = () => {
    clearTimeout(closeTimer.current);
    setShopMenuOpen(true);
  };
  const scheduleCloseShopMenu = () => {
    closeTimer.current = setTimeout(() => setShopMenuOpen(false), 150);
  };

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="topbar-inner">
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
            Open today &middot; 100 Access Rd, Suite 215, Norwood MA
          </span>
          <span style={{ display: 'flex', gap: '20px', flexShrink: 0 }}>
            <a href="mailto:sales@los2a.com" style={{ color: 'inherit', whiteSpace: 'nowrap' }}>sales@los2a.com</a>
            <a href="tel:+15084925955" style={{ color: 'var(--color-accent-700)', fontWeight: 600, whiteSpace: 'nowrap' }}>(508) 492-5955</a>
          </span>
        </div>
      </div>
      <div className="header-row">
        <nav aria-label="Main" className="main-nav">
          <div className="nav-item-mega" onMouseEnter={openShopMenu} onMouseLeave={scheduleCloseShopMenu}>
            <NavLink to="/shop" className={({ isActive }) => (isActive || shopMenuOpen ? 'nav-mega-active' : undefined)}>Shop</NavLink>
          </div>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/deals">Deals</NavLink>
          <NavLink to="/guide">Guide</NavLink>
          <NavLink to="/sell-your-guns">Sell to Us</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <Link to="/" className="brand">
          <img src="/images/logo-mark.png" alt="" className="brand-mark" />
          <span>Liberty Ordnance Supply</span>
        </Link>
        <div className="header-actions">
          <Link to={isStaff ? '/admin' : '/login'} aria-label="Account" className="icon-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
          <Link to="/cart" aria-label="Cart" className="icon-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <circle cx="8" cy="21" r="1"></circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
            </svg>
            {!menuOpen && cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <button type="button" aria-label="Menu" className="icon-btn mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {!menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <line x1="5" y1="5" x2="19" y2="19"></line>
                <line x1="19" y1="5" x2="5" y2="19"></line>
              </svg>
            )}
          </button>
        </div>
      </div>
      {shopMenuOpen && (
        <ProductsMegaMenu
          onNavigate={() => setShopMenuOpen(false)}
          onMouseEnter={openShopMenu}
          onMouseLeave={scheduleCloseShopMenu}
        />
      )}
      <div className={`mobile-drawer-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}></div>
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" aria-label="Close Menu" className="icon-btn" onClick={() => setMenuOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <nav aria-label="Mobile" onClick={() => setMenuOpen(false)}>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/services">Services</Link>
          <Link to="/deals">Forever Deals</Link>
          <Link to="/guide">Beginner's Guide</Link>
          <Link to="/sell-your-guns">Sell to Us</Link>
          <Link to="/about">About Us</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/cart">Cart {cartCount > 0 && `(${cartCount})`}</Link>
          <Link to={isStaff ? '/admin' : '/login'}>Account</Link>
        </nav>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          <a href="tel:+15084925955" className="btn btn-primary btn-block" style={{ textDecoration: 'none' }}>Call (508) 492-5955</a>
          <a href="https://maps.google.com/?q=100+Access+Rd+Suite+215+Norwood+MA+02062" className="btn btn-secondary btn-block" style={{ textDecoration: 'none' }}>Get directions</a>
        </div>
        <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: '28px 0 0' }}>
          Open today 10am&ndash;6pm &middot; Norwood, MA
        </p>
      </div>
    </header>
  );
}
