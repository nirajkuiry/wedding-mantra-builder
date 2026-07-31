import { leadTotal, leadRemaining, leadDisplayName, leadServiceLabel } from './reports';

function csvEscape(value) {
  const s = String(value ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function exportLeadsCsv(leads) {
  const headers = [
    'Name',
    'Phone',
    'Email',
    'Service',
    'Status',
    'Delivery Status',
    'Wedding Date',
    'Grand Total',
    'Advance',
    'Remaining',
    'Assigned Editor',
    'Assigned Photographer',
    'Assigned Cinematographer',
    'Created At',
  ];

  const rows = leads.map((l) => [
    leadDisplayName(l),
    l.contact?.phone || '',
    l.contact?.email || '',
    leadServiceLabel(l),
    l.status || '',
    l.deliveryStatus || '',
    l.weddingDate || '',
    leadTotal(l),
    l.price?.advance || 0,
    leadRemaining(l),
    l.assignedEditor || '',
    l.assignedPhotographer || '',
    l.assignedCinematographer || '',
    l.createdAt || '',
  ]);

  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `WMF-Leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
