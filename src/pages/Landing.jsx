import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Video, Sparkles, Instagram, Phone, Settings, LayoutDashboard } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';

const PILLARS = [
  { icon: Camera, title: 'Photography', copy: 'Candid, editorial, and traditional coverage across every function.' },
  { icon: Video, title: 'Cinematography', copy: 'Cinematic wedding films, highlight reels, and same-day edits.' },
  { icon: Sparkles, title: 'Bespoke Packages', copy: 'Every quote is built around your exact day — nothing generic.' },
];

const FAQS = [
  { q: 'How far in advance should we book?', a: 'We recommend locking your date 6–9 months ahead, especially for peak wedding season.' },
  { q: 'Do you travel outside the city?', a: 'Yes — outstation and destination weddings are welcome. Travel is quoted separately.' },
  { q: 'When do we receive our final films and album?', a: 'Timelines are agreed at booking and shared in your quotation.' },
];

export default function Landing() {
  const business = useSettingsStore((s) => s.business);
  return (
    <div className="min-h-screen">
      {/* Logo header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-center">
          <img src="/assets/logo.png" alt={business.name} className="h-12 w-auto" loading="eager" />
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:pt-24">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/assets/hero-bg.jpg)' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.12),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-xs uppercase tracking-[0.3em] text-gold/80"
          >
            {business.name}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 font-display text-5xl leading-[1.05] text-ivory sm:text-7xl"
          >
            Every wedding, <span className="text-gold">told cinematically.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-3 font-display text-lg italic text-gold/80"
          >
            {business.tagline}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-4 max-w-xl font-body text-base text-ivory/60"
          >
            Pick a ready-made package or build your own from scratch — either way, get a custom
            quotation in minutes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/packages" className="btn-gold text-base">
              Choose a Ready-Made Package
            </Link>
            <Link to="/builder" className="btn-ghost text-base">
              Build a Fully Custom Package
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="glass-card p-6">
              <Icon className="text-gold" size={22} />
              <h3 className="mt-4 font-display text-xl text-ivory">{title}</h3>
              <p className="mt-2 font-body text-sm text-ivory/50">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-24">
        <h2 className="text-center font-display text-3xl text-ivory">Frequently Asked</h2>
        <div className="mt-8 space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="glass-card group p-5 open:border-gold/30">
              <summary className="cursor-pointer list-none font-body text-sm font-medium text-ivory/80 group-open:text-gold">
                {f.q}
              </summary>
              <p className="mt-2 font-body text-sm text-ivory/50">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact */}
      <footer className="border-t border-white/10 px-4 py-10 text-center">
        <div className="flex flex-wrap items-center justify-center gap-6 font-body text-sm text-ivory/50">
          <span className="flex items-center gap-2">
            <Phone size={14} className="text-gold" /> {business.phone}
          </span>
          <span className="flex items-center gap-2">
            <Instagram size={14} className="text-gold" /> {business.instagram}
          </span>
          <span>{business.website}</span>
        </div>
        <p className="mt-3 font-body text-xs text-ivory/30">{business.address}</p>
        <p className="mt-4 font-body text-xs text-ivory/30">
          © {new Date().getFullYear()} {business.name}. All rights reserved.
        </p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 font-body text-[11px] text-ivory/20 transition hover:text-gold"
          >
            <LayoutDashboard size={11} /> Admin Dashboard
          </Link>
          <Link
            to="/settings"
            className="inline-flex items-center gap-1.5 font-body text-[11px] text-ivory/20 transition hover:text-gold"
          >
            <Settings size={11} /> Studio Settings
          </Link>
        </div>
      </footer>
    </div>
  );
}
