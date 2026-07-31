import clsx from 'clsx';

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left transition hover:border-gold/30"
    >
      <span className="font-body text-sm text-ivory/80">{label}</span>
      <span
        className={clsx(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-gold' : 'bg-white/15'
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 h-5 w-5 rounded-full bg-ink transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </span>
    </button>
  );
}
