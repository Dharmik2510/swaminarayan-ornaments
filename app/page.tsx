'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import StoreLayout from '@/components/store/StoreLayout';
import StoreHero from '@/components/store/StoreHero';
import WholesaleStrip from '@/components/store/WholesaleStrip';
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
    <StoreLayout categories={categories}>
      <main>
        <StoreHero />
        <WholesaleStrip />
        <CategoryShowcase categories={categories} loading={loading} />
        <FeaturedPieces products={products} onSelectProduct={setSelectedProduct} />
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
