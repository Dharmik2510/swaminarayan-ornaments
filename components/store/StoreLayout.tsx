'use client';

import type { ReactNode } from 'react';
import StoreNavbar from './StoreNavbar';
import StoreFooter from './StoreFooter';
import type { CategoryWithStats } from '@/lib/catalog';

interface StoreLayoutProps {
  children: ReactNode;
  categories?: CategoryWithStats[];
  showFooter?: boolean;
}

export default function StoreLayout({
  children,
  categories = [],
  showFooter = true,
}: StoreLayoutProps) {
  return (
    <div className="storefront min-h-screen bg-[var(--store-bg)] text-[var(--store-text)]">
      <StoreNavbar categories={categories} />
      {children}
      {showFooter && <StoreFooter categories={categories} />}
    </div>
  );
}
