'use client';

import Image from 'next/image';
import { Check, Eye, Plus, Sparkles } from 'lucide-react';
import type { Product } from '@/lib/data';
import { useTradeDossier } from './TradeDossierContext';

interface ProductTileProps {
  product: Product;
  index?: number;
  onSelect: (product: Product) => void;
  compact?: boolean;
}

const gradients = [
  'linear-gradient(160deg, #1b1215 0%, #120c0e 50%, #271a15 100%)',
  'linear-gradient(160deg, #140f11 0%, #1d1512 50%, #2e2216 100%)',
];

export default function ProductTile({
  product,
  index = 0,
  onSelect,
  compact = false,
}: ProductTileProps) {
  const { isShortlisted, toggleShortlist } = useTradeDossier();
  const shortlisted = isShortlisted(product.id);

  return (
    <article
      data-sc-tilt="5"
      className="sc-vault-card group relative w-full text-left rounded-2xl overflow-hidden flex flex-col justify-between"
    >
      {/* Image Stage */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(product)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(product);
          }
        }}
        className={`relative overflow-hidden cursor-pointer ${
          compact ? 'aspect-[4/4.3]' : 'aspect-[3/3.6]'
        }`}
        style={{ background: gradients[index % gradients.length] }}
      >
        {/* Subtle radial spotlight behind jewel */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(212,175,55,0.16) 0%, transparent 68%)',
          }}
        />

        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-5 transition-transform duration-700 group-hover:scale-[1.06] drop-shadow-[0_18px_28px_rgba(0,0,0,0.8)]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--store-gold)]/25 text-4xl font-display">
            {product.name.charAt(0)}
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080607]/90 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="px-2.5 py-0.5 text-[10px] font-mono tracking-widest uppercase rounded-full bg-black/60 backdrop-blur-md text-[var(--store-gold)] border border-[var(--store-gold)]/25">
            {product.carat}K AU
          </span>
          {product.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-mono tracking-widest uppercase rounded-full bg-[var(--store-gold)] text-[#080607] font-semibold">
              <Sparkles size={9} />
              Signature
            </span>
          )}
        </div>

        {/* Hover Quick-Inspect Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-[var(--sc-ink)] border border-white/10">
            <Eye size={11} className="text-[var(--store-gold)]" />
            Inspect Piece
          </span>
        </div>
      </div>

      {/* Museum Specification Footer */}
      <div className={`${compact ? 'p-4' : 'p-4 md:p-5'} flex-1 flex flex-col justify-between`}>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-[10px] font-mono tracking-[0.18em] uppercase text-[var(--store-gold-soft)] truncate">
              {product.category}
            </p>
            {product.tags?.[0] && (
              <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--store-muted)]">
                #{product.tags[0]}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onSelect(product)}
            className="text-left block w-full focus:outline-none"
          >
            <h3 className="font-display text-lg md:text-xl text-[var(--sc-ink)] group-hover:text-[var(--store-gold-soft)] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </button>
          {!compact && (
            <p className="mt-1.5 text-xs text-[var(--store-muted)] line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--store-border)] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onSelect(product)}
            className="text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--store-muted)] hover:text-[var(--sc-ink)] transition-colors"
          >
            Spec Sheet →
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleShortlist(product);
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider inline-flex items-center gap-1 transition-all ${
              shortlisted
                ? 'bg-[var(--store-gold)] text-[#080607] font-semibold'
                : 'border border-[var(--store-gold)]/25 text-[var(--store-gold-soft)] hover:bg-[var(--store-gold)]/15'
            }`}
            aria-label={shortlisted ? `Remove ${product.name} from shortlist` : `Add ${product.name} to shortlist`}
          >
            {shortlisted ? <Check size={11} /> : <Plus size={11} />}
            {shortlisted ? 'In Dossier' : 'Shortlist'}
          </button>
        </div>
      </div>
    </article>
  );
}
