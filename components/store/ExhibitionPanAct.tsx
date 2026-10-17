'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Eye, Plus, Sparkles } from 'lucide-react';
import type { Product } from '@/lib/data';
import { sortProducts } from '@/lib/catalog';
import { useTradeDossier } from './TradeDossierContext';

interface ExhibitionPanActProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function ExhibitionPanAct({
  products,
  onSelectProduct,
}: ExhibitionPanActProps) {
  const { toggleShortlist, isShortlisted } = useTradeDossier();
  const railProducts = sortProducts(products, 'default').slice(0, 7);

  return (
    <section
      id="exhibition"
      data-sc-act="pan"
      data-sc-span="3.6"
      data-sc-drift="#0B0908"
      className="relative border-t border-[var(--store-border)]"
    >
      <div
        data-sc-stage
        className="sc-stage flex items-center overflow-hidden"
      >
        {/* Horizontal Rail driven by ScrollCraft data-sc-pan */}
        <div
          data-sc-pan="0.06"
          className="flex items-stretch gap-6 md:gap-8 px-6 sm:px-12 lg:px-20 py-8"
        >
          {/* FIRST ITEM: Opening Title & Exhibition Ledger Card (always exempted from fade by .sc-pan-card:first-child) */}
          <article className="sc-pan-card sc-vault-card shrink-0 w-[84vw] sm:w-[390px] md:w-[430px] rounded-3xl p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--store-gold)]/25 bg-[var(--store-gold)]/[0.08] mb-6">
                <Sparkles size={12} className="text-[var(--store-gold)]" />
                <span className="sc-label text-[10px] text-[var(--store-gold)]">
                  Act IV · Lateral Vault Rail
                </span>
              </div>
              <h2 className="sc-display sc-display--md text-[var(--sc-ink)] mb-4">
                Signature trade editions.
              </h2>
              <p className="sc-body text-sm md:text-base">
                Scroll vertically to glide through our flagship 92K &amp; 84K pieces. Every card
                carries verified melt specifications and can be added directly to your wholesale
                shortlist.
              </p>
            </div>

            <div className="pt-6 border-t border-[var(--store-border)]">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--store-muted)] mb-4">
                <span>EXHIBITION SERIES</span>
                <span className="text-[var(--store-gold)]">01 — 0{railProducts.length}</span>
              </div>
              <Link href="/collection" className="store-btn-ghost w-full justify-center">
                Open Full Index
                <ArrowRight size={14} />
              </Link>
            </div>
          </article>

          {/* SPECIMEN CARDS (with data-sc-tilt and museum label schema) */}
          {railProducts.map((product, index) => {
            const shortlisted = isShortlisted(product.id);
            const cardOffset = ((index + 1) * 0.08).toFixed(2);
            return (
              <article
                key={product.id}
                data-sc-tilt="6"
                style={{ '--card-offset': cardOffset } as React.CSSProperties}
                className="sc-pan-card sc-vault-card shrink-0 w-[78vw] sm:w-[340px] md:w-[370px] rounded-3xl overflow-hidden flex flex-col justify-between group"
              >
                {/* Image Vitrine */}
                <div
                  onClick={() => onSelectProduct(product)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectProduct(product);
                    }
                  }}
                  className="relative aspect-[4/4.2] w-full overflow-hidden bg-gradient-to-b from-[#1d1417] via-[#120d0f] to-[#0a0708] cursor-pointer"
                >
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="380px"
                      className="object-contain p-6 transition-transform duration-700 group-hover:scale-[1.06] drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-display text-5xl text-[var(--store-gold)]/25">
                      {product.name.charAt(0)}
                    </div>
                  )}

                  {/* Top Museum Spec Bar */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-black/65 backdrop-blur-md text-[var(--store-gold)] border border-[var(--store-gold)]/30">
                      {product.carat}K GOLD
                    </span>
                    <span className="font-mono text-[10px] text-[var(--store-muted)] bg-black/50 px-2.5 py-1 rounded-full">
                      NO. 0{index + 1}
                    </span>
                  </div>
                </div>

                {/* Museum Label Schema (concise 1-2 word visual anchor for cropped reading + facts) */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-widest text-[var(--store-gold-soft)] mb-1.5">
                      <span>{product.category}</span>
                      <span>{product.tags?.[0] || 'Hallmarked'}</span>
                    </div>
                    <h3 className="font-display text-2xl text-[var(--sc-ink)] group-hover:text-[var(--store-gold-soft)] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-xs text-[var(--store-muted)] line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[var(--store-border)] flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="flex-1 py-2.5 px-3 rounded-xl text-[11px] font-mono uppercase tracking-wider border border-[var(--store-border)] bg-white/[0.03] hover:border-[var(--store-gold)] text-[var(--sc-ink)] inline-flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye size={13} />
                      Inspect
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleShortlist(product)}
                      className={`py-2.5 px-3.5 rounded-xl text-[11px] font-mono uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-all ${
                        shortlisted
                          ? 'bg-[var(--store-gold)] text-[#080607] font-semibold'
                          : 'border border-[var(--store-gold)]/30 text-[var(--store-gold-soft)] hover:bg-[var(--store-gold)]/15'
                      }`}
                    >
                      {shortlisted ? <Check size={13} /> : <Plus size={13} />}
                      {shortlisted ? 'Saved' : 'Shortlist'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {/* CLOSING RAIL CARD: Resolution & Full Vault Entry */}
          <article className="sc-pan-card sc-vault-card shrink-0 w-[82vw] sm:w-[380px] md:w-[420px] rounded-3xl p-8 md:p-10 flex flex-col justify-between bg-gradient-to-br from-[#231419] to-[#0e090b]">
            <div>
              <p className="sc-label text-[10px] text-[var(--store-gold)] mb-3">
                Complete Inventory
              </p>
              <h3 className="sc-display sc-display--md text-[var(--sc-ink)] mb-4">
                Explore all {products.length} active trade pieces.
              </h3>
              <p className="sc-body text-sm mb-6">
                Filter by 18 wholesale categories, compare 92K and 84K purities, or use our AI
                Trade Concierge to match pieces to your showroom clientele.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/collection" className="store-btn-primary w-full justify-center">
                Launch Full Wholesale Catalog
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/collection?carat=92"
                className="store-btn-ghost w-full justify-center"
              >
                View 92K Bridal Line
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
