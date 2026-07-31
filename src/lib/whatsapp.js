import { formatINR } from './calculatePrice';

export function buildWhatsAppMessage(formData, priceResult, business) {
  const { contact, occasion, days } = formData;
  const { grandTotal, recommendation } = priceResult;

  const eventLines = (days || [])
    .map((d, i) => `Day ${i + 1}: ${d.eventName || d.ceremony} at ${d.venue} (${d.startTime}–${d.endTime})`)
    .join('\n');

  const servicesLines = (days || [])
    .map((d) => {
      const svcs = [
        d.photographyRequired && 'Photography',
        d.cinematographyRequired && 'Cinematography',
        d.droneRequired && 'Drone',
        d.ledWall && 'LED Wall',
        d.liveStreaming && 'Live Streaming',
        d.reelsRequired && 'Reels',
        d.weddingFilmRequired && 'Wedding Film',
        d.albumRequired && 'Album',
      ].filter(Boolean);
      return svcs.length ? svcs.join(', ') : null;
    })
    .filter(Boolean)
    .join(' | ');

  const message = [
    `Hi ${business.name}! I'd like to book a shoot.`,
    ``,
    `*Name:* ${contact?.name || '-'}`,
    `*Phone:* ${contact?.phone || '-'}`,
    `*Occasion:* ${occasion || '-'}`,
    ``,
    `*Event Details:*`,
    eventLines || '-',
    ``,
    `*Selected Services:* ${servicesLines || '-'}`,
    `*Recommended Package:* ${recommendation?.name || '-'}`,
    `*Total Amount:* ${formatINR(grandTotal)}`,
    ``,
    `Please confirm availability and next steps. Thank you!`,
  ].join('\n');

  return message;
}

export function buildWhatsAppLink(message, whatsappNumber) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildPackageWhatsAppMessage({ pkg, coverage, contact, priceResult, business }) {
  const { grandTotal } = priceResult;
  const packageLabel = coverage === 'bundle' && pkg.bundlePrice ? `${pkg.name} — Premium Bundle (Both Side Coverage)` : pkg.name;
  const addonLines = priceResult.lineItems
    .filter((li) => li.item.startsWith('Add-on:'))
    .map((li) => li.item.replace('Add-on: ', ''));

  const message = [
    `Hi ${business.name}! I'd like to book the ${packageLabel} package.`,
    ``,
    `*Name:* ${contact?.name || '-'}`,
    `*Phone:* ${contact?.phone || '-'}`,
    `*Package:* ${packageLabel}`,
    addonLines.length ? `*Add-ons:* ${addonLines.join(', ')}` : null,
    `*Total Amount:* ${formatINR(grandTotal)}`,
    ``,
    `Please confirm availability and next steps. Thank you!`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  return message;
}
