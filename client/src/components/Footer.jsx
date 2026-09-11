import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !consent) return;
    setJoined(true);
    setEmail('');
  };

  return (
    <footer className="site-footer" style={{ backgroundImage: 'url("/footer.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', color: '#fff' }}>
      <div className="wrap" style={{ padding: 'clamp(40px,6vw,64px) 0', borderBottom: '1px solid var(--color-divider)', display: 'flex', flexWrap: 'wrap', gap: '24px 48px', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(26px,4vw,40px)', lineHeight: 1.02, margin: 0 }}>Keep up<br />with the shop</h2>
          <p style={{ fontSize: '14px', margin: '10px 0 0', maxWidth: '38ch' }}>Restock alerts, forever deals, and LTC class dates &mdash; no spam.</p>
        </div>
        {joined ? (
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', margin: 0 }}>You're on the list &mdash; thanks!</p>
        ) : (
          <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '260px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="input"
                style={{ flex: '1 1 200px', minHeight: '46px' }}
              />
              <button type="submit" className="btn btn-primary" style={{ minHeight: '46px' }}>Sign up</button>
            </div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.7)', cursor: 'pointer' }}>
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required style={{ marginTop: '2px' }} />
              I consent to receive emails from Liberty Ordnance Supply.
            </label>
          </form>
        )}
      </div>
      <div className="footer-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/images/logo-mark.png" alt="" style={{ width: '30px', height: '30px', flexShrink: 0 }} />
            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>
              Liberty Ordnance<span style={{ color: '#fff' }}> Supply</span>
            </p>
          </div>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.8)', margin: '12px 0 0', maxWidth: '32ch' }}>
            Family-run gun shop in Norwood, MA. Straight answers, fair prices, and coffee that's always on.
          </p>
        </div>
        <div>
          <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', margin: '0 0 12px' }}>Visit</p>
          <p style={{ fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
            100 Access Rd, Suite 215<br />Norwood, MA 02062
          </p>
          <p style={{ fontSize: '14px', lineHeight: 1.7, margin: '12px 0 0' }}>
            Mon&ndash;Fri 10am&ndash;6pm<br />Sat 10am&ndash;7pm &middot; Sun 10am&ndash;3:30pm
          </p>
        </div>
        <div>
          <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', margin: '0 0 12px' }}>Contact</p>
          <p style={{ fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
            <a href="tel:+15084925955" style={{ textDecoration: 'none', fontWeight: 600 }}>(508) 492-5955</a><br />
            <a href="mailto:sales@los2a.com" style={{ textDecoration: 'none' }}>sales@los2a.com</a>
          </p>
        </div>
        <div>
          <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', margin: '0 0 12px' }}>Site</p>
          <nav aria-label="Footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
            <Link to="/shop" style={{ textDecoration: 'none' }}>Shop</Link>
            <Link to="/services" style={{ textDecoration: 'none' }}>Services</Link>
            <Link to="/deals" style={{ textDecoration: 'none' }}>Forever deals</Link>
            <Link to="/guide" style={{ textDecoration: 'none' }}>Beginner's guide</Link>
            <Link to="/sell-your-guns" style={{ textDecoration: 'none' }}>Sell your guns</Link>
            <Link to="/about" style={{ textDecoration: 'none' }}>About us</Link>
            <Link to="/careers" style={{ textDecoration: 'none' }}>Careers</Link>
            <Link to="/contact" style={{ textDecoration: 'none' }}>Contact us</Link>
          </nav>
        </div>
      </div>
      <div style={{ borderTop: '2px solid var(--color-divider)' }}>
        <div className="footer-bottom-inner">
          <span>&copy; {new Date().getFullYear()} Liberty Ordnance Supply</span>
          <span style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Terms &amp; Conditions</a>
            <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Privacy Policy</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
