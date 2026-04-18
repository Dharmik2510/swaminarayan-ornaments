'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { defaultCategories, mockProducts } from '@/lib/data';
import type { Product } from '@/lib/data';

// Timeout wrapper
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ]);
}

const categoryDescriptions: Record<string, string> = {
  Necklaces: 'Regal statement pieces that command attention',
  Bangles: 'Crafted circles of timeless elegance',
  Earrings: 'Drops of liquid gold artistry',
  Rings: 'Symbols of an eternal bond',
  Chains: 'Links of timeless grace',
  Bracelets: 'Wrist-adorning masterpieces',
  Pendants: 'Charms of divine beauty',
  Mangalsutra: 'Sacred threads of togetherness',
};

const categoryEmoji: Record<string, string> = {
  Necklaces: '📿',
  Bangles: '⭕',
  Earrings: '💎',
  Rings: '💍',
  Chains: '🔗',
  Bracelets: '⌚',
  Pendants: '🔱',
  Mangalsutra: '📿',
};

interface CategoryDisplay {
  name: string;
  description: string;
  image: string | null;
  productCount: number;
}

function buildCategoryDisplay(
  cats: typeof defaultCategories,
  products: Product[]
): CategoryDisplay[] {
  const activeProducts = products.filter(p => p.status === 'active');
  return cats
    .map(cat => {
      const catProducts = activeProducts.filter(p => p.category === cat.name);
      const firstImage = catProducts.find(p => p.images && p.images.length > 0)?.images?.[0] ?? null;
      return {
        name: cat.name,
        description: categoryDescriptions[cat.name] || 'Exquisite gold artistry',
        image: firstImage,
        productCount: catProducts.length,
      };
    })
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, 5);
}

export default function FeaturedCategories() {
  const [categoryData, setCategoryData] = useState<CategoryDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  useEffect(() => {
    async function load() {
      try {
        const { getCategories, getProducts } = await import('@/lib/firebase-db');
        const [cats, products] = await withTimeout(
          Promise.all([getCategories(), getProducts()]),
          20000
        );
        const resolvedCats = cats.length > 0 ? cats : defaultCategories;
        const resolvedProducts = products.length > 0 ? products : mockProducts;
        setCategoryData(buildCategoryDisplay(resolvedCats, resolvedProducts));
      } catch {
        setCategoryData(buildCategoryDisplay(defaultCategories, mockProducts));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const scrollBy = (dir: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: dir * 400, behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      className="py-16 md:py-28 relative z-20 overflow-hidden"
      style={{ opacity: sectionOpacity }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header with navigation arrows */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p
              className="text-xs tracking-[0.4em] uppercase text-gold/50 mb-3"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Curated Selection
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Popular <span className="gold-gradient-text">Categories</span>
            </h2>
            <p className="text-white/50 text-sm max-w-md" style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontWeight: 300 }}>
              Discover our most sought-after collections, each a testament to the artisan&apos;s craft
            </p>
          </motion.div>

          {/* Scroll navigation */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => scrollBy(-1)}
              data-hoverable
              className="w-11 h-11 rounded-full border border-gold/20 flex items-center justify-center text-gold/60 hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-all duration-300"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              data-hoverable
              className="w-11 h-11 rounded-full border border-gold/20 flex items-center justify-center text-gold/60 hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-all duration-300"
            >
              <ChevronRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Horizontal Runway Scroll */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 rounded-full border-2 border-[var(--color-garnet)] border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, var(--color-background), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(270deg, var(--color-background), transparent)' }} />

          <div
            ref={scrollContainerRef}
            className="runway-scroll pl-6 md:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pr-24"
          >
            {categoryData.map((category, index) => (
              <motion.a
                key={category.name}
                href="#collection"
                data-hoverable
                className="group relative w-[300px] md:w-[380px] rounded-xl overflow-hidden flex flex-col"
                style={{
                  background: hoveredIndex === index
                    ? 'linear-gradient(145deg, rgba(212, 175, 55, 0.08), rgba(43, 12, 16, 0.95))'
                    : 'rgba(43, 12, 16, 0.6)',
                  border: '1px solid rgba(212, 175, 55, 0.08)',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.7, delay: index * 0.12 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ y: -8 }}
              >
                {/* Image Container with parallax-style scale */}
                <div className="relative h-56 md:h-72 w-full overflow-hidden">
                  {/* Ambient glow */}
                  <div className="absolute inset-0 z-[5] bg-gradient-to-b from-transparent via-transparent to-[#2B0C10] opacity-80" />
                  
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 300px, 380px"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #1a1200 0%, #332600 30%, #D4AF37 50%, #332600 70%, #1a1200 100%)' }}
                    >
                      <span className="text-7xl opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                        {categoryEmoji[category.name] || '✨'}
                      </span>
                    </div>
                  )}

                  {/* Piece count pill */}
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[10px] tracking-widest uppercase backdrop-blur-md"
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      color: 'rgba(212, 175, 55, 0.8)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {category.productCount} {category.productCount === 1 ? 'piece' : 'pieces'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-7 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-gold transition-colors duration-500" style={{ fontFamily: 'var(--font-display)' }}>
                    {category.name}
                  </h3>
                  <p className="text-white/40 mb-6 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-accent)', fontWeight: 300, fontStyle: 'italic' }}>
                    {category.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-medium text-gold/50 group-hover:text-gold transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Explore
                    </div>
                    <motion.div
                      className="w-9 h-9 rounded-full border border-gold/20 flex items-center justify-center text-gold/40 group-hover:text-gold group-hover:border-gold/50 group-hover:bg-gold/10 transition-all duration-500"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ArrowRight size={14} />
                    </motion.div>
                  </div>
                </div>

                {/* Subtle corner accents */}
                <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-gold/40 to-transparent" />
                  <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-gold/40 to-transparent" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
