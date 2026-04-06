'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Product } from '@/lib/data';

interface ProductCardProps {
  product: Product;
  index: number;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, index, onSelect }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rY = ((x - centerX) / centerX) * 8;
    const rX = -((y - centerY) / centerY) * 8;

    setRotateX(rX);
    setRotateY(rY);
    setGlowX((x / rect.width) * 100);
    setGlowY((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlowX(50);
    setGlowY(50);
  };

  // Generate a gold-toned gradient for the product image placeholder
  const gradients = [
    'linear-gradient(135deg, #1a1400 0%, #2d2200 30%, #D4AF37 50%, #2d2200 70%, #1a1400 100%)',
    'linear-gradient(135deg, #0d0d00 0%, #1a1500 30%, #B8860B 50%, #1a1500 70%, #0d0d00 100%)',
    'linear-gradient(135deg, #1a1200 0%, #332600 30%, #FFD700 50%, #332600 70%, #1a1200 100%)',
    'linear-gradient(135deg, #0f0f00 0%, #261d00 30%, #C5A028 50%, #261d00 70%, #0f0f00 100%)',
  ];

  // Category icons
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
        layout: { type: 'spring', stiffness: 200, damping: 25 },
      }}
      ref={cardRef}
      onClick={() => onSelect(product)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-hoverable
      className="group relative rounded-lg overflow-hidden gold-shimmer-overlay"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="relative transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Product image / placeholder */}
        <div
          className="relative aspect-[3/4] overflow-hidden"
          style={{
            background: gradients[index % gradients.length],
          }}
        >
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Category emoji centered if no image */}
              <motion.span
                className="text-6xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                style={{ filter: 'grayscale(0.5)' }}
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 2, 0, -2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {getCategoryEmoji(product.category)}
              </motion.span>
            </div>
          )}

          {/* Featured badge */}
          {product.featured && (
            <div
              className="absolute top-3 right-3 z-20 px-3 py-1 text-[10px] tracking-[0.2em] uppercase"
              style={{
                fontFamily: 'var(--font-body)',
                background: 'rgba(212, 175, 55, 0.9)',
                color: '#050505',
                fontWeight: 600,
              }}
            >
              Featured
            </div>
          )}

          {/* Carat badge */}
          <div
            className="absolute top-3 left-3 z-20 px-2 py-1 text-[10px] tracking-[0.15em] glass-dark"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <span className="text-gold">{product.carat}K</span>
          </div>

          {/* Bottom gradient overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1/2 z-10"
            style={{
              background: 'linear-gradient(to top, rgba(5, 5, 5, 0.95), transparent)',
            }}
          />
        </div>

        {/* Product info */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 p-5"
          style={{ transform: 'translateZ(20px)' }}
        >
          <p
            className="text-[10px] tracking-[0.2em] uppercase mb-1 text-gold/60"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {product.category}
          </p>
          <h3
            className="text-lg font-semibold mb-2 text-text-primary group-hover:text-gold transition-colors duration-500"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {product.name}
          </h3>
          <p
            className="text-xs text-text-secondary line-clamp-2 mb-3 leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}
          >
            {product.description}
          </p>
          <div className="flex items-center justify-end">
            <motion.span
              className="text-xs text-gold/40 group-hover:text-gold/80 transition-colors duration-500"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Explore →
            </motion.span>
          </div>
        </div>

        {/* Border glow on hover */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(212, 175, 55, 0.3), 0 0 30px rgba(212, 175, 55, 0.1)',
          }}
        />
      </div>
    </motion.div>
  );
}
