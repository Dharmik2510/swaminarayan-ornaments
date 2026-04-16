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
const GoldInkTrail = dynamic(() => import('@/components/GoldInkTrail'), { ssr: false });
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const HeroSection = dynamic(() => import('@/components/HeroSection'), { ssr: false });
const LuxuryMarquee = dynamic(() => import('@/components/LuxuryMarquee'), { ssr: false });
const FeaturedCategories = dynamic(() => import('@/components/FeaturedCategories'), { ssr: false });
const DiamondDivider = dynamic(() => import('@/components/DiamondDivider'), { ssr: false });
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

      {/* Gold Ink Trail — calligraphy-style cursor trail */}
      <GoldInkTrail />

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

        {/* Luxury Marquee — storytelling ticker */}
        <LuxuryMarquee />

        {/* Featured Categories */}
        <FeaturedCategories />

        {/* Diamond Divider */}
        <DiamondDivider />

        {/* Collection */}
        <CollectionSection
          selectedCarat={selectedCarat}
          selectedCategory={selectedCategory}
          onCaratChange={setSelectedCarat}
          onCategoryChange={setSelectedCategory}
          onSelectProduct={setSelectedProduct}
        />

        {/* Diamond Divider */}
        <DiamondDivider />

        {/* About */}
        <AboutSection />

        {/* Footer */}
        <Footer />
      </motion.div>

      {/* Floating Chat Button — elevated with ring pulse */}
      <motion.div
        className="fixed bottom-8 right-8 z-[90]"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, type: 'spring' }}
      >
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 animate-ping" />
        <motion.button
          className="relative w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center text-black shadow-gold hover:bg-[#FFD700] transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ cursor: 'none' }}
          data-hoverable
        >
          <MessageCircle size={24} strokeWidth={1.5} />
        </motion.button>
      </motion.div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
