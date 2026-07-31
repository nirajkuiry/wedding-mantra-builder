/**
 * @param {object} pkg - the selected package (from useSettingsStore's `packages`)
 * @param {'single'|'bundle'} coverage - 'bundle' = Premium Bundle (Both Side Coverage)
 * @param {object} addons - { drone, reels, weddingFilm, extras: {key: bool} }
 * @param {object} rates - the current pricing rates (from useSettingsStore's `pricing`)
 */
export function calculatePackagePrice(pkg, coverage, addons, rates) {
  const lineItems = [];

  const basePrice = coverage === 'bundle' && pkg.bundlePrice ? pkg.bundlePrice : pkg.price;
  const baseLabel =
    coverage === 'bundle' && pkg.bundlePrice
      ? `${pkg.name} Package — Premium Bundle (Both Side Coverage)`
      : `${pkg.name} Package`;

  lineItems.push({ item: baseLabel, qty: 1, price: basePrice, total: basePrice });

  if (addons.drone && addons.drone !== 'none' && rates.drone[addons.drone]) {
    const d = rates.drone[addons.drone];
    lineItems.push({ item: `Add-on: ${d.label}`, qty: 1, price: d.price, total: d.price });
  }

  if (addons.reels && addons.reels !== 'none' && rates.reels[addons.reels]) {
    const r = rates.reels[addons.reels];
    lineItems.push({ item: `Add-on: Additional ${r.label}`, qty: 1, price: r.price, total: r.price });
  }

  if (addons.weddingFilm && addons.weddingFilm !== 'none' && rates.weddingFilm[addons.weddingFilm]) {
    const w = rates.weddingFilm[addons.weddingFilm];
    lineItems.push({ item: `Add-on: ${w.label}`, qty: 1, price: w.price, total: w.price });
  }

  Object.entries(addons.extras || {}).forEach(([key, checked]) => {
    if (checked && rates.extras[key]) {
      lineItems.push({ item: `Add-on: ${rates.extras[key].label}`, qty: 1, price: rates.extras[key].price, total: rates.extras[key].price });
    }
  });

  const grandTotal = lineItems.reduce((sum, li) => sum + li.total, 0);
  const advance = Math.round((grandTotal * rates.advancePercent) / 100);
  const remaining = grandTotal - advance;

  return { lineItems, grandTotal, advance, remaining };
}
