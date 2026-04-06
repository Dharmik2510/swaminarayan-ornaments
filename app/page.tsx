'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/lib/data';
import type { Category } from '@/lib/data';
import { MessageCircle } from 'lucide-react';

// Dynamic imports for client-only components
const GoldRevealLoader = dynamic(() => import('@/components/GoldRevealLoader'), { ssr: false });
const GoldCursor = dynamic(() => import('@/components/GoldCursor'), { ssr: false });
const GoldDustParticles = dynamic(() => import('@/components/GoldDustParticles'), { ssr: false });
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const HeroSection = dynamic(() => import('@/components/HeroSection'), { ssr: false });
const FeaturedCategories = dynamic(() => import('@/components/FeaturedCategories'), { ssr: false });
const CollectionSection = dynamic(() => import('@/components/CollectionSection'), { ssr: false });
const AboutSection = dynamic(() => import('@/components/AboutSection'), { ssr: false });
const ProductDetailModal = dynamic(() => import('@/components/ProductDetailModal'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCarat, setSelectedCarat] = useState<'all' | 92 | 84>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  // Lock body scroll during loading
  useEffect(() => {
    if (isLoading) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [isLoading]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProduct]);

  return (
    <main className="relative">
      {/* Gold Reveal Loader */}
      <AnimatePresence>
        {isLoading && (
          <GoldRevealLoader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Custom Cursor */}
      <GoldCursor />

      {/* Gold dust particles overlay */}
      <GoldDustParticles />

      {/* Main content wrapper */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {/* Navigation */}
        <Navbar />

        {/* Hero */}
        <HeroSection />

        {/* Featured Categories */}
        <FeaturedCategories />

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.15), transparent)' }} />
        </div>

        {/* Collection */}
        <CollectionSection
          selectedCarat={selectedCarat}
          selectedCategory={selectedCategory}
          onCaratChange={setSelectedCarat}
          onCategoryChange={setSelectedCategory}
          onSelectProduct={setSelectedProduct}
        />

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.15), transparent)' }} />
        </div>

        {/* About */}
        <AboutSection />

        {/* Footer */}
        <Footer />
      </motion.div>

      {/* Floating Chat Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-[90] w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center text-black shadow-gold hover:bg-[#FFD700] transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ cursor: 'none' }}
        data-hoverable
      >
        <MessageCircle size={24} strokeWidth={1.5} />
      </motion.button>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
