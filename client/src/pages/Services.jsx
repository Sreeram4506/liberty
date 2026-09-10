import React from 'react';
import { Link } from 'react-router-dom';

export default function Services() {
  return (
    <main className="wrap">
      <section style={{ padding: 'clamp(32px,5vw,56px) 0' }}>
        <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 12px' }}>Done in-house, in Norwood</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', letterSpacing: '-0.02em', margin: '0 0 0 -0.058em' }}>Services</h1>
        <p style={{ fontSize: 'clamp(15px,2vw,17px)', lineHeight: 1.65, maxWidth: '58ch', margin: '20px 0 0' }}>Everything below is done by us, at the shop. Walk in during open hours or call ahead &mdash; most jobs are same-day or next-day.</p>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(48px,120px) 1fr', gap: '16px clamp(20px,4vw,64px)', borderTop: '2px solid var(--color-divider)', padding: 'clamp(24px,4vw,40px) 0' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '15px', margin: 0 }}>01</p>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(20px,2.5vw,26px)', margin: 0 }}>FFL transfers</h2>
            <p style={{ fontSize: '15px', lineHeight: 1.65, maxWidth: '56ch', margin: '10px 0 0', color: 'color-mix(in srgb, var(--color-text) 78%, transparent)' }}>Buying online? Have it shipped to us. We handle receiving, background check and paperwork &mdash; you're usually in and out in fifteen minutes.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(48px,120px) 1fr', gap: '16px clamp(20px,4vw,64px)', borderTop: '2px solid var(--color-divider)', padding: 'clamp(24px,4vw,40px) 0' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '15px', margin: 0 }}>02</p>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(20px,2.5vw,26px)', margin: 0 }}>LTC classes</h2>
            <p style={{ fontSize: '15px', lineHeight: 1.65, maxWidth: '56ch', margin: '10px 0 0', color: 'color-mix(in srgb, var(--color-text) 78%, transparent)' }}>Massachusetts License to Carry certification, taught in-store by certified instructors. Small classes, materials provided, certificate issued same day.</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
              <a href="tel:+15084925955" className="btn btn-primary" style={{ textDecoration: 'none', minHeight: '48px' }}>Register by phone</a>
              <Link to="/guide" className="btn btn-ghost" style={{ textDecoration: 'none', minHeight: '48px' }}>What's covered</Link>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(48px,120px) 1fr', gap: '16px clamp(20px,4vw,64px)', borderTop: '2px solid var(--color-divider)', padding: 'clamp(24px,4vw,40px) 0' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '15px', margin: 0 }}>03</p>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(20px,2.5vw,26px)', margin: 0 }}>Gunsmithing &amp; optic mounting</h2>
            <p style={{ fontSize: '15px', lineHeight: 1.65, maxWidth: '56ch', margin: '10px 0 0', color: 'color-mix(in srgb, var(--color-text) 78%, transparent)' }}>Sight installs, optic cuts and mounting, trigger work, deep cleaning, repairs and full builds.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
