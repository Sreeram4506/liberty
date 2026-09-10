import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      <main className="wrap">
        <section style={{ padding: 'clamp(36px,6vw,64px) 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(28px,4vw,64px)', alignItems: 'center', borderBottom: '2px solid var(--color-divider)' }}>
          <div>
            <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 16px' }}>About us</p>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(34px,5.5vw,64px)', lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 0 -0.055em' }}>The leading gun shop in Massachusetts that actually <span style={{ color: 'var(--color-accent)' }}>cares about you</span>.</h1>
            <p style={{ fontSize: 'clamp(15px,2vw,17px)', lineHeight: 1.65, maxWidth: '54ch', margin: '22px 0 0' }}>Young, relatable professionals who know our stuff. Our mission: get individuals the best tools possible to defend themselves and their loved ones &mdash; whether it's your first firearm or your fiftieth.</p>
          </div>
          <div className="glass-card" style={{ aspectRatio: '5/4', overflow: 'hidden' }}>
            <img src="/images/shop_counter.png" alt="Liberty Ordnance Supply Team & Counter" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </section>
        <section style={{ padding: 'clamp(36px,5vw,60px) 0' }}>
          <div className="tile-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
            {[
              { n: '01', title: 'Who we are', text: "Young, professional, relatable individuals who know our stuff. A leading gun shop in MA focused on getting individuals the best tools possible to defend themselves and their loved ones." },
              { n: '02', title: 'What we do', text: "We source products we believe in and personally test — gear we'd trust our lives with. We're also your resource for navigating the complex rules and regulations of firearm ownership, plus the technical gear questions." },
              { n: '03', title: 'Why we do it', text: "It's hard to find a shop that provides a personalized experience and cares about you, the individual. We're extremely passionate about our mission. First-time owner or the most advanced and experienced — we're here to serve you." }
            ].map(s => (
              <div key={s.n} className="tile" style={{ padding: '28px 24px' }}>
                <span style={{ display: 'block', fontSize: '13px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-accent)' }}>{s.n}</span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '22px', margin: '14px 0 0' }}>{s.title}</h2>
                <p style={{ fontSize: '15px', lineHeight: 1.65, margin: '12px 0 0' }}>{s.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <section style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
        <div className="wrap" style={{ paddingTop: 'clamp(44px,6vw,72px)', paddingBottom: 'clamp(44px,6vw,72px)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(30px,4.5vw,52px)', lineHeight: 1.06, letterSpacing: '-0.015em', margin: '0 0 0 -0.055em' }}>Come say hi. The coffee's always on.</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '26px' }}>
            <Link to="/contact" className="btn btn-ghost" style={{ textDecoration: 'none', color: 'var(--color-bg)', borderColor: 'var(--color-bg)', minHeight: '48px' }}>Contact us</Link>
            <Link to="/shop" className="btn btn-ghost" style={{ textDecoration: 'none', color: 'var(--color-bg)', borderColor: 'var(--color-bg)', minHeight: '48px' }}>Browse the shop</Link>
          </div>
        </div>
      </section>
    </>
  );
}
