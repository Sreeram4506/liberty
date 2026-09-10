import React from 'react';
import { Link } from 'react-router-dom';

export default function SellGuns() {
  return (
    <>
      <main className="wrap">
        <section style={{ padding: 'clamp(36px,6vw,64px) 0', borderBottom: '2px solid var(--color-divider)' }}>
          <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 16px' }}>We buy all collections &amp; guns</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(34px,5.5vw,64px)', lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 0 -0.055em' }}>Selling a firearm,<br /><span style={{ color: 'var(--color-accent)' }}>made easy.</span></h1>
          <p style={{ fontSize: 'clamp(15px,2vw,17px)', lineHeight: 1.65, maxWidth: '56ch', margin: '22px 0 0' }}>Whether you're inheriting a firearm and don't have an LTC, selling to fund something new, or trading toward another purchase &mdash; we handle the process from start to finish. One gun or a whole estate.</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '26px' }}>
            <a href="tel:+15084925955" className="btn btn-primary" style={{ textDecoration: 'none', minHeight: '48px' }}>Get a quote &mdash; (508) 492-5955</a>
            <a href="mailto:sales@los2a.com" className="btn btn-secondary" style={{ textDecoration: 'none', minHeight: '48px' }}>Email us</a>
          </div>
        </section>
        <section style={{ padding: 'clamp(36px,5vw,60px) 0' }}>
          <div className="tile-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
            <div className="tile" style={{ padding: '28px 24px' }}>
              <span style={{ display: 'block', fontSize: '13px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-accent)' }}>01</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '22px', margin: '14px 0 0' }}>Describe what you have</h2>
              <p style={{ fontSize: '15px', lineHeight: 1.65, margin: '12px 0 0' }}>Text, call, or email us with make, model, condition, and any accessories. Photos help but aren't required for some items.</p>
            </div>
            <div className="tile" style={{ padding: '28px 24px' }}>
              <span style={{ display: 'block', fontSize: '13px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-accent)' }}>02</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '22px', margin: '14px 0 0' }}>Get a number, fast</h2>
              <p style={{ fontSize: '15px', lineHeight: 1.65, margin: '12px 0 0' }}>We can give pricing almost immediately, with a reply by text or email. We respond in under 24 hours &mdash; usually much sooner.</p>
            </div>
            <div className="tile" style={{ padding: '28px 24px' }}>
              <span style={{ display: 'block', fontSize: '13px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-accent)' }}>03</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '22px', margin: '14px 0 0' }}>No LTC? No problem.</h2>
              <p style={{ fontSize: '15px', lineHeight: 1.65, margin: '12px 0 0' }}>If you don't have a License to Carry or can't transport the firearm, we can come right to your house and pick it up. Paperwork handled.</p>
            </div>
          </div>
        </section>
      </main>
      <section style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}>
        <div className="wrap" style={{ paddingTop: 'clamp(44px,6vw,72px)', paddingBottom: 'clamp(44px,6vw,72px)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(30px,4.5vw,52px)', lineHeight: 1.06, letterSpacing: '-0.015em', margin: '0 0 0 -0.055em' }}>Get a quote without leaving the couch.</h2>
          <p style={{ fontSize: '16px', lineHeight: 1.6, margin: '18px 0 0', maxWidth: '52ch' }}>sales@los2a.com &middot; (508) 492-5955 &middot; replies in under 24 hours.</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '26px' }}>
            <Link to="/contact" className="btn btn-ghost" style={{ textDecoration: 'none', color: 'var(--color-on-accent)', borderColor: 'var(--color-on-accent)', minHeight: '48px' }}>Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
