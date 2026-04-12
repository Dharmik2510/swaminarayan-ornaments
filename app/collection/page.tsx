'use client';

import { useState, useEffect, useMemo, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutGrid, Search } from 'lucide-react';
import { mockProducts, categories } from '@/lib/data';
import type { Product, Category } from '@/lib/data';

const GoldCursor = dynamic(() => import('@/components/GoldCursor'), { ssr: false });
const ProductDetailModal = dynamic(() => import('@/components/ProductDetailModal'), { ssr: false });

// Timeout wrapper
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

const ITEMS_PER_PAGE = 12;

type SortOption = 'default' | 'name-asc' | 'name-desc' | 'newest' | 'oldest';

const sortLabels: Record<SortOption, string> = {
  default: 'Featured First',
  'name-asc': 'Name A–Z',
  'name-desc': 'Name Z–A',
  newest: 'Newest First',
  oldest: 'Oldest First',
};

function CollectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryFromUrl = (searchParams.get('category') as Category) || 'All';
  const caratFromUrl = searchParams.get('carat') === '92' ? 92 : searchParams.get('carat') === '84' ? 84 : 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>(categoryFromUrl);
  const [selectedCarat, setSelectedCarat] = useState<'all' | 92 | 84>(caratFromUrl);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Load products
  useEffect(() => {
    async function loadProducts() {
      try {
        const { getProducts } = await import('@/lib/firebase-db');
        const data = await withTimeout(getProducts(), 4000);
        const resolved = data.length > 0 ? data : mockProducts;
        setProducts(resolved.filter(p => p.status === 'active'));
      } catch {
        setProducts(mockProducts.filter(p => p.status === 'active'));
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Sync filter state from URL when browser back/forward changes searchParams
  useEffect(() => {
    if (categoryFromUrl !== selectedCategory) setSelectedCategory(categoryFromUrl);
    if (caratFromUrl !== selectedCarat) setSelectedCarat(caratFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFromUrl, caratFromUrl]);

  // Update URL params when user changes filters (skip if already matching URL)
  useEffect(() => {
    // Check if current state already matches URL to prevent loops
    if (selectedCategory === categoryFromUrl && selectedCarat === caratFromUrl) return;

    const params = new URLSearchParams();
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (selectedCarat !== 'all') params.set('carat', String(selectedCarat));
    const qs = params.toString();
    router.push(`/collection${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [selectedCategory, selectedCarat, categoryFromUrl, caratFromUrl, router]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => prev + ITEMS_PER_PAGE);
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedCategory, selectedCarat, sortBy, searchQuery]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProduct]);

  // Filter + sort logic
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const caratMatch = selectedCarat === 'all' || product.carat === selectedCarat;
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
      const searchMatch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return caratMatch && categoryMatch && searchMatch;
    });

    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.order - b.order);
    }

    return result;
  }, [products, selectedCarat, selectedCategory, sortBy, searchQuery]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;
  const activeFilterCount = (selectedCategory !== 'All' ? 1 : 0) + (selectedCarat !== 'all' ? 1 : 0);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedCarat('all');
    setSearchQuery('');
    setSortBy('default');
  };

  const gradients = [
    'linear-gradient(135deg, #1a1400 0%, #2d2200 30%, #D4AF37 50%, #2d2200 70%, #1a1400 100%)',
    'linear-gradient(135deg, #0d0d00 0%, #1a1500 30%, #B8860B 50%, #1a1500 70%, #0d0d00 100%)',
    'linear-gradient(135deg, #1a1200 0%, #332600 30%, #FFD700 50%, #332600 70%, #1a1200 100%)',
    'linear-gradient(135deg, #0f0f00 0%, #261d00 30%, #C5A028 50%, #261d00 70%, #0f0f00 100%)',
  ];

  return (
    <main className="min-h-screen bg-[var(--color-background)] relative">
      <GoldCursor />

      {/* Fixed Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50" style={{
        background: 'rgba(43, 12, 16, 0.95)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.08)',
      }}>
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              data-hoverable
              className="flex items-center gap-2 text-white/60 hover:text-gold transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-xs tracking-[0.15em] uppercase hidden sm:inline" style={{ fontFamily: 'var(--font-body)' }}>
                Home
              </span>
            </Link>
            <div className="w-[1px] h-5 bg-white/10" />
            <h1
              className="text-sm md:text-base tracking-[0.1em] gold-gradient-text"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              {selectedCategory !== 'All' ? selectedCategory : 'The Collection'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40" style={{ fontFamily: 'var(--font-body)' }}>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
            </span>
          </div>
        </div>
      </header>

      <div className="pt-16">
        {/* Category Hero Banner */}
        <section className="relative py-16 md:py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.04), transparent 60%)',
          }} />
          <div className="max-w-[1400px] mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p
                className="text-xs tracking-[0.4em] uppercase text-gold/40 mb-4 flex items-center gap-3"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <span className="w-8 h-[1px] bg-gold/30" />
                {selectedCategory !== 'All' ? 'Category' : 'Full Catalog'}
              </p>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {selectedCategory !== 'All' ? (
                  <span className="gold-gradient-text">{selectedCategory}</span>
                ) : (
                  <>
                    The <span className="gold-gradient-text">Collection</span>
                  </>
                )}
              </h2>
              <p
                className="text-white/50 text-base md:text-lg max-w-lg"
                style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontWeight: 300 }}
              >
                {selectedCategory !== 'All'
                  ? `Explore our curated selection of ${selectedCategory.toLowerCase()}, each crafted with devotion and unmatched artistry.`
                  : 'Every piece tells a story of heritage, purity, and timeless elegance.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Toolbar: Search + Filter toggle + Sort + Grid toggle */}
        <div className="sticky top-16 z-40 border-b" style={{
          background: 'rgba(43, 12, 16, 0.95)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(212, 175, 55, 0.06)',
        }}>
          <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search pieces..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white/[0.03] border border-white/[0.06] rounded-lg text-white placeholder:text-white/25 focus:outline-none focus:border-gold/30 transition-colors"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              data-hoverable
              className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border transition-all duration-300"
              style={{
                fontFamily: 'var(--font-body)',
                borderColor: showFilters ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.06)',
                background: showFilters ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                color: showFilters ? '#D4AF37' : 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-gold text-black text-[10px] flex items-center justify-center font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort dropdown */}
            <div ref={sortRef} className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                data-hoverable
                className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border border-white/[0.06] bg-white/[0.03] text-white/50 transition-all duration-300 hover:border-gold/20"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {sortLabels[sortBy]}
                <ChevronDown size={14} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    className="absolute right-0 top-full mt-2 w-48 rounded-lg overflow-hidden z-50"
                    style={{
                      background: 'rgba(30, 8, 12, 0.98)',
                      border: '1px solid rgba(212, 175, 55, 0.12)',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                    }}
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                  >
                    {(Object.entries(sortLabels) as [SortOption, string][]).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => { setSortBy(value); setShowSortDropdown(false); }}
                        data-hoverable
                        className="w-full text-left px-4 py-2.5 text-xs transition-colors"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: sortBy === value ? '#D4AF37' : 'rgba(255, 255, 255, 0.5)',
                          background: sortBy === value ? 'rgba(212, 175, 55, 0.06)' : 'transparent',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Grid toggle — desktop only */}
            <div className="hidden lg:flex items-center border border-white/[0.06] rounded-lg overflow-hidden">
              <button
                onClick={() => setGridCols(3)}
                data-hoverable
                className="p-2 transition-colors"
                style={{
                  background: gridCols === 3 ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                  color: gridCols === 3 ? '#D4AF37' : 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                data-hoverable
                className="p-2 transition-colors"
                style={{
                  background: gridCols === 4 ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                  color: gridCols === 4 ? '#D4AF37' : 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>

          {/* Expandable filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="border-t"
                style={{ borderColor: 'rgba(212, 175, 55, 0.06)' }}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="max-w-[1400px] mx-auto px-6 py-5 space-y-5">
                  {/* Category chips */}
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                      Category
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          data-hoverable
                          className="px-4 py-2 text-xs rounded-full border transition-all duration-300"
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontWeight: selectedCategory === cat ? 500 : 300,
                            borderColor: selectedCategory === cat ? 'rgba(212, 175, 55, 0.4)' : 'rgba(255, 255, 255, 0.06)',
                            background: selectedCategory === cat ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                            color: selectedCategory === cat ? '#D4AF37' : 'rgba(255, 255, 255, 0.45)',
                          }}
                        >
                          {cat}
                          <span className="ml-1.5 text-[10px] opacity-50">
                            {categoryCounts[cat] || 0}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Carat chips */}
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                      Purity
                    </p>
                    <div className="flex gap-2">
                      {([{ label: 'All Carats', value: 'all' as const }, { label: '92 Carat', value: 92 as const }, { label: '84 Carat', value: 84 as const }]).map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setSelectedCarat(opt.value)}
                          data-hoverable
                          className="px-5 py-2 text-xs rounded-full border transition-all duration-300"
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontWeight: selectedCarat === opt.value ? 500 : 300,
                            borderColor: selectedCarat === opt.value ? 'rgba(212, 175, 55, 0.4)' : 'rgba(255, 255, 255, 0.06)',
                            background: selectedCarat === opt.value ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                            color: selectedCarat === opt.value ? '#D4AF37' : 'rgba(255, 255, 255, 0.45)',
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear all */}
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      data-hoverable
                      className="text-xs text-white/40 hover:text-gold transition-colors flex items-center gap-1.5"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      <X size={12} /> Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Grid */}
        <section className="px-6 py-10 md:py-14">
          <div className="max-w-[1400px] mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-32">
                <div className="w-12 h-12 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                className="text-center py-32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="text-6xl block mb-4 opacity-20">🔍</span>
                <p className="text-xl text-white/60 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  No pieces found
                </p>
                <p className="text-sm text-white/30 mb-8" style={{ fontFamily: 'var(--font-body)' }}>
                  Try adjusting your filters or search to discover more
                </p>
                <button
                  onClick={clearAllFilters}
                  data-hoverable
                  className="px-6 py-3 text-xs tracking-[0.15em] uppercase border border-gold/30 text-gold/70 hover:bg-gold/10 hover:text-gold rounded-lg transition-all"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Clear all filters
                </button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  className={`grid gap-5 md:gap-6 ${
                    gridCols === 3
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  }`}
                  layout
                >
                  <AnimatePresence mode="popLayout">
                    {visibleProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          duration: 0.5,
                          delay: Math.min(index * 0.05, 0.4),
                          ease: [0.16, 1, 0.3, 1],
                          layout: { type: 'spring', stiffness: 200, damping: 25 },
                        }}
                        onClick={() => setSelectedProduct(product)}
                        data-hoverable
                        className="group relative rounded-xl overflow-hidden"
                        style={{
                          background: 'rgba(43, 12, 16, 0.4)',
                          border: '1px solid rgba(255, 255, 255, 0.04)',
                          transition: 'border-color 0.5s, box-shadow 0.5s',
                        }}
                        whileHover={{
                          borderColor: 'rgba(212, 175, 55, 0.2)',
                          boxShadow: '0 8px 40px rgba(212, 175, 55, 0.06)',
                        }}
                      >
                        {/* Image */}
                        <div
                          className="relative aspect-[3/4] overflow-hidden"
                          style={{ background: gradients[index % gradients.length] }}
                        >
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              sizes={gridCols === 3
                                ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                                : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                              }
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              loading={index < 8 ? 'eager' : 'lazy'}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-5xl opacity-20">✨</span>
                            </div>
                          )}

                          {/* Featured badge */}
                          {product.featured && (
                            <div
                              className="absolute top-3 right-3 z-10 px-2.5 py-1 text-[9px] tracking-[0.15em] uppercase"
                              style={{
                                fontFamily: 'var(--font-body)',
                                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.95), rgba(255, 215, 0, 0.9))',
                                color: '#050505',
                                fontWeight: 600,
                              }}
                            >
                              ✦ Featured
                            </div>
                          )}

                          {/* Carat badge */}
                          <div
                            className="absolute top-3 left-3 z-10 px-2 py-1 text-[10px] tracking-[0.1em] backdrop-blur-md rounded-sm"
                            style={{
                              background: 'rgba(0, 0, 0, 0.4)',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                              fontFamily: 'var(--font-body)',
                              color: '#D4AF37',
                            }}
                          >
                            {product.carat}K
                          </div>

                          {/* Bottom gradient */}
                          <div
                            className="absolute bottom-0 left-0 right-0 h-2/3 z-[5]"
                            style={{
                              background: 'linear-gradient(to top, rgba(5, 5, 5, 0.95) 0%, rgba(5, 5, 5, 0.5) 40%, transparent 100%)',
                            }}
                          />
                        </div>

                        {/* Info */}
                        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 md:p-5">
                          <p
                            className="text-[9px] tracking-[0.2em] uppercase mb-1 text-gold/50"
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            {product.category}
                          </p>
                          <h3
                            className="text-sm md:text-base font-semibold text-white group-hover:text-gold transition-colors duration-500 mb-2"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {product.name}
                          </h3>
                          <p
                            className="text-[11px] text-white/35 line-clamp-2 leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}
                          >
                            {product.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Load more trigger / indicator */}
                {hasMore && (
                  <div ref={loaderRef} className="flex justify-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-gold/20 border-t-gold/60 animate-spin" />
                      <span className="text-xs text-white/30" style={{ fontFamily: 'var(--font-body)' }}>
                        Loading more...
                      </span>
                    </div>
                  </div>
                )}

                {/* Results summary */}
                {!hasMore && filteredProducts.length > 0 && (
                  <div className="text-center py-16">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-16 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.15))' }} />
                      <div className="w-1.5 h-1.5 rotate-45 bg-gold/30" />
                      <div className="w-16 h-[1px]" style={{ background: 'linear-gradient(270deg, transparent, rgba(212, 175, 55, 0.15))' }} />
                    </div>
                    <p className="text-xs text-white/25" style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic' }}>
                      Showing all {filteredProducts.length} pieces
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Back to top + home */}
        <section className="px-6 pb-16">
          <div className="max-w-[1400px] mx-auto flex justify-center gap-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              data-hoverable
              className="px-6 py-3 text-xs tracking-[0.15em] uppercase border border-white/[0.06] text-white/40 hover:text-gold hover:border-gold/20 rounded-lg transition-all"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Back to Top ↑
            </button>
            <Link
              href="/"
              data-hoverable
              className="px-6 py-3 text-xs tracking-[0.15em] uppercase border border-gold/20 text-gold/60 hover:bg-gold/10 hover:text-gold rounded-lg transition-all"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              ← Back to Home
            </Link>
          </div>
        </section>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}

export default function CollectionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
      </div>
    }>
      <CollectionContent />
    </Suspense>
  );
}
