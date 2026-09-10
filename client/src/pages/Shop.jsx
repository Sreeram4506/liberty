import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Shop() {
  const { inventory, addToCart, fmt } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const CATS = ['Red Dots', 'Weapon Lights', 'AR Accessories', 'Upper Receivers', 'Used Guns'];
  const initialCat = searchParams.get('cat');
  const [filter, setFilter] = useState((initialCat && CATS.includes(initialCat)) ? initialCat : 'All');
  const [added, setAdded] = useState(null);

  useEffect(() => {
    if (filter === 'All') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', filter);
    }
    setSearchParams(searchParams, { replace: true });
  }, [filter, searchParams, setSearchParams]);

  const handleAdd = (e, p) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof p.stock === 'number' && p.stock === 0) return;
    addToCart(p);
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1400);
  };

  const filteredInventory = inventory.filter(p => filter === 'All' || p.cat === filter);

  return (
    <>
      <main className="wrap">
        <section style={{ padding: 'clamp(32px,5vw,56px) 0 20px' }}>
          <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', margin: '0 0 12px' }}>In-store inventory &middot; call to confirm stock</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', letterSpacing: '-0.02em', margin: '0 0 0 -0.058em' }}>Shop</h1>
        </section>

        <div id="cat-filters" style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 0 20px', WebkitOverflowScrolling: 'touch' }}>
          {['All', ...CATS].map(c => (
            <button 
              key={c} 
              type="button" 
              onClick={() => setFilter(c)} 
              className={`btn ${filter === c ? 'btn-primary' : 'btn-secondary'} cat-btn`}
              style={{ whiteSpace: 'nowrap', flexShrink: 0, minHeight: '44px' }}
            >
              {c}
            </button>
          ))}
        </div>

        <div id="deals" className="glass-card" style={{ border: '1px solid var(--color-accent-muted)', background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', padding: '20px 24px', marginBottom: '32px' }}>
          <div>
            <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-active)', margin: 0, fontWeight: 700 }}>Forever deals</p>
            <p style={{ fontSize: '15px', fontWeight: 600, margin: '4px 0 0', color: 'var(--color-text)' }}>Free optic mounting &amp; boresight with any red dot purchased in store.</p>
          </div>
          <a href="tel:+15084925955" className="btn btn-primary" style={{ textDecoration: 'none' }}>Ask in store</a>
        </div>

        <div id="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '24px', paddingBottom: '8px' }}>
          {filteredInventory.length === 0 ? (
            <p style={{ gridColumn: '1/-1', color: 'var(--color-text-muted)' }}>No products in this category right now.</p>
          ) : (
            filteredInventory.map(p => {
              const lowStock = typeof p.stock === 'number' && p.stock > 0 && p.stock <= 3;
              const outOfStock = typeof p.stock === 'number' && p.stock === 0;
              const isAdded = added === p.id;
              
              const getImage = (cat) => {
                if (cat === 'Red Dots') return '/images/red_dot.png';
                if (cat === 'Weapon Lights') return '/images/weapon_light.png';
                if (cat === 'AR Accessories' || cat === 'Upper Receivers') return '/images/ar_accessories.png';
                if (cat === 'Used Guns') return '/images/used_guns.png';
                return '/images/shop_counter.png';
              };

              return (
                <Link key={p.id} to={`/product/${encodeURIComponent(p.id)}`} className="product-card tile-link glass-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', color: 'inherit' }}>
                  <div style={{ aspectRatio: '4/3', overflow: 'hidden', borderBottom: '1px solid var(--color-divider)' }}>
                    <img src={getImage(p.cat)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <span style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 600 }}>{p.cat}</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '17px', lineHeight: 1.25 }}>{p.name}</span>
                    {p.used && <span className="tag tag-neutral" style={{ alignSelf: 'flex-start' }}>Used &middot; {p.condition || ''}</span>}
                    {lowStock && <span className="tag tag-accent" style={{ alignSelf: 'flex-start' }}>Only {p.stock} left</span>}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: 'auto', paddingTop: '14px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '20px' }}>{fmt(p.priceN)}</span>
                      <button 
                        type="button" 
                        onClick={(e) => handleAdd(e, p)} 
                        className={`btn ${isAdded ? 'btn-primary' : 'btn-secondary'}`} 
                        disabled={outOfStock} 
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {outOfStock ? 'Out of stock' : (isAdded ? 'Added ✓' : 'Add to cart')}
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'color-mix(in srgb, var(--color-text) 70%, transparent)', margin: '24px 0 0', maxWidth: '64ch' }}>
          Inventory shown is representative &mdash; stock moves fast. Call <a href="tel:+15084925955" style={{ color: 'var(--color-accent-700)', fontWeight: 600 }}>(508) 492-5955</a> to confirm, or ask about a custom order: we order handguns, rifles and shotguns from every major distributor.
        </p>
      </main>
      <div style={{ height: 'clamp(40px,6vw,72px)' }}></div>
    </>
  );
}
