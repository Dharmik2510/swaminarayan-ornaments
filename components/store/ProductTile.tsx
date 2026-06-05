'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/data';

interface ProductTileProps {
  product: Product;
  index?: number;
  onSelect: (product: Product) => void;
  compact?: boolean;
}

const gradients = [
  'linear-gradient(160deg, #1c1814 0%, #2a241c 45%, #4a3d28 100%)',
  'linear-gradient(160deg, #141210 0%, #221e18 45%, #3d3424 100%)',
];

export default function ProductTile({
  product,
  index = 0,
  onSelect,
  compact = false,
}: ProductTileProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(product)}
      className="group w-full text-left rounded-2xl overflow-hidden bg-[var(--store-surface)] border border-[var(--store-border)] hover:border-[var(--store-gold-dim)] transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-gold)]/40"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.35) }}
      whileHover={{ y: -4 }}
    >
      <div
        className={`relative overflow-hidden ${compact ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}
        style={{ background: gradients[index % gradients.length] }}
      >
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--store-gold)]/25 text-4xl font-display">
            {product.name.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a08]/90 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] tracking-widest uppercase rounded-full bg-black/35 text-[var(--store-gold)] border border-white/10">
          {product.carat}K
        </span>
        {product.featured && (
          <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] tracking-widest uppercase rounded-full bg-[var(--store-gold)] text-[#0c0a08] font-medium">
            Featured
          </span>
        )}
      </div>
      <div className={`${compact ? 'p-3.5' : 'p-4 md:p-5'}`}>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--store-muted)] mb-1">
          {product.category}
        </p>
        <h3 className="font-display text-base md:text-lg text-[var(--store-text)] group-hover:text-[var(--store-gold)] transition-colors line-clamp-2">
          {product.name}
        </h3>
        {!compact && (
          <p className="mt-2 text-xs text-[var(--store-muted)] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
      </div>
    </motion.button>
  );
}
