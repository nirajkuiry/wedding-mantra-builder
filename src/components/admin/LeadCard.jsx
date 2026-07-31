import { formatINR } from '../../lib/calculatePrice';
import { leadDisplayName, leadServiceLabel, leadTotal } from '../../lib/reports';

export function LeadCard({ lead, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(lead)}
      className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-gold/40 hover:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-body text-sm font-medium text-ivory/90">{leadDisplayName(lead)}</span>
        {lead.isFutureLead && (
          <span className="shrink-0 rounded-full bg-gold/10 px-2 py-0.5 font-body text-[9px] uppercase tracking-wide text-gold">
            Future
          </span>
        )}
      </div>
      <div className="mt-1 font-body text-xs text-ivory/50">{leadServiceLabel(lead)}</div>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-body text-xs text-ivory/40">{lead.contact?.phone}</span>
        <span className="font-display text-sm text-gold">{formatINR(leadTotal(lead))}</span>
      </div>
    </button>
  );
}
