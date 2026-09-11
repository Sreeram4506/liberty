// Friendlier display text for raw Lightspeed category names. The raw name
// is still what's used for filtering/URLs — this only affects what's shown.
const DISPLAY_LABEL = {
  frame: 'Frames & Lowers',
  mags: 'Magazines',
  Pistol: 'Pistols',
  AR: 'AR Rifles',
  'Red Dot': 'Red Dots',
  '9mm FMJ Bulk': '9mm Ammo'
};

export const getCategoryLabel = (name) => DISPLAY_LABEL[name] || name;
