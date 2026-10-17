'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Check, Crosshair, Plus, ShieldCheck, Sparkles, X } from 'lucide-react';
import type { Product } from '@/lib/data';
import WhatsAppButton from './WhatsAppButton';
import { useTradeDossier } from './store/TradeDossierContext';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const pushedRef = useRef(false);
  const imgBoxRef = useRef<HTMLDivElement>(null);
  const [loupeActive, setLoupeActive] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 50, y: 50 });

  let dossier: ReturnType<typeof useTradeDossier> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    dossier = useTradeDossier();
  } catch {
    dossier = null;
  }

  const stableOnClose = useCallback(onClose, [onClose]);

  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ modal: true }, '');
      pushedRef.current = true;

      const handlePopState = () => {
        pushedRef.current = false;
        stableOnClose();
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') stableOnClose();
      };

      window.addEventListener('popstate', handlePopState);
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back();
    }
  }, [isOpen, stableOnClose]);

  if (!product) return null;

  const hasImage = product.images && product.images.length > 0;
  const shortlisted = dossier ? dossier.isShortlisted(product.id) : false;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!imgBoxRef.current) return;
    const rect = imgBoxRef.current.getBoundingClientRect();
    const x = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
    setLoupePos({ x, y });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="sc-vault-card relative w-full max-w-5xl max-h-[90vh] overflow-y-auto pointer-events-auto rounded-3xl bg-[#0b0709]"
              initial={{ scale: 0.92, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close product specification modal"
                className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 border border-[var(--store-border)] text-[var(--store-muted)] hover:text-[var(--sc-ink)] hover:border-[var(--store-gold)] transition-colors"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                {/* Product Image Side with Interactive 2.2x Loupe */}
                <div
                  ref={imgBoxRef}
                  onPointerEnter={() => setLoupeActive(true)}
                  onPointerLeave={() => setLoupeActive(false)}
                  onPointerMove={handlePointerMove}
                  className="md:col-span-6 relative aspect-square md:aspect-auto min-h-[360px] md:min-h-[500px] overflow-hidden bg-gradient-to-br from-[#1d1317] via-[#110b0d] to-[#080607] flex items-center justify-center select-none"
                >
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 48%, rgba(212,175,55,0.22) 0%, transparent 68%)',
                    }}
                  />

                  {hasImage ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-8 md:p-12 drop-shadow-[0_28px_46px_rgba(0,0,0,0.88)]"
                    />
                  ) : (
                    <div className="font-display text-7xl text-[var(--store-gold)]/30">
                      {product.name.charAt(0)}
                    </div>
                  )}

                  {/* Interactive 2.2x Loupe */}
                  {hasImage && loupeActive && (
                    <div
                      className="pointer-events-none hidden md:block absolute z-20 w-44 h-44 rounded-full border-2 border-[var(--store-gold)] shadow-2xl overflow-hidden bg-[#130d0f]"
                      style={{
                        left: `${loupePos.x}%`,
                        top: `${loupePos.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div
                        className="relative w-full h-full"
                        style={{
                          transform: 'scale(2.25)',
                          transformOrigin: `${loupePos.x}% ${loupePos.y}%`,
                        }}
                      >
                        <Image
                          src={product.images[0]}
                          alt=""
                          fill
                          sizes="400px"
                          className="object-contain p-4"
                        />
                      </div>
                    </div>
                  )}

                  {/* Top & Bottom Badges */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[var(--store-gold)]/35 text-[10px] font-mono uppercase tracking-widest text-[var(--store-gold)]">
                      {product.carat}K HALLMARKED
                    </span>
                  </div>

                  {hasImage && (
                    <div className="hidden md:inline-flex items-center gap-1.5 absolute bottom-4 left-4 z-10 px-3 py-1 rounded-full bg-black/65 text-[10px] font-mono text-[var(--store-muted)] border border-[var(--store-border)]">
                      <Crosshair size={11} className="text-[var(--store-gold)]" />
                      Hover to inspect detail (2.2×)
                    </div>
                  )}
                </div>

                {/* Product Details Side */}
                <div className="md:col-span-6 p-7 sm:p-10 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.22em] uppercase text-[var(--store-gold)] mb-2">
                    <Sparkles size={12} />
                    <span>{product.category}</span>
                    <span>·</span>
                    <span>LOT #{product.id.toUpperCase()}</span>
                  </div>

                  <h2 className="font-display text-3xl sm:text-4xl text-[var(--sc-ink)] mb-4">
                    {product.name}
                  </h2>

                  <div className="h-px w-24 bg-gradient-to-r from-[var(--store-gold)] to-transparent mb-6" />

                  <p className="text-sm sm:text-base text-[var(--store-muted)] leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Metallurgical Spec Grid */}
                  <div className="grid grid-cols-2 gap-3.5 mb-7">
                    <div className="rounded-xl p-3.5 bg-white/[0.03] border border-[var(--store-border)]">
                      <p className="sc-label text-[9px] text-[var(--store-muted)]">Melt Purity</p>
                      <p className="font-display text-xl text-[var(--store-gold-soft)] mt-0.5">
                        {product.carat} Carat ({product.carat === 92 ? '92.0%' : '84.0%'} Au)
                      </p>
                    </div>
                    <div className="rounded-xl p-3.5 bg-white/[0.03] border border-[var(--store-border)]">
                      <p className="sc-label text-[9px] text-[var(--store-muted)]">Assay Status</p>
                      <p className="font-display text-xl text-[var(--sc-ink)] mt-0.5 flex items-center gap-1.5">
                        <ShieldCheck size={16} className="text-[var(--store-gold)]" />
                        XRF Verified
                      </p>
                    </div>
                  </div>

                  {product.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-8">
                      {product.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/[0.04] border border-[var(--store-border)] text-[var(--store-muted)]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <WhatsAppButton product={product} />

                    {dossier && (
                      <button
                        type="button"
                        onClick={() => dossier.toggleShortlist(product)}
                        className={`px-5 py-3 rounded-sm text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2 transition-all ${
                          shortlisted
                            ? 'bg-[var(--store-gold)] text-[#080607] font-semibold'
                            : 'border border-[var(--store-gold)]/35 text-[var(--store-gold-soft)] hover:bg-[var(--store-gold)]/15'
                        }`}
                      >
                        {shortlisted ? <Check size={14} /> : <Plus size={14} />}
                        {shortlisted ? 'Shortlisted in Dossier' : 'Add to Trade Dossier'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
