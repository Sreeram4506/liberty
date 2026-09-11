import React from 'react';
import { Link } from 'react-router-dom';
import { getCategoryLabel } from '../lib/categoryLabel';

// Real Lightspeed category names, organized into sections. Categories that
// don't exist in the live catalog (or haven't loaded yet) are simply omitted.
const SECTION_LAYOUT = [
  { column: 0, heading: 'Firearms', match: ['Used Guns', 'Consignment Guns', 'Pistol', 'AR', 'frame'] },
  { column: 1, heading: 'Optics & Lights', match: ['Red Dot', 'Optics', 'Handgun Light', 'Rifle Light'] },
  { column: 1, heading: 'Ammo', match: ['Ammo', '9mm FMJ Bulk'] },
  { column: 2, heading: 'Parts & Accessories', match: ['Upper Receivers', 'mags', 'Muzzle Device', 'Accessory', 'Triggers'] },
  { column: 3, heading: 'Apparel', match: ['Apparel'] }
];

export default function ProductsMegaMenu({ categories = [], onNavigate, onMouseEnter, onMouseLeave }) {
  // Only list categories with enough products to also show up as a filter
  // pill on the Shop page, so every link here lands on a visibly-active filter.
  const visible = new Set(categories.filter(c => c.count >= 3).map(c => c.name));

  const columns = [[], [], [], []];
  SECTION_LAYOUT.forEach(({ column, heading, match }) => {
    const links = match.filter(name => visible.has(name));
    if (links.length) columns[column].push({ heading, links });
  });

  return (
    <div className="mega-menu" onClick={onNavigate} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="wrap mega-menu-grid">
        {columns.map((groups, i) => (
          <div className="mega-col" key={i}>
            {i === 0 && <Link to="/shop" className="btn btn-primary mega-shop-all">Shop all</Link>}
            {groups.map(g => (
              <div className="mega-group" key={g.heading}>
                <span className="mega-heading">{g.heading}</span>
                {g.links.map(name => (
                  <Link key={name} to={`/shop?cat=${encodeURIComponent(name)}`}>{getCategoryLabel(name)}</Link>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
