import clsx from 'clsx';
import { motion } from 'framer-motion';

const LABELS = {
  contact: 'Your Details',
  occasion: 'Occasion',
  dateKnown: 'The Date',
  dayCount: 'Event Days',
  dayDetails: 'Day by Day',
  addons: 'Add-Ons',
  calculator: 'Your Estimate',
  generate: 'Confirm & Send',
};

export function ProgressRail({ steps, activeIndex, onSelect }) {
  return (
    <div className="mb-10 flex items-center gap-1 overflow-x-auto pb-2 sm:gap-2">
      {steps.map((key, i) => {
        const state = i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'upcoming';
        return (
          <div key={key} className="flex flex-1 items-center gap-1 sm:gap-2">
            <button
              type="button"
              disabled={state === 'upcoming'}
              onClick={() => onSelect(i)}
              className={clsx(
                'group relative flex w-full flex-col items-center rounded-lg border px-2 py-2 text-center transition disabled:cursor-not-allowed',
                state === 'active' && 'border-gold/70 bg-gold/[0.08] shadow-goldGlow',
                state === 'done' && 'border-gold/30 bg-white/[0.02] hover:border-gold/50',
                state === 'upcoming' && 'border-white/10 bg-transparent opacity-40'
              )}
            >
              {state === 'active' && (
                <motion.span
                  layoutId="rail-shimmer"
                  className="absolute inset-0 rounded-lg bg-gold-foil opacity-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={clsx('font-display text-xs sm:text-sm', state === 'active' ? 'text-gold' : 'text-ivory/70')}>
                {i + 1}
              </span>
              <span className="mt-0.5 hidden font-body text-[10px] uppercase tracking-wide text-ivory/40 sm:block">
                {LABELS[key]}
              </span>
            </button>
            {i < steps.length - 1 && <div className="h-px w-3 shrink-0 bg-white/10 sm:w-6" />}
          </div>
        );
      })}
    </div>
  );
}
