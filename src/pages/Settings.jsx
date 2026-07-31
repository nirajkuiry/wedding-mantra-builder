import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { formatINR } from '../lib/calculatePrice';

const OPTION_GROUPS = [
  { key: 'photographers', title: 'Photographers' },
  { key: 'cinematographers', title: 'Cinematographers' },
  { key: 'drone', title: 'Drone' },
  { key: 'albums', title: 'Albums' },
  { key: 'weddingFilm', title: 'Wedding Film' },
  { key: 'reels', title: 'Instagram Reels' },
  { key: 'extras', title: 'Optional Extras' },
];

function Section({ title, subtitle, children }) {
  return (
    <div className="glass-card p-6 sm:p-8">
      <h2 className="font-display text-2xl text-ivory">{title}</h2>
      {subtitle && <p className="mt-1 font-body text-sm text-ivory/50">{subtitle}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </div>
  );
}

function Saved({ show }) {
  if (!show) return null;
  return (
    <span className="inline-flex items-center gap-1 font-body text-xs text-gold">
      <CheckCircle2 size={13} /> Saved
    </span>
  );
}

export default function Settings() {
  const business = useSettingsStore((s) => s.business);
  const packages = useSettingsStore((s) => s.packages);
  const pricing = useSettingsStore((s) => s.pricing);
  const updateBusiness = useSettingsStore((s) => s.updateBusiness);
  const updatePackage = useSettingsStore((s) => s.updatePackage);
  const updateOptionPrice = useSettingsStore((s) => s.updateOptionPrice);
  const updateDurationMultiplier = useSettingsStore((s) => s.updateDurationMultiplier);
  const updateBaseDayRate = useSettingsStore((s) => s.updateBaseDayRate);
  const updateAdvancePercent = useSettingsStore((s) => s.updateAdvancePercent);
  const updatePackageTier = useSettingsStore((s) => s.updatePackageTier);
  const resetToDefaults = useSettingsStore((s) => s.resetToDefaults);

  const [savedPing, setSavedPing] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);

  // Every field calls this after its own update so a brief "Saved" shows —
  // changes are already persisted the moment the store updates (localStorage).
  const ping = () => setSavedPing((n) => n + 1);

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetToDefaults();
    setConfirmReset(false);
    ping();
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-ink/80 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-body text-sm text-ivory/60 hover:text-gold">
            <ArrowLeft size={16} /> Back
          </Link>
          <div className="flex items-center gap-3">
            <Saved show={savedPing > 0} />
            <button
              type="button"
              onClick={handleReset}
              onBlur={() => setConfirmReset(false)}
              className="btn-ghost !px-4 !py-2 text-xs"
            >
              <RotateCcw size={13} /> {confirmReset ? 'Click again to confirm' : 'Reset to Defaults'}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:py-16">
        <div>
          <h1 className="font-display text-4xl text-ivory">Studio Settings</h1>
          <p className="mt-1 font-body text-sm text-ivory/50">
            Everything here updates the site immediately — no code, no developer needed. Changes are saved to
            this browser automatically.
          </p>
        </div>

        {/* Business Info */}
        <Section title="Business Info" subtitle="Shown on the site, in quotations, and used for the WhatsApp button.">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label">Business Name</label>
              <input
                className="field-input"
                value={business.name}
                onChange={(e) => {
                  updateBusiness({ name: e.target.value });
                  ping();
                }}
              />
            </div>
            <div>
              <label className="field-label">Tagline</label>
              <input
                className="field-input"
                value={business.tagline}
                onChange={(e) => {
                  updateBusiness({ tagline: e.target.value });
                  ping();
                }}
              />
            </div>
            <div>
              <label className="field-label">Phone (for display)</label>
              <input
                className="field-input"
                value={business.phone}
                onChange={(e) => {
                  updateBusiness({ phone: e.target.value });
                  ping();
                }}
              />
            </div>
            <div>
              <label className="field-label">WhatsApp Number</label>
              <input
                className="field-input"
                value={business.whatsapp}
                placeholder="Country code + number, digits only, e.g. 919288277233"
                onChange={(e) => {
                  updateBusiness({ whatsapp: e.target.value.replace(/[^0-9]/g, '') });
                  ping();
                }}
              />
              <p className="mt-1 font-body text-[11px] text-ivory/30">
                Digits only, with country code — this is what the "Book on WhatsApp" button uses.
              </p>
            </div>
            <div>
              <label className="field-label">Instagram Handle</label>
              <input
                className="field-input"
                value={business.instagram}
                onChange={(e) => {
                  updateBusiness({ instagram: e.target.value });
                  ping();
                }}
              />
            </div>
            <div>
              <label className="field-label">Website</label>
              <input
                className="field-input"
                value={business.website}
                onChange={(e) => {
                  updateBusiness({ website: e.target.value });
                  ping();
                }}
              />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input
                className="field-input"
                value={business.email}
                onChange={(e) => {
                  updateBusiness({ email: e.target.value });
                  ping();
                }}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Address</label>
              <input
                className="field-input"
                value={business.address}
                onChange={(e) => {
                  updateBusiness({ address: e.target.value });
                  ping();
                }}
              />
            </div>
          </div>
        </Section>

        {/* Packages */}
        <Section title="Package Pricing" subtitle="Your four ready-made packages, shown on the /packages page.">
          {packages.map((pkg) => (
            <div key={pkg.key} className="rounded-xl border border-white/10 p-4">
              <div className="font-display text-xl text-gold">{pkg.name}</div>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="field-label">Price (One Side)</label>
                  <input
                    type="number"
                    className="field-input"
                    value={pkg.price}
                    onChange={(e) => {
                      updatePackage(pkg.key, { price: Number(e.target.value) || 0 });
                      ping();
                    }}
                  />
                </div>
                <div>
                  <label className="field-label">Bundle Price (Both Sides)</label>
                  <input
                    type="number"
                    className="field-input"
                    placeholder="Leave 0 for none"
                    value={pkg.bundlePrice ?? 0}
                    onChange={(e) => {
                      const v = Number(e.target.value) || 0;
                      updatePackage(pkg.key, { bundlePrice: v || null });
                      ping();
                    }}
                  />
                </div>
                <div>
                  <label className="field-label">Delivery Days</label>
                  <input
                    type="number"
                    className="field-input"
                    value={pkg.deliveryDays}
                    onChange={(e) => {
                      updatePackage(pkg.key, { deliveryDays: Number(e.target.value) || 0 });
                      ping();
                    }}
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="field-label">What's Included (one line each)</label>
                <textarea
                  rows={Math.min(10, Math.max(4, pkg.includes.length))}
                  className="field-input resize-y font-mono text-xs"
                  value={pkg.includes.join('\n')}
                  onChange={(e) => {
                    updatePackage(pkg.key, { includes: e.target.value.split('\n') });
                    ping();
                  }}
                  onBlur={(e) => {
                    updatePackage(pkg.key, {
                      includes: e.target.value.split('\n').map((l) => l.trim()).filter(Boolean),
                    });
                    ping();
                  }}
                />
              </div>
            </div>
          ))}
        </Section>

        {/* Add-on pricing */}
        <Section
          title="Add-On Pricing"
          subtitle="Used by both the package customizer and the fully custom builder."
        >
          {OPTION_GROUPS.map((group) => (
            <div key={group.key}>
              <div className="field-label mb-2">{group.title}</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(pricing[group.key]).map(([optKey, opt]) => (
                  <div key={optKey} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2">
                    <span className="font-body text-xs text-ivory/70">{opt.label}</span>
                    <input
                      type="number"
                      className="field-input !w-28 !py-1.5 text-right"
                      value={opt.price}
                      onChange={(e) => {
                        updateOptionPrice(group.key, optKey, Number(e.target.value) || 0);
                        ping();
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Section>

        {/* Day coverage + advance */}
        <Section
          title="Custom Builder Rates"
          subtitle="Used only by the fully-custom, day-by-day builder."
        >
          <div>
            <label className="field-label">Base Day Rate (before duration multiplier)</label>
            <input
              type="number"
              className="field-input max-w-xs"
              value={pricing.baseDayRate}
              onChange={(e) => {
                updateBaseDayRate(Number(e.target.value) || 0);
                ping();
              }}
            />
          </div>

          <div>
            <div className="field-label mb-2">Duration Multipliers</div>
            <div className="grid gap-2 sm:grid-cols-3">
              {Object.entries(pricing.durationMultiplier).map(([key, d]) => (
                <div key={key} className="flex items-center justify-between gap-2 rounded-lg border border-white/10 px-3 py-2">
                  <span className="font-body text-xs text-ivory/70">{d.label}</span>
                  <input
                    type="number"
                    step="0.1"
                    className="field-input !w-20 !py-1.5 text-right"
                    value={d.multiplier}
                    onChange={(e) => {
                      updateDurationMultiplier(key, Number(e.target.value) || 0);
                      ping();
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Advance Percentage</label>
            <div className="flex max-w-xs items-center gap-2">
              <input
                type="number"
                className="field-input"
                value={pricing.advancePercent}
                onChange={(e) => {
                  updateAdvancePercent(Number(e.target.value) || 0);
                  ping();
                }}
              />
              <span className="font-body text-sm text-ivory/50">%</span>
            </div>
          </div>

          <div>
            <div className="field-label mb-2">Recommendation Bands (Basic / Premium / Luxury)</div>
            <div className="space-y-2">
              {pricing.packageTiers.map((tier) => (
                <div key={tier.key} className="grid items-center gap-2 rounded-lg border border-white/10 p-3 sm:grid-cols-[1fr_auto]">
                  <div>
                    <div className="font-body text-sm text-gold">{tier.name}</div>
                    <input
                      className="field-input mt-1 !py-1.5 text-xs"
                      value={tier.blurb}
                      onChange={(e) => {
                        updatePackageTier(tier.key, { blurb: e.target.value });
                        ping();
                      }}
                    />
                  </div>
                  <div className="sm:w-40">
                    <label className="font-body text-[10px] uppercase tracking-wide text-ivory/40">
                      Up To (₹)
                    </label>
                    <input
                      type="number"
                      className="field-input !py-1.5 text-right"
                      value={tier.max}
                      onChange={(e) => {
                        updatePackageTier(tier.key, { max: Number(e.target.value) || 0 });
                        ping();
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 font-body text-[11px] text-ivory/30">
              A quote is recommended for the first tier whose "Up To" amount is greater than or equal to the
              total. Set the last tier very high to act as "anything above."
            </p>
          </div>
        </Section>

        <p className="text-center font-body text-xs text-ivory/30">
          Reference: {formatINR(pricing.baseDayRate)} base day rate · {pricing.advancePercent}% advance
        </p>
      </div>
    </div>
  );
}
