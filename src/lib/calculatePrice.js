import { recommendPackageTier } from '../store/useSettingsStore';

/**
 * @param {object} formData — the full builder form state (see builderSchema)
 * @param {object} rates — the current pricing rates (from useSettingsStore's `pricing`)
 * @returns {{ lineItems: Array<{item:string, qty:number, price:number, total:number}>, grandTotal:number, advance:number, remaining:number, recommendation:object }}
 */
export function calculatePrice(formData, rates) {
  const lineItems = [];

  (formData.days || []).forEach((day, i) => {
    const durationInfo = rates.durationMultiplier[day.duration] ?? rates.durationMultiplier['3-5'];
    const dayTotal = Math.round(rates.baseDayRate * durationInfo.multiplier);
    lineItems.push({
      item: `Day ${i + 1} Coverage — ${day.eventName || day.ceremony || 'Event'} (${durationInfo.label})`,
      qty: 1,
      price: dayTotal,
      total: dayTotal,
    });
  });

  const addons = formData.addons || {};

  if (addons.photographers && rates.photographers[addons.photographers]) {
    const p = rates.photographers[addons.photographers];
    lineItems.push({ item: p.label, qty: 1, price: p.price, total: p.price });
  }
  if (addons.cinematographers && rates.cinematographers[addons.cinematographers]) {
    const c = rates.cinematographers[addons.cinematographers];
    lineItems.push({ item: c.label, qty: 1, price: c.price, total: c.price });
  }
  if (addons.drone && addons.drone !== 'none' && rates.drone[addons.drone]) {
    const d = rates.drone[addons.drone];
    lineItems.push({ item: d.label, qty: 1, price: d.price, total: d.price });
  }
  if (addons.album && addons.album !== 'none' && rates.albums[addons.album]) {
    const a = rates.albums[addons.album];
    lineItems.push({ item: a.label, qty: 1, price: a.price, total: a.price });
  }
  if (addons.weddingFilm && addons.weddingFilm !== 'none' && rates.weddingFilm[addons.weddingFilm]) {
    const w = rates.weddingFilm[addons.weddingFilm];
    lineItems.push({ item: w.label, qty: 1, price: w.price, total: w.price });
  }
  if (addons.reels && addons.reels !== 'none' && rates.reels[addons.reels]) {
    const r = rates.reels[addons.reels];
    lineItems.push({ item: r.label, qty: 1, price: r.price, total: r.price });
  }

  Object.entries(addons.extras || {}).forEach(([key, checked]) => {
    if (checked && rates.extras[key]) {
      lineItems.push({ item: rates.extras[key].label, qty: 1, price: rates.extras[key].price, total: rates.extras[key].price });
    }
  });

  const grandTotal = lineItems.reduce((sum, li) => sum + li.total, 0);
  const advance = Math.round((grandTotal * rates.advancePercent) / 100);
  const remaining = grandTotal - advance;
  const recommendation = recommendPackageTier(grandTotal, rates.packageTiers);

  return { lineItems, grandTotal, advance, remaining, recommendation };
}

export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}
