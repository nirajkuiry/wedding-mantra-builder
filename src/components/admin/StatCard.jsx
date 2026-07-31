export function StatCard({ label, value, sublabel }) {
  return (
    <div className="glass-card p-5">
      <div className="font-body text-[11px] uppercase tracking-wide text-ivory/40">{label}</div>
      <div className="mt-1 font-display text-2xl text-gold">{value}</div>
      {sublabel && <div className="mt-0.5 font-body text-xs text-ivory/40">{sublabel}</div>}
    </div>
  );
}
