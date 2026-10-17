'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Briefcase, Sparkles } from 'lucide-react';
import { useTradeDossier } from './TradeDossierContext';

const WAYPOINTS = [
  { id: 'hero', num: 'I', label: 'Vault' },
  { id: 'assay', num: 'II', label: 'Assay' },
  { id: 'crucible', num: 'III', label: 'Crucible' },
  { id: 'exhibition', num: 'IV', label: 'Rail' },
  { id: 'categories', num: 'V', label: 'Index' },
  { id: 'about', num: 'VI', label: 'Desk' },
  { id: 'contact', num: 'VII', label: 'Close' },
];

export default function ScrollTraceBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const { shortlist, setDrawerOpen, purityPref } = useTradeDossier();

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1
        );
        const p = Math.min(1, Math.max(0, window.scrollY / max));
        setProgress(p);

        if (pathname === '/') {
          let found = 0;
          const mid = window.innerHeight * 0.45;
          WAYPOINTS.forEach((wp, i) => {
            const el = document.getElementById(wp.id);
            if (el) {
              const r = el.getBoundingClientRect();
              if (r.top <= mid) found = i;
            }
          });
          setActiveIdx(found);
        }
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 pointer-events-none px-4 sm:px-6">
      <div className="max-w-[1160px] mx-auto flex items-center justify-between gap-3">
        {/* Left / Center: Scroll-as-Playhead Persistent Trace Rail (Home only) */}
        {pathname === '/' ? (
          <nav
            aria-label="Scroll chapter trace"
            className="pointer-events-auto hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--store-gold)]/25 bg-[#0a0708]/90 backdrop-blur-xl shadow-2xl"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--store-gold)] mr-2 flex items-center gap-1.5">
              <Sparkles size={11} />
              {Math.round(progress * 100)}%
            </span>

            <div className="flex items-center gap-1">
              {WAYPOINTS.map((wp, idx) => {
                const passed = idx <= activeIdx;
                const current = idx === activeIdx;
                return (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => jumpTo(wp.id)}
                    className={`group relative px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      current
                        ? 'bg-[var(--store-gold)] text-[#080607] font-semibold'
                        : passed
                          ? 'text-[var(--store-gold-soft)] hover:bg-white/[0.05]'
                          : 'text-[var(--store-muted)]/60 hover:text-[var(--sc-ink)]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        current
                          ? 'bg-[#080607]'
                          : passed
                            ? 'bg-[var(--store-gold)]'
                            : 'bg-white/20'
                      }`}
                    />
                    <span>{wp.num}</span>
                    <span className="hidden lg:inline">{wp.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        ) : (
          <div />
        )}

        {/* Right: Persistent Trade Dossier Trigger Pill */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="pointer-events-auto ml-auto inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[var(--store-gold)]/35 bg-[#120c0e]/95 hover:bg-[#1b1215] backdrop-blur-xl shadow-2xl transition-all group"
        >
          <span className="w-6 h-6 rounded-full bg-[var(--store-gold)] text-[#080607] font-mono text-[11px] font-bold flex items-center justify-center sc-nums">
            {shortlist.length}
          </span>
          <span className="text-left">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--sc-ink)] group-hover:text-[var(--store-gold-soft)]">
              Trade Dossier
            </span>
            <span className="block font-mono text-[9px] text-[var(--store-muted)]">
              {purityPref === 'both' ? '92K & 84K Brief' : `${purityPref}K Only`}
            </span>
          </span>
          <Briefcase size={14} className="text-[var(--store-gold)] ml-1" />
        </button>
      </div>
    </div>
  );
}
