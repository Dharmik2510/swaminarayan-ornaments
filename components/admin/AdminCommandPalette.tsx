'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search, LayoutDashboard, Package, Tag, Image as ImageIcon,
  Plus, Sparkles, BookOpen, CornerDownLeft, Command, Trash2,
} from 'lucide-react';
import { getProducts, getCategories } from '@/lib/firebase';
import type { Product, CategoryItem } from '@/lib/data';

type Item = {
  id: string;
  label: string;
  hint?: string;
  group: 'Navigate' | 'Create' | 'Products' | 'Categories';
  icon: typeof Search;
  run: () => void;
};

export default function AdminCommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Open on ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Lazy-load products/categories the first time the palette opens.
  useEffect(() => {
    if (!open || loaded) return;
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => { setProducts(p); setCategories(c); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, [open, loaded]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const go = useCallback((path: string) => { router.push(path); setOpen(false); }, [router]);

  const items = useMemo<Item[]>(() => {
    const nav: Item[] = [
      { id: 'nav:dashboard',  group: 'Navigate', icon: LayoutDashboard, label: 'Dashboard',  hint: 'Overview & activity',   run: () => go('/admin') },
      { id: 'nav:products',   group: 'Navigate', icon: Package,         label: 'Products',   hint: 'Browse catalog',        run: () => go('/admin/products') },
      { id: 'nav:categories', group: 'Navigate', icon: Tag,             label: 'Categories', hint: 'Manage categories',     run: () => go('/admin/categories') },
      { id: 'nav:media',      group: 'Navigate', icon: ImageIcon,       label: 'Media',      hint: 'Media library',         run: () => go('/admin/media') },
      { id: 'nav:trash',      group: 'Navigate', icon: Trash2,          label: 'Trash',      hint: 'Recently deleted products', run: () => go('/admin/trash') },
      { id: 'nav:activity',   group: 'Navigate', icon: LayoutDashboard, label: 'Activity log', hint: 'Audit trail',             run: () => go('/admin/activity') },
      { id: 'nav:guide',      group: 'Navigate', icon: BookOpen,        label: 'Guide',      hint: 'Admin documentation',   run: () => go('/admin/guide') },
    ];
    const actions: Item[] = [
      { id: 'action:new-product',  group: 'Create', icon: Plus,      label: 'New product',           hint: 'Create a single product',           run: () => go('/admin/products/new') },
      { id: 'action:bulk-product', group: 'Create', icon: Sparkles,  label: 'Bulk add products',     hint: 'AI-drafted batch creation',          run: () => go('/admin/products/bulk') },
    ];
    const prodItems: Item[] = products.slice(0, 50).map(p => ({
      id: `product:${p.id}`,
      group: 'Products',
      icon: Package,
      label: p.name,
      hint: `${p.category} · ${p.status}`,
      run: () => go(`/admin/products/${p.id}`),
    }));
    const catItems: Item[] = categories.map(c => ({
      id: `category:${c.id}`,
      group: 'Categories',
      icon: Tag,
      label: c.name,
      hint: c.slug,
      run: () => go('/admin/categories'),
    }));
    return [...nav, ...actions, ...prodItems, ...catItems];
  }, [products, categories, go]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 40);
    return items
      .filter(it => it.label.toLowerCase().includes(q) || it.hint?.toLowerCase().includes(q))
      .slice(0, 40);
  }, [items, query]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(filtered.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(0, i - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); filtered[activeIndex]?.run(); }
  };

  // Group items for display
  const grouped = useMemo(() => {
    const g: Record<string, Item[]> = {};
    filtered.forEach(it => { (g[it.group] ||= []).push(it); });
    return Object.entries(g);
  }, [filtered]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-[3px] flex items-start justify-center pt-[12vh] px-4"
        >
          <motion.div
            key="palette"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden"
            style={{ background: 'var(--a-elevated)', borderColor: 'var(--a-border)' }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--a-border)' }}>
              <Search className="w-4 h-4 text-black/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search or jump to…"
                className="flex-1 bg-transparent outline-none text-sm text-black/90 placeholder:text-black/30"
              />
              <kbd className="text-[10px] tracking-wider text-black/40 border border-black/10 rounded px-1.5 py-0.5">ESC</kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar py-1">
              {filtered.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-black/40">No matches.</p>
              ) : (
                grouped.map(([group, groupItems]) => (
                  <div key={group} className="py-1">
                    <p className="px-4 py-1 text-[9px] tracking-[0.22em] uppercase text-black/40 font-semibold">
                      {group}
                    </p>
                    {groupItems.map(it => {
                      const globalIndex = filtered.indexOf(it);
                      const isActive = globalIndex === activeIndex;
                      const Icon = it.icon;
                      return (
                        <button
                          key={it.id}
                          onMouseEnter={() => setActiveIndex(globalIndex)}
                          onClick={it.run}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                            isActive ? 'bg-[#D4AF37]/15' : 'hover:bg-black/[0.04]'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isActive ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-black/5 text-black/55'
                          }`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-black/90 truncate">{it.label}</p>
                            {it.hint && <p className="text-[11px] text-black/45 truncate">{it.hint}</p>}
                          </div>
                          {isActive && <CornerDownLeft className="w-3.5 h-3.5 text-[#D4AF37]" />}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-2 border-t text-[10px] text-black/40 flex-wrap gap-2" style={{ borderColor: 'var(--a-border)' }}>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1"><kbd className="border border-black/10 rounded px-1 py-0.5">↑</kbd><kbd className="border border-black/10 rounded px-1 py-0.5">↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="border border-black/10 rounded px-1 py-0.5">↵</kbd> open</span>
                <span className="flex items-center gap-1"><kbd className="border border-black/10 rounded px-1 py-0.5">n</kbd> new product</span>
                <span className="flex items-center gap-1"><kbd className="border border-black/10 rounded px-1 py-0.5">g</kbd> then <kbd className="border border-black/10 rounded px-1 py-0.5">p/c/m/t/a/d</kbd> go-to</span>
              </div>
              <span className="flex items-center gap-1">
                <Command className="w-3 h-3" /> K to toggle
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
