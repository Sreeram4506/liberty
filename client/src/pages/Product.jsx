import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const DETAILS = {
  'holosun-507c': {
    category: 'Pistol red dots',
    description: "Open-reflex pistol optic with Holosun's multi-reticle system — switch between a 32 MOA circle, 2 MOA dot, or both. Solar failsafe, Shake Awake, and a side-loading battery tray so you never re-zero for a battery change.",
    specs: [['Reticle', '2 MOA dot / 32 MOA circle / both'], ['Battery', 'CR1632, up to 50,000 hrs'], ['Footprint', 'Trijicon RMR'], ['Weight', '1.5 oz'], ['Housing', '7075 aluminum'], ['Extras', 'Solar failsafe, Shake Awake']],
    goodToKnow: "Fits most optics-ready pistols with an RMR-pattern slide cut; we stock adapter plates for the rest. Bring your pistol in and we'll mount it, fit the plate, and get you boresighted before you leave — free with purchase.\n\nNot sure between the 507C and a closed emitter? Ask at the counter — we carry both and will let you look through them side by side."
  },
  'romeo5': {
    category: 'Rifle red dots',
    description: "1x20mm red dot sight with a 2 MOA dot, built for AR-pattern rifles and pistols alike. 40,000-hour battery life on a single CR2032, waterproof to 1 meter, and motion-activated illumination (MOTAC) to save the battery between uses.",
    specs: [['Reticle', '2 MOA dot'], ['Battery', 'CR2032, up to 40,000 hrs'], ['Mount', 'Picatinny, lower 1/3 co-witness riser included'], ['Weight', '5.5 oz'], ['Waterproof', 'IPX7, 1 meter'], ['Extras', 'MOTAC motion sensor']],
    goodToKnow: "A great value red dot for a home-defense or range AR — comes zeroed close out of the box and holds up well. We'll mount and boresight it free with purchase."
  },
  'tlr1-hl': {
    category: 'Weapon lights',
    description: "High-output 1,000-lumen weapon light built for full-size and compact pistols. Snap-on rail mount fits most pistol and long-gun rails without tools, with ambidextrous paddle switches for momentary or constant-on.",
    specs: [['Output', '1,000 lumens'], ['Runtime', '~1.25 hrs high'], ['Battery', '2x CR123A (included)'], ['Mount', 'Tool-less rail clamp'], ['Weight', '4.5 oz'], ['Switching', 'Ambidextrous paddle, momentary/constant']],
    goodToKnow: "Mounts to most accessory rails without removing anything from the gun. We'll fit and function-check it free with purchase."
  },
  'x300u': {
    category: 'Weapon lights',
    description: "Surefire's flagship 1,000-lumen pistol light in a compact, duty-proven body. Machined from aircraft aluminum with a Total Internal Reflection (TIR) lens for a tight, far-throwing beam.",
    specs: [['Output', '1,000 lumens'], ['Runtime', '~1.5 hrs'], ['Battery', '2x CR123A (included)'], ['Mount', 'Rail-Lock tool-less mounting'], ['Weight', '4.4 oz'], ['Body', 'Machined aircraft aluminum']],
    goodToKnow: "The X300U is a duty-grade light trusted by a lot of law enforcement — built to take abuse. We'll mount and function-check it free with purchase."
  },
  'moe-sl': {
    category: 'AR accessories',
    description: "Slim-profile AR-15/M4 buttstock with a lower-profile cheek weld and reduced bulk versus mil-spec stocks. Two sling attachment points, dual QD sockets, and a soft rubber buttpad.",
    specs: [['Fit', 'Mil-spec carbine buffer tube'], ['Material', 'Reinforced polymer'], ['QD sockets', '2, ambidextrous'], ['Length of pull', '5 positions'], ['Weight', '6.9 oz']],
    goodToKnow: "A direct drop-in swap on any mil-spec buffer tube — takes about ten minutes at the counter if you'd rather not do it yourself."
  },
  'raptor-lt': {
    category: 'AR accessories',
    description: "Ambidextrous charging handle with an extended, low-profile latch that clears optics and offset red dots. Machined from 7075 aluminum, sized for standard AR-15 uppers.",
    specs: [['Fit', 'Standard AR-15 upper receivers'], ['Material', '7075 aluminum, black nitride'], ['Latch', 'Ambidextrous, low profile'], ['Weight', '2.4 oz']],
    goodToKnow: "A common upgrade when you're running a large red dot or offset optic — the extended latch stays clear of glass and rings. We can swap it in-store if you'd rather not do it yourself."
  },
  'bcm-upper': {
    category: 'Upper receivers',
    description: 'Complete 16" mid-length upper built to mil-spec tolerances — chrome-lined barrel, M4 feed ramps, and a mid-length gas system for softer recoil impulse than a carbine-length gun.',
    specs: [['Barrel', '16", chrome-lined, 1:7 twist'], ['Gas system', 'Mid-length'], ['Receiver', 'Forged 7075-T6, mil-spec'], ['Bolt', 'Shot-peened, MPI tested'], ['Caliber', '5.56 NATO']],
    goodToKnow: "Drops onto any mil-spec lower. We'll function-check headspace and cycling free with purchase, and can help you pick a compatible lower if you need one."
  },
  'glock19-used': {
    category: 'Used guns',
    description: "Gen 4 compact 9mm pistol in very good condition — a proven, widely-carried platform with the Gen 4 dual recoil spring and swappable backstraps. Comes with the standard case and one factory magazine unless noted otherwise; ask at the counter for exact included accessories.",
    specs: [['Caliber', '9mm Luger'], ['Capacity', '15+1 (standard mag)'], ['Condition', 'Very good — light holster wear'], ['Barrel', '4.02"'], ['Weight', '25.9 oz (unloaded)']],
    goodToKnow: "Every used firearm we sell is function-checked and inspected before it goes in the case. Background check and paperwork handled in store, same as a new gun."
  }
};

export default function Product() {
  const { id } = useParams();
  const { inventory, addToCart, fmt } = useAppContext();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const product = inventory.find(p => p.id === id) || inventory[0];

  useEffect(() => {
    if (product) document.title = product.name + ' — Liberty Ordnance Supply';
  }, [product]);

  if (!product) {
    return (
      <main className="wrap" style={{ padding: 'clamp(40px,6vw,72px) 0' }}>
        <h1>Product not found</h1>
        <p><Link to="/shop">Back to shop</Link></p>
      </main>
    );
  }

  const d = DETAILS[product.id] || {
    category: product.cat,
    description: `${product.name} — ask us at the counter for full specs and fit questions. In stock in Norwood, call to confirm and hold.`,
    specs: [['Category', product.cat], ['Condition', product.used ? ('Used — ' + (product.condition || 'good')) : 'New']],
    goodToKnow: "Call or stop by the shop with any fit or compatibility questions before you buy — we're happy to talk it through."
  };

  const outOfStock = typeof product.stock === 'number' && product.stock === 0;

  const handleAdd = () => {
    if (outOfStock) return;
    addToCart(product, qty);
    setJustAdded(true);
    setQty(1);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const related = inventory.filter(p => p.id !== product.id && p.cat === product.cat).slice(0, 3);
  const relList = related.length ? related : inventory.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <main className="wrap">
      <nav aria-label="Breadcrumb" style={{ padding: '20px 0', fontSize: '13px', display: 'flex', gap: '8px', flexWrap: 'wrap', color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link><span>/</span>
        <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>Shop</Link><span>/</span>
        <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{product.name}</span>
      </nav>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(24px,4vw,64px)', alignItems: 'start', paddingBottom: 'clamp(32px,5vw,56px)' }}>
        <div className="grayscale" style={{ border: '2px solid var(--color-divider)', aspectRatio: '1/1' }}>
          <div className="img-slot">{product.placeholder || product.name + ' product photo'}</div>
        </div>
        <div>
          <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 12px' }}>{d.category}</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(28px,4vw,44px)', lineHeight: 1.08, letterSpacing: '-0.015em', margin: '0 0 0 -0.045em' }}>{product.name}</h1>
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(24px,3vw,32px)', color: 'var(--color-accent)', margin: '16px 0 0' }}>{fmt(product.priceN)}</p>
          <p style={{ fontSize: '15px', lineHeight: 1.65, maxWidth: '48ch', margin: '16px 0 0' }}>{d.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0 0' }}>
            <span style={{ width: '10px', height: '10px', background: outOfStock ? 'var(--color-divider)' : 'var(--color-accent)', flexShrink: 0 }}></span>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{outOfStock ? 'Out of stock — call to ask about a special order' : 'In stock in Norwood — call to confirm & hold'}</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'stretch', marginTop: '24px' }}>
            <div className="qty-stepper">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity" style={{ width: '48px', minHeight: '48px' }}>&minus;</button>
              <span className="qty-val" style={{ minWidth: '44px', fontSize: '17px' }}>{qty}</span>
              <button type="button" onClick={() => setQty(Math.min(99, qty + 1))} aria-label="Increase quantity" style={{ width: '48px', minHeight: '48px' }}>+</button>
            </div>
            <button type="button" onClick={handleAdd} className="btn btn-primary" disabled={outOfStock} style={{ minHeight: '48px', whiteSpace: 'nowrap' }}>
              {justAdded ? 'Added to cart ✓' : 'Add to cart — ' + fmt(product.priceN)}
            </button>
            <Link to="/cart" className="btn btn-ghost" style={{ textDecoration: 'none', minHeight: '48px', whiteSpace: 'nowrap' }}>View cart</Link>
          </div>
          <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'color-mix(in srgb, var(--color-text) 70%, transparent)', margin: '14px 0 0' }}>Free pickup in store &middot; accessories ship anywhere &middot; questions? <a href="tel:+15084925955" style={{ color: 'var(--color-accent-700)', fontWeight: 600 }}>call us</a></p>
          <div style={{ border: '2px solid var(--color-divider)', padding: '14px 16px', marginTop: '24px' }}>
            <p style={{ fontSize: '14px', lineHeight: 1.6, margin: 0 }}><strong>Forever deal:</strong> free mounting, plate fitting and boresight with any optic purchased in store.</p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      <section style={{ padding: 'clamp(32px,5vw,56px) 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(24px,4vw,64px)' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '22px', margin: '0 0 16px' }}>Specifications</h2>
          <table className="table" style={{ width: '100%' }}>
            <tbody>
              {d.specs.map(([k, v]) => <tr key={k}><td style={{ fontWeight: 600 }}>{k}</td><td>{v}</td></tr>)}
            </tbody>
          </table>
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '22px', margin: '0 0 16px' }}>Good to know</h2>
          {d.goodToKnow.split('\n\n').map((p, i) => <p key={i} style={{ fontSize: '15px', lineHeight: 1.7, margin: '0 0 14px', maxWidth: '52ch' }}>{p}</p>)}
        </div>
      </section>

      <hr className="rule" />

      <section style={{ padding: 'clamp(32px,5vw,56px) 0' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '22px', margin: '0 0 20px' }}>Also in the case</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '16px' }}>
          {relList.length === 0 ? (
            <p style={{ color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' }}>Nothing else in the case right now.</p>
          ) : relList.map(p => (
            <Link key={p.id} to={`/product/${encodeURIComponent(p.id)}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', border: '2px solid var(--color-divider)', color: 'inherit' }}>
              <div className="grayscale" style={{ aspectRatio: '4/3', borderBottom: '2px solid var(--color-divider)' }}><div className="img-slot">{p.placeholder || p.name + ' photo'}</div></div>
              <div style={{ padding: '12px 14px' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '15px', display: 'block' }}>{p.name}</span>
                <span style={{ fontWeight: 700, fontSize: '15px', display: 'block', marginTop: '4px' }}>{fmt(p.priceN)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
