import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';

export default function Deals() {
  const deals = [
    { n: '01', title: 'Ammo deal', desc: 'Buy 2 cases of any caliber ammo, get a free Maglula speed loader.' },
    { n: '02', title: 'Gun + gear bundle', desc: 'Buy any pistol or rifle with a red dot and light, get a free KORE EDC belt.' },
    { n: '03', title: 'Red dot / light install', desc: 'Purchase any red dot or light from LOS, get free installation — same-day or drop-off.' },
    { n: '04', title: 'First-time gun owners', desc: 'Buying your first firearm? Get a free bottle of lube and gun cleaner with purchase.' },
    { n: '05', title: 'Premium upper deal', desc: 'Buy any upper over $1,000, get 20% off a Geissele trigger.' },
    { n: '06', title: 'Multi-gun bonus', desc: 'Buy 2 or more firearms at the same time, receive 150 rounds of 9mm ammo free.' },
    { n: '07', title: 'Full plate carrier setup', desc: 'Buy a complete setup — plate carrier, mag pouch, admin pouch — get 100 rounds of 9mm + an LOS patch free.' },
  ];

  return (
    <>
      <PageHero
        image="/images/weapon_light.png"
        eyebrow="Forever deals · No limits, no gimmicks"
        title={<>Ongoing deals at LOS.<br /><span style={{ color: 'var(--color-accent)' }}>They never expire.</span></>}
        subtitle="Buy as much as you want, as often as you want — anytime. No weekly restrictions, just consistent value for everyone. Deals are valid at the time of purchase."
      >
        <p style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', margin: 0, padding: '12px 16px', border: '2px solid var(--color-accent)', fontSize: '14px', fontWeight: 600, color: 'var(--color-on-accent)' }}>Show this page at checkout to activate any deal.</p>
      </PageHero>
      <main className="wrap">
      <section style={{ padding: 'clamp(36px,5vw,56px) 0' }}>
        <div className="tile-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
          {deals.map(d => (
            <div key={d.n} className="tile" style={{ padding: '24px 22px' }}>
              <span style={{ display: 'block', fontSize: '13px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-accent)' }}>{d.n}</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '20px', margin: '12px 0 0' }}>{d.title}</h2>
              <p style={{ fontSize: '14.5px', lineHeight: 1.6, margin: '10px 0 0' }}>{d.desc}</p>
            </div>
          ))}
          <Link to="/shop" className="tile-link tile" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px', padding: '24px 22px', background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '20px', lineHeight: 1.2 }}>Ready to stack a deal?</span>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Browse the shop &rarr;</span>
          </Link>
        </div>
      </section>
      </main>
    </>
  );
}
