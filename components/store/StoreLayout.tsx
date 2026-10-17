'use client';

import { useRef, type ReactNode } from 'react';
import StoreNavbar from './StoreNavbar';
import StoreFooter from './StoreFooter';
import ScrollTraceBar from './ScrollTraceBar';
import TradeDossierDrawer from './TradeDossierDrawer';
import { TradeDossierProvider } from './TradeDossierContext';
import { useScrollCraft } from '@/hooks/useScrollCraft';
import type { CategoryWithStats } from '@/lib/catalog';

interface StoreLayoutProps {
  children: ReactNode;
  categories?: CategoryWithStats[];
  showFooter?: boolean;
  scrollDeps?: unknown[];
}

export default function StoreLayout({
  children,
  categories = [],
  showFooter = true,
  scrollDeps = [],
}: StoreLayoutProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  useScrollCraft(rootRef, [categories.length, ...scrollDeps]);

  return (
    <TradeDossierProvider>
      <div
        ref={rootRef}
        className="storefront min-h-screen bg-[var(--store-bg)] text-[var(--store-text)] relative"
      >
        {/* ScrollCraft Atmospheric Film Grain */}
        <div className="sc-grain" aria-hidden="true" />

        <StoreNavbar categories={categories} />
        {children}
        {showFooter && <StoreFooter categories={categories} />}
        <ScrollTraceBar />
        <TradeDossierDrawer />
      </div>
    </TradeDossierProvider>
  );
}
