import { LeadCard } from './LeadCard';

export function PipelineBoard({ statuses, groups, onOpenLead }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-3">
      {statuses.map((status) => {
        const leads = groups[status] || [];
        return (
          <div key={status} className="w-64 shrink-0">
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="font-body text-xs font-semibold uppercase tracking-wide text-ivory/60">{status}</span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 font-body text-[10px] text-ivory/40">{leads.length}</span>
            </div>
            <div className="space-y-2">
              {leads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} onOpen={onOpenLead} />
              ))}
              {!leads.length && (
                <div className="rounded-xl border border-dashed border-white/10 p-4 text-center font-body text-[11px] text-ivory/20">
                  Empty
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
