import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, CheckCircle2 } from 'lucide-react';

import { PackageCard } from '../components/packages/PackageCard';
import { ChoiceCard } from '../components/ui/ChoiceCard';
import { Toggle } from '../components/ui/Toggle';
import { calculatePackagePrice } from '../lib/calculatePackagePrice';
import { formatINR } from '../lib/calculatePrice';
import { buildPackageWhatsAppMessage, buildWhatsAppLink } from '../lib/whatsapp';
import { contactSchema } from '../schemas/builderSchema';
import { useLeadsStore } from '../store/useLeadsStore';
import { useSettingsStore } from '../store/useSettingsStore';

// Loaded only when the final step actually renders — keeps the heavy PDF
// library out of the initial bundle so the package flow opens fast.
const QuotationPdfButton = lazy(() => import('../components/pdf/QuotationPdfButton'));

const STEPS = ['select', 'customize', 'contact', 'generate'];
const STEP_LABELS = { select: 'Package', customize: 'Add-Ons', contact: 'Your Details', generate: 'Confirm & Send' };

const emptyAddons = {
  drone: 'none',
  reels: 'none',
  weddingFilm: 'none',
  extras: {
    coupleShoot: false,
    sameDayEdit: false,
    familyBytes: false,
    liveStreaming: false,
    ledWall: false,
    coffeeMug: false,
    frames: false,
    verticalAlbum: false,
    candidAlbum: false,
  },
};

export default function PackageFlow() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState(null);
  const [coverage, setCoverage] = useState('single');
  const [addons, setAddons] = useState(emptyAddons);
  const [contact, setContact] = useState({ name: '', phone: '', email: '', address: '' });
  const [contactErrors, setContactErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const savedRef = useRef(false);
  const addLead = useLeadsStore((s) => s.addLead);
  const packages = useSettingsStore((s) => s.packages);
  const rates = useSettingsStore((s) => s.pricing);
  const business = useSettingsStore((s) => s.business);

  const pkg = packages.find((p) => p.key === selectedKey);
  const stepKey = STEPS[stepIndex];
  const priceResult = pkg ? calculatePackagePrice(pkg, coverage, addons, rates) : null;

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleSelectPackage = (key) => {
    setSelectedKey(key);
    setCoverage('single');
    goNext();
  };

  const handleContactNext = () => {
    const result = contactSchema.safeParse(contact);
    if (!result.success) {
      const errs = {};
      result.error.issues.forEach((issue) => {
        errs[issue.path.join('.')] = issue.message;
      });
      setContactErrors(errs);
      return;
    }
    setContactErrors({});
    goNext();
  };

  useEffect(() => {
    if (stepKey !== 'generate' || savedRef.current || !pkg) return;
    savedRef.current = true;
    addLead({
      flow: 'package',
      packageName: pkg.name,
      coverage,
      contact,
      addons,
      price: priceResult,
    }).then(() => setSaved(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey]);

  const waMessage = priceResult ? buildPackageWhatsAppMessage({ pkg, coverage, contact, priceResult, business }) : '';
  const waLink = buildWhatsAppLink(waMessage, business.whatsapp);

  // Minimal shape QuotationDocument expects — no per-day schedule for this flow.
  const pdfFormData = {
    contact,
    occasion: pkg ? `${pkg.name} Package${coverage === 'bundle' ? ' (Premium Bundle)' : ''}` : '',
    weddingDate: '',
    days: [],
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-ink/80 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-body text-sm text-ivory/60 hover:text-gold">
            <ArrowLeft size={16} /> Back
          </Link>
          <img src="/assets/logo.png" alt={business.name} className="h-9 w-auto" />
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
        {/* Simple step indicator */}
        <div className="mb-8 flex items-center gap-2">
          {STEPS.map((k, i) => (
            <div key={k} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-body text-xs ${
                  i <= stepIndex ? 'border-gold text-gold' : 'border-white/15 text-ivory/30'
                }`}
              >
                {i + 1}
              </div>
              <span className={`hidden font-body text-xs sm:block ${i <= stepIndex ? 'text-ivory/70' : 'text-ivory/30'}`}>
                {STEP_LABELS[k]}
              </span>
              {i < STEPS.length - 1 && <div className="h-px flex-1 bg-white/10" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={stepKey}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {stepKey === 'select' && (
              <div>
                <h2 className="font-display text-3xl text-ivory">Choose your package</h2>
                <p className="mt-1 mb-6 font-body text-sm text-ivory/50">
                  Start with a ready-made package — you can add extras next.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {packages.map((p) => (
                    <PackageCard key={p.key} pkg={p} onSelect={() => handleSelectPackage(p.key)} />
                  ))}
                </div>
              </div>
            )}

            {stepKey === 'customize' && pkg && (
              <div className="glass-card space-y-7 p-6 sm:p-8">
                <div>
                  <h2 className="font-display text-3xl text-ivory">{pkg.name} Package</h2>
                  <p className="mt-1 font-body text-sm text-ivory/50">
                    Here's what's included — add anything extra below. Unchecking an included item is just for your
                    own reference; it won't change the price.
                  </p>
                </div>

                <div>
                  <div className="field-label mb-2">What's Included</div>
                  <ul className="grid gap-1.5 sm:grid-cols-2">
                    {pkg.includes.map((line) => (
                      <li key={line} className="font-body text-xs text-ivory/60">
                        • {line}
                      </li>
                    ))}
                  </ul>
                </div>

                {pkg.bundlePrice && (
                  <div>
                    <div className="field-label mb-2">Coverage</div>
                    <div className="grid grid-cols-2 gap-2 sm:max-w-sm">
                      <ChoiceCard
                        label="One Side"
                        sublabel={formatINR(pkg.price)}
                        active={coverage === 'single'}
                        onClick={() => setCoverage('single')}
                      />
                      <ChoiceCard
                        label="Both Sides"
                        sublabel={formatINR(pkg.bundlePrice)}
                        active={coverage === 'bundle'}
                        onClick={() => setCoverage('bundle')}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="field-label mb-2">Drone</div>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(rates.drone).map(([key, opt]) => (
                      <ChoiceCard
                        key={key}
                        label={opt.label}
                        sublabel={opt.price ? formatINR(opt.price) : undefined}
                        active={addons.drone === key}
                        onClick={() => setAddons((a) => ({ ...a, drone: key }))}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="field-label mb-2">Additional Reels</div>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {Object.entries(rates.reels).map(([key, opt]) => (
                      <ChoiceCard
                        key={key}
                        label={opt.label}
                        sublabel={opt.price ? formatINR(opt.price) : undefined}
                        active={addons.reels === key}
                        onClick={() => setAddons((a) => ({ ...a, reels: key }))}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="field-label mb-2">Additional Wedding Film</div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {Object.entries(rates.weddingFilm).map(([key, opt]) => (
                      <ChoiceCard
                        key={key}
                        label={opt.label}
                        sublabel={opt.price ? formatINR(opt.price) : undefined}
                        active={addons.weddingFilm === key}
                        onClick={() => setAddons((a) => ({ ...a, weddingFilm: key }))}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="field-label mb-2">Optional Extras</div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {Object.entries(rates.extras).map(([key, opt]) => (
                      <Toggle
                        key={key}
                        label={`${opt.label} — ${formatINR(opt.price)}`}
                        checked={!!addons.extras[key]}
                        onChange={(val) => setAddons((a) => ({ ...a, extras: { ...a.extras, [key]: val } }))}
                      />
                    ))}
                  </div>
                </div>

                <div className="gold-hairline" />
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-ivory/50">Running Total</span>
                  <span className="font-display text-2xl text-gold">{formatINR(priceResult.grandTotal)}</span>
                </div>
              </div>
            )}

            {stepKey === 'contact' && (
              <div className="glass-card space-y-5 p-6 sm:p-8">
                <div>
                  <h2 className="font-display text-3xl text-ivory">Your details</h2>
                  <p className="mt-1 font-body text-sm text-ivory/50">So we know who to send your quotation to.</p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="field-label">Full Name</label>
                    <input
                      className="field-input"
                      value={contact.name}
                      onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                    />
                    {contactErrors.name && <p className="field-error">{contactErrors.name}</p>}
                  </div>
                  <div>
                    <label className="field-label">Phone Number</label>
                    <input
                      className="field-input"
                      value={contact.phone}
                      onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                    />
                    {contactErrors.phone && <p className="field-error">{contactErrors.phone}</p>}
                  </div>
                  <div>
                    <label className="field-label">Email (optional)</label>
                    <input
                      className="field-input"
                      value={contact.email}
                      onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                    />
                    {contactErrors.email && <p className="field-error">{contactErrors.email}</p>}
                  </div>
                  <div>
                    <label className="field-label">Address (optional)</label>
                    <input
                      className="field-input"
                      value={contact.address}
                      onChange={(e) => setContact((c) => ({ ...c, address: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {stepKey === 'generate' && pkg && (
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

                <div className="glass-card overflow-hidden">
                  <table className="w-full text-left font-body text-sm">
                    <tbody>
                      {priceResult.lineItems.map((li, i) => (
                        <tr key={i} className="border-b border-white/5 last:border-0">
                          <td className="px-4 py-3 text-ivory/80">{li.item}</td>
                          <td className="px-4 py-3 text-right text-ivory/80">{formatINR(li.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="gold-hairline" />
                  <div className="p-4">
                    <div className="font-body text-[11px] uppercase tracking-wide text-ivory/40">Grand Total</div>
                    <div className="font-display text-3xl text-gold">{formatINR(priceResult.grandTotal)}</div>
                    <div className="mt-1 font-body text-xs text-ivory/50">
                      {formatINR(priceResult.advance)} advance · {formatINR(priceResult.remaining)} balance
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Suspense fallback={<button type="button" disabled className="btn-ghost w-full opacity-50">Loading…</button>}>
                    <QuotationPdfButton
                      formData={pdfFormData}
                      priceResult={priceResult}
                      business={business}
                      fileName={`WMF-Quotation-${(contact.name || 'client').replace(/\s+/g, '-')}.pdf`}
                      className="btn-ghost w-full"
                    />
                  </Suspense>

                  <a href={waLink} target="_blank" rel="noreferrer" className="btn-gold w-full">
                    <MessageCircle size={16} /> Book on WhatsApp
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {stepKey !== 'select' && (
          <div className="mt-6 flex items-center justify-between">
            <button type="button" onClick={goBack} className="btn-ghost">
              <ChevronLeft size={16} /> Back
            </button>
            {stepKey !== 'generate' && (
              <button
                type="button"
                onClick={stepKey === 'contact' ? handleContactNext : goNext}
                className="btn-gold"
              >
                Continue <ChevronRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
