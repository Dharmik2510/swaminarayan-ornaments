'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: 'gold' | 'green' | 'blue' | 'purple';
  delay?: number;
}

const COLOR_MAP = {
  gold:   { icon: 'text-[#D4AF37]',   accent: 'rgba(212,175,55,0.12)' },
  green:  { icon: 'text-emerald-400', accent: 'rgba(52,211,153,0.1)'  },
  blue:   { icon: 'text-blue-400',    accent: 'rgba(96,165,250,0.1)'  },
  purple: { icon: 'text-violet-400',  accent: 'rgba(167,139,250,0.1)' },
};

export default function AdminStatsCard({ label, value, icon: Icon, color = 'gold', delay = 0 }: Props) {
  const c = COLOR_MAP[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border p-5"
      style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.2em] uppercase mb-2"
            style={{ color: 'var(--a-muted)' }}>
            {label}
          </p>
          <p
            className="text-[32px] leading-none text-white/90 font-light"
            style={{ fontFamily: 'var(--font-accent)' }}
          >
            {value}
          </p>
        </div>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: c.accent }}
        >
          <Icon className={`w-4 h-4 ${c.icon}`} />
        </div>
      </div>
    </motion.div>
  );
}
