import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import { formatINR } from '../../lib/calculatePrice';

export function PackageCard({ pkg, onSelect, highlighted }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={clsx(
        'glass-card flex flex-col p-6 transition',
        highlighted && 'border-gold/70 shadow-goldGlow'
      )}
    >
      <div className="font-body text-[11px] uppercase tracking-[0.2em] text-ivory/40">
        {pkg.days} {pkg.days === 1 ? 'Day' : 'Days'} Coverage
      </div>
      <div className="mt-1 font-display text-3xl text-ivory">{pkg.name}</div>
      <div className="mt-2 font-display text-2xl text-gold">{formatINR(pkg.price)}</div>
      {pkg.bundlePrice && (
        <div className="mt-0.5 font-body text-xs text-ivory/40">
          {formatINR(pkg.bundlePrice)} for Both Side Coverage
        </div>
      )}

      <ul className="mt-5 flex-1 space-y-2">
        {pkg.includes.slice(0, 6).map((line) => (
          <li key={line} className="flex items-start gap-2 font-body text-xs text-ivory/60">
            <Check size={13} className="mt-0.5 shrink-0 text-gold/70" />
            <span>{line}</span>
          </li>
        ))}
        {pkg.includes.length > 6 && (
          <li className="font-body text-xs text-ivory/30">+ {pkg.includes.length - 6} more included</li>
        )}
      </ul>

      <button type="button" onClick={onSelect} className="btn-gold mt-6 w-full">
        Choose {pkg.name}
      </button>
    </motion.div>
  );
}
