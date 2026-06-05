'use client';

import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  Grid3X3,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import StoreLayout from '@/components/store/StoreLayout';
import CategoryNav from '@/components/store/CategoryNav';
import ProductTile from '@/components/store/ProductTile';
import ScrollReveal from '@/components/store/ScrollReveal';
import { useCatalog } from '@/hooks/useCatalog';
import {
  ALL_CATEGORY,
  filterProducts,
  sortProducts,
  type CategoryFilter,
} from '@/lib/catalog';
import type { Product } from '@/lib/data';

const ProductDetailModal = dynamic(
  () => import('@/components/ProductDetailModal'),
  { ssr: false }
);

const ITEMS_PER_PAGE = 12;

type SortOption = 'default' | 'name-asc' | 'name-desc' | 'newest' | 'oldest';

const sortLabels: Record<SortOption, string> = {
  default: 'Featured first',
  'name-asc': 'Name A–Z',
  'name-desc': 'Name Z–A',
  newest: 'Newest',
  oldest: 'Oldest',
};

function CollectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { catalog, loading } = useCatalog();

  const categoryFromUrl = searchParams.get('category') || ALL_CATEGORY;
  const caratFromUrl =
    searchParams.get('carat') === '92'
      ? 92
      : searchParams.get('carat') === '84'
        ? 84
        : 'all';

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(categoryFromUrl);
  const [selectedCarat, setSelectedCarat] = useState<'all' | 92 | 84>(caratFromUrl);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const sortRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const products = catalog?.products ?? [];
  const categoryFilters = catalog?.categoryFilters ?? [ALL_CATEGORY];
  const categoriesWithStats = catalog?.categoriesWithStats ?? [];

  useEffect(() => {
    if (categoryFromUrl !== selectedCategory) setSelectedCategory(categoryFromUrl);
    if (caratFromUrl !== selectedCarat) setSelectedCarat(caratFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFromUrl, caratFromUrl]);

  useEffect(() => {
    if (selectedCategory === categoryFromUrl && selectedCarat === caratFromUrl) return;
    const params = new URLSearchParams();
    if (selectedCategory !== ALL_CATEGORY) params.set('category', selectedCategory);
    if (selectedCarat !== 'all') params.set('carat', String(selectedCarat));
    const qs = params.toString();
    router.push(`/collection${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [selectedCategory, selectedCarat, categoryFromUrl, caratFromUrl, router]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedCategory, selectedCarat, sortBy, searchQuery]);

  useEffect(() => {
    document.body.style.overflow = selectedProduct ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProduct]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { [ALL_CATEGORY]: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(products, {
      category: selectedCategory,
      carat: selectedCarat,
      search: searchQuery,
    });
    return sortProducts(filtered, sortBy);
  }, [products, selectedCategory, selectedCarat, searchQuery, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const clearFilters = () => {
    setSelectedCategory(ALL_CATEGORY);
    setSelectedCarat('all');
    setSearchQuery('');
    setSortBy('default');
  };

  return (
    <StoreLayout categories={categoriesWithStats}>
      <div className="pt-16 md:pt-[4.25rem] min-h-screen">
        <div className="border-b border-[var(--store-border)] bg-[var(--store-surface)]/40">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 md:py-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-[var(--store-muted)] hover:text-[var(--store-gold)] mb-6"
            >
              <ArrowLeft size={16} />
              Home
            </Link>
            <ScrollReveal>
              <h1 className="font-display text-3xl md:text-5xl text-[var(--store-text)]">
                {selectedCategory !== ALL_CATEGORY ? (
                  <span className="text-[var(--store-gold-soft)]">{selectedCategory}</span>
                ) : (
                  'Wholesale catalog'
                )}
              </h1>
              <p className="mt-3 text-[var(--store-muted)] max-w-xl text-sm md:text-base">
                {filteredProducts.length} pieces · filter by category, purity, or search
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-wrap items-center gap-3 mb-6 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileCatsOpen(true)}
              className="store-btn-ghost py-2.5 px-4 flex items-center gap-2"
            >
              <SlidersHorizontal size={14} />
              Categories
            </button>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pieces..."
              className="store-input flex-1 min-w-[140px]"
            />
          </div>

          <div className="flex gap-8 lg:gap-12">
            <aside className="hidden lg:block w-56 xl:w-64 shrink-0">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)]">
                <CategoryNav
                  categories={categoriesWithStats}
                  categoryFilters={categoryFilters}
                  categoryCounts={categoryCounts}
                  selected={selectedCategory}
                  onSelect={setSelectedCategory}
                  variant="sidebar"
                />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="hidden lg:flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-[var(--store-border)]">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pieces..."
                  className="store-input max-w-sm flex-1 min-w-[200px]"
                />
                <div className="flex gap-2">
                  {(['all', 92, 84] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCarat(c)}
                      className={`px-4 py-2 rounded-full text-xs border transition-colors ${
                        selectedCarat === c
                          ? 'border-[var(--store-gold-dim)] text-[var(--store-gold)] bg-[var(--store-gold)]/10'
                          : 'border-[var(--store-border)] text-[var(--store-muted)]'
                      }`}
                    >
                      {c === 'all' ? 'All carats' : `${c}K`}
                    </button>
                  ))}
                </div>
                <div ref={sortRef} className="relative ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowSortDropdown((o) => !o)}
                    className="store-btn-ghost py-2.5 px-4 flex items-center gap-2"
                  >
                    {sortLabels[sortBy]}
                    <ChevronDown size={14} />
                  </button>
                  <AnimatePresence>
                    {showSortDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-[var(--store-border)] bg-[var(--store-elevated)] shadow-xl z-20 overflow-hidden"
                      >
                        {(Object.entries(sortLabels) as [SortOption, string][]).map(
                          ([value, label]) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => {
                                setSortBy(value);
                                setShowSortDropdown(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-xs ${
                                sortBy === value
                                  ? 'text-[var(--store-gold)] bg-white/[0.04]'
                                  : 'text-[var(--store-muted)]'
                              }`}
                            >
                              {label}
                            </button>
                          )
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="hidden xl:flex border border-[var(--store-border)] rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setGridCols(3)}
                    className={`p-2 ${gridCols === 3 ? 'text-[var(--store-gold)]' : 'text-[var(--store-muted)]'}`}
                    aria-label="3 column grid"
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridCols(4)}
                    className={`p-2 ${gridCols === 4 ? 'text-[var(--store-gold)]' : 'text-[var(--store-muted)]'}`}
                    aria-label="4 column grid"
                  >
                    <LayoutGrid size={16} />
                  </button>
                </div>
              </div>

              <div className="lg:hidden flex gap-2 mb-6 overflow-x-auto pb-2 store-scrollbar">
                {(['all', 92, 84] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedCarat(c)}
                    className={`shrink-0 px-4 py-2 rounded-full text-xs border ${
                      selectedCarat === c
                        ? 'border-[var(--store-gold-dim)] text-[var(--store-gold)]'
                        : 'border-[var(--store-border)] text-[var(--store-muted)]'
                    }`}
                  >
                    {c === 'all' ? 'All' : `${c}K`}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[3/4] rounded-2xl bg-[var(--store-surface)] animate-pulse"
                    />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-24">
                  <p className="font-display text-xl text-[var(--store-text)] mb-2">
                    No pieces found
                  </p>
                  <p className="text-sm text-[var(--store-muted)] mb-8">
                    Try another category or clear filters
                  </p>
                  <button type="button" onClick={clearFilters} className="store-btn-primary">
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className={`grid gap-4 md:gap-5 ${
                      gridCols === 3
                        ? 'grid-cols-2 md:grid-cols-2 xl:grid-cols-3'
                        : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                    }`}
                  >
                    {visibleProducts.map((product, index) => (
                      <ProductTile
                        key={product.id}
                        product={product}
                        index={index}
                        onSelect={setSelectedProduct}
                      />
                    ))}
                  </div>
                  {hasMore && (
                    <div ref={loaderRef} className="flex justify-center py-16">
                      <div className="w-8 h-8 rounded-full border border-[var(--store-gold-dim)] border-t-[var(--store-gold)] animate-spin" />
                    </div>
                  )}
                  {!hasMore && (
                    <p className="text-center text-xs text-[var(--store-muted)] py-12">
                      Showing all {filteredProducts.length} pieces
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {mobileCatsOpen && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-[60] bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileCatsOpen(false)}
              aria-label="Close categories"
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-[61] lg:hidden rounded-t-2xl border-t border-[var(--store-border)] bg-[var(--store-elevated)] p-6 max-h-[85vh] overflow-hidden flex flex-col"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              <CategoryNav
                categories={categoriesWithStats}
                categoryFilters={categoryFilters}
                categoryCounts={categoryCounts}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                variant="sheet"
                onClose={() => setMobileCatsOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </StoreLayout>
  );
}

export default function CollectionPage() {
  return (
    <Suspense
      fallback={
        <div className="storefront min-h-screen bg-[var(--store-bg)] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border border-[var(--store-gold-dim)] border-t-[var(--store-gold)] animate-spin" />
        </div>
      }
    >
      <CollectionContent />
    </Suspense>
  );
}
