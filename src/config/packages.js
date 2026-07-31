/**
 * Source of truth for the four ready-made packages, taken directly from
 * Wedding Mantra Films' printed rate card. Edit prices or `includes` lines
 * here whenever the rate card changes — nothing else needs to change.
 *
 * `bundlePrice` is the "Premium Bundle — Both Side Coverage" price for that
 * same tier (covering both the bride's and groom's side functions). Bronze
 * has no bundle option on the rate card.
 */

export const PACKAGES = [
  {
    key: 'bronze',
    name: 'Bronze',
    price: 39999,
    bundlePrice: null,
    days: 1,
    deliveryDays: 30,
    includes: [
      '1 Photographer, 1 Cinematographer & Assist',
      '1 Full Movie (1 Hour)',
      '1 Highlight (3–4 Minutes)',
      '1 Reel',
      "Music/Song as per client's choice",
      'Album — 30 Sheets, 150 Pics (14"x40")',
      '1 Photo Frame (14x20)',
      "Total raw photos (on client's hard disk)",
    ],
  },
  {
    key: 'silver',
    name: 'Silver',
    price: 59999,
    bundlePrice: 99999,
    days: 3,
    deliveryDays: 15,
    includes: [
      'Day 1: 1 Photographer, 1 Cinematographer',
      'Day 2: 1 Photographer, 1 Cinematographer',
      'Day 3: 1 Photographer, 1 Cinematographer & Candid Photographer',
      '1 Full Movie (1–2 Hours)',
      '2 Reels',
      "Music/Song as per client's choice",
      'Album — 30 Sheets, 150 Pics (14"x40")',
      '1 Photo Frame (14x20)',
      "Total raw photos (on client's hard disk)",
    ],
  },
  {
    key: 'gold',
    name: 'Gold',
    price: 79999,
    bundlePrice: 149999,
    days: 3,
    deliveryDays: 15,
    includes: [
      'Day 1: 1 Photographer, 1 Cinematographer & 1 Assist',
      'Day 2: 1 Photographer, 1 Cinematographer & 1 Assist',
      'Day 3: 1 Photographer, 1 Candid Photographer, 2 Cinematographers, 1 Dronegrapher & 1 Assist',
      '1 Full Movie (1–2 Hours)',
      '4 Reels (30–40 Sec)',
      '1 Highlight (3–4 Minutes)',
      "Music/Song as per client's choice",
      'Album — 40 Sheets, 300 Pics (14"x40") — Combo Album 1',
      '2 Printed Coffee Mugs',
      '2 Photo Frames (14x20)',
      "Total raw photos (on client's hard disk)",
    ],
  },
  {
    key: 'platinum',
    name: 'Platinum',
    price: 99999,
    bundlePrice: 179999,
    days: 3,
    deliveryDays: 15,
    includes: [
      'Day 1: 1 Photographer, 2 Cinematographers & 1 Assist',
      'Day 2: 2 Photographers, 2 Cinematographers & 1 Assist',
      'Day 3: 1 Photographer, 1 Candid Photographer, 2 Cinematographers, 1 Dronegrapher & 1 Assist',
      '1 Full Movie (1–2 Hours)',
      '1 Teaser (1–2 Minutes)',
      '6 Reels (30–40 Sec)',
      '1 Highlight (3–4 Minutes)',
      'Family Bytes',
      "Music/Song as per client's choice",
      'Album — 50 Sheets, 300 Pics (14"x40") — Combo Album 2',
      '20-Page Vertical Album (Couple Album)',
      'Candid Album of 100 Photos',
      '4 Printed Coffee Mugs',
      '4 Photo Frames (14x20)',
      "Total raw photos (on client's hard disk)",
    ],
  },
];

export function getPackage(key) {
  return PACKAGES.find((p) => p.key === key);
}

// Alias used when seeding the Settings store's default state.
export const DEFAULT_PACKAGES = PACKAGES;
