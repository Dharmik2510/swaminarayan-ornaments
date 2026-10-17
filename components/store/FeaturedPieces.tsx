'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductTile from './ProductTile';
import ConciergeSearch from '@/components/ConciergeSearch';
import type { Product } from '@/lib/data';
import { sortProducts } from '@/lib/catalog';

interface FeaturedPiecesProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const LIMIT = 8;

export default function FeaturedPieces({
  products,
  onSelectProduct,
}: FeaturedPiecesProps) {
  const [caratFilter, setCaratFilter] = useState<'all' | 92 | 84>('all');
  const [aiMatchIds, setAiMatchIds] = useState<string[] | null>(null);

  const handleConciergeResults = useCallback((matchIds: string[] | null) => {
    setAiMatchIds(matchIds);
  }, []);

  const displayedProducts = useMemo(() => {
    let list = sortProducts(products, 'default');
    if (caratFilter !== 'all') {
      list = list.filter((p) => p.carat === caratFilter);
    }
    if (aiMatchIds !== null) {
      if (aiMatchIds.length === 0) return [];
      const idSet = new Set(aiMatchIds);
      list = list.filter((p) => idSet.has(p.id));
    }
    return list.slice(0, LIMIT);
  }, [products, caratFilter, aiMatchIds]);

  return (
    <section
      id="collection"
      data-sc-act="flow"
      data-sc-drift="#120A0D"
      className="sc-section border-t border-[var(--store-border)]"
    >
      <div className="sc-wrap">
        <div
          data-sc-in
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10"
        >
          <div>
            <p className="sc-label text-[10px] text-[var(--store-gold)] mb-3 flex items-center gap-1.5">
              <Sparkles size={12} />
              Curated Vault Selection &amp; AI Trade Concierge
            </p>
            <h2 className="sc-display sc-display--lg text-[var(--sc-ink)]">
              Featured showroom lots.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Purity Filter Pills */}
            <div className="inline-flex p-1 rounded-full bg-black/40 border border-[var(--store-border)]">
              {(['all', 92, 84] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCaratFilter(c)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                    caratFilter === c
                      ? 'bg-[var(--store-gold)] text-[#080607] font-semibold'
                      : 'text-[var(--store-muted)] hover:text-[var(--sc-ink)]'
                  }`}
                >
                  {c === 'all' ? 'All Purities' : `${c}K Gold`}
                </button>
              ))}
            </div>

            <Link
              href="/collection"
              className="store-btn-ghost py-2 px-4 text-[10px]"
            >
              All {products.length} Pieces
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* AI Concierge Search Bar */}
        <div data-sc-in className="sc-vault-card rounded-2xl p-6 mb-10">
          <p className="sc-label text-[10px] text-[var(--store-gold)] text-center mb-3">
            AI Trade Concierge · Describe an occasion, style, or carat requirement
          </p>
          <ConciergeSearch products={products} onResults={handleConciergeResults} />
        </div>

        {displayedProducts.length === 0 ? (
          <div className="sc-vault-card rounded-2xl p-12 text-center">
            <p className="font-display text-2xl text-[var(--sc-ink)] mb-2">
              No pieces matched that exact filter.
            </p>
            <p className="text-sm text-[var(--store-muted)] mb-6">
              Reset the purity filter or clear your concierge query to view all featured pieces.
            </p>
            <button
              type="button"
              onClick={() => {
                setCaratFilter('all');
                setAiMatchIds(null);
              }}
              className="store-btn-primary"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div
            data-sc-in
            data-sc-stagger="55"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {displayedProducts.map((product, index) => (
              <ProductTile
                key={product.id}
                product={product}
                index={index}
                onSelect={onSelectProduct}
                compact
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
