import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BUSINESS as DEFAULT_BUSINESS } from '../config/options';
import { PACKAGES as DEFAULT_PACKAGES } from '../config/packages';
import {
  BASE_DAY_RATE,
  DURATION_MULTIPLIER,
  PHOTOGRAPHERS,
  CINEMATOGRAPHERS,
  DRONE,
  ALBUMS,
  WEDDING_FILM,
  REELS,
  EXTRAS,
  ADVANCE_PERCENT,
  PACKAGE_TIERS,
} from '../config/pricing';

const clone = (v) => JSON.parse(JSON.stringify(v));

// Note: the top package tier's "no upper bound" is represented as this large
// finite number rather than Infinity — Infinity doesn't survive JSON
// serialization, and settings are persisted to localStorage as JSON on every
// change, so a real number is needed for it to keep working after a reload.
const NO_CEILING = 99999999;

const DEFAULT_PRICING = clone({
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
  packageTiers: PACKAGE_TIERS.map((t) => ({ ...t, max: t.max === Infinity ? NO_CEILING : t.max })),
});

export const useSettingsStore = create(
  persist(
    (set) => ({
      business: clone(DEFAULT_BUSINESS),
      packages: clone(DEFAULT_PACKAGES),
      pricing: clone(DEFAULT_PRICING),

      updateBusiness: (partial) => set((state) => ({ business: { ...state.business, ...partial } })),

      updatePackage: (key, partial) =>
        set((state) => ({
          packages: state.packages.map((p) => (p.key === key ? { ...p, ...partial } : p)),
        })),

      addPackage: (pkg) => set((state) => ({ packages: [...state.packages, pkg] })),

      removePackage: (key) => set((state) => ({ packages: state.packages.filter((p) => p.key !== key) })),

      // category: 'photographers' | 'cinematographers' | 'drone' | 'albums' | 'weddingFilm' | 'reels' | 'extras'
      updateOptionPrice: (category, optionKey, price) =>
        set((state) => ({
          pricing: {
            ...state.pricing,
            [category]: {
              ...state.pricing[category],
              [optionKey]: { ...state.pricing[category][optionKey], price },
            },
          },
        })),

      updateDurationMultiplier: (durationKey, multiplier) =>
        set((state) => ({
          pricing: {
            ...state.pricing,
            durationMultiplier: {
              ...state.pricing.durationMultiplier,
              [durationKey]: { ...state.pricing.durationMultiplier[durationKey], multiplier },
            },
          },
        })),

      updateBaseDayRate: (value) => set((state) => ({ pricing: { ...state.pricing, baseDayRate: value } })),

      updateAdvancePercent: (value) => set((state) => ({ pricing: { ...state.pricing, advancePercent: value } })),

      updatePackageTier: (key, partial) =>
        set((state) => ({
          pricing: {
            ...state.pricing,
            packageTiers: state.pricing.packageTiers.map((t) => (t.key === key ? { ...t, ...partial } : t)),
          },
        })),

      resetToDefaults: () =>
        set({
          business: clone(DEFAULT_BUSINESS),
          packages: clone(DEFAULT_PACKAGES),
          pricing: clone(DEFAULT_PRICING),
        }),
    }),
    { name: 'wmf-settings-storage' }
  )
);

export function recommendPackageTier(grandTotal, tiers) {
  return tiers.find((tier) => grandTotal <= tier.max) ?? tiers[tiers.length - 1];
}
