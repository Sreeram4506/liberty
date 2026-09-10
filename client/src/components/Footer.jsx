import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>
            Liberty Ordnance<span style={{ color: 'var(--color-accent)' }}> Supply</span>
          </p>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'color-mix(in srgb, var(--color-text) 70%, transparent)', margin: '12px 0 0', maxWidth: '32ch' }}>
            Family-run gun shop in Norwood, MA. Straight answers, fair prices, and coffee that's always on.
          </p>
        </div>
        <div>
          <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 12px' }}>Visit</p>
          <p style={{ fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
            100 Access Rd, Suite 215<br />Norwood, MA 02062
          </p>
          <p style={{ fontSize: '14px', lineHeight: 1.7, margin: '12px 0 0' }}>
            Mon&ndash;Fri 10am&ndash;6pm<br />Sat 10am&ndash;7pm &middot; Sun 10am&ndash;3:30pm
          </p>
        </div>
        <div>
          <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 12px' }}>Contact</p>
          <p style={{ fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
            <a href="tel:+15084925955" style={{ textDecoration: 'none', fontWeight: 600 }}>(508) 492-5955</a><br />
            <a href="mailto:sales@los2a.com" style={{ textDecoration: 'none' }}>sales@los2a.com</a>
          </p>
        </div>
        <div>
          <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 12px' }}>Site</p>
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
