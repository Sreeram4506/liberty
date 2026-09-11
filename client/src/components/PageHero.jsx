import React from 'react';

export default function PageHero({ image, eyebrow, title, subtitle, children, height = 'clamp(360px,44vw,480px)' }) {
  return (
    <section style={{ position: 'relative', width: '100%', minHeight: height, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
      <img src={image} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0, zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.68) 45%, rgba(0,0,0,0.4) 100%)', zIndex: 1 }} />
      <div className="wrap" style={{ position: 'relative', zIndex: 2, paddingTop: 'clamp(48px,7vw,72px)', paddingBottom: 'clamp(32px,5vw,48px)' }}>
        {eyebrow && <p style={{ fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 700, margin: '0 0 16px' }}>{eyebrow}</p>}
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(34px,5.5vw,64px)', lineHeight: 1.04, letterSpacing: '-0.01em', margin: '0 0 0 -0.03em', color: 'var(--color-on-accent)' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 'clamp(15px,2vw,17px)', lineHeight: 1.65, maxWidth: '56ch', margin: '20px 0 0', color: 'rgba(255,255,255,0.72)' }}>{subtitle}</p>}
        {children && <div style={{ marginTop: '24px' }}>{children}</div>}
      </div>
    </section>
  );
}
