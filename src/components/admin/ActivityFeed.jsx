export function ActivityFeed({ items }) {
  return (
    <div className="glass-card p-5">
      <div className="font-body text-[11px] uppercase tracking-wide text-ivory/40">Recent Activity</div>
      <div className="mt-3 space-y-3 border-l border-white/10 pl-4">
        {items.map((a, i) => (
          <div key={i}>
            <div className="font-body text-sm text-ivory/70">
              <span className="text-gold">{a.leadName}</span> — {a.message}
            </div>
            <div className="font-body text-[11px] text-ivory/30">{new Date(a.ts).toLocaleString('en-IN')}</div>
          </div>
        ))}
        {!items.length && <p className="font-body text-xs text-ivory/30">No activity yet.</p>}
      </div>
    </div>
  );
}
