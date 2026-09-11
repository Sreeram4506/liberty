import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';

export default function Guide() {
  return (
    <>
      <PageHero
        image="/images/red_dot.png"
        eyebrow="Beginner's guide"
        title={<>Picking your <span style={{ color: 'var(--color-accent)' }}>first handgun</span>.</>}
        subtitle="Everything a first-time Massachusetts buyer needs to know — the law, the sizes, the calibers, and the gear that actually matters."
      />
      <main className="wrap">
        <section style={{ padding: 'clamp(36px,5vw,56px) 0', borderBottom: '2px solid var(--color-divider)' }}>
          <p style={{ fontSize: '13px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-accent)', margin: 0 }}>01</p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(24px,3vw,36px)', letterSpacing: '-0.015em', margin: '12px 0 0' }}>Massachusetts law &mdash; what you need to know</h2>
          <p style={{ fontSize: '15.5px', lineHeight: 1.7, maxWidth: '66ch', margin: '18px 0 0' }}>First things first: you need a Massachusetts License to Carry ("LTC") to purchase or possess firearms in Massachusetts. Don't have one? Sign up for our LTC class &mdash; it's the required course to obtain your MA LTC.</p>
          <Link to="/contact" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: '20px', minHeight: '48px' }}>Register for the LTC course</Link>
        </section>

        <section style={{ padding: 'clamp(36px,5vw,56px) 0', borderBottom: '2px solid var(--color-divider)' }}>
          <p style={{ fontSize: '13px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-accent)', margin: 0 }}>02</p>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(24px,3vw,36px)', letterSpacing: '-0.015em', margin: '12px 0 0' }}>Start with the purpose</h2>
          <div className="tile-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', marginTop: '24px' }}>
            <div className="tile" style={{ padding: '24px 22px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '19px', margin: 0 }}>Concealed carry</h3>
              <p style={{ fontSize: '14.5px', lineHeight: 1.65, margin: '10px 0 0' }}>Easily hidden handgun designed for personal protection. Lightweight, reliable, and quick to access in an emergency.</p>
            </div>
            <div className="tile" style={{ padding: '24px 22px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '19px', margin: 0 }}>Home defense</h3>
              <p style={{ fontSize: '14.5px', lineHeight: 1.65, margin: '10px 0 0' }}>Reliable, easy to use, built to protect your home and family. Larger form factor, manageable recoil, room for attachments.</p>
            </div>
            <div className="tile" style={{ padding: '24px 22px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '19px', margin: 0 }}>Competition / range</h3>
              <p style={{ fontSize: '14.5px', lineHeight: 1.65, margin: '10px 0 0' }}>Built for accuracy, speed, and control. Longer barrel, improved sights, smooth trigger, and ergonomic grip.</p>
            </div>
          </div>
        </section>
      </main>

      <section style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}>
        <div className="wrap" style={{ paddingTop: 'clamp(44px,6vw,72px)', paddingBottom: 'clamp(44px,6vw,72px)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(30px,4.5vw,52px)', lineHeight: 1.06, letterSpacing: '-0.015em', margin: '0 0 0 -0.055em' }}>Still unsure? That's why we're here.</h2>
          <p style={{ fontSize: '16px', lineHeight: 1.65, margin: '18px 0 0', maxWidth: '58ch' }}>Stop by the shop, email, DM us on IG, or call. We'll find the right firearm for <strong>you</strong>.</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '26px' }}>
            <a href="tel:+15084925955" className="btn btn-ghost" style={{ textDecoration: 'none', color: 'var(--color-on-accent)', borderColor: 'var(--color-on-accent)', minHeight: '48px' }}>(508) 492-5955</a>
            <Link to="/contact" className="btn btn-ghost" style={{ textDecoration: 'none', color: 'var(--color-on-accent)', borderColor: 'var(--color-on-accent)', minHeight: '48px' }}>Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
