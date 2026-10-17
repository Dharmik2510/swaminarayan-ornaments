'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search, Sparkles, Check } from 'lucide-react';
import type { CategoryWithStats } from '@/lib/catalog';
import { useTradeDossier } from './TradeDossierContext';

interface CategoryShowcaseProps {
  categories: CategoryWithStats[];
  loading?: boolean;
}

const FALLBACK_IMAGES = [
  '/images/emerald_necklace.png',
  '/images/emerald_bangle.png',
  '/images/emerald_earrings.png',
];

export default function CategoryShowcase({
  categories,
  loading = false,
}: CategoryShowcaseProps) {
  const [query, setQuery] = useState('');
  const { selectedCategories, toggleCategoryPref } = useTradeDossier();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, query]);

  return (
    <section
      id="categories"
      data-sc-act="flow"
      data-sc-drift="#0E080A"
      className="sc-section relative border-t border-[var(--store-border)]"
    >
      <div className="sc-wrap">
        <div
          data-sc-in
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--store-gold)]/25 bg-[var(--store-gold)]/[0.06] mb-4">
              <Sparkles size={12} className="text-[var(--store-gold)]" />
              <span className="sc-label text-[10px] text-[var(--store-gold)]">
                Act V · 18-Department Wholesale Index
              </span>
            </div>
            <h2 className="sc-display sc-display--lg text-[var(--sc-ink)]">
              Every category, one vault.
            </h2>
            <p className="sc-body mt-4 text-sm md:text-base">
              Browse all 18 trade departments or pin your core showroom categories directly to
              your wholesale inquiry dossier below.
            </p>
          </div>

          <div className="relative w-full lg:max-w-xs">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--store-muted)]"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter 18 categories..."
              className="store-input w-full pl-9"
              aria-label="Search jewellery categories"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/4.6] rounded-2xl bg-[var(--store-surface)] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div
            data-sc-in
            data-sc-stagger="35"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5 md:gap-4"
          >
            {filtered.map((cat, index) => {
              const displayImg =
                cat.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
              const isPinnedToDossier = selectedCategories.includes(cat.name);

              return (
                <div
                  key={cat.id}
                  data-sc-spotlight
                  className="sc-vault-card group rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <Link
                    href={`/collection?category=${encodeURIComponent(cat.name)}`}
                    className="relative aspect-[4/4.2] overflow-hidden bg-gradient-to-b from-[#1a1215] to-[#0b0809] block"
                  >
                    <Image
                      src={displayImg}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 18vw"
                      className="object-contain p-5 opacity-90 group-hover:scale-[1.07] transition-transform duration-700 drop-shadow-[0_14px_24px_rgba(0,0,0,0.8)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080607] via-[#080607]/15 to-transparent" />

                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-black/60 text-[var(--store-gold-soft)] border border-white/10">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--store-muted)] sc-nums bg-black/50 px-2 py-0.5 rounded-full">
                        {cat.productCount > 0 ? `${cat.productCount} pcs` : '92/84K'}
                      </span>
                    </div>
                  </Link>

                  <div className="p-3.5 flex flex-col justify-between gap-2.5">
                    <Link
                      href={`/collection?category=${encodeURIComponent(cat.name)}`}
                      className="flex items-center justify-between gap-1.5 group/link"
                    >
                      <h3 className="font-display text-base md:text-lg text-[var(--sc-ink)] group-hover/link:text-[var(--store-gold-soft)] transition-colors truncate">
                        {cat.name}
                      </h3>
                      <ArrowRight
                        size={13}
                        className="shrink-0 text-[var(--store-muted)] group-hover/link:text-[var(--store-gold)] group-hover/link:translate-x-0.5 transition-all"
                      />
                    </Link>

                    <button
                      type="button"
                      onClick={() => toggleCategoryPref(cat.name)}
                      className={`w-full py-1.5 px-2.5 rounded-lg text-[9px] font-mono uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
                        isPinnedToDossier
                          ? 'bg-[var(--store-gold)]/20 border border-[var(--store-gold)]/50 text-[var(--store-gold-soft)]'
                          : 'bg-white/[0.02] border border-[var(--store-border)] text-[var(--store-muted)] hover:text-[var(--sc-ink)]'
                      }`}
                    >
                      {isPinnedToDossier && <Check size={10} className="text-[var(--store-gold)]" />}
                      {isPinnedToDossier ? 'Focused in Dossier' : '+ Focus Category'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-[var(--store-muted)] py-16">
            No categories match your filter.
          </p>
        )}

        <div data-sc-in className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link href="/collection" className="store-btn-primary">
            Browse Complete 18-Category Vault
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
