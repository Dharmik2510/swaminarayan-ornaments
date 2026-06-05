'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import type { CategoryWithStats } from '@/lib/catalog';

interface CategoryShowcaseProps {
  categories: CategoryWithStats[];
  loading?: boolean;
}

export default function CategoryShowcase({
  categories,
  loading = false,
}: CategoryShowcaseProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, query]);

  return (
    <section id="categories" className="py-20 md:py-28 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <ScrollReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--store-gold)] mb-3">
              Wholesale range
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-[var(--store-text)]">
              Every category, one catalog
            </h2>
            <p className="mt-4 text-[var(--store-muted)] max-w-lg text-sm md:text-base">
              From everyday chains to bridal sets — filter by category on any device. Add more
              anytime from admin; the storefront scales with your inventory.
            </p>
          </div>
          <div className="relative w-full md:max-w-xs">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--store-muted)]"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories..."
              className="store-input w-full pl-9"
              aria-label="Search jewellery categories"
            />
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] rounded-2xl bg-[var(--store-surface)] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {filtered.map((cat, index) => (
              <ScrollReveal key={cat.id} delay={Math.min(index * 0.04, 0.4)}>
                <Link
                  href={`/collection?category=${encodeURIComponent(cat.name)}`}
                  className="group block rounded-2xl overflow-hidden border border-[var(--store-border)] bg-[var(--store-surface)] hover:border-[var(--store-gold-dim)] transition-all duration-500"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#1a1612]">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-cover opacity-90 group-hover:scale-[1.04] transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center font-display text-4xl text-[var(--store-gold)]/20">
                        {cat.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a08] via-[#0c0a08]/20 to-transparent" />
                    <span className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] text-[var(--store-muted)] tabular-nums">
                        {cat.productCount} {cat.productCount === 1 ? 'piece' : 'pieces'}
                      </span>
                    </span>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-2">
                    <h3 className="font-display text-base text-[var(--store-text)] group-hover:text-[var(--store-gold)] transition-colors truncate">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-[11px] text-[var(--store-muted)] line-clamp-1 mt-0.5 hidden sm:block">
                        {cat.description}
                      </p>
                    )}
                    <ArrowRight
                      size={14}
                      className="shrink-0 text-[var(--store-muted)] group-hover:text-[var(--store-gold)] group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-[var(--store-muted)] py-16">No categories match your search.</p>
        )}

        <ScrollReveal className="mt-12 text-center">
          <Link href="/collection" className="store-btn-ghost inline-flex items-center gap-2">
            Open full catalog
            <ArrowRight size={14} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
