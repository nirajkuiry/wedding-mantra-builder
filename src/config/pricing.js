/**
 * ⚠️ PLACEHOLDER PRICING — edit every number in this file to match
 * Wedding Mantra Films' real rate card. Nothing else in the app needs
 * to change when you update these numbers — the calculator, PDF quote,
 * and recommendation engine all read from here.
 *
 * All amounts are in INR (₹).
 */

// Base coverage rate per event-day, before duration multiplier and add-ons.
export const BASE_DAY_RATE = 20000;

// Multiplier applied to BASE_DAY_RATE depending on how long the day runs.
export const DURATION_MULTIPLIER = {
  '3-5': { label: '3–5 Hours', multiplier: 1 },
  '5-10': { label: '5–10 Hours', multiplier: 1.4 },
  full: { label: 'Full Day', multiplier: 1.8 },
};

export const PHOTOGRAPHERS = {
  1: { label: '1 Photographer', price: 25000 },
  2: { label: '2 Photographers', price: 45000 },
  3: { label: '3 Photographers', price: 65000 },
  4: { label: '4 Photographers', price: 85000 },
};

export const CINEMATOGRAPHERS = {
  1: { label: '1 Cinematographer', price: 25000 },
  2: { label: '2 Cinematographers', price: 45000 },
  3: { label: '3 Cinematographers', price: 65000 },
};

export const DRONE = {
  none: { label: 'None', price: 0 },
  '4k': { label: '4K Drone', price: 8000 },
  fpv: { label: 'FPV Drone', price: 15000 },
};

export const ALBUMS = {
  none: { label: 'None', price: 0 },
  sheet20: { label: '20 Sheet Album', price: 6000 },
  sheet30: { label: '30 Sheet Album', price: 9000 },
  sheet40: { label: '40 Sheet Album', price: 12000 },
  crystal: { label: 'Crystal Album', price: 18000 },
  acrylic: { label: 'Acrylic Album', price: 22000 },
  leather: { label: 'Leather Album', price: 25000 },
};

export const WEDDING_FILM = {
  none: { label: 'None', price: 0 },
  highlight: { label: 'Highlight Film', price: 10000 },
  min15: { label: '15 Minute Film', price: 18000 },
  min30: { label: '30 Minute Film', price: 28000 },
  documentary: { label: 'Documentary Film', price: 40000 },
};

export const REELS = {
  none: { label: 'None', price: 0 },
  r2: { label: '2 Reels', price: 5000 },
  r4: { label: '4 Reels', price: 9000 },
  r6: { label: '6 Reels', price: 13000 },
  r10: { label: '10 Reels', price: 20000 },
  unlimited: { label: 'Unlimited Reels', price: 30000 },
};

export const EXTRAS = {
  coupleShoot: { label: 'Couple Shoot', price: 15000 },
  sameDayEdit: { label: 'Same Day Edit', price: 20000 },
  familyBytes: { label: 'Family Bytes', price: 8000 },
  liveStreaming: { label: 'Live Streaming', price: 12000 },
  ledWall: { label: 'LED Wall', price: 20000 },
  coffeeMug: { label: 'Coffee Mug', price: 1500 },
  frames: { label: 'Frames', price: 2500 },
  verticalAlbum: { label: 'Vertical Album', price: 7000 },
  candidAlbum: { label: 'Candid Album', price: 9000 },
};

// Advance percentage collected at booking.
export const ADVANCE_PERCENT = 50;

// Recommendation bands — swap for real package definitions whenever ready.
// "max" is the upper bound of the grand total (INR) that still falls in the tier.
export const PACKAGE_TIERS = [
  { key: 'basic', name: 'Basic', max: 150000, blurb: 'Clean, essential coverage for an intimate celebration.' },
  { key: 'premium', name: 'Premium', max: 350000, blurb: 'Full-day coverage with cinematic add-ons — our most booked tier.' },
  { key: 'luxury', name: 'Luxury', max: Infinity, blurb: 'The complete Wedding Mantra experience, multi-day and multi-team.' },
];

export function recommendPackage(grandTotal, tiers = PACKAGE_TIERS) {
  return tiers.find((tier) => grandTotal <= tier.max) ?? tiers[tiers.length - 1];
}

// Combined shape used to seed the Settings store — everything above, in one
// object, so the whole rate card can be edited from the Settings page and
// persisted without touching this file.
export const DEFAULT_PRICING = {
  baseDayRate: BASE_DAY_RATE,
  durationMultiplier: DURATION_MULTIPLIER,
  photographers: PHOTOGRAPHERS,
  cinematographers: CINEMATOGRAPHERS,
  drone: DRONE,
  albums: ALBUMS,
  weddingFilm: WEDDING_FILM,
  reels: REELS,
  extras: EXTRAS,
  advancePercent: ADVANCE_PERCENT,
  packageTiers: PACKAGE_TIERS,
};
