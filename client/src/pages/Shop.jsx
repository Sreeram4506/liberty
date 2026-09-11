import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import PageHero from '../components/PageHero';
import { getFallbackImage } from '../lib/productImage';
import { getCategoryLabel } from '../lib/categoryLabel';
import { API_BASE } from '../lib/api';

const PAGE_SIZE = 24;

export default function Shop() {
  const { inventory: demoInventory, addToCart, fmt } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const [liveProducts, setLiveProducts] = useState(null);
  const [liveCategories, setLiveCategories] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/lightspeed/products`)
      .then(res => { if (!res.ok) throw new Error('bad response'); return res.json(); })
      .then(data => {
        if (cancelled) return;
        setLiveProducts(data.products || []);
        setLiveCategories(data.categories || []);
      })
      .catch(() => { if (!cancelled) setLoadError(true); });
    return () => { cancelled = true; };
  }, []);

  const isLoading = liveProducts === null && !loadError;
  const usingLiveData = Array.isArray(liveProducts) && !loadError;
  // Mock data is only ever shown as a genuine fallback when the live call
  // fails — never as a stand-in while we're still waiting on it.
  const inventory = usingLiveData ? liveProducts : (loadError ? demoInventory : []);
  const CATS = usingLiveData
    ? liveCategories.filter(c => c.count >= 3).map(c => c.name)
    : (loadError ? ['Red Dots', 'Weapon Lights', 'AR Accessories', 'Upper Receivers', 'Used Guns'] : []);

  const [filter, setFilter] = useState(searchParams.get('cat') || 'All');
  const [added, setAdded] = useState(null);

  useEffect(() => {
    if (filter === 'All') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', filter);
    }
    setSearchParams(searchParams, { replace: true });
  }, [filter, searchParams, setSearchParams]);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [filter]);

  const handleAdd = (e, p) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof p.stock === 'number' && p.stock === 0) return;
    addToCart(p);
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1400);
  };

  const filteredInventory = useMemo(
    () => inventory.filter(p => filter === 'All' || p.cat === filter),
    [inventory, filter]
  );
  const visibleInventory = filteredInventory.slice(0, visibleCount);

  return (
    <>
      <PageHero
        image="/images/shop_counter.png"
        eyebrow={isLoading ? 'Loading inventory…' : usingLiveData ? 'Live Lightspeed inventory · call to confirm stock' : 'In-store inventory · call to confirm stock'}
        title="Shop"
        height="clamp(260px,30vw,340px)"
      />
      <main className="wrap">
        {isLoading ? (
          <div style={{ padding: 'clamp(32px,5vw,56px) 0' }}>
            <p style={{ color: 'var(--color-text-muted)', margin: '0 0 24px' }}>Loading live inventory from Lightspeed…</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '24px' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="skeleton" style={{ aspectRatio: '4/3', background: 'var(--color-surface-hover)' }} />
                  <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="skeleton" style={{ height: '10px', width: '40%', background: 'var(--color-surface-hover)' }} />
                    <div className="skeleton" style={{ height: '14px', width: '85%', background: 'var(--color-surface-hover)' }} />
                    <div className="skeleton" style={{ height: '20px', width: '35%', background: 'var(--color-surface-hover)', marginTop: '8px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
        <>
        <div id="cat-filters" style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '24px 0 20px', WebkitOverflowScrolling: 'touch' }}>
          {['All', ...CATS].map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`btn ${filter === c ? 'btn-primary' : 'btn-secondary'} cat-btn`}
              style={{ whiteSpace: 'nowrap', flexShrink: 0, minHeight: '44px' }}
            >
              {c === 'All' ? 'All' : getCategoryLabel(c)}
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
            visibleInventory.map(p => {
              const lowStock = typeof p.stock === 'number' && p.stock > 0 && p.stock <= 3;
              const outOfStock = typeof p.stock === 'number' && p.stock === 0;
              const isUsed = p.used || p.cat === 'Used Guns' || p.cat === 'Consignment Guns';
              const isAdded = added === p.id;
              const image = p.image || getFallbackImage(p.cat);

              return (
                <Link key={p.id} to={`/product/${encodeURIComponent(p.id)}`} className="product-card tile-link glass-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', color: 'inherit' }}>
                  <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', borderBottom: '1px solid var(--color-divider)' }}>
                    {image ? (
                      <img src={image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="img-slot" style={{ fontSize: '12px' }}>No photo yet<br />call to ask</div>
                    )}
                    <span className="quick-view-badge">Quick view</span>
                  </div>
                  <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <span style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 600 }}>{getCategoryLabel(p.cat)}</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '17px', lineHeight: 1.25 }}>{p.name}</span>
                    {isUsed && <span className="tag tag-neutral" style={{ alignSelf: 'flex-start' }}>Used{p.condition ? ` · ${p.condition}` : ''}</span>}
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

        {visibleCount < filteredInventory.length && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '28px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setVisibleCount(v => v + PAGE_SIZE)}>
              Load more ({filteredInventory.length - visibleCount} more)
            </button>
          </div>
        )}

        <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'color-mix(in srgb, var(--color-text) 70%, transparent)', margin: '24px 0 0', maxWidth: '64ch' }}>
          {usingLiveData
            ? `Showing ${filteredInventory.length} items pulled live from our Lightspeed catalog. Stock levels move fast — call`
            : 'Inventory shown is representative — stock moves fast. Call'} <a href="tel:+15084925955" style={{ color: 'var(--color-accent-700)', fontWeight: 600 }}>(508) 492-5955</a> to confirm, or ask about a custom order: we order handguns, rifles and shotguns from every major distributor.
        </p>
        </>
        )}
      </main>
      <div style={{ height: 'clamp(40px,6vw,72px)' }}></div>
    </>
  );
}
