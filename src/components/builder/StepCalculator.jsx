import { useFormContext } from 'react-hook-form';
import { calculatePrice, formatINR } from '../../lib/calculatePrice';
import { useSettingsStore } from '../../store/useSettingsStore';
import clsx from 'clsx';

export function StepCalculator() {
  const { watch } = useFormContext();
  const formData = watch();
  const rates = useSettingsStore((s) => s.pricing);
  const { lineItems, grandTotal, advance, remaining, recommendation } = calculatePrice(formData, rates);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-ivory">Your live estimate</h2>
        <p className="mt-1 font-body text-sm text-ivory/50">
          Updates instantly as you change your selections — go back anytime to adjust.
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left font-body text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[11px] uppercase tracking-wide text-ivory/40">
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((li, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3 text-ivory/80">{li.item}</td>
                <td className="px-4 py-3 text-ivory/50">{li.qty}</td>
                <td className="px-4 py-3 text-right text-ivory/80">{formatINR(li.total)}</td>
              </tr>
            ))}
            {!lineItems.length && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-ivory/40">
                  Add some services in earlier steps to see pricing here.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="gold-hairline" />

        <div className="grid gap-3 p-4 sm:grid-cols-3">
          <div>
            <div className="font-body text-[11px] uppercase tracking-wide text-ivory/40">Grand Total</div>
            <div className="font-display text-2xl text-gold">{formatINR(grandTotal)}</div>
          </div>
          <div>
            <div className="font-body text-[11px] uppercase tracking-wide text-ivory/40">50% Advance</div>
            <div className="font-display text-2xl text-ivory">{formatINR(advance)}</div>
          </div>
          <div>
            <div className="font-body text-[11px] uppercase tracking-wide text-ivory/40">Remaining Balance</div>
            <div className="font-display text-2xl text-ivory">{formatINR(remaining)}</div>
          </div>
        </div>
      </div>

      <div>
        <div className="field-label mb-3">Recommended For You</div>
        <div className="grid gap-3 sm:grid-cols-3">
          {rates.packageTiers.map((tier) => (
            <div
              key={tier.key}
              className={clsx(
                'glass-card p-4 transition',
                recommendation.key === tier.key && 'border-gold/70 shadow-goldGlow'
              )}
            >
              <div className={clsx('font-display text-xl', recommendation.key === tier.key ? 'text-gold' : 'text-ivory')}>
                {tier.name}
              </div>
              <p className="mt-1 font-body text-xs text-ivory/50">{tier.blurb}</p>
              {recommendation.key === tier.key && (
                <div className="mt-2 inline-block rounded-full bg-gold/10 px-2 py-0.5 font-body text-[10px] uppercase tracking-wide text-gold">
                  Best match
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
