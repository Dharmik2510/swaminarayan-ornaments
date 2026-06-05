'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { mockProducts } from '@/lib/data';
import type { Product } from '@/lib/data';

// Timeout wrapper — Firestore hangs when the DB isn't provisioned
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ]);
}

interface CollectionSectionProps {
  onSelectProduct: (product: Product) => void;
}

const FEATURED_LIMIT = 4;

const gradients = [
  'linear-gradient(135deg, #1a1400 0%, #2d2200 30%, #D4AF37 50%, #2d2200 70%, #1a1400 100%)',
  'linear-gradient(135deg, #0d0d00 0%, #1a1500 30%, #B8860B 50%, #1a1500 70%, #0d0d00 100%)',
  'linear-gradient(135deg, #1a1200 0%, #332600 30%, #FFD700 50%, #332600 70%, #1a1200 100%)',
  'linear-gradient(135deg, #0f0f00 0%, #261d00 30%, #C5A028 50%, #261d00 70%, #0f0f00 100%)',
];

export default function CollectionSection({ onSelectProduct }: CollectionSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [conciergeIds, setConciergeIds] = useState<string[] | null>(null);
  const [conciergeCaption, setConciergeCaption] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { getProducts } = await import('@/lib/firebase-db');
        // Increased timeout to 20s. In development, Firestore WebChannel reconnects
        // can take roughly 5-10 seconds after a hot reload drops the stream.
        const data = await withTimeout(getProducts(), 20000);
        const resolved = data.length > 0 ? data : mockProducts;
        setProducts(resolved.filter(p => p.status === 'active'));
      } catch {
        setProducts(mockProducts.filter(p => p.status === 'active'));
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const featuredProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.order - b.order)
      .slice(0, FEATURED_LIMIT);
  }, [products]);

  const totalCount = products.length;

  return (
    <section id="collection" className="py-20 md:py-28 px-6 relative">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.02), transparent 60%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p
              className="text-xs tracking-[0.4em] uppercase text-gold/40 mb-3 flex items-center gap-3"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <span className="w-8 h-[1px] bg-gold/30" />
              Handpicked For You
            </p>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Curated <span className="gold-gradient-text">Pieces</span>
            </h2>
            <p
              className="text-white/40 text-sm max-w-md"
              style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontWeight: 300 }}
            >
              A glimpse of our finest creations — explore the full collection for more
            </p>
          </motion.div>

          {/* View All CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Link
              href="/collection"
              data-hoverable
              className="group flex items-center gap-3 px-6 py-3 rounded-lg border border-gold/20 text-gold/70 hover:text-gold hover:border-gold/40 hover:bg-gold/5 transition-all duration-500"
            >
              <span
                className="text-xs tracking-[0.15em] uppercase"
                style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
              >
                View All {totalCount} Pieces
              </span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>

        {/* Product grid — 4 featured items only */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 rounded-full border-2 border-[var(--color-garnet)] border-t-transparent animate-spin" />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
            layout
          >
            <AnimatePresence mode="popLayout">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                    layout: { type: 'spring', stiffness: 200, damping: 25 },
                  }}
                  onClick={() => onSelectProduct(product)}
                  data-hoverable
                  className="group relative rounded-xl overflow-hidden"
                  style={{
                    background: 'rgba(43, 12, 16, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'border-color 0.5s, box-shadow 0.5s',
                  }}
                  whileHover={{
                    y: -6,
                    borderColor: 'rgba(212, 175, 55, 0.25)',
                    boxShadow: '0 12px 48px rgba(212, 175, 55, 0.08)',
                  }}
                >
                  {/* Image */}
                  <div
                    className="relative aspect-[3/4] overflow-hidden"
                    style={{ background: gradients[index % gradients.length] }}
                  >
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority={index < 2}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl opacity-20">✨</span>
                      </div>
                    )}

                    {/* Featured badge */}
                    {product.featured && (
                      <div
                        className="absolute top-3 right-3 z-20 px-2.5 py-1 text-[9px] tracking-[0.15em] uppercase"
                        style={{
                          fontFamily: 'var(--font-body)',
                          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.95), rgba(255, 215, 0, 0.9))',
                          color: '#050505',
                          fontWeight: 600,
                        }}
                      >
                        ✦ Featured
                      </div>
                    )}

                    {/* Carat badge */}
                    <div
                      className="absolute top-3 left-3 z-20 px-2 py-1 text-[10px] tracking-[0.1em] backdrop-blur-md rounded-sm"
                      style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        fontFamily: 'var(--font-body)',
                        color: '#D4AF37',
                      }}
                    >
                      {product.carat}K
                    </div>

                    {/* Bottom gradient */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-2/3 z-10"
                      style={{
                        background: 'linear-gradient(to top, rgba(5, 5, 5, 0.98) 0%, rgba(5, 5, 5, 0.6) 40%, transparent 100%)',
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
                    <p
                      className="text-[9px] tracking-[0.2em] uppercase mb-1 text-gold/50"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {product.category}
                    </p>
                    <h3
                      className="text-base md:text-lg font-semibold text-white group-hover:text-gold transition-colors duration-500 mb-1"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className="text-[10px] text-white/30 group-hover:text-gold/60 transition-colors flex items-center gap-1"
                        style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.1em' }}
                      >
                        Explore →
                      </span>
                    </div>
                  </div>

                  {/* Corner accents on hover */}
                  <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-gold/40 to-transparent" />
                    <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-gold/40 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-gold/40 to-transparent" />
                    <div className="absolute bottom-0 right-0 h-full w-[1px] bg-gradient-to-t from-gold/40 to-transparent" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Bottom CTA — centered, prominent */}
        {!loading && (
          <motion.div
            className="text-center mt-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link
              href="/collection"
              data-hoverable
              className="group inline-flex items-center gap-3 px-10 py-4 bg-[var(--color-card-cream)] text-[var(--color-background)] font-medium text-xs tracking-[0.2em] uppercase relative overflow-hidden transition-colors duration-300"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <span className="relative z-10">Browse Full Collection</span>
              <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              {/* Shine sweep */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </Link>
            <p
              className="text-xs text-white/25 mt-4"
              style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic' }}
            >
              {totalCount} exquisite pieces await
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
