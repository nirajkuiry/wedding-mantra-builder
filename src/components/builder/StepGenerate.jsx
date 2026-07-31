import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { useFormContext } from 'react-hook-form';
import { MessageCircle, CheckCircle2 } from 'lucide-react';
import { calculatePrice, formatINR } from '../../lib/calculatePrice';
import { buildWhatsAppMessage, buildWhatsAppLink } from '../../lib/whatsapp';
import { useLeadsStore } from '../../store/useLeadsStore';
import { useSettingsStore } from '../../store/useSettingsStore';

// Loaded only when this step actually renders — keeps the heavy PDF library
// out of the initial builder bundle so the wizard opens fast.
const QuotationPdfButton = lazy(() => import('../pdf/QuotationPdfButton'));

export function StepGenerate() {
  const { watch } = useFormContext();
  const formData = watch();
  const rates = useSettingsStore((s) => s.pricing);
  const business = useSettingsStore((s) => s.business);
  const priceResult = calculatePrice(formData, rates);
  const addLead = useLeadsStore((s) => s.addLead);
  const savedRef = useRef(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    addLead({
      isFutureLead: formData.dateKnown === 'no',
      contact: formData.contact,
      occasion: formData.occasion,
      weddingDate: formData.weddingDate || null,
      days: formData.days,
      addons: formData.addons,
      price: priceResult,
    }).then(() => setSaved(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const waMessage = buildWhatsAppMessage(formData, priceResult, business);
  const waLink = buildWhatsAppLink(waMessage, business.whatsapp);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-ivory">You're all set</h2>
        <p className="mt-1 font-body text-sm text-ivory/50">
          Download your documents or send your package straight to us on WhatsApp.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/[0.06] px-4 py-3 font-body text-sm text-gold">
          <CheckCircle2 size={16} /> Saved — we've received your details and will follow up shortly.
        </div>
      )}

      <div className="glass-card p-5">
        <div className="font-body text-[11px] uppercase tracking-wide text-ivory/40">Grand Total</div>
        <div className="font-display text-3xl text-gold">{formatINR(priceResult.grandTotal)}</div>
        <div className="mt-1 font-body text-xs text-ivory/50">
          {formatINR(priceResult.advance)} advance · {formatINR(priceResult.remaining)} balance
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Suspense fallback={<button type="button" disabled className="btn-ghost w-full opacity-50">Loading…</button>}>
          <QuotationPdfButton
            formData={formData}
            priceResult={priceResult}
            business={business}
            fileName={`WMF-Quotation-${(formData.contact?.name || 'client').replace(/\s+/g, '-')}.pdf`}
            className="btn-ghost w-full"
          />
        </Suspense>

        <a href={waLink} target="_blank" rel="noreferrer" className="btn-gold w-full">
          <MessageCircle size={16} /> Book on WhatsApp
        </a>
      </div>
    </div>
  );
}
