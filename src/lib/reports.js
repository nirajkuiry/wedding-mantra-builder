const CLOSED_LOST_LIKE = new Set(['Closed']);

export function leadTotal(lead) {
  return lead?.price?.grandTotal || 0;
}

export function leadRemaining(lead) {
  return lead?.price?.remaining || 0;
}

export function totalQuotedValue(leads) {
  return leads.reduce((sum, l) => sum + leadTotal(l), 0);
}

// Pending = balance still owed on anything actively moving through the
// pipeline (i.e. not yet Closed). Simple and adjustable.
export function totalPendingPayments(leads) {
  return leads.filter((l) => !CLOSED_LOST_LIKE.has(l.status)).reduce((sum, l) => sum + leadRemaining(l), 0);
}

// Last 6 calendar months (including current), each bucket = sum of quoted
// value for leads created in that month.
export function monthlyRevenue(leads) {
  const now = new Date();
  const buckets = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }), total: 0 });
  }
  const byKey = Object.fromEntries(buckets.map((b) => [b.key, b]));

  leads.forEach((l) => {
    const d = new Date(l.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (byKey[key]) byKey[key].total += leadTotal(l);
  });

  return buckets;
}

export function upcomingEvents(leads) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return leads
    .filter((l) => l.weddingDate)
    .map((l) => ({ lead: l, date: new Date(l.weddingDate) }))
    .filter((e) => !Number.isNaN(e.date.getTime()) && e.date >= today)
    .sort((a, b) => a.date - b.date);
}

export function groupByStatus(leads, statuses) {
  const groups = Object.fromEntries(statuses.map((s) => [s, []]));
  leads.forEach((l) => {
    if (!groups[l.status]) groups[l.status] = [];
    groups[l.status].push(l);
  });
  return groups;
}

export function leadDisplayName(lead) {
  return lead?.contact?.name || 'Unnamed Lead';
}

export function leadServiceLabel(lead) {
  if (lead.flow === 'package') return `${lead.packageName || 'Package'}${lead.coverage === 'bundle' ? ' (Bundle)' : ''}`;
  return lead.occasion || 'Custom Quote';
}

export function recentActivity(leads, limit = 12) {
  const items = [];
  leads.forEach((l) => {
    (l.activity || []).forEach((a) => {
      items.push({ ...a, leadId: l.id, leadName: leadDisplayName(l) });
    });
  });
  return items.sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, limit);
}

export function matchesSearch(lead, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return [
    lead.contact?.name,
    lead.contact?.phone,
    lead.contact?.email,
    lead.occasion,
    lead.packageName,
    lead.status,
  ]
    .filter(Boolean)
    .some((field) => String(field).toLowerCase().includes(q));
}
