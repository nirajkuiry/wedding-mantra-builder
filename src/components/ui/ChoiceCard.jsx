import clsx from 'clsx';
import { motion } from 'framer-motion';

export function ChoiceCard({ label, active, onClick, sublabel }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={clsx('choice-card', active && 'choice-card-active')}
    >
      <div className="font-display text-base">{label}</div>
      {sublabel && <div className="mt-0.5 text-[11px] text-ivory/40">{sublabel}</div>}
    </motion.button>
  );
}
