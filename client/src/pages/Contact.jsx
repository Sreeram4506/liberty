import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Contact() {
  const { stores } = useAppContext();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const first = e.target.elements['c-first'].value.trim();
    setName(first || 'there');
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
  };

  return (
    <main className="wrap">
      <section style={{ padding: 'clamp(36px,6vw,64px) 0 clamp(28px,4vw,44px)' }}>
        <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 16px' }}>Contact us</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(34px,5.5vw,64px)', lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 0 -0.055em' }}>Send us a message.</h1>
        <p style={{ fontSize: 'clamp(15px,2vw,17px)', lineHeight: 1.65, maxWidth: '54ch', margin: '20px 0 0' }}>Question about stock, a transfer, an LTC class, or selling a gun? Write us &mdash; we usually reply the same day.</p>
      </section>

      <section style={{ padding: '0 0 clamp(44px,6vw,72px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(28px,4vw,64px)', alignItems: 'start' }}>
        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', border: '2px solid var(--color-divider)', padding: 'clamp(20px,3vw,32px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '18px' }}>
              <div className="field"><label htmlFor="c-first">First name *</label><input className="input" id="c-first" name="first" required style={{ minHeight: '48px' }} /></div>
              <div className="field"><label htmlFor="c-last">Last name *</label><input className="input" id="c-last" name="last" required style={{ minHeight: '48px' }} /></div>
            </div>
            <div className="field"><label htmlFor="c-phone">Phone number *</label><input className="input" id="c-phone" name="phone" type="tel" required style={{ minHeight: '48px' }} /></div>
            <div className="field"><label htmlFor="c-email">Email *</label><input className="input" id="c-email" name="email" type="email" required style={{ minHeight: '48px' }} /></div>
            <div className="field"><label htmlFor="c-msg">Comment or message</label><textarea className="input" id="c-msg" name="message" rows="5" style={{ resize: 'vertical', minHeight: '120px' }}></textarea></div>
            <button type="submit" className="btn btn-primary" style={{ minHeight: '48px', alignSelf: 'flex-start' }}>Submit</button>
          </form>
        ) : (
          <div style={{ border: '2px solid var(--color-accent)', padding: 'clamp(24px,4vw,40px)' }}>
            <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: 0 }}>Message sent</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(24px,3vw,34px)', margin: '14px 0 0' }}>Thanks, {name}. We'll get back to you shortly.</h2>
            <p style={{ fontSize: '15px', lineHeight: 1.65, margin: '14px 0 0', maxWidth: '46ch' }}>We reply in under 24 hours, usually much sooner. Need an answer right now? Call the shop.</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '22px' }}>
              <a href="tel:+15084925955" className="btn btn-primary" style={{ textDecoration: 'none', minHeight: '48px' }}>(508) 492-5955</a>
              <button type="button" onClick={handleReset} className="btn btn-ghost" style={{ minHeight: '48px' }}>Send another</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '2px solid var(--color-divider)' }}>
          <div style={{ padding: '20px 22px', borderBottom: '2px solid var(--color-divider)' }}>
            <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 10px' }}>Reach us</p>
            <p style={{ fontSize: '15.5px', lineHeight: 1.8, margin: 0 }}><a href="tel:+15084925955" style={{ textDecoration: 'none', fontWeight: 700 }}>(508) 492-5955</a><br /><a href="mailto:sales@los2a.com" style={{ textDecoration: 'none' }}>sales@los2a.com</a></p>
          </div>

          {stores.map((s, i) => (
            <div key={s.id} style={{ padding: '20px 22px', borderBottom: '2px solid var(--color-divider)' }}>
              <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 10px' }}>{s.name}{i === 0 && <span className="tag tag-accent" style={{ marginLeft: '8px', textTransform: 'none', letterSpacing: 0 }}>Flagship</span>}</p>
              <p style={{ fontSize: '14.5px', lineHeight: 1.7, margin: 0 }}>
                {s.address}<br />
                {s.phone && <><a href={`tel:${s.phone.replace(/[^\d+]/g, '')}`} style={{ textDecoration: 'none' }}>{s.phone}</a><br /></>}
                {s.hours}
              </p>
            </div>
          ))}

          <div style={{ padding: '20px 22px' }}>
            <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 10px' }}>Follow on social</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="https://www.facebook.com/LOSGunshop" className="icon-btn" style={{ width: 'auto', height: '44px', textDecoration: 'none', fontSize: '14.5px', fontWeight: 600, border: '2px solid var(--color-divider)', padding: '0 16px' }}>Facebook</a>
              <a href="https://www.instagram.com/libertyordnancesupply/" className="icon-btn" style={{ width: 'auto', height: '44px', textDecoration: 'none', fontSize: '14.5px', fontWeight: 600, border: '2px solid var(--color-divider)', padding: '0 16px' }}>Instagram</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
