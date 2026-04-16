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
  const [isHovered, setIsHovered] = useState(false);

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
    setIsHovered(false);
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      data-hoverable
      className="group relative rounded-lg overflow-hidden velvet-card"
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
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
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

          {/* Spotlight glow that follows mouse */}
          <div
            className="absolute inset-0 z-15 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)`,
            }}
          />

          {/* Featured badge — elevated */}
          {product.featured && (
            <motion.div
              className="absolute top-3 right-3 z-30 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase backdrop-blur-sm"
              style={{
                fontFamily: 'var(--font-body)',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.95), rgba(255, 215, 0, 0.9))',
                color: '#050505',
                fontWeight: 600,
                boxShadow: '0 2px 12px rgba(212, 175, 55, 0.3)',
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 + 0.3 }}
            >
              ✦ Featured
            </motion.div>
          )}

          {/* Carat badge */}
          <div
            className="absolute top-3 left-3 z-30 px-2.5 py-1.5 text-[10px] tracking-[0.15em] glass-dark"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <span className="text-gold">{product.carat}K</span>
          </div>

          {/* Bottom gradient overlay — richer transition */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2/3 z-10 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(to top, rgba(5, 5, 5, 0.98) 0%, rgba(5, 5, 5, 0.7) 40%, transparent 100%)',
            }}
          />
        </div>

        {/* Product info — with reveal animation on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 p-5"
          style={{ transform: 'translateZ(20px)' }}
        >
          <p
            className="text-[10px] tracking-[0.2em] uppercase mb-1.5 text-gold/60"
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
          
          {/* Description slides up on hover */}
          <motion.div
            className="overflow-hidden"
            animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="text-xs text-text-secondary line-clamp-2 mb-3 leading-relaxed"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}
            >
              {product.description}
            </p>
          </motion.div>

          {/* Explore CTA with line animation */}
          <div className="flex items-center justify-between">
            <motion.div
              className="h-[1px] bg-gold/20"
              animate={{ width: isHovered ? '40%' : '0%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.span
              className="text-xs text-gold/40 group-hover:text-gold transition-colors duration-500 flex items-center gap-1"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 400, letterSpacing: '0.1em' }}
            >
              Explore
              <motion.span
                animate={{ x: isHovered ? [0, 4, 0] : 0 }}
                transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
              >
                →
              </motion.span>
            </motion.span>
          </div>
        </div>

        {/* Border glow on hover — enhanced with corner accents */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(212, 175, 55, 0.3), 0 0 30px rgba(212, 175, 55, 0.08)',
          }}
        />
        
        {/* Corner accent lines */}
        <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-gold/50 to-transparent" />
          <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-gold/50 to-transparent" />
        </div>
        <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
          <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-gold/50 to-transparent" />
          <div className="absolute bottom-0 right-0 h-full w-[1px] bg-gradient-to-t from-gold/50 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}
