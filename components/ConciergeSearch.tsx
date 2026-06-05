'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, ProductSummary, ConciergeResult } from '@/lib/data';

interface ConciergeSearchProps {
  products: Product[];
  onResults: (matchIds: string[] | null, caption: string | null) => void;
}

function naiveSearch(query: string, products: Product[]): string[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const scored = products
    .map((p) => {
      const haystack = [p.name, p.description, p.category, ...p.tags]
        .join(' ')
        .toLowerCase();
      const hits = terms.filter((t) => haystack.includes(t)).length;
      return { id: p.id, score: hits };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  return scored.map((s) => s.id);
}

function toSummaries(products: Product[]): ProductSummary[] {
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    carat: p.carat,
    tags: p.tags,
    description: p.description.slice(0, 200),
  }));
}

export default function ConciergeSearch({
  products,
  onResults,
}: ConciergeSearchProps): React.ReactElement {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [caption, setCaption] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const executeSearch = useCallback(
    async (searchQuery: string) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) {
        setCaption(null);
        onResults(null, null);
        return;
      }

      // Cancel any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setSearching(true);

      try {
        const res = await fetch('/api/ai/concierge-search', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            query: trimmed,
            products: toSummaries(products),
          }),
        });

        // 5s client-side timeout race
        const timeout = setTimeout(() => controller.abort(), 5000);

        if (!res.ok) {
          clearTimeout(timeout);
          throw new Error(`HTTP ${res.status}`);
        }

        const data: ConciergeResult = await res.json();
        clearTimeout(timeout);

        if (!controller.signal.aborted) {
          setCaption(data.caption);
          onResults(data.matchIds, data.caption);
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        // Fallback to naive client-side search
        console.error('Concierge search failed, falling back to naive search:', err);
        const fallbackIds = naiveSearch(trimmed, products);
        const fallbackCaption = fallbackIds.length > 0
          ? 'Showing text matches'
          : 'No pieces matched — try describing the occasion or style';
        setCaption(fallbackCaption);
        onResults(fallbackIds.length > 0 ? fallbackIds : [], fallbackCaption);
      } finally {
        if (!controller.signal.aborted) {
          setSearching(false);
        }
      }
    },
    [products, onResults]
  );

  const scheduleSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => executeSearch(value), 600);
    },
    [executeSearch]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      if (!value.trim()) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setCaption(null);
        setSearching(false);
        onResults(null, null);
      } else {
        scheduleSearch(value);
      }
    },
    [scheduleSearch, onResults]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        executeSearch(query);
      }
    },
    [query, executeSearch]
  );

  const handleClear = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();
    setQuery('');
    setCaption(null);
    setSearching(false);
    onResults(null, null);
  }, [onResults]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  return (
    <div className="mb-10 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you're looking for\u2026"
          className="w-full bg-transparent border-0 border-b pb-3 text-lg outline-none transition-colors duration-300 placeholder:text-text-tertiary"
          style={{
            fontFamily: 'var(--font-accent)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'rgba(245, 240, 232, 0.85)',
            borderColor: query
              ? 'rgba(212, 175, 55, 0.6)'
              : 'rgba(255, 255, 255, 0.1)',
          }}
        />
      </div>

      {/* Searching indicator — single animated gold dot */}
      <AnimatePresence>
        {searching && (
          <motion.div
            className="mt-4 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: '#D4AF37' }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Caption with clear button */}
      <AnimatePresence>
        {!searching && caption && (
          <motion.div
            className="mt-4 flex items-center gap-3"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            <span
              className="text-sm italic"
              style={{
                fontFamily: 'var(--font-accent)',
                color: 'rgba(212, 175, 55, 0.7)',
                fontWeight: 300,
              }}
            >
              {caption}
            </span>
            <button
              data-hoverable
              onClick={handleClear}
              className="text-xs opacity-40 hover:opacity-80 transition-opacity"
              style={{ color: 'rgba(245, 240, 232, 0.6)' }}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
