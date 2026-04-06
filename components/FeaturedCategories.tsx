'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { defaultCategories, mockProducts } from '@/lib/data';
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

const categoryDescriptions: Record<string, string> = {
  Necklaces: 'Regal statement pieces',
  Bangles: 'Crafted circles of elegance',
  Earrings: 'Drops of liquid gold',
  Rings: 'Symbols of eternal bond',
  Chains: 'Links of timeless grace',
  Bracelets: 'Wrist-adorning artistry',
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
    .slice(0, 3);
}

export default function FeaturedCategories() {
  const [categoryData, setCategoryData] = useState<CategoryDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { getCategories, getProducts } = await import('@/lib/firebase-db');
        const [cats, products] = await withTimeout(
          Promise.all([getCategories(), getProducts()]),
          4000
        );
        const resolvedCats = cats.length > 0 ? cats : defaultCategories;
        const resolvedProducts = products.length > 0 ? products : mockProducts;
        setCategoryData(buildCategoryDisplay(resolvedCats, resolvedProducts));
      } catch {
        // Firestore not provisioned or timed out — use local mock data silently
        setCategoryData(buildCategoryDisplay(defaultCategories, mockProducts));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section className="py-12 md:py-24 px-6 relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Popular Categories
            </h2>
            <p className="text-white/60" style={{ fontFamily: 'var(--font-body)' }}>Our most sought-after collections</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 rounded-full border-2 border-[var(--color-garnet)] border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {categoryData.map((category, index) => (
              <motion.a
                key={category.name}
                href="#collection"
                data-hoverable
                className="group relative bg-[var(--color-card-cream)] rounded-lg overflow-hidden flex flex-col hover:-translate-y-2 transition-transform duration-500 shadow-xl"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Image Container */}
                <div
                  className="relative h-64 md:h-80 w-full overflow-hidden flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1a1200 0%, #332600 30%, #D4AF37 50%, #332600 70%, #1a1200 100%)' }}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  ) : (
                    <span className="text-7xl opacity-40">
                      {categoryEmoji[category.name] || '✨'}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col flex-grow justify-between bg-[var(--color-card-cream)] z-20">
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-[#061A14]" style={{ fontFamily: 'var(--font-display)' }}>
                      {category.name}
                    </h3>
                    <p className="text-[#061A14]/50 text-xs mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                      {category.productCount} {category.productCount === 1 ? 'piece' : 'pieces'}
                    </p>
                    <p className="text-[#061A14]/70 mb-8 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <div className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#061A14] text-[var(--color-card-cream)] rounded-full text-xs tracking-widest uppercase font-medium group-hover:bg-[#D4AF37] group-hover:text-[#061A14] transition-colors duration-300 w-fit">
                      Explore Collection <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
