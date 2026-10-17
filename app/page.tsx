'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import StoreLayout from '@/components/store/StoreLayout';
import StoreHero from '@/components/store/StoreHero';
import WholesaleStrip from '@/components/store/WholesaleStrip';
import CraftCrucibleAct from '@/components/store/CraftCrucibleAct';
import ExhibitionPanAct from '@/components/store/ExhibitionPanAct';
import CategoryShowcase from '@/components/store/CategoryShowcase';
import FeaturedPieces from '@/components/store/FeaturedPieces';
import StoreAbout from '@/components/store/StoreAbout';
import { useCatalog } from '@/hooks/useCatalog';
import type { Product } from '@/lib/data';

const ProductDetailModal = dynamic(
  () => import('@/components/ProductDetailModal'),
  { ssr: false }
);

export default function Home() {
  const { catalog, loading } = useCatalog();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProduct]);

  const categories = catalog?.categoriesWithStats ?? [];
  const products = catalog?.products ?? [];

  return (
    <StoreLayout
      categories={categories}
      scrollDeps={[loading, products.length]}
    >
      <main>
        {/* Act I: 5-Plane Dimensional Hero (pin + parallax + kinetic + spotlight + magnet) */}
        <StoreHero />

        {/* Act II: Assay & Metallurgical Ledger (flow + entry counters + 92K/84K comparator) */}
        <WholesaleStrip />

        {/* Act III: The Engineered Peak — Goldsmith's Crucible (pin + --sc-p SVG blueprint + iris wipe + 2.2x loupe) */}
        <CraftCrucibleAct
          products={products}
          onSelectProduct={setSelectedProduct}
        />

        {/* Act IV: Horizontal Exhibition Rail (pan + 3D tilt + --sc-p staggered arrival) */}
        <ExhibitionPanAct
          products={products}
          onSelectProduct={setSelectedProduct}
        />

        {/* Act V: 18-Department Wholesale Index & AI Concierge Featured Vault (flow + spotlight + stagger) */}
        <CategoryShowcase categories={categories} loading={loading} />
        <FeaturedPieces
          products={products}
          onSelectProduct={setSelectedProduct}
        />

        {/* Act VI: Heritage Story & Interactive B2B Trade Dossier Configurator */}
        <StoreAbout />
      </main>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </StoreLayout>
  );
}
