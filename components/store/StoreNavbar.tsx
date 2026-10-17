'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ChevronDown, Search, Briefcase, Sparkles } from 'lucide-react';
import TilakSymbol from '@/components/TilakSymbol';
import type { CategoryWithStats } from '@/lib/catalog';
import { useTradeDossier } from './TradeDossierContext';

const navLinks = [
  { label: 'Vault', href: '/' },
  { label: 'Crucible', href: '/#crucible' },
  { label: 'Categories', href: '/#categories' },
  { label: 'Catalog', href: '/collection' },
  { label: 'Trade Desk', href: '/#about' },
];

interface StoreNavbarProps {
  categories?: CategoryWithStats[];
}

export default function StoreNavbar({ categories = [] }: StoreNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const megaRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const { shortlist, setDrawerOpen } = useTradeDossier();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24));

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  const filteredMega = categories.filter((c) =>
    c.name.toLowerCase().includes(catSearch.trim().toLowerCase())
  );

  const scrollToHash = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('/#')) return;
      const hash = href.slice(1);
      if (pathname === '/') {
        e.preventDefault();
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [pathname]
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'store-nav-scrolled' : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
    >
      {/* ScrollCraft Top Progress Bar */}
      <div data-sc-progress aria-hidden="true" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 md:h-[4.5rem] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <TilakSymbol className="w-4 h-6 text-[var(--store-gold)]" />
          <div className="flex flex-col">
            <span className="font-display text-base md:text-lg tracking-[0.14em] uppercase text-[var(--store-text)] leading-none">
              Swaminarayan
            </span>
            <span className="font-mono text-[8px] tracking-[0.26em] uppercase text-[var(--store-gold)] mt-0.5 hidden sm:block">
              92 &amp; 84K Wholesale Vault
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Main">
          {navLinks.map((link) =>
            link.label === 'Categories' ? (
              <div key={link.label} className="relative" ref={megaRef}>
                <button
                  type="button"
                  onClick={() => setMegaOpen((o) => !o)}
                  className="flex items-center gap-1.5 text-xs font-mono tracking-[0.14em] uppercase text-[var(--store-muted)] hover:text-[var(--store-gold-soft)] transition-colors"
                >
                  Categories
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${megaOpen ? 'rotate-180 text-[var(--store-gold)]' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[min(92vw,560px)] rounded-2xl border border-[var(--store-gold)]/25 bg-[#120c0e]/98 backdrop-blur-2xl shadow-2xl p-5"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="sc-label text-[10px] text-[var(--store-gold)] flex items-center gap-1.5">
                          <Sparkles size={11} />
                          18 Wholesale Departments
                        </span>
                        <div className="flex gap-2">
                          <Link
                            href="/collection?carat=92"
                            onClick={() => setMegaOpen(false)}
                            className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[var(--store-gold)]/15 text-[var(--store-gold-soft)] border border-[var(--store-gold)]/30"
                          >
                            92K Line
                          </Link>
                          <Link
                            href="/collection?carat=84"
                            onClick={() => setMegaOpen(false)}
                            className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.05] text-[var(--store-muted)] border border-[var(--store-border)]"
                          >
                            84K Line
                          </Link>
                        </div>
                      </div>

                      <div className="relative mb-4">
                        <Search
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--store-muted)]"
                        />
                        <input
                          type="search"
                          value={catSearch}
                          onChange={(e) => setCatSearch(e.target.value)}
                          placeholder="Find a jewellery department..."
                          className="store-input w-full pl-9"
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 max-h-[280px] overflow-y-auto store-scrollbar">
                        {filteredMega.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/collection?category=${encodeURIComponent(cat.name)}`}
                            className="px-3 py-2 rounded-lg text-xs text-[var(--store-muted)] hover:text-[var(--store-gold-soft)] hover:bg-white/[0.04] transition-colors flex justify-between gap-2"
                            onClick={() => setMegaOpen(false)}
                          >
                            <span className="truncate">{cat.name}</span>
                            <span className="text-[10px] font-mono opacity-50 tabular-nums">
                              {cat.productCount || '·'}
                            </span>
                          </Link>
                        ))}
                      </div>

                      <Link
                        href="/collection"
                        className="mt-4 pt-3 border-t border-[var(--store-border)] block text-center text-xs font-mono tracking-[0.16em] uppercase text-[var(--store-gold)] hover:underline"
                        onClick={() => setMegaOpen(false)}
                      >
                        Open Complete Wholesale Vault →
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => scrollToHash(e, link.href)}
                className={`text-xs font-mono tracking-[0.14em] uppercase transition-colors ${
                  pathname === link.href
                    ? 'text-[var(--store-gold)]'
                    : 'text-[var(--store-muted)] hover:text-[var(--store-text)]'
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="store-btn-ghost py-2 px-4 text-[10px]"
          >
            <Briefcase size={13} className="text-[var(--store-gold)]" />
            Dossier ({shortlist.length})
          </button>
          <Link href="/collection" className="store-btn-primary text-[10px] py-2.5 px-5">
            Wholesale Vault
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="px-3 py-1.5 rounded-full border border-[var(--store-gold)]/30 bg-[var(--store-gold)]/10 text-[10px] font-mono text-[var(--store-gold-soft)] flex items-center gap-1.5"
            aria-label="Open Trade Dossier"
          >
            <Briefcase size={12} />
            <span>{shortlist.length}</span>
          </button>
          <button
            type="button"
            className="p-2 text-[var(--store-text)]"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[var(--store-border)] bg-[#080607]/98 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto store-scrollbar">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    scrollToHash(e, link.href);
                    setMenuOpen(false);
                  }}
                  className="font-display text-2xl text-[var(--store-text)]"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-[var(--store-border)]">
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--store-gold)] mb-3">
                  Wholesale Departments
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 14).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/collection?category=${encodeURIComponent(cat.name)}`}
                      className="px-3 py-1.5 rounded-full text-xs border border-[var(--store-border)] text-[var(--store-muted)]"
                      onClick={() => setMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/collection"
                onClick={() => setMenuOpen(false)}
                className="store-btn-primary text-center mt-2"
              >
                Enter Wholesale Catalog
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
