'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import ProductTile from './ProductTile';
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
  const featured = sortProducts(products, 'default').slice(0, LIMIT);

  return (
    <section id="collection" className="py-20 md:py-28 border-t border-[var(--store-border)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <ScrollReveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--store-gold)] mb-3">
              Curated selection
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-[var(--store-text)]">
              Featured pieces
            </h2>
          </div>
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[var(--store-gold)] hover:underline"
          >
            {products.length} pieces in catalog
            <ArrowRight size={14} />
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {featured.map((product, index) => (
            <ProductTile
              key={product.id}
              product={product}
              index={index}
              onSelect={onSelectProduct}
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
}
