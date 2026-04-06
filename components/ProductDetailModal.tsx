'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { Product } from '@/lib/data';
import WhatsAppButton from './WhatsAppButton';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  if (!product) return null;

  const gradients = [
    'linear-gradient(135deg, #1a1400 0%, #2d2200 30%, #D4AF37 50%, #2d2200 70%, #1a1400 100%)',
    'linear-gradient(135deg, #0d0d00 0%, #1a1500 30%, #B8860B 50%, #1a1500 70%, #0d0d00 100%)',
    'linear-gradient(135deg, #1a1200 0%, #332600 30%, #FFD700 50%, #332600 70%, #1a1200 100%)',
  ];

  const getCategoryEmoji = (category: string) => {
    const map: Record<string, string> = {
      'Necklaces': '📿',
      'Bangles': '⭕',
      'Earrings': '💎',
      'Rings': '💍',
      'Chains': '🔗',
      'Bracelets': '⌚',
      'Pendants': '🔱',
      'Mangalsutra': '📿',
    };
    return map[category] || '✨';
  };

  const hasImage = product.images && product.images.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto pointer-events-auto rounded-xl"
              style={{
                background: '#0A0A0A',
                border: '1px solid rgba(212, 175, 55, 0.15)',
                boxShadow: '0 0 80px rgba(212, 175, 55, 0.08), 0 0 200px rgba(212, 175, 55, 0.03)',
              }}
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              {/* Close button */}
              <motion.button
                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                onClick={onClose}
                data-hoverable
                whileHover={{ scale: 1.1, background: 'rgba(212, 175, 55, 0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="rgba(245, 240, 232, 0.6)" strokeWidth="1.5">
                  <line x1="2" y1="2" x2="14" y2="14" />
                  <line x1="14" y1="2" x2="2" y2="14" />
                </svg>
              </motion.button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Product Image Side */}
                <div className="relative aspect-square md:aspect-auto overflow-hidden">
                  <div
                    className="w-full h-full min-h-[400px] relative"
                    style={{
                      background: gradients[parseInt(product.id.replace(/[^0-9]/g, '')) % 3],
                    }}
                  >
                    {hasImage ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <>
                        {/* Rotating light reflection */}
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background: 'conic-gradient(from 0deg at 50% 50%, transparent, rgba(255, 215, 0, 0.12), transparent, transparent)',
                          }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                        />
                        {/* Product emoji */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.span
                            className="text-8xl md:text-9xl"
                            style={{ filter: 'drop-shadow(0 0 40px rgba(212, 175, 55, 0.4))' }}
                            animate={{
                              rotateY: [0, 360],
                              scale: [1, 1.05, 1],
                            }}
                            transition={{
                              rotateY: { duration: 15, repeat: Infinity, ease: 'linear' },
                              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                            }}
                          >
                            {getCategoryEmoji(product.category)}
                          </motion.span>
                        </div>
                      </>
                    )}

                    {/* Carat badge */}
                    <div className="absolute bottom-4 left-4 z-10">
                      <motion.div
                        className="px-4 py-2 glass-gold rounded-full"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <span className="text-gold text-sm font-semibold" style={{ fontFamily: 'var(--font-body)' }}>
                          {product.carat} Carat Gold
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Product Details Side */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  {/* Category */}
                  <motion.p
                    className="text-xs tracking-[0.3em] uppercase text-gold/60 mb-3"
                    style={{ fontFamily: 'var(--font-body)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {product.category}
                  </motion.p>

                  {/* Product name */}
                  <motion.h2
                    className="text-3xl md:text-4xl font-bold mb-4 gold-gradient-text"
                    style={{ fontFamily: 'var(--font-display)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {product.name}
                  </motion.h2>

                  {/* Decorative line */}
                  <motion.div
                    className="h-[1px] mb-6"
                    style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }}
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  />

                  {/* Description */}
                  <motion.p
                    className="text-text-secondary mb-8 leading-relaxed"
                    style={{
                      fontFamily: 'var(--font-accent)',
                      fontSize: '1rem',
                      lineHeight: 1.8,
                      fontWeight: 300,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {product.description}
                  </motion.p>

                  {/* Details grid */}
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="p-4 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-gold/50 mb-1" style={{ fontFamily: 'var(--font-body)' }}>Purity</p>
                      <p className="text-lg font-semibold text-gold" style={{ fontFamily: 'var(--font-display)' }}>{product.carat} Carat</p>
                    </div>
                  </motion.div>

                  {/* Action buttons */}
                  <motion.div
                    className="flex flex-col sm:flex-row gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <WhatsAppButton product={product} />
                    
                    <button
                      data-hoverable
                      className="px-6 py-3 text-sm tracking-[0.2em] uppercase transition-all duration-500"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 400,
                        border: '1px solid rgba(245, 240, 232, 0.15)',
                        color: 'rgba(245, 240, 232, 0.6)',
                      }}
                      onClick={onClose}
                    >
                      Continue Browsing
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
