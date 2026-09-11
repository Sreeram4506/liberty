const FALLBACK_IMAGE_BY_CAT = {
  'Red Dot': '/images/red_dot.png',
  'Red Dots': '/images/red_dot.png',
  'Optics': '/images/red_dot.png',
  'Handgun Light': '/images/weapon_light.png',
  'Rifle Light': '/images/weapon_light.png',
  'Weapon Lights': '/images/weapon_light.png',
  'Upper Receivers': '/images/ar_accessories.png',
  'Muzzle Device': '/images/ar_accessories.png',
  'AR': '/images/ar_accessories.png',
  'AR Accessories': '/images/ar_accessories.png',
  'Used Guns': '/images/used_guns.png',
  'Consignment Guns': '/images/used_guns.png'
};

// Only returns a stock photo when it's a genuine match for the category.
// Returns null otherwise so the caller can show an honest "no photo" slot
// instead of an unrelated storefront picture that looks like a broken image.
export const getFallbackImage = (cat) => FALLBACK_IMAGE_BY_CAT[cat] || null;
