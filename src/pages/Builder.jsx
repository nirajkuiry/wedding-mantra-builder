import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BuilderWizard } from '../components/builder/BuilderWizard';
import { useSettingsStore } from '../store/useSettingsStore';

export default function Builder() {
  const business = useSettingsStore((s) => s.business);
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-ink/80 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-body text-sm text-ivory/60 hover:text-gold">
            <ArrowLeft size={16} /> Back
          </Link>
          <span className="font-display text-sm tracking-wide text-gold">{business.name}</span>
        </div>
      </header>
      <BuilderWizard />
    </div>
  );
}
