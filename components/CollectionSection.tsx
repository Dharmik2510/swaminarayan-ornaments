'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import SmartFilter from './SmartFilter';
import { mockProducts } from '@/lib/data';
import type { Product, Category } from '@/lib/data';

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
  selectedCarat: 'all' | 92 | 84;
  selectedCategory: Category;
  onCaratChange: (carat: 'all' | 92 | 84) => void;
  onCategoryChange: (category: Category) => void;
  onSelectProduct: (product: Product) => void;
}

export default function CollectionSection({
  selectedCarat,
  selectedCategory,
  onCaratChange,
  onCategoryChange,
  onSelectProduct,
}: CollectionSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { getProducts } = await import('@/lib/firebase-db');
        const data = await withTimeout(getProducts(), 4000);
        const resolved = data.length > 0 ? data : mockProducts;
        setProducts(resolved.filter(p => p.status === 'active'));
      } catch {
        // Firestore not provisioned or timed out — use local mock data
        setProducts(mockProducts.filter(p => p.status === 'active'));
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const caratMatch = selectedCarat === 'all' || product.carat === selectedCarat;
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
      return caratMatch && categoryMatch;
    });
  }, [selectedCarat, selectedCategory, products]);

  return (
    <section id="collection" className="py-24 px-6 relative">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.02), transparent 60%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <SmartFilter
          selectedCarat={selectedCarat}
          selectedCategory={selectedCategory}
          onCaratChange={onCaratChange}
          onCategoryChange={onCategoryChange}
          productCount={filteredProducts.length}
        />

        {/* Product grid or Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 rounded-full border-2 border-[var(--color-garnet)] border-t-transparent animate-spin" />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onSelect={onSelectProduct}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-6xl block mb-4 opacity-30">🔍</span>
            <p
              className="text-lg text-text-secondary mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              No pieces match your selection
            </p>
            <p
              className="text-sm text-text-tertiary"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Try adjusting your filters to discover more
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
