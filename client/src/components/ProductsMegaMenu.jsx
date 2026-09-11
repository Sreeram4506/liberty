import React from 'react';
import { Link } from 'react-router-dom';

const COLUMNS = [
  {
    featured: true,
    groups: [
      { heading: 'Rifle Equipment', links: ['Optics', 'Lights', 'Furniture', 'Rifle Slings', 'Magazines', 'Muzzle Devices', 'Triggers', 'Mounts', 'Precision'] }
    ]
  },
  {
    groups: [
      { heading: 'Pistol Equipment', links: ['Lights', 'Optics', 'Upgrades'] },
      { heading: 'Maintenance', links: ['Rifle Cleaning', 'Pistol Cleaning'] }
    ]
  },
  {
    groups: [
      { heading: 'Personal Equipment', links: ['Soft Goods'] },
      { heading: 'Range Gear', links: ['Transport', 'Observation', 'Targets'] }
    ]
  },
  {
    groups: [
      { heading: 'Lifestyle Products', links: ['Apparel', 'EDC'] }
    ]
  }
];

export default function ProductsMegaMenu({ onNavigate, onMouseEnter, onMouseLeave }) {
  return (
    <div className="mega-menu" onClick={onNavigate} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="wrap mega-menu-grid">
        {COLUMNS.map((col, i) => (
          <div className="mega-col" key={i}>
            {col.featured && <Link to="/shop" className="btn btn-primary mega-shop-all">Shop all</Link>}
            {col.groups.map(g => (
              <div className="mega-group" key={g.heading}>
                <span className="mega-heading">{g.heading}</span>
                {g.links.map(l => (
                  <Link key={l} to={`/shop?cat=${encodeURIComponent(l)}`}>{l}</Link>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
