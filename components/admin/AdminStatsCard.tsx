'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
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
  const isNumber = typeof value === 'number';
  
  // Counting animation
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState<string | number>(isNumber ? 0 : value);

  useEffect(() => {
    if (isNumber) {
      const controls = animate(count, value as number, {
        duration: 1.2,
        delay: delay + 0.2, // Wait for entry animation
        ease: 'easeOut',
        onUpdate: (v) => setDisplayValue(Math.round(v))
      });
      return controls.stop;
    } else {
      setDisplayValue(value);
    }
  }, [value, isNumber, count, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.04)' }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border shadow-sm p-5 relative overflow-hidden group"
      style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
    >
      {/* Subtle background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-black/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.2em] uppercase mb-2"
            style={{ color: 'var(--a-muted)' }}>
            {label}
          </p>
          <motion.p
            className="text-[32px] leading-none text-black/90 font-medium"
            style={{ fontFamily: 'var(--font-accent)' }}
          >
            {displayValue}
          </motion.p>
        </div>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110"
          style={{ background: c.accent }}
        >
          <Icon className={`w-4 h-4 ${c.icon}`} />
        </div>
      </div>
    </motion.div>
  );
}
