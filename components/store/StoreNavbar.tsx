'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import TilakSymbol from '@/components/TilakSymbol';
import type { CategoryWithStats } from '@/lib/catalog';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Categories', href: '/#categories' },
  { label: 'Collection', href: '/collection' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
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
        scrolled ? 'store-nav-scrolled' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 md:h-[4.25rem] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <TilakSymbol className="w-4 h-6 text-[var(--store-gold)]" />
          <span className="hidden sm:block font-display text-sm tracking-[0.14em] uppercase text-[var(--store-text)]">
            Swaminarayan
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Main">
          {navLinks.map((link) =>
            link.label === 'Categories' ? (
              <div key={link.label} className="relative" ref={megaRef}>
                <button
                  type="button"
                  onClick={() => setMegaOpen((o) => !o)}
                  className="flex items-center gap-1 text-xs tracking-[0.12em] uppercase text-[var(--store-muted)] hover:text-[var(--store-gold)] transition-colors"
                >
                  Categories
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${megaOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[min(90vw,520px)] rounded-2xl border border-[var(--store-border)] bg-[var(--store-elevated)]/98 backdrop-blur-xl shadow-2xl p-5"
                    >
                      <div className="relative mb-4">
                        <Search
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--store-muted)]"
                        />
                        <input
                          type="search"
                          value={catSearch}
                          onChange={(e) => setCatSearch(e.target.value)}
                          placeholder="Find a category..."
                          className="store-input w-full pl-9"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1 max-h-[280px] overflow-y-auto store-scrollbar">
                        {filteredMega.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/collection?category=${encodeURIComponent(cat.name)}`}
                            className="px-3 py-2 rounded-lg text-sm text-[var(--store-muted)] hover:text-[var(--store-gold)] hover:bg-white/[0.04] transition-colors flex justify-between gap-2"
                            onClick={() => setMegaOpen(false)}
                          >
                            <span className="truncate">{cat.name}</span>
                            <span className="text-[10px] opacity-50 tabular-nums">
                              {cat.productCount}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href="/collection"
                        className="mt-4 block text-center text-xs tracking-[0.15em] uppercase text-[var(--store-gold)] hover:underline"
                        onClick={() => setMegaOpen(false)}
                      >
                        View full catalog
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
                className={`text-xs tracking-[0.12em] uppercase transition-colors ${
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
          <Link href="/collection" className="store-btn-primary text-[10px] py-2.5 px-5">
            Wholesale catalog
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden p-2 text-[var(--store-text)]"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[var(--store-border)] bg-[var(--store-bg)]/98 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto store-scrollbar">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    scrollToHash(e, link.href);
                    setMenuOpen(false);
                  }}
                  className="font-display text-xl text-[var(--store-text)]"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-[var(--store-border)]">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--store-muted)] mb-3">
                  Quick categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 12).map((cat) => (
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
              <Link href="/collection" className="store-btn-primary text-center mt-2">
                Browse catalog
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
